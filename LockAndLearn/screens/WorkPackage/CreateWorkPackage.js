import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  ImageBackground,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { getItem } from '../../components/AsyncStorage';
import {
  workPackageNames,
  workPackageGrades,
  subcategoryData,
} from '../../components/WorkPackageConstants';

const CreateWorkPackage = (route) => {
  const navigation = useNavigation();
  const [workPackageName, setWorkPackageName] = useState('Choose a Subject');
  const [workPackageGrade, setWorkPackageGrade] = useState('Choose a Grade');
  const [workPackageSubcategories, setWorkPackageSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState('Choose a Subcategory');

  // Function to diplay the subcategories or not, based on the selected grade and subject
  const handleGradeAndSubjectChange = (grade, subject) => {
    const selectedSubcategories =
      subcategoryData[grade] && subcategoryData[grade][subject]
        ? subcategoryData[grade][subject]
        : [];
    setWorkPackageSubcategories(['Choose a Subcategory', ...selectedSubcategories]);
    setSelectedSubcategory('Choose a Subcategory');
  };

  // Disable the create button if the user has not selected a subject and a grade
  const isCreateButtonDisabled =
    workPackageName === 'Choose a Subject' || workPackageGrade === 'Choose a Grade';

  // Function to create a work package
  const handleCreateWorkPackage = async () => {
    if (isCreateButtonDisabled) {
      // Do nothing if the button is disabled
      return;
    }
    try {
      const token = await getItem('@token');
      const user = JSON.parse(token);
      const userId = user._id;
      if (userId) {
        const response = await fetch('http://localhost:4000/workPackages/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: workPackageName,
            grade: workPackageGrade,
            subcategory: selectedSubcategory,
            instructorID: userId,
          }),
        });
        if (response.status === 200 || 201) {
          const data = await response.json();
          console.log('Created work package:', data);
          setWorkPackageName('');
          setWorkPackageGrade('');
          // Extract the ID from the response
          const workPackageId = data._id;
          // Navigate to "DisplayWorkPackageContent" and pass the workPackageId
          navigation.navigate('DisplayWorkPackageContent', { workPackageId });
          console.log('workpackage: ' + workPackageId);
        } else {
          console.error('Error creating work package');
          console.log(response);
        }
      } else {
        console.log('Must be logged in to create a work package');
      }
    } catch (error) {
      console.error('Network error');
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/backgroundCloudyBlobsFull.png')}
      resizeMode="cover"
      style={styles.container}
    >
      <View style={styles.containerFile}>
        <Text style={styles.selectFiles}>Create Work Package</Text>
        {/* Display picker for subject */}
        <View style={styles.containerInput}>
          <View style={styles.containerPicker}>
            <Text style={{ color: '#ADADAD' }}>Subject</Text>
            <Picker
              testID="subject-picker"
              selectedValue={workPackageName}
              onValueChange={(itemValue) => {
                setWorkPackageName(itemValue);
                handleGradeAndSubjectChange(workPackageGrade, itemValue); // Call the function with selected grade and subject
              }}
              style={styles.workPackageTypePicker}
            >
              <Picker.Item label="Choose a Subject" value="Choose a Subject" />
              {workPackageNames.map((name, index) => (
                <Picker.Item key={index} label={name} value={name} />
              ))}
            </Picker>
          </View>
          {/* Display picker for grade */}
          <View style={styles.containerPicker}>
            <Text style={{ color: '#ADADAD' }}>School Grade</Text>
            <Picker
              testID="grade-picker"
              selectedValue={workPackageGrade}
              onValueChange={(itemValue) => {
                setWorkPackageGrade(itemValue);
                handleGradeAndSubjectChange(itemValue, workPackageName); // Call the function with selected grade and subject
              }}
              style={styles.workPackageTypePicker}
            >
              <Picker.Item label="Choose a Grade" value="Choose a Grade" />
              {workPackageGrades.map((type, index) => (
                <Picker.Item key={index} label={type} value={type} />
              ))}
            </Picker>
          </View>
          {/* Display picker for subcategory */}
          <View style={styles.containerPicker}>
            <Text style={{ color: '#ADADAD' }}>Subcategory</Text>
            <Picker
              testID="subcategory-picker"
              selectedValue={selectedSubcategory}
              onValueChange={(itemValue) => setSelectedSubcategory(itemValue)}
              style={styles.workPackageTypePicker}
            >
              {workPackageSubcategories.map((subcategory, index) => (
                <Picker.Item key={index} label={subcategory} value={subcategory} />
              ))}
            </Picker>
          </View>
        </View>
        {/* Display button to create work package */}
        <TouchableOpacity
          testID="createWorkPackageButton"
          style={[styles.createQuestionButton, isCreateButtonDisabled && styles.disabledButton]}
          onPress={handleCreateWorkPackage}
          disabled={isCreateButtonDisabled}
        >
          <Text style={styles.createWorkPackageButtonText}>Create Work Package</Text>
        </TouchableOpacity>
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
  },
  containerFile: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    width: '100%',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: '5%',
  },
  selectFiles: {
    color: '#696969',
    fontSize: 36,
    fontWeight: '500',
    marginTop: '2%',
    textAlign: 'center',
  },
  containerInput: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  containerName: {
    flexDirection: 'column',
    alignItems: 'baseline',
    width: '100%',
    marginLeft: '20%',
    marginTop: '2%',
  },
  containerPicker: {
    flexDirection: 'column',
    alignItems: 'baseline',
    width: '100%',
    marginLeft: '20%',
    marginTop: 20,
  },
  workPackageTypePicker: {
    width: '80%',
    height: 45,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  workPackageInput: {
    width: '80%',
    height: 45,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  createQuestionButton: {
    backgroundColor: '#407BFF',
    width: 250,
    height: 35,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    marginBottom: 20,
  },
  createWorkPackageButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default CreateWorkPackage;
