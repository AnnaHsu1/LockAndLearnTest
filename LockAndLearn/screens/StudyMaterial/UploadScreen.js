import {
  StyleSheet,
  Text,
  View,
  Platform,
  ImageBackground,
  FlatList,
  Modal,
  Dimensions,
  TextInput,
} from 'react-native';
import { React, useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { TouchableOpacity } from 'react-native';
import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css'; causes issue with android
import { Icon } from 'react-native-paper';
import { getUser } from '../../components/AsyncStorage';
import { useNavigation } from '@react-navigation/native';

const UploadScreen = () => {
  const [fileName, setFileName] = useState([]);
  const [files, setFiles] = useState([]);
  const navigation = useNavigation();
  const [modalOverwriteFilesVisible, setModalOverwriteFilesVisible] = useState(false);
  const [duplicateFiles, setDuplicateFiles] = useState([]);
  const { width } = Dimensions.get('window');
  const maxTextWidth = width * 0.9;
  const [dictionary, setDictionary] = useState([]); // [{key, value}]
  const dict = [];
  const [fileDescription, setFileDescription] = useState([]);

  // function to get userID from async storage
  const getUserId = async () => {
    const user = await getUser();
    return user._id;
  };

  // function handling with file uploaded by user and its names
  const fileSelectedHandler = async () => {
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

  // function deleting files that are selected by user
  const deleteFile = (index) => {
    const filesAfterDeletionName = fileName.filter((_name, i) => i !== index);
    setFileName(filesAfterDeletionName);
    const filteredFiles = Array.from(files).filter((file) =>
      filesAfterDeletionName.includes(file.name)
    );
    setFiles(filteredFiles);
    const filteredDictionary = dictionary.filter((dict) => filesAfterDeletionName.includes(dict.key));
    setDictionary(filteredDictionary);
  };

  // function to find description of each file
  const findDescription = (fileName) => {
    return dictionary.find((dict) => dict.key == fileName)?.value || '';
  };

  // function to send uploaded files to server
  const uploadFilesHandler = async () => {
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

    const noDescription = dictionary.filter((dict) => dict.value == '');
    if (noDescription.length > 0) {
      toast.error('Please add description for all files.');
      return false;
    }

    const fileData = new FormData();
    const user = await getUserId();
    fileData.append('userId', user);
    files.forEach((file) => {
      fileData.append('files', file);
      fileData.append('description', findDescription(file.name));
    });

    // keep: for testing purposes
    // for (var key of fileData.entries()) {
    //   console.log(key[0] + ', ' + key[1]);
    // }

    try {
      const response = await fetch('https://lockandlearn.onrender.com/files/uploadFiles', {
        method: 'POST',
        body: fileData,
      });
      // detected duplicated files from server
      if (response.status == 201) {
        const data = await response.json();
        if (data.duplicatedFiles) {
          setDuplicateFiles(data.duplicatedFiles);
          toggleModalOverwriteFiles();
        }
        // no duplicated files - save files to db
        else if (data.message == "File(s) uploaded successfully") {
          toast.success('Files uploaded successfully!');
          navigation.navigate('ViewUploads', { newFilesAdded: fileName });
          setFileName([]);
          setFiles([]);
        }
        else {
          console.error('Request failed:', response.status, response.statusText);
        }
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  // function to send all confirmed duplicated files to server -> will overwrite the old files
  const overwriteFilesHandler = async () => {
    if (duplicateFiles.length == 0) {
      return;
    }
    const fileData = new FormData();
    const user = await getUserId();
    fileData.append('userId', user);
    files.forEach((file) => {
      fileData.append('files', file);
      fileData.append('description', findDescription(file.name));
    });
    try {
      const response = await fetch('https://lockandlearn.onrender.com/files/overwriteFiles', {
        method: 'PUT',
        body: fileData,
      });
      if (response.status == 201) {
        if (response.ok) {
          toast.success('Files uploaded successfully!');
          navigation.navigate('ViewUploads', { newFilesAdded: duplicateFiles });
          setFileName([]);
          setFiles([]);
        }
        else {
          console.error('Request failed:', response.status, response.statusText);
        }
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  // function to render each row (which is uploaded file)
  const renderFile = (item, index) => {
    const splitName = item.split('.');
    const fileType = splitName[splitName.length - 1];
    const fileDescription = dictionary.find((dict) => dict.key == item)?.value || '';
    return (
      <View key={index}>
        <View
          key={index}
          style={[fileType == 'pdf' ? styles.successRowUpload : styles.errorRowUpload]}
        >
          <View style={styles.rowUpload} key={index}>
            <Text numberOfLines={1} ellipsizeMode='middle' style={[{ maxWidth: maxTextWidth, paddingLeft: 10 }, styles.errorTextbox]} >{item}</Text>
            <TouchableOpacity
              testID={`deleteButton-${index}`} // Unique testID for each button
              style={styles.buttonDelete}
              onPress={() => deleteFile(index)}
            >
              {fileType == 'pdf' ? (
                <Icon source="delete-outline" size={22} color={'#F24E1E'} />
              ) : (
                <Icon source="close-circle" size={20} color={'#F24E1E'} />
              )}
            </TouchableOpacity>
          </View>
          {/* add a description field and display in lightgrey */}
          {fileType == 'pdf' ? (
            <View style={styles.rowDescription}>
              <TextInput
                style={styles.fileDescriptionInput}
                onChangeText={(newText) => {
                  setFileDescription(newText),
                    setDictionary(
                      dictionary.map((dict) => {
                        if (dict.key == item) {
                          return { ...dict, value: newText };
                        } else {
                          return dict;
                        }
                      })
                    );
                }}
                value={fileDescription}
                placeholder="Add File's Description"
              />
            </View>
          ) : null}
        </View>
        {fileType == 'pdf' ? null : (
          <View style={styles.errorMsgRow}>
            <Text style={styles.errorText}>This format is not supported. Please try again.</Text>
          </View>
        )}
      </View>
    );
  };

  // function to render each row (which is uploaded file)
  const renderDuplicateFiles = (item, index) => {
    return (
      <View key={index}>
        <View
          key={index}
          style={styles.duplicateRow}
        >
          <View style={styles.rowUploadModal} key={index}>
            <Icon source="file-alert" size={20} color={'#696969'} />
            <Text numberOfLines={1} ellipsizeMode='middle' style={{ maxWidth: maxTextWidth, marginLeft: 5 }} >{item}</Text>
          </View>
        </View>
      </View>
    );
  };

  // function to toggle the pop up modal for filter section
  const toggleModalOverwriteFiles = () => {
    setModalOverwriteFilesVisible(!modalOverwriteFilesVisible);
  };

  return (
    // display the blue background on top of screen
    <ImageBackground
      source={require('../../assets/backgroundCloudyBlobsFull.png')}
      resizeMode="cover"
      style={styles.container}
    >
      {/* display container to select file with the appropriate formats */}
      <View style={styles.containerFile}>
        <ToastContainer
          position="top-center"
          hideProgressBar
          closeOnClick
          theme="dark"
          style={{ marginTop: '70px' }}
        />
        <Text style={styles.selectFiles}>Select files</Text>
        <View style={styles.buttonUploadFiles}>
          {/* display button to upload file */}
          <TouchableOpacity testID="selectButton" onPress={fileSelectedHandler} accept=".pdf">
            <ImageBackground
              style={styles.imageUpload}
              source={require('../../assets/UploadDashedZoneH.png')}
            >
              <Text style={[styles.supportedFormats, { marginTop: '40%', textAlign: 'center' }]}>Supported format:{'\n'}PDF</Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>
        <View style={styles.containerUploaded}>
          <Text style={styles.uploadFiles}>Uploads - {fileName.length} files</Text>
          <Text style={[styles.supportedFormats, { marginTop: 2, marginBottom: 10 }]}>Uploading files that already existed in our system will be overwritten by the newest version.</Text>
          {/* display rows for each uploaded file */}
          <FlatList
            data={fileName}
            renderItem={({ item, index }) => renderFile(item, index)}
            keyExtractor={(item, index) => index.toString()}
            style={{ width: '100%' }}
          />
          {/* display button to confirm: uploading files */}
          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity
              onPress={uploadFilesHandler}
              style={styles.buttonUpload}
              testID="uploadButton"
            >
              <Text style={styles.buttonText}>Upload</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* display pop up modal for overwritten files section */}
      < Modal
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
              <Text style={[{ fontSize: 12 }, styles.textDuplicateFiles]}>Are you sure you want to overwrite these following files?</Text>
            </View>
            {/* display each row with filename */}
            <FlatList
              data={duplicateFiles}
              renderItem={({ item, index }) => renderDuplicateFiles(item, index)}
              keyExtractor={(item, index) => index.toString()}
              style={{ width: '100%' }}
            />
            {/* display buttons */}
            <View
              style={styles.buttonOverwriteFiles}>
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
                  overwriteFilesHandler();
                }}
                style={styles.buttonConfirm}
              >
                <Text style={styles.buttonConfirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal >
    </ImageBackground>
  );
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
    // minHeight: '100%',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: '5%',
  },
  selectFiles: {
    color: '#696969',
    fontSize: 36,
    fontWeight: '500',
    marginTop: '1%',
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
  uploadFiles: {
    color: '#696969',
    fontSize: 20,
    fontWeight: '500',
    marginTop: '0.5%',
    marginBottom: 0.5,
  },
  rowUpload: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // padding: 10,
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
  rowDescription: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 10,
  },
  successRowUpload: {
    borderRadius: 10,
    borderColor: '#61A750',
    borderStyle: 'solid',
    borderWidth: 1,
    marginBottom: 15,
    height: 90,
  },
  errorRowUpload: {
    borderRadius: 10,
    borderColor: '#F24E1E',
    borderStyle: 'solid',
    borderWidth: 1,
  },
  errorTextbox: {
    flex: 0.9,
    outlineStyle: 'none',
  },
  fileDescriptionInput: {
    flex: 0.9,
    outlineStyle: 'none',
    backgroundColor: '#EBEBEB',
    borderRadius: 10,
    padding: 10,
  },
  buttonDelete: {
    flex: 0.1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorMsgRow: {
    marginBottom: 10,
  },
  errorText: {
    color: '#F24E1E',
    fontSize: 10.76,
    fontWeight: '500',
    // lineHeight: 19.37,
  },
  buttonConfirm: {
    backgroundColor: 'red',
    width: 75,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonCancel: {
    backgroundColor: 'lightgray',
    width: 75,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
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
    marginBottom: '3%'
  },
  buttonConfirmText: {
    color: '#FFFFFF',
    alignItems: 'center',
    fontSize: 13,
    fontWeight: '500',
  },
  buttonText: {
    color: '#FFFFFF',
    alignItems: 'center',
    fontSize: 15,
    fontWeight: '500',
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
  textDuplicateFiles: {
    color: '#696969',
    fontWeight: '500',
    textAlign: "center"
  },
  containerTextModal: {
    alignItems: 'center',
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
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
  buttonUploadFiles: {
    alignItems: 'center',
    marginTop: '0.5%'
  },
  duplicateRow: {
    marginBottom: '1%',
    marginTop: 10
  },
  close: {
    color: 'white',
    textAlign: 'center',
  },
  button: {
    color: '#ffffff',
    backgroundColor: '#4F85FF',
    borderRadius: 10,
    width: 100,
    alignSelf: 'center',
  },
});

export default UploadScreen;