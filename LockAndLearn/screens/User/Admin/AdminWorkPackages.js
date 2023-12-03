import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { CreateResponsiveStyle, DEVICE_SIZES, minSize } from 'rn-responsive-styles';

const AdminWorkPackages = ({ route, navigation }) => {
  const styles = useStyles();
  const [workPackages, setWorkPackages] = useState([]);
  const [instructors, setInstructors] = useState({});
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

        // Fetch instructors and quizzes for each work package
        const fetchData = await Promise.all(
          data.map(async (workPackage) => {
            const instructorResponse = await fetchInstructor(workPackage.instructorID);

            // Assuming workPackage has a quizzes array containing quiz IDs
            const quizResponses = await Promise.all(
              workPackage.quizzes.map(async (quizId) => {
                const quizResponse = await fetchQuizById(quizId);
                return { [quizId]: quizResponse };
              })
            );

            return {
              workPackage,
              instructor: { [workPackage.instructorID]: instructorResponse },
              quizzes: quizResponses.reduce((acc, quiz) => ({ ...acc, ...quiz }), {}),
            };
          })
        );

        // Combine fetched instructor and quiz data
        const mergedData = fetchData.reduce(
          (acc, item) => {
            const { workPackage, instructor, quizzes } = item;
            return {
              workPackages: [...acc.workPackages, workPackage],
              instructors: { ...acc.instructors, ...instructor },
              quizzes: { ...acc.quizzes, ...quizzes },
            };
          },
          { workPackages: [], instructors: {}, quizzes: {} }
        );

        setWorkPackages(mergedData.workPackages);
        setInstructors(mergedData.instructors);
        // Handle quiz data as needed, you can set it to state or perform any other actions
      } else {
        console.error('Failed to fetch work packages:', response.status);
      }
    } catch (error) {
      console.error('Error fetching work packages:', error);
    }
  };

  const fetchInstructor = async (instructorID) => {
    try {
      const response = await fetch(`http://localhost:4000/users/getUser/${instructorID}`);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        return data;
      } else {
        console.error(`Failed to fetch instructor for ID ${instructorID}:`, response.status);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching instructor for ID ${instructorID}:`, error);
      return null;
    }
  };

  const fetchQuizById = async (quizId) => {
    try {
      const response = await fetch(`http://localhost:4000/quizzes/quiz/${quizId}`);
      if (response.ok) {
        const data = await response.json();
        setQuizzes((prevQuizzes) => ({ ...prevQuizzes, [quizId]: data }));
        return data;
      } else {
        console.error(`Failed to fetch quiz for ID ${quizId}:`, response.status);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching quiz for ID ${quizId}:`, error);
      return null;
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
                <Text style={styles.workPackageTitle}>
                  {workPackage.name} - {workPackage.grade} - {workPackage.subcategory}
                </Text>
                <View style={styles.instructorInfoContainer}>
                  <Text style={styles.greyText}>
                    {instructors[workPackage.instructorID]?.firstName}{' '}
                    {instructors[workPackage.instructorID]?.lastName}
                  </Text>
                  <Text style={styles.greyText}>
                    {instructors[workPackage.instructorID]?.email}
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
              <Text style={styles.modalText}>
                Are you sure you want to delete this work package?
              </Text>
              <Text style={styles.modalText}>Enter your password to confirm deletion</Text>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                secureTextEntry={true}
                value={password}
                onChangeText={(text) => setPassword(text)}
              />
              {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={handleDeletePress}>
                  <Text style={styles.modalButton}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={closeModal}>
                  <Text style={styles.modalButton}>Cancel</Text>
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
      width: '80%',
      alignItems: 'center',
    },
    modalText: {
      fontSize: 18,
      marginBottom: 20,
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
      marginVertical: 10,
      height: 80,
      justifyContent: 'center',
      minWidth: 100,
    },
    modalButtons: {
      borderRadius: 10,
      marginVertical: 10,
      height: 50,
      justifyContent: 'center',
      minWidth: 100,
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
