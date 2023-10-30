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

const AddChildScreen = ({ navigation, setToken }) => {
  const styles = useStyles();
  const deviceSize = useDeviceSize();
  const [text, setText] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [childAdded, setChildAdded] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const [fdata, setFdata] = useState({
    FirstName: '',
    LastName: '',
    Grade: '',
    ParentId: '',
  });

  const [errors, setErrors] = useState('');

  const addChild = async () => {
    const auth = await getItem('@token');

    if (auth) {
      const user = JSON.parse(auth);
      console.log(user);

      fdata.ParentId = user._id;
    } else {
      // Handle the case where user is undefined (not found in AsyncStorage)
      console.log('User not found in AsyncStorage');
    }

    console.log(fdata);

    // Package the user data into a JSON format and ship it to the backend
    try {
      const response = await fetch('http://localhost:4000/child/addchild', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fdata), // Send user data as JSON
      });

      const data = await response.json();

      if (response.status === 201) {
        setErrors('');
        setModalVisible(true);
        // User created successfully
        console.log('child added successfully in database!', data);

        //Add redirect
      } else {
        if (data.msg === 'All fields must be filled.') {
          setErrors(data.msg);
        }
      }
    } catch (error) {
      console.error('Submitting error when adding child:', error);
    }
  };

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <Text style={styles.title}>Add child</Text>
        {errors ? <Text style={styles.box}>{errors}</Text> : null}
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
        <Modal
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
              minHeight: hp('20%'),
            }}
          >
            <Text style={styles.title}>
              {fdata.FirstName} {fdata.LastName} has been added successfully!
            </Text>
            <Button
              style={styles.button}
              title="Hide modal"
              onPress={() => {
                toggleModal();
                navigation.navigate('ParentAccount');
              }}
            >
              <Text style={styles.close}>Close</Text>
            </Button>
          </View>
        </Modal>
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
    close: {
      color: 'white',
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
    box: {
      borderWidth: 1,
      borderColor: 'red',
      color: 'red',
      padding: 10,
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
