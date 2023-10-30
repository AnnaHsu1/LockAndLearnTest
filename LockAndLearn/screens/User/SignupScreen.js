import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { StyleSheet, Text, TextInput, View, Image, navigation } from 'react-native';
import { RadioButton, Button } from 'react-native-paper';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { CreateResponsiveStyle, DEVICE_SIZES, minSize, useDeviceSize } from 'rn-responsive-styles';
import { getItem, setItem, removeItem } from '../../components/AsyncStorage';

WebBrowser.maybeCompleteAuthSession();

const SignupScreen = ({ navigation }) => {
  const styles = useStyles();
  const deviceSize = useDeviceSize();
  const [userInfo, setUserInfo] = useState(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '113548474045-u200bnbcqe8h4ba7mul1be61pv8ldnkg.apps.googleusercontent.com',
    iosClientId: '113548474045-a3e9t8mijs7s0c9v9ht3ilvlgsjm64oj.apps.googleusercontent.com',
    webClientId: '113548474045-vuk7am9h5b8ug7c1tudd36pcsagv4l6b.apps.googleusercontent.com',
  });
  const [text, setText] = useState('');
  const [checked, setChecked] = React.useState('first');

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
    Email: '',
    Password: '',
    CPassword: '',
    DOB: '',
  });

  // Handle google sign in when user attempts to login
  useEffect(() => {
    handleGoogleSignIn();
  }, [response]);

  async function handleGoogleSignIn() {
    const user = await getItem('@user');
    if (!user) {
      if (response?.type === 'success') {
        await getUserInfo(response.authentication.accessToken);
      }
    } else {
      setUserInfo(JSON.parse(user));
    }
  }

  async function handleGoogleSignOut() {
    const user = await getItem('@user');
    if (user) {
      await removeItem('@user');
      setUserInfo(null);
    }
  }

  const getUserInfo = async (token) => {
    if (!token) return;
    try {
      const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = await response.json();
      await setItem('@user', JSON.stringify(user));
      setUserInfo(user);
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

  const handleSubmit = async () => {
    // console.log(fdata);
    // Package the user data into a JSON format and ship it to the backend
    try {
      const response = await fetch('http://localhost:4000/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fdata), // Send user data as JSON
      });
      const data = await response.json();
      // console.log(response.status);
      if (response.status === 201) {
        setErrors({
          Fields: '',
          Email: '',
          Password: '',
          CPassword: '',
          DOB: '',
        });
        // User created successfully
        console.log('User created successfully in database!', data);
        await setItem('@token', JSON.stringify(data.user));
        //Add redirect
        {
          data?.user.isParent
            ? navigation.navigate('ParentAccount')
            : navigation.navigate('UserLandingPage');
        }
      } else {
        setErrors({
          Fields: '',
          Email: '',
          Password: '',
          CPassword: '',
          DOB: '',
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
        } else if (data.msg === 'Invalid date of birth. Date cannot be ahead of today.') {
          setErrors((prevErrors) => ({
            ...prevErrors,
            DOB: data.msg,
          }));
        }
      }
    } catch (error) {
      console.error('Submitting error when creating user:', error);
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
              style={[styles.textbox, styles.half_width]}
              value={fdata.LastName}
              onChangeText={(newText) => setFdata({ ...fdata, LastName: newText })}
            />
          </View>
        </View>

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

        <Button
          testID="signup-button"
          mode="contained"
          onPress={() => {
            handleSubmit();
          }}
          style={[styles.button, styles.full_width]}
        >
          SIGN UP
        </Button>

        <Text testID="login-link" style={styles.link} onPress={() => navigation.navigate('Login')}>
          Already have an account? Sign in
        </Text>

        {/* <Text>{userInfo ? JSON.stringify(userInfo) : null}</Text> */}
        {!userInfo ? (
          <Button
            mode="contained"
            style={[styles.button, { marginTop: 10 }]}
            textColor="#fff"
            onPress={() => promptAsync()}
          >
            Create an account with Google
          </Button>
        ) : (
          <Button
            mode="contained"
            style={[styles.button, { marginTop: 10 }]}
            textColor="#fff"
            onPress={() => handleGoogleSignOut()}
          >
            Sign out
          </Button>
        )}
        <StatusBar style="auto" />
      </View>
      <Image style={styles.bottomCloud} source={require('../../assets/bottomClouds.png')} />
    </View>
  );
};

const useStyles = CreateResponsiveStyle(
  {
    page: {
      backgroundColor: '#ffffff',
      maxWidth: wp('100%'),
      flex: 1,
      alignItems: 'center',
    },
    container: {
      minWidth: wp('90%'),
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 20,
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
    auto_width: {
      minWidth: 'auto',
    },
    half_width: {
      width: wp('40%'),
    },
    bottomCloud: {
      width: wp('100%'),
      height: 250,
      resizeMode: 'stretch',
    },
  },
  {
    [minSize(DEVICE_SIZES.MD)]: {
      container: {
        minWidth: 500,
        width: 500,
      },
      half_width: {
        width: 225,
      },
      bottomCloud: {
        width: wp('100%'),
        height: 300,
        resizeMode: 'stretch',
        flex: 1,
      },
    },
  }
);

export default SignupScreen;
