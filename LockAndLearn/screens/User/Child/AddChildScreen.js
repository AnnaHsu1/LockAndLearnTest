import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, TextInput, View, navigation, Image } from 'react-native';
import { CreateResponsiveStyle, DEVICE_SIZES, minSize, useDeviceSize } from 'rn-responsive-styles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Button, Icon } from 'react-native-paper';
import DeviceInfo from 'react-native-device-info';

const AddChildScreen = ({ navigation, setToken }) => {
  const styles = useStyles();
  const deviceSize = useDeviceSize();

  const [deviceId, setDeviceId] = useState('');
  const storedDeviceId = localStorage.getItem('deviceId');

  useEffect(() => {
    // Check if a unique identifier is already stored in local storage.
    const storedDeviceId = localStorage.getItem('deviceId');

    if (storedDeviceId) {
      setDeviceId(storedDeviceId);
    } else {
      // If not found, generate and store a new identifier.
      const newDeviceId = `web_device_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('deviceId', newDeviceId);
      setDeviceId(newDeviceId);
    }
  }, []);
  console.log('Device ID:', deviceId);

  //   ONLY WORKS FOR MOBILE DEVICES
  //   const getDeviceId = async () => {
  //     try {
  //       const deviceId = await DeviceInfo.getDeviceId();
  //       console.log('Device ID:', deviceId);
  //       // You can now use 'deviceId' in your code
  //     } catch (error) {
  //       console.error('Error getting device ID:', error);
  //     }
  //   };
  //   getDeviceId();

  const [text, setText] = useState('');

  const [fdata, setFdata] = useState({
    FirstName: '',
    LastName: '',
    Grade: '',
  });

  const addChild = () => {};

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <Text style={styles.title}>Add child</Text>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={styles.half_width}>
            <Text style={styles.field}>First Name</Text>
            <TextInput
              testID="first-name-input"
              style={[styles.textbox, styles.half_width]}
              value={fdata.FirstName}
              onChangeText={(newText) => setFdata({ ...fdata, FirstName: newText })}
            />
          </View>

          <View style={styles.half_width}>
            <Text style={styles.field}>Last Name</Text>
            <TextInput
              testID="last-name-input"
              style={[styles.textbox, styles.half_width]}
              value={fdata.LastName}
              onChangeText={(newText) => setFdata({ ...fdata, LastName: newText })}
            />
          </View>
        </View>

        <View style={styles.input}>
          <Text style={styles.field}>Grade</Text>
          <TextInput
            testID="grade-input"
            style={[styles.textbox, styles.full_width]}
            value={fdata.Grade}
            onChangeText={(newText) => setFdata({ ...fdata, Grade: newText })}
          />
        </View>

        <Button
          testID="signup-button"
          mode="contained"
          onPress={() => {
            addChild();
          }}
          style={[styles.button, styles.full_width]}
        >
          <Text style={styles.child}>Add Child</Text>
        </Button>
      </View>
      <Image style={styles.bottomCloud} source={require('../../../assets/bottomClouds.png')} />
    </View>
  );
};

const useStyles = CreateResponsiveStyle(
  {
    page: {
      backgroundColor: '#ffffff',
      maxWidth: wp('100%'),
      flex: 1,
      alignItems: 'center',
    },
    container: {
      minWidth: wp('90%'),
      minHeight: hp('65%'),
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 20,
    },
    title: {
      color: '#4F85FF',
      fontSize: 24,
      textAlign: 'center',
      paddingBottom: 20,
    },
    button: {
      color: '#ffffff',
      backgroundColor: '#4F85FF',
      borderRadius: 10,
    },
    field: {
      color: '#ADADAD',
    },
    full_width: {
      minWidth: '100%',
    },
    half_width: {
      width: wp('40%'),
    },
    bottomCloud: {
      display: 'flex',
      justifyContent: 'flex-end',
      width: wp('100%'),
      height: 250,
      resizeMode: 'stretch',
    },
    input: {
      display: 'flex',
      width: '100%',
      paddingVertical: 10,
    },
    textbox: {
      display: 'flex',
      minHeight: 30,
      borderRadius: 10,
      borderColor: '#407BFF',
      borderStyle: 'solid',
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderWidth: 1,
    },
  },
  {
    [minSize(DEVICE_SIZES.MD)]: {
      container: {
        minWidth: 500,
        width: 500,
      },
      bottomCloud: {
        width: wp('100%'),
        height: 300,
        resizeMode: 'stretch',
        flex: 1,
      },
      half_width: {
        width: 225,
      },
    },
  }
);

export default AddChildScreen;
