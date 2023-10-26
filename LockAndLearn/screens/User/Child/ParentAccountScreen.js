import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, TextInput, View, navigation, Image } from 'react-native';
import { CreateResponsiveStyle, DEVICE_SIZES, minSize, useDeviceSize } from 'rn-responsive-styles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Button } from 'react-native-paper';

const ParentAccountScreen = ({ navigation, setToken }) => {
  const styles = useStyles();
  const deviceSize = useDeviceSize();

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome back </Text>
        <Text>Select a child </Text>
        <Button
          testID="login-button"
          mode="contained"
          onPress={() => {
            handleSubmit();
          }}
          style={[styles.button, styles.full_width]}
        >
          Child 1
        </Button>
        <StatusBar style="auto" />
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
    item: {
      display: 'flex',
      width: '100%',
      paddingVertical: 10,
    },
    title: {
      color: '#4F85FF',
      fontSize: 24,
      textAlign: 'left',
    },
    button: {
      color: '#ffffff',
      backgroundColor: '#4F85FF',
      borderRadius: 10,
      marginTop: 10,
      height: 78,
      justifyContent: 'center', // Center text vertically
      alignItems: 'center', // Center text horizontally
    },
    field: {
      color: '#ADADAD',
    },
    link: {
      color: '#4F85FF',
      paddingTop: 10,
      textAlign: 'center',
    },
    full_width: {
      minWidth: '100%',
    },
    bottomCloud: {
      display: 'flex',
      justifyContent: 'flex-end',
      width: wp('100%'),
      height: 250,
      resizeMode: 'stretch',
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
    },
  }
);

export default ParentAccountScreen;
