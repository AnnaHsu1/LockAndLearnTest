import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, TextInput, View, navigation, Image, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { CreateResponsiveStyle, DEVICE_SIZES, minSize, useDeviceSize } from 'rn-responsive-styles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Button, Icon } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import PropTypes from 'prop-types';

const EditChildProfileScreen = ({ route, navigation }) => {
  const styles = useStyles();
  const deviceSize = useDeviceSize();
  const [text, setText] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [updatedChildrenData, setUpdatedChildrenData] = useState([]);
  const childInfo = route.params.child;
  const [fdata, setFdata] = useState({
    FirstName: childInfo.firstName,
    LastName: childInfo.lastName,
    Grade: childInfo.grade,
    PassingGrade: childInfo.passingGrade,
    ParentId: childInfo.parentId,
  });
  const [errors, setErrors] = useState('');

  // Toggle modal
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  // API request to update child
  const editChild = async () => {
    // const response = await fetch('http://localhost:4000/child/updatechild/' + childInfo._id, {
    const response = await fetch(
      'https://data.mongodb-api.com/app/lock-and-learn-xqnet/endpoint/updateChild',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          childId: childInfo._id,
          FirstName: fdata.FirstName,
          LastName: fdata.LastName,
          Grade: fdata.Grade,
          PassingGrade: fdata.PassingGrade,
        }),
      }
    );
    const data = await response.json();

    if (response.status === 200) {
      toggleModal();
      setUpdatedChildrenData([...updatedChildrenData, data]);
    } else {
      setErrors(data.msg);
    }
  };

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <Text style={styles.title}>Edit child</Text>
        {errors ? <Text style={styles.box}>{errors}</Text> : null}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {/* Edit first name */}
          <View style={styles.half_width}>
            <Text style={styles.field}>First Name</Text>
            <TextInput
              testID="first-name-input"
              style={[styles.textbox, styles.half_width]}
              value={fdata.FirstName}
              onChangeText={(newText) => setFdata({ ...fdata, FirstName: newText })}
            />
          </View>

          {/* Edit last name */}
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

        {/* Edit grade */}
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
        {/*</View>*/}
        {/* Parent can edit passing grade here */}
        <View style={styles.input}>
          <Text style={styles.field}>Passing Grade</Text>
          <TextInput
            testID="passing-grade-input"
            style={[styles.textbox, styles.full_width]}
            value={fdata.PassingGrade}
            onChangeText={(newText) => setFdata({ ...fdata, PassingGrade: newText })}
          />
        </View>

        {/* On click the child will be updated in the DB */}
        <Button
          testID="edit-child-button"
          mode="contained"
          onPress={() => {
            editChild();
          }}
          style={[styles.button, styles.full_width]}
        >
          <Text style={styles.child}>Done</Text>
        </Button>

        {/* Simple modal to acknowledge the change */}
        <Modal
          testID="modal-success"
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
              justifyContent: 'space-between',
              minHeight: hp('20%'),
            }}
          >
            <Text style={styles.title} testID="modal-success-message">
              {fdata.FirstName} {fdata.LastName} has been changed successfully!
            </Text>

            {/* Parent will acknowledge and navigate to parent account screen */}
            <TouchableOpacity
              style={[
                {
                  borderColor: '#4F85FF',
                  borderWidth: 1,
                  borderRadius: 10,
                  padding: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 40,
                },
              ]}
              title="Hide modal"
              testID="close-modal-button"
              onPress={() => {
                toggleModal();
                navigation.navigate('ParentAccount', {
                  updatedChildren: updatedChildrenData,
                });
              }}
            >
              <Text style={styles.close}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
      <Image style={styles.bottomCloud} source={require('../../../assets/bottomClouds.png')} />
    </View>
  );
};

EditChildProfileScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      child: PropTypes.shape({
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        grade: PropTypes.string.isRequired,
        passingGrade: PropTypes.string,
        parentId: PropTypes.string,
        _id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
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
      color: '#4F85FF',
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
        width: '100%',
        height: 300,
        resizeMode: 'stretch',
        flex: 1,
      },
    },
  }
);

export default EditChildProfileScreen;
