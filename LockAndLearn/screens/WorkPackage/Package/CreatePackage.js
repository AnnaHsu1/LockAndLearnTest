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
import { getItem } from '../../../components/AsyncStorage';
import PropTypes from 'prop-types';

const CreatePackage = ({ route }) => {
  const navigation = useNavigation();
  const params = route.params;
  const { _id, name, grade } = params?.workPackage;
  const [packageSubcategories, setPackageSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState('Choose a Subcategory');
  const [packageDescription, setPackageDescription] = useState('');
  const [modalFilterVisible, setModalFilterVisible] = useState(false);
  const [packageId, setPackageId] = useState('');
  const [packageData, setPackage] = useState({});

  // When the screen is loaded, display the respective subcategories based on the selected grade and subject
  useEffect(() => {
    handleGradeAndSubjectChange();
  }, []);

  // Function to diplay the subcategories or not, based on the selected grade and subject
  const handleGradeAndSubjectChange = async () => {
    try {
      // Fetch subcategories from the server
      const response = await fetch(
        `http://localhost:4000/subcategories/fetchSubcategories/${name}/${grade}`
      );
      console.log(name, grade);
      if (response.status === 200) {
        const subcategoriesData = await response.json();
        setPackageSubcategories(['Choose a Subcategory', ...subcategoriesData]);
        setSelectedSubcategory('Choose a Subcategory');
      } else {
        console.error('Error fetching subcategories');
        console.log(response);
      }
    } catch (error) {
      console.error('Network error while fetching subcategories');
    }
  };

  // Disable the create button if the user has not selected a subject and a grade
  const isCreateButtonDisabled =
    selectedSubcategory === 'Choose a Subcategory' || packageDescription === '';

  // Function to create a work package
  const handleCreatePackage = async (buttonPressed) => {
    if (isCreateButtonDisabled) {
      // Do nothing if the button is disabled
      return;
    }

    try {
      const token = await getItem('@token');
      const user = JSON.parse(token);
      const userId = user._id;
      if (userId) {
        const response = await fetch('http://localhost:4000/packages/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            workPackageID: _id,
            subcategory: selectedSubcategory,
            instructorID: userId,
            description: packageDescription,
          }),
        });
        if (response.status === 200 || 201) {
          const data = await response.json();
          if (buttonPressed === 'addMaterial') {
            navigation.navigate('SelectStudyMaterialToAdd', {
              package: {
                p_id: data._id,
                p_quizzes: [],
                p_materials: [],
                subcategory: selectedSubcategory,
                description: packageDescription,
              },
              workPackage: {
                name: name,
                grade: grade,
                wp_id: _id,
              },
            });
            toggleModalFilter();
          } else if (buttonPressed === 'addQuiz') {
            navigation.navigate('SelectQuizToAdd', {
              package: {
                p_id: data._id,
                p_quizzes: [],
                p_materials: [],
                subcategory: selectedSubcategory,
                description: packageDescription,
              },
              workPackage: {
                name: name,
                grade: grade,
                wp_id: _id,
              },
            });
            toggleModalFilter();
          } else if (buttonPressed === 'addPackage') {
            navigation.navigate('PackageOverview', { workPackage: { name, grade, _id } });
          }
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

  // Function to toggle the pop up modal for filter section
  const toggleModalFilter = () => {
    setModalFilterVisible(!modalFilterVisible);
  };

  return (
    <ImageBackground
      source={require('../../../assets/backgroundCloudyBlobsFull.png')}
      resizeMode="cover"
      style={styles.container}
    >
      <View style={styles.containerFile}>
        <Text style={styles.selectFiles}>Create New Package</Text>
        <ScrollView style={{ width: '100%' }}>
          {/* Display picker for subject */}
          <View style={styles.containerInput}>
            <View style={styles.containerPicker}>
              <Text style={{ color: '#ADADAD' }}>Subject</Text>
              <Picker
                enabled={false}
                testID="subject-picker"
                selectedValue={name}
                style={styles.workPackageTypePicker}
              >
                <Picker.Item label={name} value={name} />
              </Picker>
            </View>
            {/* Display picker for grade */}
            <View style={styles.containerPicker}>
              <Text style={{ color: '#ADADAD' }}>School Grade</Text>
              <Picker
                enabled={false}
                testID="grade-picker"
                selectedValue={grade}
                style={styles.workPackageTypePicker}
              >
                <Picker.Item label={grade} value={grade} />
              </Picker>
            </View>
            {/* Display picker for subcategory */}
            <View style={styles.containerPicker}>
              <Text style={{ color: '#000000' }}>Subcategory</Text>
              <Picker
                testID="subcategory-picker"
                selectedValue={selectedSubcategory}
                onValueChange={(itemValue) => setSelectedSubcategory(itemValue)}
                style={styles.workPackageTypePicker}
              >
                {packageSubcategories.map((subcategory, index) => (
                  <Picker.Item key={index} label={subcategory} value={subcategory} />
                ))}
              </Picker>
            </View>
            {/* Display description */}
            <View style={[styles.containerPicker, { marginTop: 10 }]}>
              <Text style={{ color: '#000000' }}>Description</Text>
              <TextInput
                multiline={true}
                // numberOfLines={4}
                value={packageDescription}
                onChangeText={setPackageDescription}
                style={styles.workPackageInputText}
              // placeholder="Enter your description"
              />
            </View>
          </View>
          <View style={styles.buttonsRow}>
            {/* Display button to add material */}
            <TouchableOpacity
              style={[
                styles.createQuestionButton,
                { marginRight: 10 },
                isCreateButtonDisabled && styles.disabledButton,
              ]}
              onPress={() => {
                toggleModalFilter();
              }}
              disabled={isCreateButtonDisabled}
            >
              <Text style={styles.createWorkPackageButtonText}>Add material</Text>
            </TouchableOpacity>
            {/* Display button to create package */}
            <TouchableOpacity
              style={[styles.createQuestionButton, isCreateButtonDisabled && styles.disabledButton]}
              onPress={() => handleCreatePackage('addPackage')}
              disabled={isCreateButtonDisabled}
            >
              <Text style={styles.createWorkPackageButtonText}>Add Package</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      {/* Display modal to add files/quizzes */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalFilterVisible}
        onRequestClose={toggleModalFilter}
      >
        <View style={styles.containerModal}>
          <View
            style={[
              styles.containerMaterial,
              { flexDirection: 'column', justifyContent: 'space-around' },
            ]}
          >
            <View style={styles.titleModal}>
              <View>
                <Text style={styles.titleModalText}>
                  {name} - {grade}
                </Text>
                <Text style={styles.titleModalText}>{selectedSubcategory}</Text>
              </View>
            </View>
            <View style={styles.containerButtonsModal}>
              <TouchableOpacity
                style={styles.buttonAddStudyMaterial}
                onPress={() => {
                  handleCreatePackage('addMaterial');
                }}
              >
                <Text style={styles.buttonAddMaterialText}>Add Study Material</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonAddQuizMaterial}
                onPress={() => {
                  handleCreatePackage('addQuiz');
                }}
              >
                <Text style={styles.buttonAddMaterialText}>Add Quiz Material</Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                style={styles.buttonCancelMaterial}
                onPress={() => {
                  toggleModalFilter();
                }}
              >
                <Text style={styles.buttonAddMaterialText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

CreatePackage.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      workPackage: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        grade: PropTypes.string.isRequired,
      }),
    }),
  }).isRequired,
};

