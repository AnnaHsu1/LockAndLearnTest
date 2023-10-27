import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, TextInput, View, Button, navigation, Image } from 'react-native';
import { CreateResponsiveStyle, DEVICE_SIZES, minSize, useDeviceSize } from 'rn-responsive-styles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { IPV4 } from '../../components/APIUrl';

const LandingPage = ({ navigation }) => {
  const styles = useStyles();
  const deviceSize = useDeviceSize();
  const api_url = IPV4; // TO MODIFY
  const handleLogout = async () => {
    try {
      console.log('Attempting to log out...');

      // Make a POST request to the logout endpoint using fetch
      const response = await fetch('http://' + api_url + ':4000/users/logout', {
        method: 'POST',
        credentials: 'include', // Include credentials (cookies) in the request
      });

      //console.log('Post logout response done.');

      if (response.status === 201) {
        console.log('Response 201: Successfully logged out');
        // After successful logout, navigate to the Home screen
        navigation.navigate('Home');

      } else {
        console.error('Error logging out:', response.status);
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View>
      <Button title="Upload" onPress={() => navigation.navigate('Upload')} />
      <Button title="Uploading" onPress={() => navigation.navigate('Uploading')} />
      <Button title="Locking" onPress={() => navigation.navigate('Locking')} />
      <Button title="Parent Account" onPress={() => navigation.navigate('ParentAccount')} />
      <Button title="Log out" onPress={handleLogout} />
      <StatusBar style="auto" />
    </View>
  );
};

const useStyles = CreateResponsiveStyle({
  page: {
    backgroundColor: '#ffffff',
    maxWidth: wp('100%'),
    flex: 1,
    alignItems: 'center',
  },
});

export default LandingPage;
