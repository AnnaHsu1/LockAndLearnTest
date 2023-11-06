import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, TextInput, View, Button, navigation, Image } from 'react-native';
import { CreateResponsiveStyle, DEVICE_SIZES, minSize, useDeviceSize } from 'rn-responsive-styles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { getItem, removeItem } from '../../components/AsyncStorage';

const LandingPage = ({ navigation }) => {
  const [user, setUser] = useState(null);

  async function getUser() {
    try {
      const token = await getItem('@token');
      if (token) {
        const user = JSON.parse(token);
        setUser(user);
      } else {
        // Handle the case where user is undefined (not found in AsyncStorage)
        console.log('User not found in AsyncStorage');
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  const handleLogout = async () => {
    await removeItem('@token');
    console.log('Logged out successfully');
    navigation.navigate('Home', {
      isAuthenticated: false,
    });
  };

  return (
    <View>
      <Button title="Upload" onPress={() => navigation.navigate('Upload')} />
      <Button title="View my Uploaded Files" onPress={() => navigation.navigate('ViewUploads')} />
      <Button title="Locking" onPress={() => navigation.navigate('Locking')} />
      <Button title="Quiz Material" onPress={() => navigation.navigate('SelectWorkPackageScreen')} />
      {/* is user a parent? */}
      {user?.isParent ? (
        <Button title="Parent Account" onPress={() => navigation.navigate('ParentAccount')} />
      ) : null}
      {/* is user logged in? */}
      {user ? <Button title="Log out" onPress={handleLogout} /> : null}

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
