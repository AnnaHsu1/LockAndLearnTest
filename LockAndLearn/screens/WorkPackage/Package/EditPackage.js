import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
  TextInput,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { subcategoryData } from '../../../components/WorkPackageConstants';

const EditPackage = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [modalFilterVisible, setModalFilterVisible] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [files, setFiles] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  let counterIndex = 0;
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
  const [fileDeleteId, setFileDeleteId] = useState('');
  const [fileDeleteName, setFileDeleteName] = useState('');
  const [quizDeleteId, setQuizDeleteId] = useState('');
  const [quizDeleteName, setQuizDeleteName] = useState('');
  const { width } = Dimensions.get('window');
  const maxTextWidth = width * 0.4;
  const params = route.params;
  const { wp_id, name, grade } = params?.workPackage;
  const { p_id, p_quizzes, p_materials, subcategory, description } = params?.package;
  const [selectedSubcategory, setSelectedSubcategory] = useState(subcategory);
  const [packageDescription, setPackageDescription] = useState(description);
  const [packageSubcategories, setPackageSubcategories] = useState([]);

  useEffect(() => {
    getQuizzes();
    getFiles();
  }, [p_quizzes, p_materials]);

  // When the screen is loaded, display the respective subcategories based on the selected grade and subject
  useEffect(() => {
    handleGradeAndSubjectChange();
  }, []);

  // Function to diplay the subcategories or not, based on the selected grade and subject
  const handleGradeAndSubjectChange = () => {
    const selectedSubcategories =
      subcategoryData[grade] && subcategoryData[grade][name] ? subcategoryData[grade][name] : [];
    setPackageSubcategories(['Choose a Subcategory', ...selectedSubcategories]);
    setSelectedSubcategory(subcategory);
  };

  // Function to fetch and display the quiz name
  async function fetchQuizName(quizId) {
    try {
      const response = await fetch(`http://localhost:4000/quizzes/quiz/${quizId}`);
      if (response.status === 200 || 201) {
        const data = await response.json();
        return data.name;
      } else {
        console.error('Error fetching quiz name');
      }
    } catch (error) {
      console.error('Network error');
    }
  }

  // Function to fetch and display the file name
  async function fetchFileName(fileId) {
    if (fileId === '') {
      return;
    }
    try {
      const response = await fetch(`http://localhost:4000/files/filesName/${fileId}`, {
        method: 'GET',
      });
      if (response.status === 201) {
        const data = await response.json();
        if (data.message === 'File not found') {
          console.log("File isn't stored in database anymore", data);
        } else {
          const file = {
            id: counterIndex++,
            name: data.fileName,
            originalId: fileId,
            description: data.fileDescription,
          };
          return file;
        }
      } else {
        console.error('Error fetching file name');
      }
    } catch (error) {
      console.error('Network error');
    }
  }

  // Function to fetch the names of each quiz in the "quizzes" array
  const getQuizzes = async () => {
    if (p_id && p_quizzes && p_quizzes.length > 0) {
      const quizIds = p_quizzes;

      Promise.all(quizIds.map((quizId) => fetchQuizName(quizId)))
        .then((quizNames) => {
          const filteredQuizNames = quizNames.filter(
            (quizName) => typeof quizName === 'string' && quizName.trim() !== ''
          );
          setQuizzes(filteredQuizNames);
        })
        .catch((error) => {
          console.error('Error fetching quiz names', error);
        });
    }
  };

  // Function to fetch the names of each file in the "files" array
  const getFiles = async () => {
    if (p_id && p_materials && p_materials.length > 0) {
      const fileIds = p_materials;
      // Fetch the names of each file in the "files" array
      Promise.all(fileIds.map((fileId) => fetchFileName(fileId)))
        .then((fileNames) => {
          const filteredFileNames = fileNames.filter((fileName) => fileName !== undefined);
          setFiles(filteredFileNames);
        })
        .catch((error) => {
          console.error('Error fetching file names', error);
        });
    }
  };

  // Function to delete a file in work package
  const handleDeleteFile = async (id, contentType) => {
    try {
      const response = await fetch(
        `http://localhost:4000/packages/deleteContent/${contentType}/${p_id}/${id}`,
        {
          method: 'DELETE',
        }
      );
      if (response.ok) {
        setFiles(files.filter((file) => file.originalId !== id));
      } else {
        console.error('Failed to delete file');
      }
    } catch (error) {
      console.error('Network error');
    }
  };

  // Function to delete a quiz in work package
  const handleDeleteQuiz = async (id, contentType) => {
    try {
      const updatedQuizzes = [...quizzes];
      const deletedQuizName = updatedQuizzes.splice(id, 1)[0];
      setQuizzes(updatedQuizzes);

      const response = await fetch(
        `http://localhost:4000/packages/deleteContent/${contentType}/${p_id}/${p_quizzes[id]}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        setQuizzes([...updatedQuizzes, deletedQuizName]);
        console.error('Failed to delete quiz');
      }
    } catch (error) {
      console.error('Network error', error);
    }
  };

  // Function to toggle the pop up modal for filter section
  const toggleModalFilter = () => {
    setModalFilterVisible(!modalFilterVisible);
  };

  // Function to toggle the pop up modal for delete section
  const toggleModalDelete = () => {
    setModalDeleteVisible(!modalDeleteVisible);
  };

  const saveChanges = async () => {
    try {
      const response = await fetch(`http://localhost:4000/packages/update/${p_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: packageDescription,
          subcategory: selectedSubcategory,
        }),
      });
      if (response.status == 200) {
        navigation.navigate('PackageOverview', {
          workPackage: {
            _id: wp_id,
            name: name,
            grade: grade,
          },
        });
      } else {
        console.error('Failed to add quizzes to the work package:', response.status);
      }
    } catch (error) {
      console.error('Error editing work package', error);
    }
  };

  // Function to download file
  const downloadFile = async (fileName) => {
    const response = await fetch(`http://localhost:4000/files/uploadFiles/${fileName}`, {
      method: 'GET',
    });
    if (response.ok) {
      const test = await response.blob();
      const url = URL.createObjectURL(test);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}`;
      a.click();
    }
  };

  // Disable the button if the user has not selected a subcategory and entered a description
  const isButtonDisabled =
    selectedSubcategory === 'Choose a Subcategory' || packageDescription === '';

  return (
    <ImageBackground
      source={require('../../../assets/backgroundCloudyBlobsFull.png')}
      resizeMode="cover"
      style={styles.container}
    >
      <View style={styles.containerFile}>
        {/* Display work package name */}
        <View
          style={{
            width: '100%',
          }}
        >
          <Text style={styles.selectFiles}>Package</Text>
        </View>
        <ScrollView style={styles.scrollContainer}>
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
          {/* Display all files and quizzes from the work package */}
          <View style={styles.containerInput}>
            <View style={styles.containerPicker}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  alignContent: 'center',
                  textAlign: 'center',
                  alignSelf: 'center',
                  width: '100%',
                }}
              >
                <Text>Study Material</Text>
                <TouchableOpacity
                  style={{ alignItems: 'center' }}
                  onPress={() =>
                    navigation.navigate('SelectStudyMaterialToAdd', {
                      package: {
                        p_id: p_id,
                        p_quizzes: p_quizzes,
                        p_materials: p_materials,
                        subcategory: selectedSubcategory,
                        description: packageDescription,
                      },
                      workPackage: {
                        name: name,
                        grade: grade,
                        wp_id: wp_id,
                      },
                    })
                  }
                >
                  <Text style={{ color: '#407BFF', fontSize: 25, fontWeight: 100 }}>+</Text>
                </TouchableOpacity>
              </View>
              {files.length === 0 ? (
                <Text style={styles.noFilesText}>No files added</Text>
              ) : (
                files.map((file) => (
                  <View
                    style={[
                      styles.row,
                      file.id === files.length
                        ? { borderBottomWidth: 1, paddingBottom: 5, borderBottomColor: '#FAFAFA' }
                        : null,
                      files.length === 0 ? { paddingTop: 5 } : null,
                    ]}
                    key={file.id}
                  >
                    <TouchableOpacity onPress={() => downloadFile(file.name)}>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="middle"
                        style={{ maxWidth: maxTextWidth, marginTop: 5 }}
                      >
                        {file.name}
                      </Text>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="middle"
                        style={{ maxWidth: maxTextWidth, color: '#696969', marginBottom: 5 }}
                      >
                        {file.description}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.buttonDelete}
                      onPress={() => {
                        setFileDeleteId(file.originalId);
                        setFileDeleteName(file.name);
                        toggleModalDelete();
                      }}
                      testID="toggle-delete-modal-button"
                    >
                      <View style={styles.deleteButtonBackground}>
                        <Icon source="delete-outline" size={20} color={'#F24E1E'} />
                      </View>
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>
            <View style={styles.containerPicker}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  alignContent: 'center',
                  textAlign: 'center',
                  alignSelf: 'center',
                  width: '100%',
                  borderTopWidth: 1,
                  borderTopColor: '#696969',
                  paddingTop: 10,
                }}
              >
                <Text>Quizzes</Text>
                <TouchableOpacity
                  style={{ alignItems: 'center' }}
                  onPress={() =>
                    navigation.navigate('SelectQuizToAdd', {
                      package: {
                        p_id: p_id,
                        p_quizzes: p_quizzes,
                        p_materials: p_materials,
                        subcategory: selectedSubcategory,
                        description: packageDescription,
                      },
                      workPackage: {
                        name: name,
                        grade: grade,
                        wp_id: wp_id,
                      },
                    })
                  }
                >
                  <Text style={{ color: '#407BFF', fontSize: 25, fontWeight: 100 }}>+</Text>
                </TouchableOpacity>
              </View>
              {quizzes.length === 0 ? (
                <Text style={styles.noQuizzesText}>No quizzes added</Text>
              ) : (
                quizzes.map((quizName, index) => (
                  <View
                    style={[
                      styles.row,
                      index === quizzes.length - 1
                        ? { borderBottomWidth: 1, paddingBottom: 5, borderBottomColor: '#FAFAFA' }
                        : null,
                      files.length === 0 ? { paddingTop: 5 } : null,
                    ]}
                    key={index}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        // Navigate to QuestionsOverviewScreen and pass the quiz _id
                        navigation.navigate('QuestionsOverviewScreen', {
                          quizId: p_quizzes[index],
                        });
                      }}
                    >
                      <Text>{quizName}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.buttonDelete}
                      onPress={() => {
                        setQuizDeleteId(index);
                        setQuizDeleteName(quizName);
                        toggleModalDelete();
                      }}
                      testID="toggle-delete-modal-button"
                    >
                      <View style={styles.deleteButtonBackground}>
                        <Icon source="delete-outline" size={20} color={'#F24E1E'} />
                      </View>
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>
          </View>
          {/* Display button to show modal to add files/quizzes */}
          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity
              // todo: save new updates in db for this package (subcategory, description, files, quizzes)
              onPress={() => {
                saveChanges();
              }}
              // todo: add padding to button Save
              style={[styles.buttonAddMaterial, isButtonDisabled && styles.disabledButton]}
              testID="addMaterialModal"
              disabled={isButtonDisabled}
            >
              <Text style={[styles.buttonText, isButtonDisabled && styles.disabledButtonText]}>
                Save
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={toggleModalFilter}
              style={[styles.buttonAddMaterial, isButtonDisabled && styles.disabledButton]}
              testID="addMaterialModal"
              disabled={isButtonDisabled}
            >
              <Text style={[styles.buttonText, isButtonDisabled && styles.disabledButtonText]}>
                Add Material
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
                {wp_id && (
                  <View>
                    <Text style={styles.titleModalText}>
                      {name} - {grade}
                    </Text>
                    {selectedSubcategory !== 'Choose a Subcategory' && (
                      <Text style={styles.titleModalText}>{selectedSubcategory}</Text>
                    )}
                  </View>
                )}
              </View>
              <View style={styles.containerButtonsModal}>
                <TouchableOpacity
                  style={styles.buttonAddStudyMaterial}
                  onPress={() => {
                    toggleModalFilter();
                    navigation.navigate('SelectStudyMaterialToAdd', {
                      package: {
                        p_id: p_id,
                        p_quizzes: p_quizzes,
                        p_materials: p_materials,
                        subcategory: selectedSubcategory,
                        description: packageDescription,
                      },
                      workPackage: {
                        name: name,
                        grade: grade,
                        wp_id: wp_id,
                      },
                    });
                  }}
                >
                  <Text style={styles.buttonAddMaterialText}>Add Study Material</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonAddQuizMaterial}
                  onPress={() => {
                    toggleModalFilter();
                    navigation.navigate('SelectQuizToAdd', {
                      package: {
                        p_id: p_id,
                        p_quizzes: p_quizzes,
                        p_materials: p_materials,
                        subcategory: selectedSubcategory,
                        description: packageDescription,
                      },
                      workPackage: {
                        name: name,
                        grade: grade,
                        wp_id: wp_id,
                      },
                    });
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
        {/* Display modal for confirming deletion of file/quiz */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalDeleteVisible}
          onRequestClose={toggleModalDelete}
          testID="modal-delete" // Add testID here
        >
          <View style={styles.containerDeleteModal}>
            <View style={styles.containerDeleteMaterial}>
              <View style={styles.titleDeleteModal}>
                <Text style={styles.textDeleteModal}>
                  Are you sure you want to delete {fileDeleteName || quizDeleteName}?
                </Text>
              </View>
              <View style={styles.containerDeleteButtonsModal}>
                <TouchableOpacity
                  style={styles.buttonDeleteModal}
                  onPress={() => {
                    toggleModalDelete();
                    setFileDeleteId('');
                    setFileDeleteName('');
                    fileDeleteId !== ''
                      ? handleDeleteFile(fileDeleteId, 'material')
                      : handleDeleteQuiz(quizDeleteId, 'quiz');
                  }}
                >
                  <Text style={styles.buttonTextDeleteModal}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonCancelModal}
                  onPress={() => {
                    toggleModalDelete();
                  }}
                >
                  <Text style={styles.buttonTextCancelModal}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  workPackageInputText: {
    height: 70,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    width: '100%',
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
  noQuizzesText: {
    paddingLeft: '5%',
    paddingTop: 10,
    paddingBottom: 5,
  },
  noFilesText: {
    paddingLeft: '5%',
    paddingTop: 10,
    paddingBottom: 15,
  },
  quizzesText: {
    borderTopWidth: 1,
    borderTopColor: '#696969',
    paddingTop: 10,
    marginRight: '3%',
    paddingBottom: 5,
  },
  descriptionText: {
    borderTopWidth: 1,
    borderTopColor: '#696969',
    paddingTop: 15,
    paddingLeft: 5,
    marginRight: '3%',
    paddingBottom: 5,
  },
  descriptionField: {
    height: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderRadius: 10,
    paddingTop: 5,
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 5,
    marginRight: 45,
  },
  containerDeleteModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  containerDeleteMaterial: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 25,
    width: 262,
  },
  titleDeleteModal: {
    alignItems: 'center',
    width: '100%',
  },
  textDeleteModal: {
    fontSize: 16,
    color: '#696969',
    fontWeight: '500',
    textAlign: 'center',
  },
  containerDeleteButtonsModal: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingTop: '10%',
  },
  buttonDeleteModal: {
    backgroundColor: 'red',
    marginRight: 20,
    width: 100,
    borderRadius: 10,
    padding: 5,
  },
  buttonTextDeleteModal: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonCancelModal: {
    backgroundColor: 'grey',
    width: 100,
    borderRadius: 10,
    padding: 5,
  },
  buttonTextCancelModal: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
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
    fontSize: 28,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  workPackageTitle: {
    color: '#696969',
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
  },
  workPackageInfo: {
    color: '#696969',
    fontSize: 23,
    fontWeight: '500',
    textAlign: 'center',
    alignSelf: 'center',
  },
  row: {
    width: '80%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonDelete: {
    padding: 8,
  },
  deleteButtonBackground: {
    backgroundColor: 'rgba(242, 78, 30, 0.13)',
    borderRadius: 100,
    padding: 5,
  },
  buttonAddMaterial: {
    backgroundColor: '#FFFFFF',
    width: 220,
    height: 25,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    marginTop: 10,
    borderColor: '#407BFF',
    borderWidth: 1,
  },
  buttonText: {
    color: '#407BFF',
    alignItems: 'center',
    fontSize: 15,
  },
  containerModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  buttonCloseModal: {
    position: 'absolute',
    top: '26.5%',
    right: '27%',
    zIndex: 1,
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
  deleteButton: {
    backgroundColor: 'red',
    width: 30,
    height: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    height: 300,
    width: '100%',
    paddingBottom: 10,
    paddingHorizontal: '2%',
  },
  disabledButton: {
    borderColor: '#ccc',
  },
  disabledButtonText: {
    color: '#ccc',
  },
});

export default EditPackage;
