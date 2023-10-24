import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, navigation, ImageBackground } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Button } from 'react-native-paper';

const HomeScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={require('../assets/homescreen_web.png')}
      style={styles.backgroundImage}
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
        </View>

        {/* <Button title="Log in" onPress={() => navigation.navigate('Login')} />
        <Button title="Sign up" onPress={() => navigation.navigate('Signup')} />
        <Button title="Upload" onPress={() => navigation.navigate('Upload')} />
        <Button title="Uploading" onPress={() => navigation.navigate('Uploading')} />
        <Button title="Locking" onPress={() => navigation.navigate('Locking')} />
        <StatusBar style="auto" /> */}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
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
    paddingLeft: 50,
    backgroundColor: '#4F85FF',
    width: wp('100%'),
    height: hp('100%'),
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
