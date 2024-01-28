import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ImageBackground } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { workPackageNames, workPackageGrades } from '../../components/WorkPackageConstants';

const EditWorkPackage = ({ route }) => {
  const navigation = useNavigation();
  const workpackage = route.params?.workpackage;
  const [workPackageName, setWorkPackageName] = useState(workpackage?.name);
  const [workPackageGrade, setWorkPackageGrade] = useState(workpackage?.grade);
  const [workPackageDescription, setWorkPackageDescription] = useState(workpackage?.description);
  const [workPackagePrice, setWorkPackagePrice] = useState(workpackage?.price);
  const [isValidPrice, setIsValidPrice] = useState(true);
  const [subjects, setSubjects] = useState([]);

  // Disable the create button if the user has not selected a subject and a grade
  const isCreateButtonDisabled =
    workPackageName === 'Choose a Subject' ||
    workPackageGrade === 'Choose a Grade' ||
    workPackageDescription === '' ||
    workPackagePrice === '' ||
    !isValidPrice;

  // Extracted common function for fetching subjects
  const fetchSubjects = async (setSubjects) => {
    try {
      const response = await fetch('http://localhost:4000/subcategories/allSubjects');
      if (response.status === 200 || 201) {
        const data = await response.json();
        if (Array.isArray(data)) {
          const subjectNames = data.map((subject) => subject.name);
          setSubjects([...subjectNames]);
        } else {
          console.error('Invalid data format for subjects');
        }
      } else {
        console.error('Error fetching subjects:', response.status);
      }
    } catch (error) {
      console.error('Network error while fetching subjects:', error);
    }
  };

  // Function to create a work package
  const handleEditWorkPackage = async () => {
    if (isCreateButtonDisabled) {
      // Do nothing if the button is disabled
      return;
    }
    try {
      const response = await fetch(
        'http://localhost:4000/workPackages/updateWorkPackage/' + workpackage._id,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: workPackageName,
            grade: workPackageGrade,
            description: workPackageDescription,
            price: workPackagePrice,
          }),
        }
      );
      if (response.status === 200) {
        const data = await response.json();
        // console.log('Edited work package:', data);
        setWorkPackageName('');
        setWorkPackageGrade('');
        navigation.navigate('WorkPackage', { edited: workpackage });
      } else {
        console.error('Error creating work package');
        console.log(response);
      }
    } catch (error) {
      console.error('Network error');
    }
  };

  const handlePriceChange = (input) => {
    const priceValidation = /^[0-9]*(\.[0-9]{0,2})?$/.test(input);
    setIsValidPrice(priceValidation);
    setWorkPackagePrice(input);
  };

  useEffect(() => {
    fetchSubjects(setSubjects);
  }, []);

  return (
    <ImageBackground
      source={require('../../assets/backgroundCloudyBlobsFull.png')}
      resizeMode="cover"
      style={styles.container}
    >
      <View style={styles.containerFile}>
        <Text style={styles.header}>Edit work package</Text>
        <View style={styles.containerInput}>
          <View style={styles.containerPicker}>
            <Text style={{ color: '#ADADAD', fontSize: 20 }}>Subject</Text>
            <Picker
              testID="subject-picker"
              selectedValue={workPackageName}
              onValueChange={(itemValue) => {
                setWorkPackageName(itemValue);
              }}
              style={styles.workPackageTypePicker}
            >
              <Picker.Item label="Choose a Subject" value="Choose a Subject" />
              {subjects.map((name, index) => (
                <Picker.Item key={index} label={name} value={name} />
              ))}
            </Picker>
          </View>
          <View style={[styles.containerPicker, { marginTop: 10 }]}>
            <Text style={{ color: '#ADADAD', fontSize: 20 }}>School Grade</Text>
            <Picker
              testID="grade-picker"
              selectedValue={workPackageGrade}
              onValueChange={(itemValue) => {
                setWorkPackageGrade(itemValue);
              }}
              style={styles.workPackageTypePicker}
            >
              <Picker.Item label="Choose a Grade" value="Choose a Grade" />
              {[...Array(12)].map((_, index) => (
                <Picker.Item key={index} label={`${index + 1}`} value={`${index + 1}`} />
              ))}
            </Picker>
          </View>
          <View style={[styles.containerPicker, { marginTop: 10 }]}>
            <Text style={{ color: '#ADADAD', fontSize: 20 }}>Description</Text>
            <TextInput
              multiline={true}
              value={workPackageDescription}
              onChangeText={setWorkPackageDescription}
              style={styles.workPackageInputText}
            />
          </View>
          <View style={[styles.containerPicker, { marginTop: 10 }]}>
            <Text style={{ color: '#ADADAD', fontSize: 20 }}>Price $</Text>
            <TextInput
              style={styles.workPackageInputTextPrice}
              value={workPackagePrice}
              onChangeText={handlePriceChange}
            />
            {!isValidPrice && (
              <Text style={styles.invalidPriceMessage}>
                Please enter an accurate price in this format: 12.34
              </Text>
            )}
          </View>
        </View>
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            testID="createWorkPackageButton"
            style={[styles.createQuestionButton, isCreateButtonDisabled && styles.disabledButton]}
            onPress={() => handleEditWorkPackage()}
            disabled={isCreateButtonDisabled}
          >
            <Text style={styles.editworkpackage}>Update work package</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  disabledButton: {
    backgroundColor: '#ccc',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'red',
  },
  containerFile: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    width: '100%',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: '5%',
    padding: '1%',
  },
  header: {
    color: '#696969',
    fontSize: 24,
    fontWeight: '450',
    paddingVertical: '3%',
    textAlign: 'center',
  },
  containerInput: {
    width: '100%',
    flexDirection: 'column',
    alignContent: 'center',
    marginTop: '1%',
  },
  containerPicker: {
    width: '80%',
    alignSelf: 'center',
  },
  workPackageTypePicker: {
    height: 40,
    borderColor: '#407BFF',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
  workPackageInputText: {
    height: 70,
    borderColor: '#407BFF',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    height: 200,
  },
  workPackageInputTextPrice: {
    height: 35,
    borderColor: '#407BFF',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 18,
    marginTop: 5,
  },
  invalidPriceMessage: {
    marginTop: 5,
    color: 'red',
    fontStyle: 'italic',
    fontWeight: 'bold',
    fontSize: 10,
    backgroundColor: '#ffe6e6',
    padding: 5,
  },
  createQuestionButton: {
    backgroundColor: '#407BFF',
    width: 190,
    height: 35,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    // marginTop: '10%',
    // marginBottom: '2%',
    marginTop: 10,
  },
  editworkpackage: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },
});

export default EditWorkPackage;
