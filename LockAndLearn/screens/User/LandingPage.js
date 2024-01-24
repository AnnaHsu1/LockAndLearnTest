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
  Modal,
  TextInput,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { getUser } from '../../components/AsyncStorage';
import { ToastContainer, toast } from 'react-toastify';
import * as DocumentPicker from 'expo-document-picker';
import { Icon } from 'react-native-paper';

const LandingPage = ({ navigation }) => {
  const [userId, setUserId] = useState(null);
  const [certificateStatus, setCertificateStatus] = useState('pending');
  const [fileName, setFileName] = useState([]);
  const [fullName, setFullName] = useState("");
  const [highestDegree, setHighestDegree] = useState("");
  const [files, setFiles] = useState([]);
  const [modalOverwriteFilesVisible, setModalOverwriteFilesVisible] = useState(false);
  const [duplicateFiles, setDuplicateFiles] = useState([]);
  const [dictionary, setDictionary] = useState([]); // [{key, value}]
  const [status, setStatus] = useState("");
  const dict = [];
  const maxTextWidth = width * 0.9;
  const { width } = Dimensions.get('window');

  const getUserToken = async () => {
    const userToken = await getUser();
    if (userToken) {
      setUserId(userToken._id);
    }
  };

  const getStatus = async () => {
    try {
      const response = await fetch(`http://localhost:4000/certificates/getCertificatesStatus/${userId}`, {
        method: 'GET',
      });
      if (response.ok) {
        const data = await response.json();
        const returnedStatus = data.firstCertificate.metadata.status;
        setStatus(returnedStatus);
        if (returnedStatus == "pending") {
          toast.info('Your certificate is under review. Please come back later.');
        }
        else if (returnedStatus == "rejected") {
          toast.error('Your certificate has been rejected. Please upload a new certificate.');
        }
      }
      
    } catch (error) {
    console.error('An error occurred:', error);
    }
  }

  const certificateSelectedHandler = async () => {
    let result = await DocumentPicker.getDocumentAsync({ multiple: true });
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

  // function to send uploaded certificates to server
  const uploadCertificatesHandler = async () => {
    if (files.length == 0) {
      return;
    }
    const invalidFileType = fileName.filter((name) => {
      const splitName = name.split('.');
      const fileType = splitName[splitName.length - 1];
      return !(fileType == 'pdf');
    });

    if (invalidFileType.length > 0) {
      toast.error('You can only upload PDF files. Please delete your file and try again.');
      return;
    }

    const fileData = new FormData();
    fileData.append('userId', userId);
    fileData.append('status', certificateStatus);
    files.forEach((file) => {
      fileData.append('certificates', file);
    });
    fileData.append('fullName', fullName);
    fileData.append('highestDegree', highestDegree);

    try {
      const response = await fetch('http://localhost:4000/certificates/uploadCertificates', {
        method: 'POST',
        body: fileData,
      });
      // detected duplicated files from server
      if (response.status == 201) {
        const data = await response.json();
        if (data.duplicatedCertificates) {
          setDuplicateFiles(data.duplicatedCertificates);
          toggleModalOverwriteFiles();
        }
        // no duplicated files - save files to db
        else if (data.message == 'Certificate uploaded successfully') {
          toast.success('Certificates uploaded successfully!');
          //navigation.navigate('ViewUploads', { newFilesAdded: fileName });
          setFileName([]);
          setFiles([]);
          setFullName("");
          setHighestDegree("");
        } else {
          console.error('Request failed:', response.status, response.statusText);
        }
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const overwriteCertificatesHandler = async () => {
    if (duplicateFiles.length == 0) {
      return;
    }
    const fileData = new FormData();
    fileData.append('userId', userId);
    files.forEach((file) => {
      fileData.append('certificates', file);
    });
    fileData.append('fullName', fullName);
    fileData.append('highestDegree', highestDegree);
    try {
      const response = await fetch('http://localhost:4000/certificates/overwriteCertificates', {
        method: 'PUT',
        body: fileData,
      });
      if (response.status == 201) {
        if (response.ok) {
          toast.success('Certificates uploaded successfully!');
          //navigation.navigate('ViewUploads', { newFilesAdded: duplicateFiles });
          setFileName([]);
          setFiles([]);
          setFullName("");
          setHighestDegree("");
        } else {
          console.error('Request failed:', response.status, response.statusText);
        }
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const toggleModalOverwriteFiles = () => {
    setModalOverwriteFilesVisible(!modalOverwriteFilesVisible);
  };

  const validateFields = fullName == "" || highestDegree == "" || files.length == 0 || status == "pending"

  // function to render each row (which is uploaded file)
  const renderFile = (item, index) => {
    const splitName = item.split('.');
    const fileType = splitName[splitName.length - 1];
    return (
      <View key={index}>
        <View
          key={index}
          style={[fileType == 'pdf' ? styles.successRowUpload : styles.errorRowUpload]}
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
              testID={`deleteButton-${index}`} // Unique testID for each button
              style={styles.buttonDelete}
              onPress={() => deleteFile(index)}
            >
              {fileType == 'pdf' ? (
                <Icon source="trash-can-outline" size={22} color={'#F24E1E'} />
              ) : (
                <Icon source="close-circle" size={20} color={'#F24E1E'} />
              )}
            </TouchableOpacity>
          </View>
          {/* add a description field and display in lightgrey */}
          {fileType == 'pdf' ? <View style={styles.rowDescription}></View> : null}
        </View>
        {fileType == 'pdf' ? null : (
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

  const renderDuplicateCertificates = (item, index) => {
    return (
      <View key={index}>
        <View key={index} style={styles.duplicateRow}>
          <View style={styles.rowUploadModal} key={index}>
            <Icon source="file-alert" size={20} color={'#696969'} />
            <Text
              numberOfLines={1}
              ellipsizeMode="middle"
              style={{ maxWidth: maxTextWidth, marginLeft: 5 }}
            >
              {item}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  useEffect(() => {
    getUserToken();
  }, []);

  useEffect(() => {
    getStatus();
  }, [userId]);

  return (
    <View style={styles.page}>
      {status == 'accepted' ? (
        <View>
          <TouchableOpacity
            style={styles.content}
            onPress={() => navigation.navigate('WorkPackage')}
          >
            <Text style={styles.text}>My Work Packages</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.content}
            onPress={() => navigation.navigate('QuizzesOverviewScreen', { userId: userId })}
          >
            <Text style={styles.text}>My quizzes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.content}
            onPress={() => navigation.navigate('ViewUploads', { newFilesAdded: undefined })}
          >
            <Text style={styles.text}>My files</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
        style={styles.content}
        onPress={() => navigation.navigate('ParentAccount')}
      >
        <Text style={styles.text}>Parent Account</Text>
      </TouchableOpacity> */}
        </View>
      ) : (
        <View style={styles.containerFile}>
          <ToastContainer
            position="top-center"
            hideProgressBar
            closeOnClick
            theme="dark"
            style={{ marginTop: '70px' }}
            autoClose={7000}
          />
          <Text style={styles.certificateTitle}>
            Please upload your professional certificates to proceed further
          </Text>
          <Text style={styles.selectCertificates}>Select certificates</Text>
          <View style={styles.buttonUploadFiles}>
            {/* display button to upload file */}
            <TouchableOpacity
              testID="selectButton"
              onPress={certificateSelectedHandler}
              accept=".pdf"
            >
              <ImageBackground
                style={styles.imageUpload}
                source={require('../../assets/UploadDashedZoneH.png')}
              >
                <Text style={[styles.supportedFormats, { marginTop: '40%', textAlign: 'center' }]}>
                  Supported format:{'\n'}PDF
                </Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>
          <View style={styles.containerUploaded}>
            <View style={styles.item}>
              <Text style={styles.field}>Full Name</Text>
              <TextInput
                testID="full-name-input"
                style={[styles.textbox, styles.full_width]}
                value={fullName}
                onChangeText={(newText) => setFullName(newText)}
              />
            </View>
            <View style={styles.item}>
                <Text style={styles.field}>Highest Degree</Text>
                <TextInput
                  testID="highest-degree-input"
                  style={[styles.textbox, styles.full_width]}
                  value={highestDegree}
                  onChangeText={(newText) => setHighestDegree(newText)}
                />
            </View>
            <Text style={styles.uploadFiles}>Uploads - {fileName.length} certificates</Text>
            <Text style={[styles.supportedFormats, { marginTop: 2, marginBottom: 10 }]}>
              Uploading certificates that already existed in our system will be overwritten by the
              newest version.
            </Text>
            {/* display rows for each uploaded file */}
            <FlatList
              data={fileName}
              renderItem={({ item, index }) => renderFile(item, index)}
              keyExtractor={(item, index) => index.toString()}
              style={{ width: '100%' }}
            />
            {status && status == "pending" ? 
            <View> 
            <Text style={styles.selectCertificates}>Your certificate is currently under review</Text>
          </View> : null  }
                  
            {/* display button to confirm: uploading files */}
            <View style={{ alignItems: 'center' }}>
              <TouchableOpacity
                onPress={uploadCertificatesHandler}
                style={[styles.buttonUpload, validateFields && styles.disabledButton]}
                testID="uploadButton"
                disabled={validateFields}
              >
                <Text style={styles.buttonText}>Upload</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      {/* display pop up modal for overwritten files section */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalOverwriteFilesVisible}
        onRequestClose={toggleModalOverwriteFiles}
      >
        <View style={styles.containerModalOverwriteFiles}>
          <View style={styles.containerModalOverwriteFilesContent}>
            {/* display title of modal */}
            <View style={styles.containerTextModal}>
              <Text style={[{ fontSize: 20 }, styles.textDuplicateFiles]}>Duplicated File(s)</Text>
              <Text style={[{ fontSize: 12 }, styles.textDuplicateFiles]}>
                Are you sure you want to overwrite these following files?
              </Text>
            </View>
            {/* display each row with filename */}
            <FlatList
              data={duplicateFiles}
              renderItem={({ item, index }) => renderDuplicateCertificates(item, index)}
              keyExtractor={(item, index) => index.toString()}
              style={{ width: '100%' }}
            />
            {/* display buttons */}
            <View style={styles.buttonOverwriteFiles}>
              <TouchableOpacity
                onPress={() => {
                  toggleModalOverwriteFiles();
                }}
                style={styles.buttonCancel}
              >
                <Text style={styles.buttonConfirmText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  toggleModalOverwriteFiles();
                  overwriteCertificatesHandler();
                }}
                style={styles.buttonConfirm}
              >
                <Text style={styles.buttonConfirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
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
  duplicateRow: {
    marginBottom: '1%',
    marginTop: 10,
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
  certificateTitle: {
    textAlign: 'center',
    color: '#696969',
    fontSize: 36,
    fontWeight: '400',
    marginTop: '1%',
  },
  selectCertificates: {
    color: '#696969',
    fontSize: 24,
    fontWeight: '500',
    marginTop: '1%',
    textAlign: "center",
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
  containerModalOverwriteFilesContent: {
    width: '67%',
    height: '50%',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  containerModalOverwriteFiles: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
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
  textDuplicateFiles: {
    color: '#696969',
    fontWeight: '500',
    textAlign: 'center',
  },
  buttonConfirmText: {
    color: '#FFFFFF',
    alignItems: 'center',
    fontSize: 13,
    fontWeight: '500',
  },
  buttonConfirm: {
    backgroundColor: 'red',
    width: 75,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonOverwriteFiles: {
    alignItems: 'center',
    paddingVertical: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: 'lightgray',
  },
  buttonCancel: {
    backgroundColor: 'lightgray',
    width: 75,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
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

export default LandingPage;
