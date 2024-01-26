import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import Modal from 'react-native-modal';
import { CreateResponsiveStyle, DEVICE_SIZES, minSize, useDeviceSize } from 'rn-responsive-styles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Button, Icon } from 'react-native-paper';

const ChildSettings = ({ route, navigation }) => {
  const styles = useStyles();
  const [child, setChild] = useState({});
  const childSelected = route.params.child;

  // On page load, set child to child pass through route parameters
  useEffect(() => {
    setChild(childSelected);
  }, []);

  return (
    <View style={styles.page}>
      <View style={[styles.container, { justifyContent: 'space-between' }]}>
        <View style={styles.header}>
          <Icon source="account-circle" color="#fff" size={30} />
          <Text style={styles.title}>
            {child.firstName} {child.lastName}
          </Text>
        </View>
        <View style={[{ flex: 1, justifyContent: 'space-around' }]}>
          {/* Device Controls */}
          <Button
            testID="device-controls"
            mode="contained"
            onPress={() => {
              console.log('See performance');
            }}
            style={[styles.button, styles.full_width]}
          >
            <Text style={styles.text}>Device Controls</Text>
          </Button>
          {/* Passing Grade*/}
          <Button
            testID="passing-grade"
            mode="contained"
            onPress={() => {
              navigation.navigate('ChildPassingGradePerSubject', { child: child });
            }}
            style={[styles.button, styles.full_width]}
          >
            <Text style={styles.text}>Passing Grade</Text>
          </Button>
          {/* Scheduling */}
          <Button
            testID="scheduling"
            mode="contained"
            onPress={() => {
              navigation.navigate('ChildTimeframes', { child: child });
            }}
            style={[styles.button, styles.full_width]}
          >
            <Text style={styles.text}>Scheduling</Text>
          </Button>
        </View>
      </View>
    </View>
  );
};

const useStyles = CreateResponsiveStyle(
  {
    page: {
      backgroundColor: '#ffffff',
      maxWidth: '100%',
      flex: 1,
      alignItems: 'center',
    },
    container: {
      minWidth: '90%',
      minHeight: '50%',
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 20,
      marginTop: 20,
      borderRadius: 10,
      backgroundColor: '#4F85FF',
    },
    header: {
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '20%',
    },
    title: {
      color: '#ffffff',
      fontSize: 24,
      textAlign: 'center',
      paddingTop: 15,
    },
    button: {
      color: '#4F85FF',
      backgroundColor: '#ffffff',
      borderRadius: 10,
      marginVertical: 10,
      height: 80,
      justifyContent: 'center',
      minWidth: 100,
    },
    modalButtons: {
      borderRadius: 10,
      marginVertical: 10,
      height: 50,
      justifyContent: 'center',
      minWidth: 100,
    },
    bgRed: {
      backgroundColor: '#FF0000',
    },
    bgWhite: {
      backgroundColor: '#ffffff',
    },
    full_width: {
      minWidth: '100%',
    },
    bottomCloud: {
      display: 'flex',
      justifyContent: 'flex-end',
      width: '100%',
      height: 250,
      resizeMode: 'stretch',
    },
    text: {
      color: '#4F85FF',
      fontSize: 20,
      padding: 10,
    },
    options: {
      flex: 0.75,
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    link: {
      color: '#ffffff',
      fontSize: 12,
      textAlign: 'center',
      justifyContent: 'flex-end',
    },
  },
  {
    [minSize(DEVICE_SIZES.MD)]: {
      container: {
        minWidth: 500,
        width: 500,
      },
      bottomCloud: {
        width: '100%',
        height: 300,
        resizeMode: 'stretch',
        flex: 1,
      },
    },
  }
);

export default ChildSettings;
