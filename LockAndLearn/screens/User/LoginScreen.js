import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, TextInput, View, navigation, Image } from 'react-native';
import { CreateResponsiveStyle, DEVICE_SIZES, minSize, useDeviceSize } from 'rn-responsive-styles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Button } from 'react-native-paper';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import {
  getItem,
  setItem,
  removeItem,
  setUserTokenWithExpiry,
} from '../../components/AsyncStorage';

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = ({ navigation }) => {
  const styles = useStyles();
  const deviceSize = useDeviceSize();
  const [ request, response, promptAsync ] = Google.useAuthRequest({
    androidClientId: '113548474045-u200bnbcqe8h4ba7mul1be61pv8ldnkg.apps.googleusercontent.com',
    iosClientId: '113548474045-a3e9t8mijs7s0c9v9ht3ilvlgsjm64oj.apps.googleusercontent.com',
    webClientId: '113548474045-vuk7am9h5b8ug7c1tudd36pcsagv4l6b.apps.googleusercontent.com',
  });
  const [text, setText] = useState('');
  const [fdata, setFdata] = useState({
    email: '',
    password: '',
  });
  const [googleUser, setGoogleUser] = useState(null);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [displayMsg, setDisplayMsg] = useState(null);

  useEffect(() => {
    checkGoogleResponse();
  }, [response]);

   const checkGoogleResponse = () => {
    if (response?.type === 'success') {
      handleGoogleLogin();
    }
  }

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

  const sendLoginData = async (loginData) => {
    try {
      const response = await fetch('http://localhost:4000/users/login', {
        method: 'POST',
        credentials: 'include', // Ensure credentials are included
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData), // Send user data as JSON
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
        await setUserTokenWithExpiry('@token', data.user);
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
  };

  const handleSubmit = async () => {
    const isValid = validate();
    // console.log(emailError);
    // console.log(passwordError);
    if (isValid) {
      console.log('Fields are appropriate', fdata);
      sendLoginData(fdata);
      
    }
  };



  const handleGoogleLogin = async () => {
    // if token does not exist get google user info
    const token = await getItem('@token');
    if (!token) {
      if (response?.type === 'success') {
        const { authentication } = response;
        await getGoogleUserInfo(response.authentication.accessToken);
      }
    } else {
      setGoogleUser(JSON.parse(token));
    }

    // login using google user credentials
    loginWithGoogle();
  };

  const getGoogleUserInfo = async (accessToken) => {
    if (!accessToken) return;
    try {
      const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const googleUser = await response.json();
      await setUserTokenWithExpiry('@token', googleUser);
      setGoogleUserInfo(googleUser);
      navigation.navigate('GoogleSignUp', { userInfo: googleUser });
    } catch (e) {
      console.error(e);
    }
  };

  const loginWithGoogle = async () => {
    const token = await getItem('@token');
    const googleUser = JSON.parse(token);
    const googleLoginData = {
      email: googleUser?.email,
      password: googleUser?.id,
    };

    sendLoginData(googleLoginData);
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
          Log in
        </Button>

        <Text style={styles.link}>Forgot password?</Text>
        {!googleUser ? (
          <Button
          testID="google-login-button"
          mode="contained"
          onPress={() => promptAsync()}
          style={[styles.button, styles.full_width]}
        >
          Login with Google
        </Button>) : null
        }
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