const styles = StyleSheet.create({
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
    padding: '1%',
  },
  selectFiles: {
    color: '#696969',
    fontSize: 36,
    fontWeight: '500',
    marginTop: '1%',
    textAlign: 'center',
  },
  containerInput: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  containerPicker: {
    width: '80%',
    alignSelf: 'center',
    marginTop: 10,
  },
  workPackageTypePicker: {
    height: 45,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    width: '100%',
  },
  workPackageInputText: {
    height: 200,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    width: '100%',
  },
  createQuestionButton: {
    backgroundColor: '#407BFF',
    width: 120,
    height: 35,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  createWorkPackageButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  containerModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  containerMaterial: {
    width: 230,
    height: 250,
    backgroundColor: '#4F85FF',
    borderRadius: 10,
    alignItems: 'center',
  },
  titleModal: {
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  titleModalText: {
    fontSize: 14,
    color: '#696969',
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  containerButtonsModal: {
    paddingHorizontal: '4%',
    alignItems: 'center',
  },
  buttonAddStudyMaterial: {
    backgroundColor: '#FFFFFF',
    width: 150,
    height: 35,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    marginBottom: 15,
  },
  buttonAddQuizMaterial: {
    backgroundColor: '#FFFFFF',
    width: 150,
    height: 35,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  buttonCancelMaterial: {
    backgroundColor: '#FFFFFF',
    width: 80,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  buttonAddMaterialText: {
    fontSize: 12,
    color: '#4F85FF',
    alignItems: 'center',
    fontWeight: 500,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});

export default CreatePackage;
