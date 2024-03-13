import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  ImageBackground,
  ScrollView,
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
  const [workPackageDescription, setWorkPackageDescription] = useState('');
  const [workPackagePrice, setWorkPackagePrice] = useState('');
  const [isValidPrice, setIsValidPrice] = useState(true);
  const [subjects, setSubjects] = useState([]);

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
    workPackageName === 'Choose a Subject' ||
    workPackageGrade === 'Choose a Grade' ||
    workPackageDescription === '' ||
    workPackagePrice === '' ||
    !isValidPrice;

  const handleBackButton = () => {
    navigation.navigate('WorkPackage');
  };

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
        // const response = await fetch('https://lockandlearn.onrender.com/workPackages/create', {
        const response = await fetch('https://lockandlearn.onrender.com/workPackages/createWorkPackage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: workPackageName,
            grade: workPackageGrade,
            // subcategory: selectedSubcategory,
            instructorID: userId,
            description: workPackageDescription,
            price: workPackagePrice,
            packageCount: 0,
          }),
        });
        if (response.status === 200 || 201) {
          const data = await response.json();
          setWorkPackageName('');
          setWorkPackageGrade('');
          // Extract the ID from the response
          const workPackageId = data._id;
          navigation.navigate('WorkPackage', { refresh: workPackageId });
        } else {
          console.error('Error creating work package');
        }
      } else {
        console.log('Must be logged in to create a work package');
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

  const fetchSubjects = async () => {
    try {
      const response = await fetch('https://lockandlearn.onrender.com/subcategories/allSubjects');
      if (response.status === 200 || 201) {
        const data = await response.json();
        if (Array.isArray(data)) {
          // Check if data is an array
          const subjectNames = data.map((subject) => subject.name);
          setSubjects([ ...subjectNames]);
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

  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
    <ImageBackground
      source={require('../../assets/backgroundCloudyBlobsFull.png')}
      resizeMode="cover"
      style={styles.container}
    >
      <View style={styles.containerFile}>
        <Text style={styles.selectFiles}>Create New Work Package</Text>
        <ScrollView style={{ width: '100%' }}>
          {/* Display picker for subject */}
          <View style={styles.containerInput}>
            <View style={styles.containerPicker}>
              <Text style={{ color: '#ADADAD' }}>Subject</Text>
              <Picker
                testID="subject-picker"
                selectedValue={workPackageName}
                onValueChange={(itemValue) => {
                  setWorkPackageName(itemValue);
                  handleGradeAndSubjectChange(workPackageGrade, itemValue);
                }}
                style={styles.workPackageTypePicker}
              >
                <Picker.Item label="Choose a Subject" value="Choose a Subject" />
                {subjects.map((name, index) => (
                  <Picker.Item key={index} label={name} value={name} />
                ))}
              </Picker>
            </View>
            {/* Display picker for grade */}
            <View style={[styles.containerPicker, { marginTop: 10 }]}>
              <Text style={{ color: '#ADADAD' }}>School Grade</Text>
              <Picker
                testID="grade-picker"
                selectedValue={workPackageGrade}
                onValueChange={(itemValue) => {
                  setWorkPackageGrade(itemValue);
                  handleGradeAndSubjectChange(itemValue, workPackageName);
                }}
                style={styles.workPackageTypePicker}
              >
                <Picker.Item label="Choose a Grade" value="Choose a Grade" />
                {[...Array(12)].map((_, index) => (
                  <Picker.Item key={index} label={`${index + 1}`} value={`${index + 1}`} />
                ))}
              </Picker>
            </View>
            {/* Display description */}
            <View style={[styles.containerPicker, { marginTop: 10 }]}>
              <Text style={{ color: '#ADADAD' }}>Description</Text>
              <TextInput
                testID="description-input"
                multiline={true}
                // numberOfLines={4}
                value={workPackageDescription}
                onChangeText={setWorkPackageDescription}
                style={styles.workPackageInputText}
                // placeholder="Enter your description"
              />
            </View>
            <View style={[styles.containerPicker, { marginTop: 10 }]}>
              <Text style={{ color: '#ADADAD' }}>Price $</Text>
              <TextInput
                testID="price-input"
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
          {/* Display button to create work package */}
          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity
              testID="createWorkPackageButton"
              style={[styles.createQuestionButton, isCreateButtonDisabled && styles.disabledButton]}
              onPress={handleCreateWorkPackage}
              disabled={isCreateButtonDisabled}
            >
              <Text style={styles.createWorkPackageButtonText}>Create work package</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '35%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#bbb',
    width: 80,
    height: 35,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
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
  selectFiles: {
    color: '#696969',
    fontSize: 35,
    fontWeight: '500',
    marginTop: '1%',
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
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
  workPackageInputText: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    height: 200,
  },
  workPackageInputTextPrice: {
    height: 35,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
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
    marginTop: 20,
    marginBottom: 20,
  },
  createWorkPackageButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default CreateWorkPackage;
