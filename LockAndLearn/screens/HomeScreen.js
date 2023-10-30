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
import { getItem } from '../components/AsyncStorage';

const HomeScreen = ({ navigation }) => {
  const styles = useStyles();
  const deviceSize = useDeviceSize();
  const [windowDimensions, setWindowDimensions] = useState(Dimensions.get('window'));
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State to track authentication

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

  useEffect(() => {
    checkAuthenticated();
  }, [isAuthenticated]);

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
              <Text style={styles.title}>
                Welcome to <br></br> Lock & Learn!
              </Text>
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
                  <Button
                    mode="contained"
                    style={styles.button}
                    textColor="#3E5CAA"
                    onPress={() => navigation.navigate('Signup')}
                  >
                    <Text>Sign up</Text>
                  </Button>
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
                <Text style={styles.title}>
                  Welcome to <br></br> Lock & Learn
                </Text>
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
                    <Button
                      mode="contained"
                      style={styles.button}
                      textColor="#3E5CAA"
                      onPress={() => navigation.navigate('Signup')}
                    >
                      <Text>Sign up</Text>
                    </Button>
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
      lineHeight: hp('10%'),
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
