import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { CreateResponsiveStyle, DEVICE_SIZES, minSize, useDeviceSize } from 'rn-responsive-styles';
import { Button, Icon } from 'react-native-paper';
import { getItem } from '../../../components/AsyncStorage';
import { useRoute } from '@react-navigation/native';
import { Divider } from '@rneui/themed';
import { IoIosBrowsers } from 'react-icons/io';
import { GiPayMoney } from 'react-icons/gi';
import { IoPersonAdd } from 'react-icons/io5';
import { color } from '@rneui/themed/dist/config';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const ParentAccountScreen = ({ navigation }) => {
  const styles = useStyles();
  const deviceSize = useDeviceSize();
  const route = useRoute();

  const [user, setUser] = useState(); // State to track authentication
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

        setUser(user);
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
        {user ? (
          <Text style={styles.title}>Welcome back {user.firstName}</Text>
        ) : (
          <Text style={styles.title}>Welcome back</Text>
        )}
        <View
          style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}
        >
          {children ? <Text style={styles.text}>Select a child </Text> : null}
          <TouchableOpacity
            testID="add-child-button"
            style={[
              styles.text,
              {
                textAlign: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 10,
                paddingVertical: 5,
              },
            ]}
            onPress={() => navigation.navigate('AddChild')}
          >
            <IoPersonAdd size={16} style={{ color: '#4F85FF' }} />
            <Text style={[styles.child, { color: '#4F85FF', paddingLeft: 10, fontSize: 16 }]}>
              Add Child
            </Text>
          </TouchableOpacity>
        </View>
        {children.map((child) => (
          <Button
            key={child._id}
            testID={`child-${child._id}`}
            mode="contained"
            contentStyle={{
              minWidth: '90%',
              maxWidth: '90%',
              minHeight: 80,
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
        <Divider style={{ marginTop: 20, marginBottom: 20 }} />
        <Text style={styles.text}>Work Packages</Text>
        <View style={[{ flexDirection: 'row', justifyContent: 'space-between' }]}>
          <TouchableOpacity
            style={[
              {
                borderColor: '#4F85FF',
                borderRadius: 5,
                borderWidth: 1,
                width: 'auto',
                flex: 0.5,
                marginVertical: 10,
                marginHorizontal: 5,
                justifyContent: 'center',
                alignItems: 'center',
                height: 80,
              },
            ]}
            onPress={() => navigation.navigate('WorkPackageBrowsing')}
          >
            <IoIosBrowsers size={30} color="#4F85FF" />
            <Text style={[styles.child, { color: '#4F85FF', paddingLeft: 0 }]}>Browse</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              {
                borderColor: '#4F85FF',
                borderRadius: 5,
                borderWidth: 1,
                width: 'auto',
                flex: 0.5,
                marginVertical: 10,
                marginHorizontal: 5,
                justifyContent: 'center',
                alignItems: 'center',
                height: 80,
              },
            ]}
            onPress={() => navigation.navigate('PurchasedMaterial')}
          >
            <GiPayMoney size={30} color="#4F85FF" />
            <Text style={[styles.child, { color: '#4F85FF', paddingLeft: 0 }]}>Purchased</Text>
          </TouchableOpacity>
              </View>
              <View>
                  <TouchableOpacity
                      style={[styles.button, styles.full_width, { justifyContent: 'center', }]}
                      onPress={() => navigation.navigate('ContactUs')}
                  >
                      <Text style={[styles.child, { color: 'white' }]}>Contact Us</Text>
                  </TouchableOpacity>
              </View>
      </View>
      <Image style={styles.bottomCloud} source={require('../../../assets/bottomClouds.png')} />
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
      minHeight: '65%',
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
      width: '100%',
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
        width: '100%',
        height: 300,
        resizeMode: 'stretch',
        flex: 1,
      },
    },
  }
);

export default ParentAccountScreen;
