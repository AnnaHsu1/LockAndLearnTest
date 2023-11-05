import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, TextInput, View, navigation, Image } from 'react-native';
import { CreateResponsiveStyle, DEVICE_SIZES, minSize, useDeviceSize } from 'rn-responsive-styles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Button } from 'react-native-paper';
import { setItem } from '../../components/AsyncStorage';

const LoginScreen = ({ navigation }) => {
  const styles = useStyles();
  const deviceSize = useDeviceSize();

  const [text, setText] = useState('');
  const [fdata, setFdata] = useState({
    email: '',
    password: '',
  });

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [displayMsg, setDisplayMsg] = useState(null);

  const validate = () => {
    let emailError = '';
    let passwordError = '';

    setEmailError('');
    setPasswordError('');

    if (!fdata.email.includes('@') || !fdata.email.includes('.')) {
      emailError = 'Please input a valid email.';
      setEmailError(emailError);
    }
    if (!fdata.password) {
      passwordError = 'Please input a password.';
    }
    if (emailError) {
      setEmailError(emailError);
      return false;
    }
    if (passwordError) {
      setPasswordError(passwordError);
      return false;
    }
    return true;
  };
  const handleSubmit = async () => {
    const isValid = validate();
    // console.log(emailError);
    // console.log(passwordError);
    if (isValid) {
      console.log('Fields are appropriate', fdata);

      try {
        const response = await fetch('http://localhost:4000/users/login', {
          method: 'POST',
          credentials: 'include', // Ensure credentials are included
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(fdata), // Send user data as JSON
        });

        const data = await response.json();

        if (response.status === 201) {
          setErrorMsg(null);
          // User logged in successfully
          console.log('User successfully logged in!', data);
          setDisplayMsg(
            'Credentials are valid, welcome back' +
              ' ' +
              data.user.firstName +
              ' ' +
              data.user.lastName +
              '!'
          );
          // Store the user data in AsyncStorage
          await setItem('@token', JSON.stringify(data.user));
          navigation.navigate('UserLandingPage');
          if (data.user.isParent) {
            navigation.navigate('ParentAccount');
          } else {
            navigation.navigate('UserLandingPage');
          }
        } else {
          // Store the error message in state
          console.log(data.msg);
          setErrorMsg(data.msg);
        }
      } catch (error) {
        console.error('Error logging user:', error);
      }
      /*const res = await loginUser({
                email: fdata.Email,
                password: fdata.Password
            });*/
      /*if (response == null) {
                setEmailError("Invalid combination of email and password");
            }*/
      /*else {
                setToken(res.data.token);
                setUserInfo(res.data);
                navigate(-1);
            }*/
      // Package the user data into a JSON format and ship it to the backend
    }
  };
  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <Text style={styles.title}>Log in to your account</Text>

        {errorMsg ? <Text style={styles.box}>{errorMsg}</Text> : null}

        {displayMsg ? <Text style={{ color: 'green' }}>{displayMsg}</Text> : null}

        <View style={styles.item}>
          <Text style={styles.field}>Email</Text>
          <TextInput
            testID="email-input"
            style={[styles.textbox, styles.full_width]}
            value={fdata.email}
            onChangeText={(newText) => setFdata({ ...fdata, email: newText })}
          />
          {emailError ? <Text style={{ color: 'red' }}>{emailError}</Text> : null}
        </View>

        <View style={styles.item}>
          <Text style={styles.field}>Password</Text>
          <TextInput
            testID="password-input"
            style={[styles.textbox, styles.full_width]}
            secureTextEntry={true}
            value={fdata.password}
            onChangeText={(newText) => setFdata({ ...fdata, password: newText })}
          />
          {passwordError ? <Text style={{ color: 'red' }}>{passwordError}</Text> : null}
        </View>

        <Button
          testID="login-button"
          mode="contained"
          onPress={() => {
            handleSubmit();
          }}
          style={[styles.button, styles.full_width]}
        >
          LOG IN
        </Button>

        <Text style={styles.link}>Forgot password?</Text>
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
      minHeight: hp('65%'),
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 20,
    },
    item: {
      display: 'flex',
      width: '100%',
      paddingVertical: 10,
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
      marginTop: 10,
    },
    field: {
      color: '#ADADAD',
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
    bottomCloud: {
      display: 'flex',
      justifyContent: 'flex-end',
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
      bottomCloud: {
        width: wp('100%'),
        height: 300,
        resizeMode: 'stretch',
        flex: 1,
      },
    },
  }
);

export default LoginScreen;