import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { CreateResponsiveStyle, DEVICE_SIZES, minSize } from 'rn-responsive-styles';

const AdminWorkPackages = ({ route, navigation }) => {
  const styles = useStyles();
  const [workPackages, setWorkPackages] = useState([]);
  const [quizzes, setQuizzes] = useState({});
  const [selectedWorkPackage, setSelectedWorkPackage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    // Fetch work packages when the component mounts
    fetchWorkPackages();
  }, []);

  const fetchWorkPackages = async () => {
    try {
      const response = await fetch('http://localhost:4000/workPackages/allWorkPackages');
      if (response.ok) {
        const data = await response.json();
        setWorkPackages(data);
      } else {
        console.error('Failed to fetch work packages:', response.status);
      }
    } catch (error) {
      console.error('Error fetching work packages:', error);
    }
  };

  const deleteWorkPackage = async (workPackageId) => {
    // Assuming there's an endpoint for deleting work packages
    try {
      const response = await fetch(`http://localhost:4000/workPackages/delete/${workPackageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Work package deleted successfully, update the workPackages state
        const updatedWorkPackages = workPackages.filter((wp) => wp._id !== workPackageId);
        setWorkPackages(updatedWorkPackages);
        closeModal();
      } else {
        console.error('Failed to delete work package:', response.status);
      }
    } catch (error) {
      console.error('Error deleting work package:', error);
    }
  };

  const openModal = (workPackageId) => {
    setSelectedWorkPackage(workPackageId);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setSelectedWorkPackage(null);
    setIsModalVisible(false);
    setPassword('');
    setPasswordError('');
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
        // Admin password check successful, proceed with work package deletion
        deleteWorkPackage(selectedWorkPackage);
      } else {
        // Admin password check failed
        setPasswordError(data.msg || 'Incorrect password. Please try again.');
      }
    } catch (error) {
      console.error('Error handling delete press:', error);
      setPasswordError('Error checking password. Please try again.');
    }
  };

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Work Packages</Text>
        </View>
        {/* Displaying the list of work packages */}
        <ScrollView style={styles.scrollView}>
          {workPackages.length > 0 ? (
            workPackages.map((workPackage, index) => (
              <View key={index} style={styles.workPackageContainer}>
                <TouchableOpacity
                  key={index.toString()}
                  onPress={() => navigation.navigate('AdminPackages', { workPackageId: workPackage._id })}
                >
                  <Text style={styles.workPackageTitle}>
                    {workPackage.name} - {workPackage.grade}
                  </Text>
                </TouchableOpacity>

                <View style={styles.instructorInfoContainer}>
                  <Text style={styles.greyText}>
                    {workPackage.instructorName}
                  </Text>
                  <Text style={styles.greyText}>
                    {workPackage.instructorEmail}
                  </Text>

                  <View style={styles.divider}></View>

                  {/* Display quizzes from the quizzes array */}
                  {workPackage.quizzes && workPackage.quizzes.length > 0 && (
                    <View style={styles.quizContainer}>
                      <Text style={styles.quizTitle}>Quizzes:</Text>
                      {workPackage.quizzes.map((quizId, quizIndex) => (
                        <Text key={quizIndex} style={styles.quizText}>
                          {quizzes[quizId]?.name}
                        </Text>
                      ))}
                    </View>
                  )}

                  {/* Display materials from the materials array */}
                  {workPackage.materials && workPackage.materials.length > 0 && (
                    <View style={styles.materialContainer}>
                      <Text style={styles.materialTitle}>Materials:</Text>
                      {workPackage.materials.map((material, materialIndex) => (
                        <Text key={materialIndex} style={styles.materialText}>
                          {material}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
                <TouchableOpacity onPress={() => openModal(workPackage._id)}>
                  <Text style={styles.deleteButton}>Delete</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.noWorkPackagesText}>No work packages available</Text>
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
              <Text style={styles.modalText}>Are you sure you want to delete this work package?</Text>
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
      </View>
    </View>
  );
};

const useStyles = CreateResponsiveStyle(
  {
    deleteButton: {
      color: 'red',
      marginTop: 10,
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
      fontSize: 23,
      marginBottom: 20,
      textAlign: 'center',
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      borderRadius: 10,
      marginVertical: 10,
      height: 50,
      justifyContent: 'center',
      minWidth: 100,
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
    materialContainer: {
      marginTop: 10,
    },
    materialTitle: {
      color: '#4F85FF',
      fontSize: 16,
      marginBottom: 5,
    },
    materialText: {
      color: 'grey',
      fontSize: 14,
    },
    quizContainer: {
      marginTop: 10,
    },
    quizTitle: {
      color: '#4F85FF',
      fontSize: 16,
      marginBottom: 5,
    },
    quizText: {
      color: 'grey',
      fontSize: 14,
    },
    divider: {
      borderBottomWidth: 1,
      borderBottomColor: 'grey',
      marginVertical: 5,
    },
    instructorInfoContainer: {
      marginTop: 1,
    },
    greyText: {
      color: 'grey',
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
      padding: 20,
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
      justifyContent: 'center',
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
    modalTextConfirm: {
      fontSize: 14,
      marginBottom: 20,
    },
    workPackageContainer: {
      backgroundColor: '#ffffff',
      borderRadius: 10,
      marginVertical: 10,
      padding: 10,
    },
    workPackageTitle: {
      color: '#4F85FF',
      fontSize: 18,
      marginBottom: 1,
      fontWeight: 'bold',
    },
    noWorkPackagesText: {
      color: '#ffffff',
      fontSize: 16,
      textAlign: 'center',
      marginTop: 20,
    },
    scrollView: {
      paddingRight: 20.
    }
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

export default AdminWorkPackages;
