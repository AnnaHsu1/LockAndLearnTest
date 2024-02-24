import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Modal, Alert, TextInput } from 'react-native';
import { CreateResponsiveStyle, DEVICE_SIZES, minSize } from 'rn-responsive-styles';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Icon } from 'react-native-paper';
import { Worker, Viewer } from '@react-pdf-viewer/core';

const AdminFiles = ({ route, navigation }) => {
  const styles = useStyles();
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [fileCreator, setFileCreator] = useState(null);
  const [isFileDetailsModalVisible, setIsFileDetailsModalVisible] = useState(false);
  const [pdf, setPdf] = useState(null);
  const [isPdfModalVisible, setPdfModalVisible] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState(null);

  const newPlugin = defaultLayoutPlugin({
    innerContainer: styles.customInnerContainer, // Customize inner container styles if needed
  });

  /**
   * Function to display a file.
   * Fetches a file from the server based on the provided file name and displays it.
   * It sets the state for the PDF URL and makes the PDF modal visible for viewing the file.
   * @param {string} fileName - The name of the file to be fetched and displayed.
   */
  const displayFile = async () => {
    if (selectedFileName) {
      const response = await fetch(`http://localhost:4000/files/uploadFiles/${selectedFileName}`, {
        method: 'GET',
      });
      if (response.ok) {
        const test = await response.blob();
        const url = URL.createObjectURL(test);
        setPdf(url);
        setPdfModalVisible(true);
      }
    }
  };

  // Function to fetch user by ID
  const fetchUserById = async (userId) => {
    try {
      const response = await fetch(`http://localhost:4000/users/getUser/${userId}`);
      if (response.ok) {
        const user = await response.json();
        setFileCreator(user);
      } else {
        console.error('Failed to fetch user details:', response.status);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const fetchFiles = async () => {
    try {
      const response = await fetch('http://localhost:4000/files/allFiles');
      if (response.ok) {
        const data = await response.json();
        setFiles(data.allFiles);
      } else {
        console.error('Failed to fetch files:', response.status);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const deleteFile = async (fileId) => {
    try {
      const response = await fetch(`http://localhost:4000/files/deleteUploadFiles/${fileId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // File deleted successfully, update the files state
        const updatedFiles = files.filter((file) => file._id !== fileId);
        setFiles(updatedFiles);
        closeModal();
      } else {
        console.error('Failed to delete file:', response.status);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const openModal = (fileId) => {
    setSelectedFile(fileId);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setSelectedFile(null);
    setIsModalVisible(false);
    setPassword('');
    setPasswordError('');
  };

  // New functions for file details modal
  const openFileDetailsModal = (fileName) => {
    setSelectedFileName(fileName);
    setIsFileDetailsModalVisible(true);

    // Fetch creator info when file details modal opens
    const file = files.find((file) => file.filename === fileName);
    if (file && file.metadata && file.metadata.userId) {
      fetchUserById(file.metadata.userId);
    }
  };

  const closeFileDetailsModal = () => {
    setIsFileDetailsModalVisible(false);
    setSelectedFileName(null);
  };

  const handleDeletePress = async () => {
    try {
      // Call the admin password check endpoint
      const response = await fetch('http://localhost:4000/users/adminCheckPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Admin password check successful, proceed with file deletion
        deleteFile(selectedFile);
      } else {
        // Admin password check failed
        setPasswordError(data.msg || 'Incorrect password. Please try again.');
      }
    } catch (error) {
      console.error('Error handling delete press:', error);
      setPasswordError('Error checking password. Please try again.');
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Study Material</Text>
        </View>

        {/* Displaying the list of files */}
        <ScrollView style={styles.fileListContainer}>
          {files.length > 0 ? (
            files.map((file, index) => (
              <View key={index} style={styles.fileContainer}>
                <TouchableOpacity onPress={() => openFileDetailsModal(file.filename)}>
                  <Text style={styles.fileName}>{file.filename}</Text>
                </TouchableOpacity>
                <Text style={styles.fileDetail}>ID: {file._id}</Text>
                <Text style={styles.fileDetail}>Uploaded: {file.uploadDate}</Text>
                {file.metadata && file.metadata.userId && (
                  <Text style={styles.fileDetail}>Created by: {file.metadata.userId}</Text>
                )}
                <TouchableOpacity onPress={() => openModal(file._id)}>
                  <Text style={styles.deleteButton}>Delete</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.noFilesText}>No files available</Text>
          )}
        </ScrollView>

        {/* Modal for deletion confirmation */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Are you sure you want to delete this file?</Text>
              <Text style={styles.modalTextConfirm}>Enter your password to confirm deletion</Text>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                secureTextEntry={true}
                value={password}
                onChangeText={(text) => setPassword(text)}
              />
              {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={handleDeletePress} style={styles.confirmButton}>
                  <Text style={styles.confirmButtonText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={closeModal} style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {/* Modal for file details */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isFileDetailsModalVisible}
          onRequestClose={closeFileDetailsModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>File Details</Text>

              {/* Display user details */}
              {fileCreator && (
                <View style={styles.fileCreatorDetails}>
                  <Text style={styles.fileDetail}>
                    Creator Name: {fileCreator.firstName} {fileCreator.lastName}
                  </Text>
                  <Text style={styles.fileDetail}>Creator Email: {fileCreator.email}</Text>
                  <Text style={styles.fileDetail}>Creator ID: {fileCreator._id}</Text>
                </View>
              )}

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  onPress={() => displayFile(selectedFileName)}
                  style={styles.viewFileButton}
                >
                  <Text style={styles.viewFileButtonText}>View File</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={closeFileDetailsModal} style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {/* PDF Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isPdfModalVisible}
          onRequestClose={() => setPdfModalVisible(false)}
        >
          <View style={styles.pdfModalContainer}>
            <View style={styles.pdfModalContent}>
              <TouchableOpacity
                onPress={() => setPdfModalVisible(false)}
                style={styles.CloseButton}
              >
                <Icon source="close-circle-outline" size={23} color={'#F24E1E'} />
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
      </View>
    </View>
  );
};

const useStyles = CreateResponsiveStyle(
  {
    viewFileButton: {
      backgroundColor: '#4CAF50',
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
      alignItems: 'center',
    },
    viewFileButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    fileCreatorDetails: {
      marginTop: 5,
      marginBottom: 10,
      borderTopWidth: 1,
      borderTopColor: '#ddd',
      paddingTop: 10,
    },
    passwordInput: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 15,
      paddingHorizontal: 10,
    },
    errorText: {
      color: 'red',
      fontSize: 14,
      marginBottom: 10,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 20,
      width: '50%',
      alignItems: 'center',
    },
    modalText: {
      fontSize: 18,
      marginBottom: 5,
      textAlign: 'center',
    },
    modalTextConfirm: {
      fontSize: 14,
      marginBottom: 20,
      textAlign: 'center',
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
    },
    modalButton: {
      color: '#4F85FF',
      fontSize: 16,
      fontWeight: 'bold',
      padding: 10,
    },
    fileDetail: {
      color: 'grey',
      fontSize: 14,
    },
    page: {
      backgroundColor: '#ffffff',
      maxWidth: '100%',
      flex: 1,
      alignItems: 'center',
    },
    container: {
      minWidth: '90%',
      minHeight: '65%',
      maxHeight: '90%',
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 20,
      paddingBottom: 20,
      marginTop: 20,
      borderRadius: 10,
      backgroundColor: '#4F85FF',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '2%',
      paddingBottom: 20,
    },
    title: {
      color: '#ffffff',
      fontSize: 24,
      textAlign: 'center',
      paddingTop: 15,
    },
    fileListContainer: {
      flexGrow: 1,
    },
    fileContainer: {
      backgroundColor: '#ffffff',
      borderRadius: 10,
      marginVertical: 10,
      padding: 10,
    },
    fileName: {
      color: '#4F85FF',
      fontSize: 18,
      marginBottom: 5,
      fontWeight: 'bold',
    },
    noFilesText: {
      color: '#ffffff',
      fontSize: 18,
      textAlign: 'center',
      marginTop: 20,
    },
    deleteButton: {
      color: 'red',
      marginTop: 10,
    },
    fileListContainer: {
      flexGrow: 1,
    },
    fileContainer: {
      backgroundColor: '#ffffff',
      borderRadius: 10,
      marginVertical: 10,
      padding: 10,
    },
    fileName: {
      color: '#4F85FF',
      fontSize: 18,
      marginBottom: 5,
      fontWeight: 'bold',
    },
    noFilesText: {
      color: '#ffffff',
      fontSize: 18,
      textAlign: 'center',
      marginTop: 20,
    },
    fileListContainer: {
      paddingRight: 20,
    },
    confirmButton: {
      backgroundColor: '#F24E1E',
      padding: 10,
      borderRadius: 10,
      marginRight: 70,
      justifyContent: 'center',
    },
    confirmButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    cancelButton: {
      backgroundColor: '#407BFF',
      padding: 10,
      borderRadius: 10,
      justifyContent: 'center',
    },
    cancelButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
  },
  {
    [minSize(DEVICE_SIZES.MD)]: {
      container: {
        minWidth: 500,
        width: 500,
      },
    },
  }
);

export default AdminFiles;
