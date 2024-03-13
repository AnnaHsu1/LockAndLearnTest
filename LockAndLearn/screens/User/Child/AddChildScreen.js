import React, { useState } from 'react';
import { Text, TextInput, View, Image } from 'react-native';
import Modal from 'react-native-modal';
import { CreateResponsiveStyle, DEVICE_SIZES, minSize } from 'rn-responsive-styles';
import { Button } from 'react-native-paper';
import { getItem } from '../../../components/AsyncStorage';
import { Picker } from '@react-native-picker/picker';
import PropTypes from 'prop-types';

const AddChildScreen = ({ navigation, setToken }) => {
  const styles = useStyles();
  const [isModalVisible, setModalVisible] = useState(false);
  const [updatedChildrenData, setUpdatedChildrenData] = useState([]);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const [fdata, setFdata] = useState({
    FirstName: '',
    LastName: '',
    Grade: '',
    PassingGrade: '',
    ParentId: '',
  });

  const [errors, setErrors] = useState('');

  const addChild = async () => {
    const auth = await getItem('@token');

    if (auth) {
      const user = JSON.parse(auth);
      // console.log(user);

      fdata.ParentId = user._id;
    } else {
      // Handle the case where user is undefined (not found in AsyncStorage)
      console.log('User not found in AsyncStorage');
    }

    // console.log(fdata);
    // Validation check for PassingGrade
    if (!fdata.FirstName || !fdata.LastName || !fdata.Grade || !fdata.ParentId) {
      setErrors('All fields must be filled.');
      return;
    }

    if (fdata.Grade < 1 || fdata.Grade > 13) {
      setErrors('Grade must be between 1 and 12.');
      return;
    }

    if (!fdata.FirstName.match(/^[a-zA-Z]+$/) && !fdata.LastName.match(/^[a-zA-Z]+$/)) {
      setErrors('First and last name must only contain letters.');
      return;
    }
    const passingGradeNumber = parseInt(fdata.PassingGrade);
    if (isNaN(passingGradeNumber) || passingGradeNumber < 1 || passingGradeNumber > 100) {
      setErrors('Passing Grade must be a number between 1 and 100.');
      return;
    }
    // Package the user data into a JSON format and ship it to the backend
    try {
      const response = await fetch(
        'https://data.mongodb-api.com/app/lock-and-learn-xqnet/endpoint/addChild',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            FirstName: fdata.FirstName,
            LastName: fdata.LastName,
            Grade: fdata.Grade,
            PassingGrade: fdata.PassingGrade,
            ParentId: fdata.ParentId,
          }), // Send user data as JSON
        }
      );

      const data = await response.json();

      if (response.status === 201) {
        setErrors('');
        setModalVisible(true);
        // User created successfully
        // console.log('child added successfully in database!', data);

        // Update the updatedChildrenData with the new child data
        setUpdatedChildrenData([...updatedChildrenData, data]);

        //Add redirect
      } else {
        setErrors(data.msg);
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
          <View style={[styles.half_width, { flex: 1 }]}>
            <Text style={styles.field}>First Name</Text>
            <TextInput
              testID="first-name-input"
              style={[styles.textbox, styles.half_width]}
              value={fdata.FirstName}
              onChangeText={(newText) => setFdata({ ...fdata, FirstName: newText })}
            />
          </View>

          <View style={[styles.half_width, { flex: 1 }]}>
            <Text style={styles.field}>Last Name</Text>
            <TextInput
              testID="last-name-input"
              style={[styles.textbox, styles.half_width]}
              value={fdata.LastName}
              onChangeText={(newText) => setFdata({ ...fdata, LastName: newText })}
            />
          </View>
        </View>

        <View style={[styles.containerPicker, { marginTop: 10 }]}>
          <Text style={{ color: '#ADADAD' }}>Grade</Text>
          <Picker
            testID="grade-input"
            selectedValue={fdata.Grade}
            onValueChange={(newText) => {
              setFdata({ ...fdata, Grade: newText });
            }}
            style={styles.textbox}
          >
            <Picker.Item label="Choose a Grade" value="Choose a Grade" />
            {[...Array(12)].map((_, index) => (
              <Picker.Item key={index} label={`${index + 1}`} value={`${index + 1}`} />
            ))}
          </Picker>
        </View>

        {/* Parent can set passing grade here */}
        <View style={styles.input}>
          <Text style={styles.field}>Passing Grade</Text>
          <TextInput
            testID="passing-grade-input"
            style={[styles.textbox, styles.full_width]}
            value={fdata.PassingGrade}
            onChangeText={(newText) => setFdata({ ...fdata, PassingGrade: newText })}
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
                navigation.navigate('ParentAccount', {
                  updatedChildren: updatedChildrenData, // Pass the updated children as a parameter
                });
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

// PropTypes
AddChildScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  setToken: PropTypes.func.isRequired,
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
    },
    close: {
      color: 'white',
    },
    field: {
      color: '#ADADAD',
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
      width: '100%',
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
        width: '100%',
        height: 300,
        resizeMode: 'stretch',
        flex: 1,
      },
    },
  }
);

export default AddChildScreen;
