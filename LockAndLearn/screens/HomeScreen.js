import { useEffect, useState } from 'react';
import { Text, View, Image, ImageBackground, Dimensions, TouchableOpacity } from 'react-native';
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
import { useRoute } from '@react-navigation/native';
import {
  getItem,
  removeItem,
  setUserTokenWithExpiry,
  getUser,
  handleLogout,
} from '../components/AsyncStorage';
import { FcGoogle } from 'react-icons/fc';

const HomeScreen = ({ navigation }) => {
  const styles = useStyles();
  const deviceSize = useDeviceSize();
  const route = useRoute();
  const [windowDimensions, setWindowDimensions] = useState(Dimensions.get('window'));
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State to track authentication

  /* useEffect(() => {
    checkAuthenticated();
  }, [isAuthenticated]);
 */

  useEffect(() => {
    if (route.params && typeof route.params.isAuthenticated !== 'undefined') {
      setIsAuthenticated(route.params.isAuthenticated);
    } else {
      isUserStillAuthenticated();
    }
  }, [route.params, isAuthenticated]);

  const isUserStillAuthenticated = async () => {
    try {
      const token = JSON.parse(await getItem('@token'));
      if (token) {
        const currentTime = Math.floor(Date.now() / 1000);
        if (token?.tokenExpiration < currentTime) {
          console.log('Token expired', currentTime, token?.tokenExpiration);
          await removeItem('@token');
          setIsAuthenticated(false);
        } else {
          // If token is not expired, update the token expiration time
          await setUserTokenWithExpiry('@token', token);
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateDimensions = () => {
    setWindowDimensions(Dimensions.get('window'));
  };

  const goToHomePage = async () => {
    const userToken = await getUser();
    if (userToken.isParent) {
      navigation.navigate('ParentHomeScreen');
    } else if (userToken.email === 'admin@lockandlearn.ca') {
      navigation.navigate('AdminMenu');
    } else {
      navigation.navigate('UserLandingPage');
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
              <Text style={styles.title}>Welcome to</Text>
              <Text style={styles.title}>Lock & Learn!</Text>
              {isAuthenticated ? (
                // Render content for authenticated users
                <>
                  <Text style={{ color: '#008000', textAlign: 'center' }}>
                    You are authenticated!
                  </Text>
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#C6D8FF', marginVertical: 5 }]}
                    onPress={() => {
                      goToHomePage();
                    }}
                  >
                    <Text style={[styles.buttonText, { marginVertical: 8 }]}>Home</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#C6D8FF', marginVertical: 5 }]}
                    onPress={() => {
                      handleLogout();
                      setIsAuthenticated(false);
                    }}
                  >
                    <Text style={[styles.buttonText, { marginVertical: 8 }]}>Log out</Text>
                  </TouchableOpacity>
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
              {/* <Text style={styles.link} onPress={() => navigation.navigate('UserLandingPage')}>
                Go to Landing Page
              </Text> */}
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
                    <TouchableOpacity
                      style={[styles.button, { backgroundColor: '#C6D8FF', marginVertical: 5 }]}
                      onPress={() => {
                        goToHomePage();
                      }}
                    >
                      <Text style={[styles.buttonText, { marginVertical: 8 }]}>Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, { backgroundColor: '#C6D8FF', marginVertical: 5 }]}
                      onPress={() => {
                        handleLogout();
                        setIsAuthenticated(false);
                      }}
                    >
                      <Text style={[styles.buttonText, { marginVertical: 8 }]}>Log out</Text>
                    </TouchableOpacity>
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
                    <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
                      Already have an account? Sign in
                    </Text>
                  </>
                )}
                {/* <Text style={styles.link} onPress={() => navigation.navigate('UserLandingPage')}>
                  Go to Landing Page
                </Text> */}
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
      width: '100%',
      height: '100%',
      backgroundColor: '#4F85FF',
    },
    web: {
      position: 'absolute',
      minHeight: 500,
      width: '30%',
      height: '97%',
      right: 0,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
      borderRadius: 15,
      margin: 10,
      shadowColor: '#000',
      shadowOffset: { width: 10, height: 10 },
      shadowOpacity: 0.75,
      shadowRadius: 20,
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
      borderRadius: 10,
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
