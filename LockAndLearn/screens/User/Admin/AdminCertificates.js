import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { CreateResponsiveStyle, DEVICE_SIZES, minSize } from 'rn-responsive-styles';

const AdminCertificates = ({ route, navigation }) => {
  const styles = useStyles();
  const [certificates, setCertificates] = useState([]);
  const [certificateId, setCertificateId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchAllCertificates();
  }, []);

  const fetchAllCertificates = async () => {
    try {
      const response = await fetch('http://localhost:4000/certificates/uploadCertificates');
      if (response.ok) {
        const data = await response.json();
        setCertificates(data.uploadedCertificates);
      } else {
        console.error('Failed to fetch certificates:', response.status);
      }
    } catch (error) {
      console.error('Error fetching certificates:', error);
    }
  };

  const handleAcceptCertificate = async (userId) => {
    const response = await fetch(
      `http://localhost:4000/certificates/acceptUserCertificates/${userId}`,
      {
        method: 'PUT',
      }
    );

    if (response.ok) {
      console.log('Status is accepted!');
    }
  };

  const handleRejectCertificate = async (certificateId) => {
    const response = await fetch(
      `http://localhost:4000/certificates/rejectCertificate/${certificateId}`,
      {
        method: 'PUT',
      }
    );

    if (response.ok) {
      console.log('Status is rejected!');
    }
  };

  const downloadCertificate = async (fileName) => {
    console.log(fileName);
    const response = await fetch(
      `http://localhost:4000/certificates/uploadCertificates/${fileName}`,
      {
        method: 'GET',
      }
    );

    if (response.ok) {
      const test = await response.blob();
      const url = URL.createObjectURL(test);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}`;
      a.click();
    }
  };

  const openModal = (fileId) => {
    setCertificateId(fileId);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Certificates to Review</Text>
        </View>
        {/* Displaying the list of certificates */}
        <ScrollView>
          {certificates.length > 0 ? (
            certificates.map((file, index) => (
              <View key={index} style={styles.fileContainer}>
                <TouchableOpacity
                  testID={`certificateContainerTest-${index}`}
                  onPress={() => downloadCertificate(file.filename)}
                >
                  <Text style={styles.fileName}>{file.filename}</Text>
                  <Text style={styles.fileDetail}>Certificate ID: {file._id}</Text>
                  <Text style={styles.fileDetail}>Uploaded: {file.uploadDate}</Text>
                  {file.metadata && file.metadata.userId && (
                    <Text style={styles.fileDetail}>Tutor ID: {file.metadata.userId}</Text>
                  )}
                  {file.metadata && file.metadata.fullName && (
                    <Text style={styles.fileDetail}>Name: {file.metadata.fullName}</Text>
                  )}
                  {file.metadata && file.metadata.highestDegree && (
                    <Text style={styles.fileDetail}>
                      Highest Degree: {file.metadata.highestDegree}
                    </Text>
                  )}
                </TouchableOpacity>
                <View style={styles.divider}></View>
                <View style={styles.buttons}>
                  <TouchableOpacity
                    testID="acceptTest"
                    onPress={() => handleAcceptCertificate(file.metadata.userId)}
                  >
                    <Text style={styles.acceptButton}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    testID="rejectTest"
                    onPress={() => {
                      openModal(file._id);
                      console.log(file._id);
                    }}
                  >
                    <Text style={styles.rejectButton}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyCertificatesList}>No certificates to approve</Text>
          )}
        </ScrollView>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                Are you sure you want to reject this application?
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  onPress={() => handleRejectCertificate(certificateId)}
                  style={styles.confirmButton}
                >
                  <Text style={styles.confirmButtonText}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={closeModal} style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const useStyles = CreateResponsiveStyle(
  {
    page: {
      backgroundColor: '#ffffff',
      maxWidth: '100%',
      flex: 1,
      alignItems: 'center',
    },
    container: {
      minWidth: '90%',
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
    button: {
      color: '#4F85FF',
      backgroundColor: '#ffffff',
      borderRadius: 10,
      marginVertical: 10,
      height: 80,
      justifyContent: 'center',
      minWidth: 100,
    },
    buttons: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    fileContainer: {
      backgroundColor: '#ffffff',
      borderRadius: 10,
      marginVertical: 10,
      padding: 10,
    },
    emptyCertificatesList: {
      color: '#ffffff',
      fontSize: 18,
      textAlign: 'center',
      marginTop: 20,
    },
    bgRed: {
      backgroundColor: '#FF0000',
    },
    bgWhite: {
      backgroundColor: '#ffffff',
    },
    full_width: {
      minWidth: '100%',
    },
    bottomCloud: {
      display: 'flex',
      justifyContent: 'flex-end',
      width: '100%',
      height: 250,
      resizeMode: 'stretch',
    },
    text: {
      color: '#4F85FF',
      fontSize: 20,
    },
    options: {
      flex: 0.75,
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    link: {
      color: '#ffffff',
      fontSize: 12,
      textAlign: 'center',
      justifyContent: 'flex-end',
    },
    acceptButton: {
      fontWeight: 'bold',
      color: 'green',
      marginTop: 10,
    },
    rejectButton: {
      fontWeight: 'bold',
      color: 'red',
      marginTop: 10,
    },
    fileName: {
      color: '#4F85FF',
      fontSize: 20,
      marginBottom: 5,
      fontWeight: 'bold',
    },
    fileDetail: {
      color: 'grey',
      fontSize: 14,
    },
    divider: {
      borderBottomWidth: 1,
      borderBottomColor: 'grey',
      marginVertical: 5,
    },
    text: {
      color: '#696969',
      fontSize: 18,
      fontWeight: '300',
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
      bottomCloud: {
        width: '100%',
        height: 300,
        resizeMode: 'stretch',
        flex: 1,
      },
    },
  }
);

export default AdminCertificates;
