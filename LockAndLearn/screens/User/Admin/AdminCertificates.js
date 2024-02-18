import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { CreateResponsiveStyle, DEVICE_SIZES, minSize } from 'rn-responsive-styles';

const AdminCertificates = () => {
  const styles = useStyles();
  const [certificates, setCertificates] = useState([]);
  const [certificateId, setCertificateId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAcceptModalVisible, setIsAcceptModalVisible] = useState(false);
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);

  // Fetch pending certificates on component mount
  useEffect(() => {
    fetchAllPendingCertificates();
  }, []);

  // Fetch all pending certificates from the server
  const fetchAllPendingCertificates = async () => {
    try {
      const response = await fetch('http://localhost:4000/certificates/uploadCertificates/pending');
      if (response.ok) {
        const data = await response.json();
        setCertificates(data.uploadedPendingCertificates);
      } else {
        console.error('Failed to fetch certificates:', response.status);
      }
    } catch (error) {
      console.error('Error fetching certificates:', error);
    }
  };

  // Function to handle accepting a certificate
  const handleAcceptCertificate = async (userId) => {
    const response = await fetch(
      `http://localhost:4000/certificates/acceptUserCertificates/${userId}`,
      {
        method: 'PUT',
      }
    );

    if (response.ok) {
      // Remove accepted certificates from the list
      const updatedCertificates = certificates.filter(
        (certificate) => certificate.metadata.userId !== userId
      );
      setCertificates(updatedCertificates);
      closeAcceptModal();
    } else {
      console.error('Failed to delete certificate:', response.status);
    }
  };

  // Function to handle rejecting a certificate
  const handleRejectCertificate = async (certificateId) => {
    const response = await fetch(
      `http://localhost:4000/certificates/rejectCertificate/${certificateId}`,
      {
        method: 'PUT',
      }
    );

    if (response.ok) {
      // Remove rejected certificate from the list
      const updatedCertificates = certificates.filter(
        (certificate) => certificate._id !== certificateId
      );
      setCertificates(updatedCertificates);
      closeRejectModal();
    } else {
      console.error('Failed to delete certificate:', response.status);
    }
  };

  // Function to download certificate
  const downloadCertificate = async (fileName) => {
    const response = await fetch(
      `http://localhost:4000/certificates/uploadCertificates/${fileName}`,
      {
        method: 'GET',
      }
    );

    if (response.ok) {
      const test = await response.blob(); // Convert the response to a blob
      const url = URL.createObjectURL(test); // Create a URL for the blob
      const a = document.createElement('a'); // Create anchor element to trigger the download
      a.href = url;
      a.download = `${fileName}`;
      a.click();
    } else {
      console.error('Failed to download certificate: ', response.status);
    }
  };

  // Function to download tutor images
  const downloadTutorImage = async (imageName) => {
    const response = await fetch(`http://localhost:4000/certificates/uploadImages/${imageName}`, {
      method: 'GET',
    });

    if (response.ok) {
      const test = await response.blob(); // Convert the response to a blob
      const url = URL.createObjectURL(test); // Create a URL for the blob
      const a = document.createElement('a'); // Create anchor element to trigger the download
      a.href = url;
      a.download = `${imageName}`;
      a.click();
    } else {
      console.error('Failed to download image: ', response.status);
    }
  };

  // Function to open the reject modal
  const openRejectModal = (fileId) => {
    setCertificateId(fileId);
    setIsRejectModalVisible(true);
  };

  // Function to open the accept modal
  const openAcceptModal = (userId) => {
    setUserId(userId);
    setIsAcceptModalVisible(true);
  };

  // Function to close the reject modal
  const closeRejectModal = () => {
    setIsRejectModalVisible(false);
  };

  // Function to close the accept modal
  const closeAcceptModal = () => {
    setIsAcceptModalVisible(false);
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
                {/* <TouchableOpacity
                  testID={`certificateContainerTest-${index}`}
                  onPress={() => downloadCertificate(file.filename)}
                > */}
                <TouchableOpacity
                  testID={`certificateContainerTest-${index}`}
                  style={styles.fileName}
                  onPress={() => downloadCertificate(file.filename)}
                >
                  {file.filename}
                </TouchableOpacity>
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
                {file.metadata && file.metadata.verificationImages && (
                  <Text style={styles.fileDetail}>
                    Images:
                    {file.metadata.verificationImages.map((file) => (
                      <TouchableOpacity onPress={() => downloadTutorImage(file.filename)}>
                        {file.filename}
                      </TouchableOpacity>
                    ))}
                  </Text>
                )}
                {file.metadata && file.metadata.status && (
                  <Text style={styles.fileStatusDetail}>
                    Status: <Text style={styles.statusText}>{file.metadata.status}</Text>
                  </Text>
                )}
                {/* </TouchableOpacity> */}
                <View style={styles.divider}></View>
                <View style={styles.buttons}>
                  <TouchableOpacity
                    testID="acceptTest"
                    onPress={() => {
                      openAcceptModal(file.metadata.userId);
                    }}
                  >
                    <Text style={styles.acceptButton}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    testID="rejectTest"
                    onPress={() => {
                      openRejectModal(file._id);
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
        {/* Displaying the accept modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isAcceptModalVisible}
          onRequestClose={closeAcceptModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                Are you sure you want to accept this application? This will accept all the user's
                applications and allow the user to become a tutor.
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  onPress={() => handleAcceptCertificate(userId)}
                  style={styles.confirmAcceptButton}
                >
                  <Text style={styles.confirmButtonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={closeAcceptModal} style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {/* Displaying the reject modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isRejectModalVisible}
          onRequestClose={closeRejectModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                Are you sure you want to reject this application?
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  onPress={() => handleRejectCertificate(certificateId)}
                  style={styles.confirmRejectButton}
                >
                  <Text style={styles.confirmButtonText}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={closeRejectModal} style={styles.cancelButton}>
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
    fileStatusDetail: {
      color: 'grey',
      fontSize: 14,
      fontWeight: 'bold',
    },
    statusText: {
      color: 'blue',
      fontStyle: 'italic',
    },
    divider: {
      borderBottomWidth: 1,
      borderBottomColor: 'grey',
      marginVertical: 5,
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
    confirmAcceptButton: {
      backgroundColor: '#228B22',
      padding: 10,
      borderRadius: 10,
      marginRight: 70,
      justifyContent: 'center',
    },
    confirmRejectButton: {
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

export default AdminCertificates;
