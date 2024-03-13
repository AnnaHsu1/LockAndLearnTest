import React, { useState, useEffect } from 'react';
import { Text, Touchable, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { CreateResponsiveStyle, DEVICE_SIZES, minSize } from 'rn-responsive-styles';
import { Button, Icon } from 'react-native-paper';
import PropTypes from 'prop-types';
import { TbMoodEdit } from 'react-icons/tb';
import { IoSettingsOutline } from 'react-icons/io5';

const ChildProfileScreen = ({ route, navigation }) => {
  const styles = useStyles();
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
      const response = await fetch('https://lockandlearn.onrender.com/child/deletechild/' + child._id, {
        method: 'DELETE',
      });
      if (response.status === 200) {
        navigation.navigate('ParentAccount', {
          updatedChildren: null,
        });
      }
    } catch (error) {
      console.error('Error deleting child:', error);
    }
  };

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={[{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }]}>
            <Icon source="account-circle" color="#fff" size={30} />
            <Text style={styles.title}>
              {child.firstName} {child.lastName}
            </Text>
          </View>
          {/* Edit profile */}
          <TouchableOpacity
            testID="edit-profile"
            onPress={() => {
              navigation.navigate('EditChild', { child: child });
            }}
          >
            <TbMoodEdit color="#fff" size={30} />
          </TouchableOpacity>
        </View>
        <View style={[{ justifyContent: 'space-evenly', flex: 1, gap: 10 }]}>
          {/* Start session button */}
          <Button
            testID="start-session"
            mode="contained"
            onPress={() => {
              navigation.navigate('Locking',{ child_ID: child._id });
            }}
            style={[styles.button, styles.full_width]}
          >
            <Text style={styles.text}>Start session</Text>
          </Button>
          {/* See performance */}
          {/* Performance should be shown on this page! TODO */}
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
          <Button
            testID="preferences"
            mode="contained"
            onPress={() => {
              navigation.navigate('StudyMaterialPreferences', { child: child });
            }}
            style={[styles.button, styles.full_width]}
          >
            <Text style={styles.text}>Set preferences</Text>
          </Button>
          {/* Add Material */}
          <Button
            testID="add-child-material"
            mode="contained"
            onPress={() => {
              navigation.navigate('AddChildMaterial', { child: child });
            }}
            style={[styles.button, styles.full_width]}
          >
            <Text style={styles.text}>Assign material</Text>
          </Button>
          <Button
            testID="settings"
            mode="contained"
            onPress={() => {
              navigation.navigate('ChildSettings', { child: child });
            }}
            style={[styles.button, styles.full_width]}
          >
            <Text style={styles.text}>Settings</Text>
          </Button>
        </View>
      </View>
      {/* Delete child link */}
      <Button
        testID="delete-child-link"
        style={styles.link}
        onPress={() => {
          toggleModal();
        }}
      >
        <Text style={styles.linkText}>Delete {child.firstName}'s account</Text>
      </Button>
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

          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
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
              <Text style={{ color: '#FF0000', fontSize: 20 }}>Yes</Text>
            </Button>

            {/* Cancel */}
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
          </View>
        </View>
      </Modal>
    </View>
  );
};

ChildProfileScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      child: PropTypes.object.isRequired,
    }),
  }).isRequired,
  navigation: PropTypes.object.isRequired,
};

const useStyles = CreateResponsiveStyle(
  {
    page: {
      backgroundColor: '#FFFFFF',
      maxWidth: '100%',
      flex: 1,
      alignItems: 'center',
    },
    container: {
      minWidth: '90%',
      paddingLeft: 20,
      paddingRight: 20,
      paddingVertical: 10,
      marginVertical: '2%',
      borderRadius: 10,
      backgroundColor: '#4F85FF',
      justifyContent: 'space-between',
    },
    header: {
      alignItems: 'center',
      height: 50,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    title: {
      color: '#ffffff',
      fontSize: 24,
      textAlign: 'center',
      paddingLeft: 10,
    },
    button: {
      color: '#4F85FF',
      backgroundColor: '#ffffff',
      borderRadius: 10,
      marginVertical: 3,
      minHeight: 70,
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
      borderColor: '#FF0000',
      borderWidth: 1,
      borderRadius: 10,
      backgroundColor: '#ffffff',
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
      padding: 5,
    },
    link: {
      borderRadius: 10,
      minHeight: 20,
      justifyContent: 'center',
      minWidth: 100,
      fontSize: 12,
      textAlign: 'center',
      backgroundColor: 'white',
    },
    linkText: {
      color: 'red',
      fontSize: 12,
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

export default ChildProfileScreen;
