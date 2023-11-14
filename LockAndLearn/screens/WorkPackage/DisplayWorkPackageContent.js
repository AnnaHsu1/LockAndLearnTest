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
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-paper';

const DisplayWorkPackageContent = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [workPackage, setWorkPackage] = useState(null);
  const workPackageId = route.params.workPackageId;
  const newContentAdded = route.params.selectedNewContent;
  const [modalFilterVisible, setModalFilterVisible] = useState(false);
  const [files, setFiles] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  let counterIndex = 0;
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
  const [fileDeleteId, setFileDeleteId] = useState('');
  const [fileDeleteName, setFileDeleteName] = useState('');
  const [quizDeleteId, setQuizDeleteId] = useState('');
  const [quizDeleteName, setQuizDeleteName] = useState('');
  const { width } = Dimensions.get('window');
  const maxTextWidth = width * 0.6;

  useEffect(() => {
    fetchWorkPackage();
  }, [newContentAdded]);

  useEffect(() => {
    getQuizzes();
    getFiles();
  }, [workPackage]);

  // Function to get data from the work package
  const fetchWorkPackage = async () => {
    if (workPackageId === '') {
      return;
    }
    try {
      const response = await fetch(`http://localhost:4000/workPackages/${workPackageId}`);
      if (response.status === 200) {
        const data = await response.json();
        setWorkPackage(data);
      } else {
        console.error('Error fetching work package');
      }
    } catch (error) {
      console.error('Network error');
    }
  };

  // Function to fetch and display the quiz name
  async function fetchQuizName(quizId) {
    try {
      const response = await fetch(`http://localhost:4000/quizzes/quiz/${quizId}`);
      console.log(response);
      console.log(quizId);
      if (response.status === 200 || 201) {
        const data = await response.json();
        console.log('DATAX' + data);
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
          const file = { id: counterIndex++, name: data.fileName, originalId: fileId };
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
    if (workPackage && workPackage.quizzes && workPackage.quizzes.length > 0) {
      const quizIds = workPackage.quizzes;

      Promise.all(quizIds.map((quizId) => fetchQuizName(quizId)))
        .then((quizNames) => {
          const filteredQuizNames = quizNames.filter(
            (quizName) => typeof quizName === 'string' && quizName.trim() !== ''
          );
          setQuizzes(filteredQuizNames);
          console.log('QUIZIDX' + quizIds);
          console.log('QUIZNAMEX' + filteredQuizNames);
        })
        .catch((error) => {
          console.error('Error fetching quiz names', error);
        });
    };
  };

  // Function to fetch the names of each file in the "files" array
  const getFiles = async () => {
    if (workPackage && workPackage.materials && workPackage.materials.length > 0) {
      const fileIds = workPackage.materials;

      // Fetch the names of each file in the "files" array
      Promise.all(fileIds.map((fileId) => fetchFileName(fileId)))
        .then((fileNames) => {
          const filteredFileNames = fileNames.filter((fileName) => fileName !== undefined);
          setFiles(filteredFileNames);
        })
        .catch((error) => {
          console.error('Error fetching file names', error);
        });
    };
  };

  // Function to delete a file in work package
  const handleDeleteFile = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/workPackages/deleteMaterial/${workPackageId}/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        console.log(response)
        setFiles(files.filter((file) => file.originalId !== id));
      }
    }
    catch (error) {
      console.error('Network error');
    }
  };

  // Function to delete a quiz in work package
  const handleDeleteQuiz = async (id) => {
    try {
      const updatedQuizzes = [...quizzes];
      const deletedQuizName = updatedQuizzes.splice(id, 1)[0];
      setQuizzes(updatedQuizzes);

      const response = await fetch(`http://localhost:4000/workPackages/deleteQuiz/${workPackageId}/${workPackage.quizzes[id]}`, {
        method: 'DELETE',
      });

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

  // Function to download file
  const downloadFile = async (fileName) => {
    console.log(fileName);
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

  return (
    <ImageBackground
      source={require('../../assets/backgroundCloudyBlobsFull.png')}
      resizeMode="cover"
      style={styles.container}
    >
      <View style={styles.containerFile}>
        {/* Display work package name */}
        <View
          style={{
            borderBottomColor: 'lightgrey', borderBottomWidth: 1, textAlign: 'center', alignSelf: 'center', paddingBottom: 5, width: '100%',
          }}>
          <Text style={styles.selectFiles}>Work Package:</Text>
          {workPackage && (
            <View>
              <Text style={styles.workPackageTitle}>
                {workPackage.name} - {workPackage.grade}
              </Text>
              {workPackage.subcategory !== "Choose a Subcategory" && (
                <Text style={styles.workPackageInfo}>{workPackage.subcategory}</Text>
              )}
            </View>
          )}
        </View>
        {/* Display all files and quizzes from the work package */}
        <ScrollView style={styles.scrollContainer}>
          <Text style={styles.studyMaterialText}>Study Material</Text>
          {files.length === 0 ? (
            <Text style={styles.noFilesText}>
              No files added
            </Text>
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
                  <Text numberOfLines={1} ellipsizeMode='middle' style={{ maxWidth: maxTextWidth }}>{file.name}</Text>
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
          <Text style={styles.quizzesText}>Quizzes</Text>
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
                    navigation.navigate('QuestionsOverviewScreen', { quizId: workPackage.quizzes[index] });
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
                  testID='toggle-delete-modal-button'
                >
                  <View style={styles.deleteButtonBackground}>
                    <Icon source="delete-outline" size={20} color={'#F24E1E'} />
                  </View>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
        {/* Display button to show modal to add files/quizzes */}
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            onPress={toggleModalFilter}
            style={styles.buttonAddMaterial}
            testID='addMaterialModal'
          >
            <Text style={styles.buttonText}>Add Material</Text>
          </TouchableOpacity>
        </View>
        {/* Display modal to add files/quizzes */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalFilterVisible}
          onRequestClose={toggleModalFilter}
        >
          <View style={styles.containerModal}>
            <View style={[styles.containerMaterial, { flexDirection: "column", justifyContent: "space-around" }]}>
              <View style={styles.titleModal}>
                {workPackage && (
                  <View>
                    <Text style={styles.titleModalText}>
                      {workPackage.name} - {workPackage.grade}
                    </Text>
                    {workPackage.subcategory !== "Choose a Subcategory" && (
                      <Text style={styles.titleModalText}>{workPackage.subcategory}</Text>
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
                      workPackageId: workPackageId,
                      workPackageName: workPackage.name,
                      workPackageGrade: workPackage.grade,
                      workPackageSubcategory: workPackage.subcategory,
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
                      workPackageId,
                      workPackageName: workPackage.name,
                      workPackageGrade: workPackage.grade,
                      workPackageSubcategory: workPackage.subcategory,
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
          <View
            style={styles.containerDeleteModal}
          >
            <View
              style={styles.containerDeleteMaterial}
            >
              <View
                style={styles.titleDeleteModal}
              >
                <Text style={styles.textDeleteModal}>
                  Are you sure you want to delete {fileDeleteName || quizDeleteName}?
                </Text>
              </View>
              <View
                style={styles.containerDeleteButtonsModal}
              >
                <TouchableOpacity
                  style={styles.buttonDeleteModal}
                  onPress={() => {
                    toggleModalDelete();
                    fileDeleteId !== '' ? handleDeleteFile(fileDeleteId) : handleDeleteQuiz(quizDeleteId);
                  }}
                >
                  <Text style={styles.buttonTextDeleteModal}>
                    Delete
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonCancelModal}
                  onPress={() => {
                    toggleModalDelete();
                  }}
                >
                  <Text style={styles.buttonTextCancelModal}>
                    Cancel
                  </Text>
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
  noQuizzesText: {
    paddingLeft: '5%',
    paddingTop: 10
  },
  noFilesText: {
    paddingLeft: '5%',
    paddingTop: 10,
    paddingBottom: 15
  },
  studyMaterialText: {
    paddingLeft: 5,
    paddingBottom: 5
  },
  quizzesText: {
    borderTopWidth: 1,
    borderTopColor: '#696969',
    paddingTop: 10,
    paddingLeft: 5,
    marginRight: "3%",
    paddingBottom: 5,
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
    width: 262
  },
  titleDeleteModal: {
    alignItems: 'center',
    width: '100%',
  },
  textDeleteModal: {
    fontSize: 16,
    color: '#696969',
    fontWeight: '500',
    textAlign: "center"
  },
  containerDeleteButtonsModal: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingTop: '10%'
  },
  buttonDeleteModal: {
    backgroundColor: "red",
    marginRight: 20,
    width: 100,
    borderRadius: 10,
    padding: 5
  },
  buttonTextDeleteModal: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: "center"
  },
  buttonCancelModal: {
    backgroundColor: "grey",
    width: 100,
    borderRadius: 10,
    padding: 5
  },
  buttonTextCancelModal: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: "center"
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
    padding: "1%"
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
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '5%',
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
    backgroundColor: '#407BFF',
    width: 190,
    height: 35,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    marginTop: '3%',
    marginBottom: '3%'
  },
  buttonText: {
    color: '#FFFFFF',
    alignItems: 'center',
    fontSize: 15,
    fontWeight: '500',
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
    paddingVertical: '2%',
    paddingHorizontal: '2%',
  },
});

export default DisplayWorkPackageContent;
