import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  navigation,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
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
import { getItem, removeItem } from '../components/AsyncStorage';
import { useRoute } from '@react-navigation/native';
import { APP_SERVICE_API_ID, APP_SERVICE_ENDPOINT_BASE_URL } from '../config';
import axios from 'axios';
import { useApp } from '@realm/react';

const HomeScreen = ({ navigation }) => {
  const app = useApp();
  const styles = useStyles();
  const deviceSize = useDeviceSize();
  const route = useRoute();
  const [windowDimensions, setWindowDimensions] = useState(Dimensions.get('window'));
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State to track authentication
  const [isRegisterd, setIsRegistered] = useState(false); // State to track registration

  const [username, setUsername] = useState('doesThisWork');

  const handleSubmitRealm = async () => {
    try {
      if (!isRegisterd) {
        await axios.post(
          `${APP_SERVICE_ENDPOINT_BASE_URL}/app/${APP_SERVICE_API_ID}/endpoint/registerUser`,
          { username }
        );

        const credentials = Realm.Credentials.function({ username });
        await app.logIn(credentials);
      }
    } catch (error) {}
  };

  const checkAuthenticated = async () => {
    try {
      const token = await getItem('@token');
      if (token) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  /* useEffect(() => {
    checkAuthenticated();
  }, [isAuthenticated]);
 */

  useEffect(() => {
    if (route.params && typeof route.params.isAuthenticated !== 'undefined') {
      setIsAuthenticated(route.params.isAuthenticated);
    } else {
      checkAuthenticated();
    }
  }, [route.params]);

  const isUserStillAuthenticated = async () => {
    const token = JSON.parse(await getItem('@token'));
    if (token) {
      const currentTime = Math.floor(Date.now() / 1000);
      if (token?.tokenExpiration < currentTime) {
        console.log('Token expired', currentTime, token?.tokenExpiration);
        await removeItem('@token');
      } else {
        console.log(token);
        console.log('Token valid', currentTime, token?.tokenExpiration);
        // If token is not expired, update the token expiration time
        await setUserTokenWithExpiry('@token', data.user);
      }
    }
  };

  const updateDimensions = () => {
    setWindowDimensions(Dimensions.get('window'));
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
              <Text style={styles.title}>Welcome to</Text>
              <Text style={styles.title}>Lock & Learn!</Text>
              {isAuthenticated ? (
                // Render content for authenticated users
                <>
                  <Text style={{ color: '#008000', textAlign: 'center' }}>
                    You are authenticated!
                  </Text>
                  {/* Additional authenticated content */}
                </>
              ) : (
                // Render content for unauthenticated users
                <>
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#C6D8FF' }]}
                    onPress={() => navigation.navigate('Signup')}
                  >
                    <Text style={[styles.buttonText, { marginVertical: 10 }]}>Sign up</Text>
                  </TouchableOpacity>
                  <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
                    Already have an account? Sign in
                  </Text>
                </>
              )}
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
                <Text style={styles.title}>Welcome to</Text>
                <Text style={styles.title}>Lock & Learn</Text>
                {isAuthenticated ? (
                  // Render content for authenticated users
                  <>
                    <Text style={{ color: '#008000', textAlign: 'center' }}>
                      You are authenticated!
                    </Text>
                    {/* Additional authenticated content */}
                  </>
                ) : (
                  <>
                    <TouchableOpacity
                      style={[styles.button, { backgroundColor: '#C6D8FF' }]}
                      onPress={() => navigation.navigate('Signup')}
                    >
                      <Text style={[styles.buttonText, { marginVertical: 8 }]}>Sign up</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, { backgroundColor: '#C6D8FF' }]}
                      onPress={() => handleSubmitRealm()}
                    >
                      <Text style={[styles.buttonText, { marginVertical: 8 }]}>Test realm</Text>
                    </TouchableOpacity>
                    <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
                      Already have an account? Sign in
                    </Text>
                  </>
                )}
                <Text style={styles.link} onPress={() => navigation.navigate('UserLandingPage')}>
                  Go to Landing Page
                </Text>
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
      minHeight: hp('40%'),
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      paddingVertical: 10,
    },
    title: {
      color: '#3E5CAA',
      textAlign: 'center',
      fontFamily: 'Montserrat',
      fontSize: 48,
      fontStyle: 'normal',
      fontWeight: '600',
      marginBottom: 25,
    },
    button: {
      borderRadius: 20,
      fontSize: 20,
      fontStyle: 'normal',
      fontWeight: 600,
    },
    buttonText: {
      color: '#3E5CAA',
      fontSize: 14,
      fontStyle: 'normal',
      fontWeight: 600,
      textAlign: 'center',
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
