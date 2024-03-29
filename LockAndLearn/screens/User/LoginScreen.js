import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Text,
  TextInput,
  View,
  navigation,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { CreateResponsiveStyle, DEVICE_SIZES, minSize, useDeviceSize } from 'rn-responsive-styles';
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
import { FcGoogle } from 'react-icons/fc';

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = ({ navigation }) => {
  var bcrypt = require('bcryptjs');
  const deviceSize = useDeviceSize();
  const [request, response, promptAsync] = Google.useAuthRequest({
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
  };

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
      // console.log('loginData:', loginData);
      const response = await fetch(
        'https://data.mongodb-api.com/app/lock-and-learn-xqnet/endpoint/userLogin',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(loginData),
        }
      );
      const user = await response.json();
      if (response.status === 200) {
        setErrorMsg(null);
        var isMatch = await bcrypt.compare(loginData.password, user.password);

        if (!isMatch) {
          setErrorMsg('Invalid credentials, please try again.');
        } else {
          if (user.suspended) {
            // If the user is suspended, navigate to SuspendedUser screen
            navigation.navigate('SuspendedUser');
          } else {
            // If the user is not suspended, proceed with regular navigation
            // console.log('User successfully logged in!', user);
            setDisplayMsg(
              'Credentials are valid, welcome back' +
                ' ' +
                user.firstName +
                ' ' +
                user.lastName +
                '!'
            );
            await setUserTokenWithExpiry('@token', user);

            if (user.isParent) {
              navigation.navigate('ParentHomeScreen');
            } else {
              navigation.navigate('UserLandingPage');
            }
          }
        }
      } else {
        // Store the error message in state
        setErrorMsg(user.msg);
      }
    } catch (error) {
      console.error('Error logging user:', error);
    }
  };

  const sendLoginDataAdmin = async (loginData) => {
    try {
      const response = await fetch(
        'https://data.mongodb-api.com/app/lock-and-learn-xqnet/endpoint/userLogin',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(loginData),
        }
      );
      const user = await response.json();
      var isMatch = await bcrypt.compare(loginData.password, user.password);

      if (response.status === 200 && isMatch) {
        setErrorMsg(null);
        console.log('Admin successfully logged in!', user);
        setDisplayMsg('Admin login successful.');

        // Store the user data in AsyncStorage
        await setUserTokenWithExpiry('@token', user);
        navigation.navigate('AdminMenu');
      } else {
        setErrorMsg(user.msg);
      }
    } catch (error) {
      console.error('Error logging admin:', error);
    }
  };

  const handleSubmit = async () => {
    const isValid = validate();

    if (isValid) {
      if (fdata.email === 'admin@lockandlearn.ca') {
        // Send login data for admin
        sendLoginDataAdmin(fdata);
      } else {
        // For regular users, proceed with login
        sendLoginData(fdata);
      }
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

        <View style={[{ gap: 10 }]}>
          <Button
            testID="login-button"
            mode="contained"
            onPress={() => {
              handleSubmit();
            }}
            style={[styles.button, styles.full_width]}
          >
            Login
          </Button>
          {!googleUser ? (
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
                Login with Google
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <Text style={styles.link}>Forgot password?</Text>
        <StatusBar style="auto" />
      </View>
      <Image style={styles.bottomCloud} source={require('../../assets/bottomClouds.png')} />
    </View>
  );
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
      minHeight: '65%',
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
      flex: 1,
      justifyContent: 'flex-end',
      width: '100%',
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
        width: '100%',
        height: 300,
        resizeMode: 'stretch',
        flex: 1,
      },
    },
  }
);
export default LoginScreen;
