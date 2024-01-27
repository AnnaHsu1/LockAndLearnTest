import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

const Spacer = ({ height, width }) => <View style={{ height, width }} />;

const FreeTimeSessionScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.centeredContent}>
        <Text style={styles.logoText} testID="itsTimeText">
          FREE TIME!
        </Text>
        <Spacer height={20} />
        {/* <Image
          source={require('../../assets/sessionbeginslogo.png')} // Placeholder image
          style={styles.logo}
          testID="sessionBeginsLogo"
        /> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#407BFF',
    alignItems: 'center',
    justifyContent: 'center', // Center content vertically
  },
  centeredContent: {
    alignItems: 'center',
  },
  logo: {
    width: 130,
    height: 130,
    marginTop: '25%', // Position the image 25% from the top
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 24, // Larger font size
  },
});

export default FreeTimeSessionScreen;
