import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  navigation,
  ImageBackground,
  Dimensions,
} from 'react-native';
import {
  CreateResponsiveStyle,
  DEVICE_SIZES,
  maxSize,
  minSize,
  useDeviceSize,
} from 'rn-responsive-styles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Button } from 'react-native-paper';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

const HomeScreen = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '113548474045-u200bnbcqe8h4ba7mul1be61pv8ldnkg.apps.googleusercontent.com',
    iosClientId: '113548474045-a3e9t8mijs7s0c9v9ht3ilvlgsjm64oj.apps.googleusercontent.com',
    webClientId: '113548474045-vuk7am9h5b8ug7c1tudd36pcsagv4l6b.apps.googleusercontent.com',
  });
  const styles = useStyles();
  const deviceSize = useDeviceSize();
  const [windowDimensions, setWindowDimensions] = useState(Dimensions.get('window'));
  const updateDimensions = () => {
    setWindowDimensions(Dimensions.get('window'));
  };

  // Handle google sign in when user attempts to login
  useEffect(() => {
    handleGoogleSignIn();
  }, [response]);

  async function handleGoogleSignIn() {
    const user = await AsyncStorage.getItem('@user');
    if (!user) {
      if (response.type === 'success') {
        await getUserInfo(response.authentication.accessToken);
      } else {
        console.log('Google sign in failed');
      }
    } else {
      setUserInfo(JSON.parse(user));
    }
  }

  async function handleGoogleSignOut() {
    const user = await AsyncStorage.getItem('@user');
    if (user) {
      await AsyncStorage.removeItem('@user');
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
      await AsyncStorage.setItem('@user', JSON.stringify(user));
      setUserInfo(user);
    } catch (e) {
      console.error(e);
    }
  };

  Dimensions.addEventListener('change', updateDimensions);

  return (
    <View style={styles.container}>
      {windowDimensions.width > 1200 ? (
        <ImageBackground
          source={require('../assets/homescreen_web.png')}
          style={[
            styles.backgroundImage,
            { width: windowDimensions.width, height: windowDimensions.height },
          ]}
        >
          <View style={styles.web}>
            <View>
              <Text style={styles.title}>
                Welcome to <br></br> Lock & Learn!
              </Text>
              <Button
                mode="contained"
                style={styles.button}
                textColor="#3E5CAA"
                onPress={() => navigation.navigate('Signup')}
              >
                <Text>Tutor</Text>
              </Button>
              <Button
                mode="contained"
                style={styles.button}
                textColor="#3E5CAA"
                onPress={() => navigation.navigate('Signup')}
              >
                Parent
              </Button>
              <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
                Already have an account? Sign in
              </Text>
              <Text style={styles.link} onPress={() => navigation.navigate('UserLandingPage')}>
                Go to Landing Page
              </Text>
            </View>
          </View>
        </ImageBackground>
      ) : (
        <View
          style={[
            styles.mobile,
            { width: windowDimensions.width, height: windowDimensions.height },
          ]}
        >
          <View style={styles.mobile_container}>
            <Image
              style={styles.mobile_image}
              source={require('../assets/homescreen_mobile.png')}
            />
            <View style={styles.main_container}>
              <View style={styles.content}>
                <Text style={styles.title}>
                  Welcome to <br></br> Lock & Learn
                </Text>
                <Button
                  mode="contained"
                  style={styles.button}
                  textColor="#3E5CAA"
                  onPress={() => navigation.navigate('Signup')}
                >
                  <Text>Tutor</Text>
                </Button>
                <Button
                  mode="contained"
                  style={styles.button}
                  textColor="#3E5CAA"
                  onPress={() => navigation.navigate('Signup')}
                >
                  Parent
                </Button>
                <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
                  Already have an account? Sign in
                </Text>
                <Text style={styles.link} onPress={() => navigation.navigate('UserLandingPage')}>
                  Go to Landing Page
                </Text>
                {JSON.stringify(userInfo)}
                <Button
                  mode="contained"
                  style={styles.button}
                  textColor="#3E5CAA"
                  onPress={() => promptAsync()}
                >
                  Sign in with google
                </Button>
                <Button
                  mode="contained"
                  style={styles.button}
                  textColor="#3E5CAA"
                  onPress={() => handleGoogleSignOut()}
                >
                  Sign out
                </Button>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const useStyles = CreateResponsiveStyle(
  {
    container: {
      minWidth: wp('100%'),
      minHeight: hp('100%'),
      backgroundColor: '#4F85FF',
    },
    web: {
      position: 'absolute',
      width: wp('30%'),
      height: hp('100%'),
      right: 0,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
      borderRadius: 20,
    },
    mobile: {
      alignItems: 'center',
    },
    mobile_container: {
      width: 500,
      height: hp('100%'),
    },
    mobile_image: {
      resizeMode: 'contain',
      height: hp('60%'),
    },
    backgroundImage: {
      resizeMode: 'cover',
      flex: 1,
    },
    main_container: {
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      paddingVertical: 30,
    },
    title: {
      color: '#3E5CAA',
      textAlign: 'center',
      fontFamily: 'Montserrat',
      fontSize: 48,
      fontStyle: 'normal',
      fontWeight: '600',
      lineHeight: 'normal',
      marginBottom: 50,
    },
    button: {
      borderRadius: 20,
      backgroundColor: '#C6D8FF',
      color: '#3E5CAA',
      fontSize: 20,
      fontStyle: 'normal',
      fontWeight: 600,
      marginVertical: 25,
    },
    link: {
      color: '#3E5CAA',
      paddingTop: 10,
      textAlign: 'center',
    },
  },
  {
    [maxSize(DEVICE_SIZES.LG)]: {
      title: {
        marginBottom: 20,
        fontSize: 30,
      },
      button: {
        marginVertical: 10,
      },
    },
  }
);

export default HomeScreen;
