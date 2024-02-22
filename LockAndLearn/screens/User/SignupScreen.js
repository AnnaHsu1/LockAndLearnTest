import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { Text, TextInput, View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { RadioButton, Button } from 'react-native-paper';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { CreateResponsiveStyle, DEVICE_SIZES, minSize } from 'rn-responsive-styles';
import { setUserTokenWithExpiry } from '../../components/AsyncStorage';
import PropTypes from 'prop-types';
import { FcGoogle } from 'react-icons/fc';
import { parseISO, isBefore, startOfDay, differenceInYears } from 'date-fns';

WebBrowser.maybeCompleteAuthSession();

const SignupScreen = ({ navigation }) => {
  var bcrypt = require('bcryptjs');
  const [googleUserInfo, setGoogleUserInfo] = useState(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '113548474045-u200bnbcqe8h4ba7mul1be61pv8ldnkg.apps.googleusercontent.com',
    iosClientId: '113548474045-a3e9t8mijs7s0c9v9ht3ilvlgsjm64oj.apps.googleusercontent.com',
    webClientId: '113548474045-vuk7am9h5b8ug7c1tudd36pcsagv4l6b.apps.googleusercontent.com',
  });
  const [checked, setChecked] = React.useState('true');

  const [fdata, setFdata] = useState({
    FirstName: '',
    LastName: '',
    isParent: null,
    Email: '',
    Password: '',
    CPassword: '',
    DOB: '',
  });

  const [errors, setErrors] = useState({
    Fields: '',
    Name: '',
    Email: '',
    Password: '',
    CPassword: '',
    DOB: '',
    Other: '',
  });

  // Handle google sign in when user attempts to login
  useEffect(() => {
    handleGoogleSignUp();
  }, [response]);

  async function handleGoogleSignUp() {
    if (response?.type === 'success') {
      await getUserInfo(response.authentication.accessToken);
    }
  }

  const getUserInfo = async (token) => {
    if (!token) return;
    try {
      const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const googleUser = await response.json();
      setGoogleUserInfo(googleUser);
      navigation.navigate('GoogleSignUp', { userInfo: googleUser });
    } catch (e) {
      console.error(e);
    }
  };

  // useEffect to watch for changes in checked state and update fdata.Account
  useEffect(() => {
    setFdata((prevFdata) => ({
      ...prevFdata,
      isParent: checked,
    }));
  }, [checked]);

  const validateInputs = async () => {
    // Input validations
    if (
      !fdata.FirstName ||
      !fdata.LastName ||
      !fdata.Email ||
      !fdata.Password ||
      !fdata.CPassword ||
      !fdata.DOB ||
      !fdata.isParent
    ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        Fields: 'All fields must be filled.',
      }));
      return false;
    }

    // Validate FirstName and LastName with regular expressions
    const nameRegex = /^[a-zA-Z]+$/;
    if (!nameRegex.test(fdata.FirstName) || !nameRegex.test(fdata.LastName)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        Name: 'First and Last names can only contain letters.',
      }));
      return false;
    }
    if (!(fdata.Email.includes('@') && fdata.Email.includes('.'))) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        Email: 'Invalid email format.',
      }));
      return false;
    }

    // Check if the email is already in use     TODOOOOOO
    // const emailCheck = await getUserByEmail(Email);

    if (fdata.Password.length < 6) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        Password: 'Password must be at least 6 characters long.',
      }));
      return false;
    }

    if (fdata.Password !== fdata.CPassword) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        CPassword: 'Passwords must match.',
      }));
      return false;
    }
    const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fdata.DOB || !dobRegex.test(fdata.DOB)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        DOB: 'Invalid date format. Please use YYYY-MM-DD.',
      }));
      return false;
    }

    // Attempt to parse the date of birth
    let dob;
    try {
      dob = parseISO(fdata.DOB);
    } catch (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        DOB: 'Invalid date. Please provide a valid date in the format YYYY-MM-DD.',
      }));
      return false;
    }

    // Parse the current date
    const currentDate = new Date();

    // Check if the date of birth is a day before the current day
    const isBeforeCurrentDay = isBefore(dob, startOfDay(currentDate));

    if (!isBeforeCurrentDay) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        DOB: 'Invalid date of birth. Date cannot be ahead of today.',
      }));
      return false;
    }

    // Check if the user is older than 18
    const isOlderThan18 = differenceInYears(currentDate, dob) >= 18;

    if (!isOlderThan18) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        DOB: 'You must be at least 18 years old to register.',
      }));
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (validateInputs() == false) return;
    else {
      // console.log('fdata:', fdata);
      // Ensure that the first name and last name start with a capital letter
      const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);

      const capitalizedFirstName = capitalizeFirstLetter(fdata.FirstName);
      const capitalizedLastName = capitalizeFirstLetter(fdata.LastName);

      //Encrypt the input password
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(fdata.Password, salt);

      // console.log(fdata);
      // Package the user data into a JSON format and ship it to the backend
      try {
        // const response = await fetch('http://localhost:4000/users/signup', {
        const response = await fetch(
          'https://data.mongodb-api.com/app/lock-and-learn-xqnet/endpoint/userSignup',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              FirstName: capitalizedFirstName,
              LastName: capitalizedLastName,
              isParent: fdata.isParent,
              Email: fdata.Email,
              Password: passwordHash,
              DOB: fdata.DOB,
            }), // Send user data as JSON
          }
        );
        const data = await response.json();
        if (response.status === 201) {
          // User created successfully
          // console.log('User created successfully in database!', data);
          await setUserTokenWithExpiry('@token', data);
          //Add redirect
          {
            data?.isParent
              ? navigation.navigate('ParentHomeScreen')
              : navigation.navigate('UserLandingPage');
          }
        } else {
          setErrors({
            Fields: '',
            Name: '',
            Email: '',
            Password: '',
            CPassword: '',
            DOB: '',
            Other: '',
          });
          if (data.msg === 'All fields must be filled.') {
            setErrors((prevErrors) => ({
              ...prevErrors,
              Fields: data.msg,
            }));
          } else if (
            data.msg === 'Invalid email format.' ||
            data.msg === 'Email is already in use.' ||
            data.msg === 'Email is already in use.'
          ) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              Email: data.msg,
            }));
          } else if (data.msg === 'Password must be at least 6 characters long.') {
            setErrors((prevErrors) => ({
              ...prevErrors,
              Password: data.msg,
            }));
          } else if (data.msg === 'Passwords must match.') {
            setErrors((prevErrors) => ({
              ...prevErrors,
              CPassword: data.msg,
            }));
          } else if (data.msg === 'First and Last names can only contain letters.') {
            setErrors((prevErrors) => ({
              ...prevErrors,
              Name: data.msg,
            }));
          } else if (
            data.msg === 'Invalid date format. Please use YYYY-MM-DD.' ||
            'Invalid date of birth. It should be a day before the current day.' ||
            'You must be at least 18 years old to register.' ||
            'Invalid date. Please provide a valid date in the format YYYY-MM-DD.'
          ) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              DOB: data.msg,
            }));
          } else if (data.msg === 'Invalid date of birth. Date cannot be ahead of today.') {
            setErrors((prevErrors) => ({
              ...prevErrors,
              DOB: data.msg,
            }));
          } else if (checked === null) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              Other: 'Please select your account type.',
            }));
          }
        }
      } catch (error) {
        console.error('Submitting error when creating user:', error);
      }
    }
  };

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <Text style={styles.title}>Create your account</Text>
        {errors.Fields ? <Text style={styles.box}>{errors.Fields}</Text> : null}
        {/* Email */}
        <View style={styles.item}>
          <Text style={styles.field}>Email</Text>
          <TextInput
            testID="email-input"
            style={[styles.textbox, styles.full_width]}
            value={fdata.Email}
            onChangeText={(newText) => setFdata({ ...fdata, Email: newText })}
          />
          {errors.Email ? <Text style={{ color: 'red' }}>{errors.Email}</Text> : null}
        </View>

        {/* First name and Last name*/}
        <View style={[styles.row, styles.nameInput]}>
          <View style={styles.half_width}>
            <Text style={styles.field}>First Name</Text>
            <TextInput
              testID="first-name-input"
              style={styles.textbox}
              value={fdata.FirstName}
              onChangeText={(newText) => setFdata({ ...fdata, FirstName: newText })}
            />
          </View>

          <View style={styles.half_width}>
            <Text style={styles.field}>Last Name</Text>
            <TextInput
              testID="last-name-input"
              style={[styles.textbox]}
              value={fdata.LastName}
              onChangeText={(newText) => setFdata({ ...fdata, LastName: newText })}
            />
          </View>
        </View>
        {errors.Name ? <Text style={{ color: 'red' }}>{errors.Name}</Text> : null}
        {/* Account type */}
        <View style={styles.item}>
          <Text style={styles.field}>Select your account type</Text>
          <View style={[styles.radio, styles.row]}>
            <View style={[styles.radio_item, styles.row]}>
              <RadioButton
                value="true"
                status={checked === 'true' ? 'checked' : 'unchecked'}
                onPress={() => setChecked('true')}
                color="#4F85FF"
              />
              <Text style={checked === 'true' ? styles.checked : styles.field}>Parent</Text>
            </View>

            <View style={[styles.radio_item, styles.row]}>
              <RadioButton
                value="false"
                status={checked === 'false' ? 'checked' : 'unchecked'}
                onPress={() => setChecked('false')}
                color="#4F85FF"
              />
              <Text style={checked === 'false' ? styles.checked : styles.field}>Teacher</Text>
            </View>
          </View>
        </View>
        {errors.Other ? <Text style={{ color: 'red' }}>{errors.Other}</Text> : null}
        {/* Birth date */}
        <View style={styles.item}>
          <Text style={styles.field}>Birth Date (YYYY-MM-DD)</Text>
          <TextInput
            testID="birthdate-input"
            style={[styles.textbox, styles.full_width]}
            value={fdata.DOB}
            onChangeText={(newText) => setFdata({ ...fdata, DOB: newText })}
          />
          {errors.DOB ? <Text style={{ color: 'red' }}>{errors.DOB}</Text> : null}
        </View>

        {/* Password */}
        <View style={styles.item}>
          <Text style={styles.field}>Password</Text>
          <TextInput
            testID="password-input"
            style={[styles.textbox, styles.full_width]}
            secureTextEntry={true}
            value={fdata.Password}
            onChangeText={(newText) => setFdata({ ...fdata, Password: newText })}
          />
          {errors.Password ? <Text style={{ color: 'red' }}>{errors.Password}</Text> : null}
        </View>

        {/* Confirm password */}
        <View style={styles.item}>
          <Text style={styles.field}>Confirm password</Text>
          <TextInput
            testID="cpassword-input"
            style={[styles.textbox, styles.full_width]}
            secureTextEntry={true}
            value={fdata.CPassword}
            onChangeText={(newText) => setFdata({ ...fdata, CPassword: newText })}
          />
          {errors.CPassword ? <Text style={{ color: 'red' }}>{errors.CPassword}</Text> : null}
        </View>

        <View style={[{ gap: 10 }]}>
          <Button
            testID="signup-button"
            mode="contained"
            onPress={() => {
              handleSubmit();
            }}
            style={[styles.button, styles.full_width]}
          >
            Sign up
          </Button>
          <TouchableOpacity
            testID="google-login-button"
            mode="contained"
            onPress={() => promptAsync()}
            style={[
              {
                borderColor: '#407BFF',
                borderWidth: 1,
                borderRadius: 10,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 10,
              },
              styles.full_width,
            ]}
          >
            <FcGoogle fontSize={24} />
            <Text style={{ color: '#407BFF', textAlign: 'center', paddingLeft: 5 }}>
              Create an account with Google
            </Text>
          </TouchableOpacity>
        </View>

        <Text testID="login-link" style={styles.link} onPress={() => navigation.navigate('Login')}>
          Already have an account? Sign in
        </Text>
        <StatusBar style="auto" />
      </View>
      <Image style={styles.bottomCloud} source={require('../../assets/bottomClouds.png')} />
    </View>
  );
};

SignupScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};
const styles = StyleSheet.create(
  {
    page: {
      backgroundColor: '#ffffff',
      maxWidth: '100%',
      flex: 1,
      alignItems: 'center',
    },
    container: {
      width: '100%',
      maxWidth: 500,
      marginHorizontal: 20,
      paddingHorizontal: 20,
      paddingVertical: 20,
    },
    item: {
      display: 'flex',
      width: '100%',
      paddingVertical: 10,
    },
    row: {
      flexDirection: 'row',
    },
    nameInput: {
      justifyContent: 'space-between',
    },
    radio: {
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    radio_item: {
      alignItems: 'center',
      alignContent: 'center',
    },
    title: {
      color: '#4F85FF',
      fontSize: 24,
      textAlign: 'left',
    },
    button: {
      color: '#ffffff',
      backgroundColor: '#4F85FF',
      borderRadius: 10,
    },
    field: {
      color: '#ADADAD',
    },
    checked: {
      color: '#000',
    },
    link: {
      color: '#4F85FF',
      paddingTop: 10,
      textAlign: 'center',
    },
    textbox: {
      display: 'flex',
      minHeight: 30,
      borderRadius: 10,
      borderColor: '#407BFF',
      borderStyle: 'solid',
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderWidth: 1,
    },
    box: {
      borderWidth: 1,
      borderColor: 'red',
      color: 'red',
      padding: 10,
      marginTop: 10,
    },
    full_width: {
      minWidth: '100%',
    },
    half_width: {
      width: '40%',
    },
    bottomCloud: {
      width: '100%',
      height: 250,
      resizeMode: 'stretch',
      flex: 1,
    },
  },
  {
    [minSize(DEVICE_SIZES.MD)]: {
      container: {
        maxWidth: 400,
        width: 400,
      },
      half_width: {
        width: 225,
      },
      bottomCloud: {
        width: '100%',
        height: 300,
        resizeMode: 'stretch',
        flex: 1,
      },
    },
  }
);

export default SignupScreen;
