import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, TextInput, View, Button, navigation, Image } from 'react-native';
import { CreateResponsiveStyle, DEVICE_SIZES, minSize, useDeviceSize } from 'rn-responsive-styles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const LandingPage = ({ navigation, setToken }) => {
  const styles = useStyles();
  const deviceSize = useDeviceSize();

  return (
    <View>
      <Button title="Log in" onPress={() => navigation.navigate('Login')} />
      <Button title="Sign up" onPress={() => navigation.navigate('Signup')} />
      <Button title="Upload" onPress={() => navigation.navigate('Upload')} />
      <Button title="Uploading" onPress={() => navigation.navigate('Uploading')} />
      <Button title="Locking" onPress={() => navigation.navigate('Locking')} />
      <Button title="Quiz Material" onPress={() => navigation.navigate('SelectWorkPackageScreen')} />
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
