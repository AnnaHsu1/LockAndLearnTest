import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, TextInput, View, navigation, Image } from 'react-native';
import { CreateResponsiveStyle, DEVICE_SIZES, minSize, useDeviceSize } from 'rn-responsive-styles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Button, Icon } from 'react-native-paper';
import { getItem } from '../../../components/AsyncStorage';
import { useRoute } from '@react-navigation/native';

const ParentAccountScreen = ({ navigation }) => {
  const styles = useStyles();
  const deviceSize = useDeviceSize();
  const route = useRoute();

  const [children, setChildren] = useState([]);

  const selectChild = (child) => {
    if (child) {
      navigation.navigate('ChildProfile', { child: child });
    }
  };

  const getChildren = async () => {
    try {
      const token = await getItem('@token');
      if (token) {
        const user = JSON.parse(token);
        const response = await fetch('http://localhost:4000/child/getchildren/' + user._id, {
          method: 'GET',
          credentials: 'include', // Include cookies in the request
        });
        const data = await response.json();
        setChildren(data);
      } else {
        // Handle the case where user is undefined (not found in AsyncStorage)
        console.log('User not found in AsyncStorage');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getChildren();

    // Check if there are updated children passed as a parameter via route.params.
    if (route.params && route.params.updatedChildren) {
      // Update the state with the updated children.
      setChildren(route.params.updatedChildren);
    }
  }, [route.params]);

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome back </Text>
        <Text style={styles.text}>Select a child </Text>
        {children.map((child) => (
          <Button
            key={child._id}
            testID={`child-${child._id}`}
            mode="contained"
            contentStyle={{
              minWidth: wp('90%'),
              minHeight: 78,
              justifyContent: 'flex-start',
            }}
            onPress={() => {
              selectChild(child);
            }}
            style={[styles.button, styles.full_width]}
          >
            <Icon source="account-circle" color="#fff" size={20} />
            <Text style={styles.child}>{child.firstName}</Text>
          </Button>
        ))}
        <StatusBar style="auto" />
        <Text
          style={[styles.text, { color: '#4F85FF', textAlign: 'center', paddingTop: 20 }]}
          onPress={() => navigation.navigate('AddChild')}
        >
          + Add Child
        </Text>
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
      marginTop: 10,
      height: 78,
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
    text: {
      color: '#ADADAD',
      fontSize: 20,
    },
    child: {
      paddingLeft: 10,
      textAlign: 'center',
      justifyContent: 'center',
      fontSize: 20,
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
