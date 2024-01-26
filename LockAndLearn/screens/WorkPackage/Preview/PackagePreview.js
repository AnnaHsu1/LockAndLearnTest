import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { subcategoryData } from '../../../components/WorkPackageConstants';
import { Modal } from 'react-native';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Icon } from 'react-native-paper';

const PackagePreview = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [files, setFiles] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  let counterIndex = 0;
  const { width } = Dimensions.get('window');
  const maxTextWidth = width * 0.4;
  const params = route.params;
  const { wp_id, name, grade } = params?.workPackage;
  const { p_id, p_quizzes, p_materials, subcategory, description } = params?.package;
  const [selectedSubcategory, setSelectedSubcategory] = useState(subcategory);
  const [packageDescription, setPackageDescription] = useState(description);
  const [packageSubcategories, setPackageSubcategories] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isQuizModalVisible, setQuizModalVisible] = useState(false);

  const [pdf, setPdf] = useState(null);
  const newPlugin = defaultLayoutPlugin({
    innerContainer: styles.customInnerContainer, // Customize inner container styles if needed
  });
  const [isPdfModalVisible, setPdfModalVisible] = useState(false);

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

  const displayFile = async (fileName) => {
    const response = await fetch(`http://localhost:4000/files/uploadFiles/${fileName}`, {
      method: 'GET',
    });

    if (response.ok) {
      const test = await response.blob();
      const url = URL.createObjectURL(test);
      setPdf(url);
      setPdfModalVisible(true);
    }
  };

  const displayQuizDetails = async (quizId) => {
    try {
      const response = await fetch(`http://localhost:4000/quizzes/quiz/${quizId}`);
      if (response.status === 200 || response.status === 201) {
        const quizDetails = await response.json();
        setSelectedQuiz(quizDetails);
        setQuizModalVisible(true);
      } else {
        console.error('Error fetching quiz details');
      }
    } catch (error) {
      console.error('Network error', error);
    }
  };

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
            {/* Display subject */}
            <View style={styles.containerPicker}>
              <Text style={styles.textFields}>Subject</Text>
              <Text style={styles.workPackageInputText}>{name}</Text>
            </View>
            {/* Display school grade */}
            <View style={styles.containerPicker}>
              <Text style={styles.textFields}>School Grade</Text>
              <Text style={styles.workPackageInputText}>{grade}</Text>
            </View>
            {/* Display subcategory */}
            <View style={styles.containerPicker}>
              <Text style={styles.textFields}>Subcategory</Text>
              <Text style={styles.workPackageInputText}>{selectedSubcategory}</Text>
            </View>
            {/* Display description */}
            <View style={[styles.containerPicker, { marginTop: 10 }]}>
              <Text style={styles.textFields}>Description</Text>
              <Text style={styles.workPackageInputText}>{packageDescription}</Text>
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
                <Text style={styles.textFields}>Study Material</Text>
              </View>
              <View style={styles.rowContainer}>
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
                      <TouchableOpacity onPress={() => displayFile(file.name)}>
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
                    </View>
                  ))
                )}
              </View>
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
                }}
              >
                <Text style={styles.textFields}>Quizzes</Text>
              </View>
              <View style={styles.rowContainer}>
                {quizzes.length === 0 ? (
                  <Text style={styles.noQuizzesText}>No quizzes added</Text>
                ) : (
                  quizzes.map((quizName, index) => (
                    <View
                      style={[
                        styles.row,
                        index === quizzes.length - 1
                          ? { borderBottomWidth: 1, padding: 5, borderBottomColor: '#FAFAFA' }
                          : null,
                        files.length === 0 ? { paddingTop: 5 } : null,
                      ]}
                      key={index}
                    >
                      <TouchableOpacity onPress={() => displayQuizDetails(p_quizzes[index])}>
                        <Text style = {styles.QuizNameStyle} >{quizName}</Text>
                      </TouchableOpacity>
                    </View>
                  ))
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* PDF Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isPdfModalVisible}
        onRequestClose={() => setPdfModalVisible(false)}
      >
        <View style={styles.pdfModalContainer}>
          <View style={styles.pdfModalContent}>
            <TouchableOpacity onPress={() => setPdfModalVisible(false)} style={styles.CloseButton}>
            <Icon source="close-circle-outline" size={23} color={'#F24E1E'}/>
            </TouchableOpacity>
            {pdf && (
              <View style={styles.pdfContainer}>
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.0.279/build/pdf.worker.min.js">
                  <Viewer fileUrl={pdf} plugins={[newPlugin]} defaultScale={1} />
                </Worker>
              </View>
            )}
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isQuizModalVisible}
        onRequestClose={() => setQuizModalVisible(false)}
      >
        <View style={styles.quizModalContainer}>
          <View style={styles.quizModalContent}>
            <TouchableOpacity onPress={() => setQuizModalVisible(false)} style={styles.CloseButton}>
            <Icon source="close-circle-outline" size={20} color={'#F24E1E'}/>
            </TouchableOpacity>
            {selectedQuiz && (
              <View>
                <Text>{selectedQuiz.name}</Text>
                <Text>Questions:</Text>
                <ScrollView>
                  {selectedQuiz.questions.map((question, index) => (
                    <View key={index}>
                      <Text>{question.questionText}</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  quizModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  quizModalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  workPackageInputText: {
    borderColor: '#407BFF',
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
  textFields: {
    fontSize: 20,
    color: '#407BFF',
  },
  noQuizzesText: {
    paddingLeft: '5%',
    paddingTop: 10,
    paddingBottom: 10,
  },
  noFilesText: {
    paddingLeft: '5%',
    paddingTop: 10,
    paddingBottom: 10,
  },
  quizzesText: {
    borderTopWidth: 1,
    borderTopColor: '#696969',
    paddingTop: 10,
    marginRight: '3%',
    paddingBottom: 5,
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
    fontSize: 35,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  row: {
    width: '95%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowContainer: {
    borderColor: '#407BFF',
    borderWidth: 1,
    borderRadius: 5,
  },
  scrollContainer: {
    height: 300,
    width: '100%',
    paddingBottom: 10,
    paddingHorizontal: '2%',
  },
  QuizNameStyle: {
    marginTop: 5,
  },
  CloseButton: {
    alignSelf: 'flex-end',
  },

});

export default PackagePreview;
