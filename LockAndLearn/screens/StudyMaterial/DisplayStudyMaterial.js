import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  Dimensions,
} from 'react-native';
import { Icon, Button } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
// import Modal from 'react-native-modal';
// import { getItem } from '../../components/AsyncStorage';

const DisplayStudyMaterial = ({ props }) => {
  const route = useRoute();
  const navigation = useNavigation();
  const [packages, setPackages] = useState([]);
  // const [deleteConfirmationModalVisible, setDeleteConfirmationModalVisible] = useState(false);
  // const [selectedPackageId, setSelectedPackageId] = useState(null);
  const params = route.params;
  const childID = params?.child_ID;
//   const { _id, name, grade } = params?.workPackage;
  const _id = "6599f29af077ba0bb1dc2093"
  // const name = "Math"
  // const grade = 10
  const { width } = Dimensions.get('window');
  // const maxTextWidth = width * 0.9;
  const [pdfUrls, setPdfUrls] = useState([]);
  const [packageInfo, setPackageInfo] = useState([]);
  const [currentPdfIndex, setCurrentPdfIndex] = useState(0);
  const [takeQuiz, setTakeQuiz]= useState(false);
  const [quiz, setQuiz]= useState([]);
  const [quizLength, setQuizLength]= useState([]);
  const [quizzesArray, setQuizzesArray]= useState([]);


  // const [quizId, setQuizId]= useState([]);
  const ProgressBar = ({ current, total }) => {
    const completionPercentage = (current / total) * 100;
  
    return (
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${completionPercentage}%` }]} />
        </View>
    );
  };

  const newPlugin = defaultLayoutPlugin({
    innerContainer: styles.customInnerContainer,
  });

  // when screen loads, get all work packages from the user & update when a new package is added
  useEffect(() => {
    fetchPackages();
    fetchPackageInfo();
  }, [params]);

  // function to get all study material info
  const fetchPackageInfo = async () => {
    try {
        const response = await fetch(`http://localhost:4000/child/getPackagesInfo/${childID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.status === 200) {
            const data = await response.json();
            setQuizLength(data.quizzes.length)
            setPackageInfo(data);
            setQuizzesArray(data.quizzes)
            // get the url PDFs with material IDs
            data.materials.forEach(material => {
                getPDFs(material)
            })
            // detect if there is no package assigned to the child, don't display pdfs
            // if (data.message) {
            //     console.log(data.message)
            // }
        } else {
            console.error('Error fetching study material');
        }
    } catch (error) {
        console.error('Network error:', error);
    }
  };
  
  // function to get url of PDF
  const getPDFs = async (materialID) => {
    try {
      console.log("materialIDs: ", materialID)

      const response = await fetch(`http://localhost:4000/files/uploadFilesById/${materialID}`, {
        method: 'GET',
      });
      if (response.status === 200) {
        const fileBlob = await response.blob();
        const fileUrl = URL.createObjectURL(fileBlob);
        setPdfUrls(prevUrls => {
          const newUrls = [...prevUrls, fileUrl];
          return newUrls;
        });

      } else {
        console.error('Error fetching PDFs');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  // function to get work package information
  const fetchPackages = async () => {
    try {
      const response = await fetch(`http://localhost:4000/packages/fetchPackages/${_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        const data = await response.json();
        setPackages(data);
      } else {
        console.error('Error fetching workPackage');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  const fetchQuizById = async (quizId) => {
    console.log("Fetching Quiz with ID:", quizId);
    try {
      const response = await fetch(`http://localhost:4000/quizzes/quiz/${quizId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 200) {
        const data = await response.json();
        setQuiz(data);
        return data;
      } else {
        console.error('Error fetching quiz with ID:', quizId);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  const handleTakeQuiz = async (quizId) => {
    const quiz = await fetchQuizById(quizId);

    navigation.navigate('DisplayQuizzScreen', {
      quizId: quiz._id,
      quizLength: quiz.questions.length,
      questionIndex: 0,
    });

  };


  const handleNextPdf = (nextIndex, length) => {

    if (nextIndex < length){
      setCurrentPdfIndex(nextIndex);
    } 
  };
  const handlePrevPdf = (prevIndex, length) => {

    if (prevIndex >= length){
      setCurrentPdfIndex(prevIndex);
    } 
  };

  // Function to determine the grade suffix
  // const getGradeSuffix = (grade) => {
  //   if (grade >= 11 && grade <= 13) {
  //     return 'th';
  //   }

  //   const lastDigit = grade % 10;

  //   switch (lastDigit) {
  //     case 1:
  //       return 'st';
  //     case 2:
  //       return 'nd';
  //     case 3:
  //       return 'rd';
  //     default:
  //       return 'th';
  //   }
  // };

  return (
    <ImageBackground
      source={require('../../assets/backgroundCloudyBlobsFull.png')}
      resizeMode="cover"
      style={styles.container}
    >
      <View style={styles.containerFile} >
      {pdfUrls.length > 0 ? (
          <View
            style={styles.pdfViewContainer}
          >
            <Text style={styles.packageInfoText} testID="packageInfo">
              {packageInfo.name} - {packageInfo.grade} - {packageInfo.packageDescription}
            </Text>
            <View style={styles.pdfContainer}>
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.0.279/build/pdf.worker.min.js">
              
                <Viewer fileUrl={pdfUrls[currentPdfIndex]} plugins={[newPlugin]} defaultScale={1} />
              
              </Worker>
            </View>
            <Text style={styles.progressBarText}>Document {currentPdfIndex+1} out of {pdfUrls.length}</Text>
            <ProgressBar current={currentPdfIndex + 1} total={pdfUrls.length} />

            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {currentPdfIndex+1 > 1 ? (
                  <Button
                      style={styles.modalButtons}
                      onPress={() => handlePrevPdf(currentPdfIndex-1, 0)}
                  >
                      <Text style = {styles.buttonText}>Previous</Text>
                  </Button>):(<View></View>)}
                {currentPdfIndex+1 < pdfUrls.length ? (
                <Button
                    style={styles.modalButtons}
                    onPress={() => handleNextPdf(currentPdfIndex+1, pdfUrls.length)}
                >
                    <Text style = {styles.buttonText}>Next</Text>
                </Button>
                ):(
                  <Button
                  style={styles.takeQuizButton}
                  onPress={() => handleTakeQuiz(quizzesArray[Math.floor(Math.random() * quizzesArray.length)])}
                  >
                      <Text style = {styles.buttonText}>Take Quiz</Text>
                  </Button>
                )}
            </View>
          </View>
        ) : (
            <Text>No pdf has been found for this package.</Text> 
          )}
          
      </View>
      
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  containerCard: {
    flexDirection: 'column',
    marginVertical: 5,
    color: '#000000',
    borderColor: '#407BFF',
    borderWidth: 1,
    padding: 10,
    borderRadius: 15,
    alignContent: 'center',
    width: '90%',
    alignSelf: 'center',
  },
  deleteConfirmationModal: {
    width: '50%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmationText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  confirmationButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  confirmButton: {
    backgroundColor: '#F24E1E',
    padding: 10,
    borderRadius: 10,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#407BFF',
    padding: 10,
    borderRadius: 10,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
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
    marginTop: '1%',
    marginBottom: '2%',
    textAlign: 'center',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  workPackageItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  workPackageItem: {
    fontSize: 16,
    color: '#407BFF',
  },
  buttonUpload: {
    backgroundColor: '#407BFF',
    width: 190,
    height: 35,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    marginTop: '5%',
    marginBottom: '5%',
  },
  buttonText: {
    color: '#FFFFFF', // White color for text
    alignItems: 'center',
    fontSize: 15,
    fontWeight: '500',
  },
  pdfViewContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#FAFAFA"
  },
  pdfContainer: {
    width: '60%',
    overflowY: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingTop: 20,
  },
  modalButtons: {
    borderRadius: 10,
    marginVertical: 10,
    justifyContent: 'center',
    minWidth: 100,
    backgroundColor: '#407BFF',
    marginHorizontal: 10, // Adjust space between buttons
    width: 150, // Adjust width as needed
    height: 40, // Adjust height as needed
    alignItems: 'center', // Center content horizontally
  },
  takeQuizButton: {
    borderRadius: 10,
    marginVertical: 10,
    justifyContent: 'center',
    minWidth: 100,
    backgroundColor: 'darkblue',
    marginHorizontal: 10, // Adjust space between buttons
    width: 150, // Adjust width as needed
    height: 40, // Adjust height as needed
    alignItems: 'center', // Center content horizontally
  },
  packageInfoText: {
    marginTop: 20, // Adjust as needed
    fontSize: 18, // Adjust as needed
    fontWeight: 'bold',
    color: '#000080', // Dark blue color
    textAlign: 'center',
  },
  progressBarContainer: {
    height: 10,
    width: "50%",
    backgroundColor: 'lightgrey',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 20,
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'darkgrey', // or any color you prefer
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  progressBarText: {
    color: 'darkgrey', 
    fontSize: 14, 
  },
});

export default DisplayStudyMaterial;
