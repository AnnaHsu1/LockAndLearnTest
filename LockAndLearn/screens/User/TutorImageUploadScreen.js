import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  ImageBackground,
  FlatList,
  Dimensions,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { getUser } from '../../components/AsyncStorage';
import { ToastContainer, toast } from 'react-toastify';
import * as DocumentPicker from 'expo-document-picker';
import { Icon } from 'react-native-paper';
import PropTypes from 'prop-types';

const TutorImageUploadScreen = ({ navigation }) => {
  const [userId, setUserId] = useState(null);
  const [fileName, setFileName] = useState([]);
  const [files, setFiles] = useState([]);
  const [dictionary, setDictionary] = useState([]);
  const dict = [];
  const maxTextWidth = width * 0.9;
  const { width } = Dimensions.get('window');
  const verificationQuestion = 'Take a clear picture of your face';
  const randomVerificationQuestions = [
    'Take a picture of your finger on your nose',
    'Take a picture of your hand on a book',
    'Take a picture of your hand over your head',
    'Take a picture of you with a water bottle',
    'Take a picture of you with your wallet',
    'Take a picture of you with a calculator',
    'Take a picture of you with a pillow',
    'Take a picture of you doing a peace sign',
    'Do a high five sign with your hand',
    'Take a picture of 1 finger',
    'Take a picture of 2 fingers',
    'Take a picture of 3 fingers',
    'Take a picture of 4 fingers',
    'Take a picture showing the back of your palm',
    'Take a picture of you holding a pen',
    'Take a picture of you holding an eraser',
    'Take a picture of you holding a ruler',
    'Take a picture of you holding scissors',
    'Take a picture of you smiling',
    'Take a picture of you frowning',
    'Take a picture of you holding a fork',
    'Take a picture of you holding a spoon',
    'Take a picture of you holding a bowl',
    'Take a picture of you holding a toilet roll',
    'Take a picture of you holding a pan',
  ];
  const [randomQuestion, setRandomQuestion] = useState([]);

  useEffect(() => {
    chooseRandomQuestion();
  }, []);

  const chooseRandomQuestion = () => {
    const randomIndex = Math.floor(Math.random() * randomVerificationQuestions.length);
    const selectedQuestion = randomVerificationQuestions[randomIndex];
    setRandomQuestion(selectedQuestion);
  };

  const getUserToken = async () => {
    const userToken = await getUser();
    if (userToken) {
      setUserId(userToken._id);
    }
  };

  // Function to select pictures
  const picturesSelectedHandler = async () => {
    let result = await DocumentPicker.getDocumentAsync({ multiple: true, type: 'image/*' });
    if (Platform.OS === 'web') {
      const selectedFileNames = Array.from(result.output).map((file) => file.name);
      const noDuplicateFileName = selectedFileNames.filter((name) => !fileName.includes(name));
      setFileName([...fileName, ...noDuplicateFileName]);
      const noDuplicateFile = Array.from(result.output).filter((file) => {
        return !files.some((f) => f.name == file.name); // using names to compare for duplicates
      });
      setFiles([...files, ...noDuplicateFile]);
      // create dictionary for each file: for description
      noDuplicateFileName.forEach((name) => {
        dict.push({ key: name, value: '' });
      });
      setDictionary([...dictionary, ...dict]);
    } else if (Platform.OS === 'android') {
      setFiles([result.assets]);
      const selectedFileNames = result.assets.map((file) => file.name);
      const noDuplicateFileName = selectedFileNames.filter((name) => !fileName.includes(name));
      setFileName([...fileName, ...noDuplicateFileName]);
      const noDuplicateFile = Array.from(result.assets).filter((file) => {
        return !files.some((f) => f.name == file.name); // using names to compare for duplicates
      });
      setFiles([...files, ...noDuplicateFile]);
    }
  };

  // function to send uploaded pictures to server
  const uploadPicturesHandler = async () => {
    if (files.length == 0) {
      return;
    }
    const invalidFileType = fileName.filter((name) => {
      const splitName = name.split('.');
      const fileType = splitName[splitName.length - 1];
      return !(fileType == 'jpeg' || fileType == 'jpg' || fileType == 'png');
    });

    if (invalidFileType.length > 0) {
      toast.error('You can only upload JPEG files. Please delete your file and try again.');
      return;
    }

    if (files.length == 1) {
      toast.error('Please upload 2 pictures that conform to the criteria.');
      return;
    }

    if (files.length > 2) {
      toast.error(
        'You cannot upload more than 2 pictures. Please delete your picture and try again.'
      );
      return;
    }

    const fileData = new FormData();
    fileData.append('userId', userId);
    fileData.append('verificationQuestion', verificationQuestion);
    fileData.append('randomQuestion', randomQuestion);
    files.forEach((file) => {
      fileData.append('pictures', file);
    });

    try {
      const response = await fetch(`https://lockandlearn.onrender.com/certificates/uploadImages/${userId}`, {
        method: 'PUT',
        body: fileData,
      });
      if (response.status == 201) {
        const data = await response.json();
        if (data.message == 'Images uploaded and metadata updated successfully') {
          toast.success('Pictures uploaded successfully!');
          setTimeout(() => {
            navigation.navigate('UserLandingPage');
          }, 2000);
        } else {
          console.error('Request failed:', response.status, response.statusText);
        }
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  // function to render each row (which is uploaded picture)
  const renderFile = (item, index) => {
    const splitName = item.split('.');
    const fileType = splitName[splitName.length - 1];
    return (
      <View key={index}>
        <View
          key={index}
          style={[
            fileType == 'jpeg' || fileType == 'jpg' || fileType == 'png'
              ? styles.successRowUpload
              : styles.errorRowUpload,
          ]}
        >
          <View style={styles.rowUpload} key={index}>
            <Text
              numberOfLines={1}
              ellipsizeMode="middle"
              style={[{ maxWidth: maxTextWidth, paddingLeft: 10 }, styles.errorTextbox]}
            >
              {item}
            </Text>
            <TouchableOpacity
              testID={`deleteButton-${index}`}
              style={styles.buttonDelete}
              onPress={() => deleteFile(index)}
            >
              {fileType == 'jpeg' || fileType == 'jpg' || fileType == 'png' ? (
                <Icon source="trash-can-outline" size={22} color={'#F24E1E'} />
              ) : (
                <Icon source="close-circle" size={20} color={'#F24E1E'} />
              )}
            </TouchableOpacity>
          </View>
          {fileType == 'jpeg' || fileType == 'jpg' || fileType == 'png' ? (
            <View style={styles.rowDescription}></View>
          ) : null}
        </View>
        {fileType == 'jpeg' || fileType == 'jpg' || fileType == 'png' ? null : (
          <View style={styles.errorMsgRow}>
            <Text style={styles.errorText}>This format is not supported. Please try again.</Text>
          </View>
        )}
      </View>
    );
  };

  const deleteFile = (index) => {
    const filesAfterDeletionName = fileName.filter((_name, i) => i !== index);
    setFileName(filesAfterDeletionName);
    const filteredFiles = Array.from(files).filter((file) =>
      filesAfterDeletionName.includes(file.name)
    );
    setFiles(filteredFiles);
    const filteredDictionary = dictionary.filter((dict) =>
      filesAfterDeletionName.includes(dict.key)
    );
    setDictionary(filteredDictionary);
  };

  useEffect(() => {
    getUserToken();
  }, []);

  const validateFields = files.length == 0;

  return (
    <View style={styles.page}>
      <View style={styles.containerFile}>
        <ToastContainer
          position="top-center"
          hideProgressBar
          closeOnClick
          theme="dark"
          style={{ marginTop: '70px' }}
          autoClose={7000}
        />
        <Text style={styles.pictureTitle}>
          Please upload two pictures of yourself for authentication purposes
        </Text>
        <Text style={styles.selectPictures}>
          Your pictures must conform to the following criteria:{' '}
        </Text>
        <Text style={styles.pictureCriteria}> 1- {verificationQuestion} </Text>
        <Text style={styles.pictureCriteria}> 2- {randomQuestion} </Text>
        <View style={styles.buttonUploadFiles}>
          <TouchableOpacity
            testID="selectButton"
            onPress={picturesSelectedHandler}
            accept=".jpeg, .jpg, .png"
          >
            <ImageBackground
              style={styles.imageUpload}
              source={require('../../assets/UploadDashedZoneH.png')}
            >
              <Text style={[styles.supportedFormats, { marginTop: '40%', textAlign: 'center' }]}>
                Supported formats:{'\n'}JPEG, JPG, PNG
              </Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>
        <View style={styles.containerUploaded}>
          <Text style={styles.uploadFiles}>Uploads - {fileName.length} picture(s)</Text>
          <FlatList
            data={fileName}
            renderItem={({ item, index }) => renderFile(item, index)}
            keyExtractor={(item, index) => index.toString()}
            style={{ width: '100%' }}
          />

          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity
              onPress={uploadPicturesHandler}
              style={[styles.buttonUpload, validateFields && styles.disabledButton]}
              testID="uploadButton"
              disabled={validateFields}
            >
              <Text style={styles.buttonText}>Upload</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

TutorImageUploadScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  item: {
    display: 'flex',
    width: '100%',
    paddingVertical: 10,
  },
  field: {
    color: '#ADADAD',
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
  full_width: {
    minWidth: '100%',
  },
  content: {
    backgroundColor: '#4F85FF',
    borderRadius: 5,
    marginVertical: 10,
    paddingVertical: 20,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: wp(50),
    minHeight: hp(10),
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  containerFile: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    width: '100%',
    // minHeight: '100%',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: '5%',
  },
  pictureTitle: {
    textAlign: 'center',
    color: '#696969',
    fontSize: 36,
    fontWeight: '400',
    marginTop: '1%',
  },
  selectPictures: {
    color: '#696969',
    fontSize: 24,
    fontWeight: '500',
    marginTop: '1%',
    textAlign: 'center',
  },
  pictureCriteria: {
    color: '#696969',
    fontSize: 20,
    fontWeight: '500',
    marginTop: '1%',
    textAlign: 'center',
  },
  uploadFiles: {
    color: '#696969',
    fontSize: 20,
    fontWeight: '500',
    marginTop: '0.5%',
    marginBottom: 0.5,
  },
  buttonUploadFiles: {
    alignItems: 'center',
    marginTop: '0.5%',
  },
  imageUpload: {
    resizeMode: 'contain',
    width: 221,
    height: 130,
  },
  supportedFormats: {
    color: '#ADADAD',
    fontSize: 12,
    fontWeight: '600',
  },
  rowUploadModal: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    fontWeight: '500',
    fontSize: 15,
    marginHorizontal: 10,
    marginBottom: 5,
  },
  containerUploaded: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'left',
    width: '100%',
    height: '100%',
    backgroundColor: '#FAFAFA',
    paddingLeft: '5%',
    paddingRight: '5%',
  },
  buttonUpload: {
    backgroundColor: '#407BFF',
    width: 190,
    height: 35,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    marginTop: '2%',
    marginBottom: '3%',
  },
  buttonText: {
    color: '#FFFFFF',
    alignItems: 'center',
    fontSize: 15,
    fontWeight: '500',
  },
  buttonDelete: {
    flex: 0.1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successRowUpload: {
    borderRadius: 10,
    borderColor: '#61A750',
    borderStyle: 'solid',
    borderWidth: 1,
    marginBottom: 15,
  },
  errorRowUpload: {
    borderRadius: 10,
    borderColor: '#F24E1E',
    borderStyle: 'solid',
    borderWidth: 1,
  },
  rowUpload: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorTextbox: {
    flex: 0.9,
    outlineStyle: 'none',
  },
  errorText: {
    color: '#F24E1E',
    fontSize: 10.76,
    fontWeight: '500',
    // lineHeight: 19.37,
  },
});

export default TutorImageUploadScreen;
