import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, navigation, ImageBackground, Dimensions } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Button } from 'react-native-paper';

const HomeScreen = ({ navigation }) => {
  const [windowDimensions, setWindowDimensions] = useState(Dimensions.get('window'));

  const updateDimensions = () => {
    setWindowDimensions(Dimensions.get('window'));
  };

  Dimensions.addEventListener('change', updateDimensions);

  return (
    <View style={styles.test}>
      {windowDimensions.width > 1200 ? (
        <ImageBackground
          source={require('../assets/homescreen_web.png')}
          style={[
            styles.backgroundImage,
            { width: windowDimensions.width, height: windowDimensions.height },
          ]}
        >
          <View style={styles.container}>
            <View>
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
            </View>
          </View>
        </ImageBackground>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  test: {
    flex: 1,
    width: wp('100%'),
    height: hp('100%'),
    backgroundColor: '#4F85FF',
  },
  container: {
    position: 'absolute',
    width: wp('30%'),
    height: hp('100%'),
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  backgroundImage: {
    resizeMode: 'cover',
    flex: 1,
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
});

export default HomeScreen;
