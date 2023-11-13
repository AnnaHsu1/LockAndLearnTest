import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, TextInput, View, navigation, Image } from 'react-native';
import Modal from 'react-native-modal';
import { CreateResponsiveStyle, DEVICE_SIZES, minSize, useDeviceSize } from 'rn-responsive-styles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Button, Icon } from 'react-native-paper';
import { getItem } from '../../../components/AsyncStorage';

const ChildProfileScreen = ({ route, navigation }) => {
  const styles = useStyles();
  const deviceSize = useDeviceSize();
  const [child, setChild] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);
  const childSelected = route.params.child;

  // On page load, set child to child pass through route parameters
  useEffect(() => {
    setChild(childSelected);
  }, []);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  // API request to delete child
  const deleteChild = async () => {
    try {
      const response = await fetch('http://localhost:4000/child/deletechild/' + child._id, {
        method: 'DELETE',
      });
      if (response.status === 200) {
        navigation.navigate('ParentAccount', {
          updatedChildren: null,
        });
      }
    } catch (error) {}
  };

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon source="account-circle" color="#fff" size={30} />
          <Text style={styles.title}>
            {child.firstName} {child.lastName}
          </Text>
        </View>

        <View style={styles.options}>
          {/* Start session */}
          <Button
            testID="start-session"
            mode="contained"
            onPress={() => {
              navigation.navigate('Locking');
            }}
            style={[styles.button, styles.full_width]}
          >
            <Text style={styles.text}>Start session</Text>
          </Button>
          {/* Edit profile */}
          <Button
            testID="edit-profile"
            mode="contained"
            onPress={() => {
              navigation.navigate('EditChild', { child: child });
            }}
            style={[styles.button, styles.full_width]}
          >
            <Text style={styles.text}>Edit profile</Text>
          </Button>
          <Button
            testID="see-performance"
            mode="contained"
            onPress={() => {
              console.log('See performance');
            }}
            style={[styles.button, styles.full_width]}
          >
            <Text style={styles.text}>See performance</Text>
          </Button>
        </View>

        {/* Delete child link */}
        <Text
          testID="delete-child-link"
          style={styles.link}
          onPress={() => {
            toggleModal();
          }}
        >
          Delete {child.firstName}'s account
        </Text>
      </View>

      {/* Modal to confirm the deletion of a child */}
      <Modal
        testID="delete-child-modal"
        isVisible={isModalVisible}
        onRequestClose={toggleModal}
        transparent={true}
        style={{ justifyContent: 'center', alignItems: 'center' }}
      >
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 20,
            padding: 20,
          }}
        >
          <Text style={styles.text}>
            Are you sure you want to delete {child.firstName}'s account?
          </Text>

          {/* Cancel */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <Button
              testID="close-modal-button"
              style={[styles.modalButtons, styles.bgWhite]}
              title="Hide modal"
              mode="contained"
              onPress={() => {
                toggleModal();
              }}
            >
              <Text style={{ color: '#4F85FF', fontSize: 20 }}>No</Text>
            </Button>

            {/* Confirm child deletion */}
            <Button
              testID="delete-child-button"
              style={[styles.modalButtons, styles.bgRed]}
              title="Delete child"
              mode="contained"
              onPress={() => {
                toggleModal();
                deleteChild();
              }}
            >
              <Text style={{ color: '#fff', fontSize: 20 }}>Yes</Text>
            </Button>
          </View>
        </View>
      </Modal>
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
      marginTop: 20,
      borderRadius: 10,
      backgroundColor: '#4F85FF',
    },
    header: {
      alignItems: 'center',
      justifyContent: 'center',
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
      width: wp('100%'),
      height: 250,
      resizeMode: 'stretch',
    },
    text: {
      color: '#4F85FF',
      fontSize: 20,
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
        width: wp('100%'),
        height: 300,
        resizeMode: 'stretch',
        flex: 1,
      },
    },
  }
);

export default ChildProfileScreen;
