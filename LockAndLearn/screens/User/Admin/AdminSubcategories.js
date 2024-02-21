import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import { CreateResponsiveStyle, DEVICE_SIZES, minSize } from 'rn-responsive-styles';
import { Icon } from 'react-native-paper';

const AdminSubcategories = ({ navigation }) => {
  const styles = useStyles();
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isNewSubcategoryModalVisible, _setIsNewSubcategoryModalVisible] = useState(false);
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [selectedGradeForNewSubcategory, setSelectedGradeForNewSubcategory] = useState(null);
  const [_password, setPassword] = useState('');
  const [_passwordError, setPasswordError] = useState('');
  const [isAddSubcategoryModalVisible, setIsAddSubcategoryModalVisible] = useState(false);
  const [_selectedSubcategoryIndex, setSelectedSubcategoryIndex] = useState(null);
  const [visibleGrades, setVisibleGrades] = useState({});
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deletePasswordError, setDeletePasswordError] = useState('');
  const [isSubcategoryDeleteModalVisible, setIsSubcategoryDeleteModalVisible] = useState(false);
  const [selectedSubcategoryToDelete, setSelectedSubcategoryToDelete] = useState(null);

  useEffect(() => {
    // Fetch subcategories when the component mounts
    fetchSubcategories();
  }, []);

  const fetchSubcategories = async () => {
    try {
      const response = await fetch('https://data.mongodb-api.com/app/lock-and-learn-xqnet/endpoint/fetchAllSubcategories');
      if (response.ok) {
        const data = await response.json();
        setSubcategories(data);
      } else {
        console.error('Failed to fetch subcategories:', response.status);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const handleDeleteConfirmation = async () => {
    try {
      // Call the admin password check endpoint
      const response = await fetch('http://localhost:4000/users/adminCheckPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: deletePassword }),
      });

      const data = await response.json();

      if (response.ok) {
        // Admin password check successful, proceed with subcategory deletion
        const responseDelete = await fetch(
          `https://data.mongodb-api.com/app/lock-and-learn-xqnet/endpoint/deleteSelectedSubcategory?subcategoryId=${selectedSubcategory}`,
          {
            method: 'DELETE',
          }
        );

        if (responseDelete.ok) {
          // Subcategory deleted successfully, update the subcategories state
          const updatedSubcategories = subcategories.filter(
            (sub) => sub._id !== selectedSubcategory
          );
          setSubcategories(updatedSubcategories);
          closeDeleteModal();
        } else {
          console.error('Failed to delete subcategory:', responseDelete.status);
        }
      } else {
        // Admin password check failed
        setDeletePasswordError(data.msg || 'Incorrect password. Please try again.');
      }
    } catch (error) {
      console.error('Error handling delete press:', error);
      setDeletePasswordError('Error checking password. Please try again.');
    }
  };

  const handleCreatePress = async () => {
    try {
      // Call the createCourse endpoint with the new subcategory name
      const response = await fetch('https://data.mongodb-api.com/app/lock-and-learn-xqnet/endpoint/createCourseAdmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseName: newSubcategoryName,
        }),
      });

      if (response.ok) {
        // Subcategory created successfully, fetch updated subcategories
        fetchSubcategories();
        closeModal();
      } else {
        console.error('Failed to create subcategory:', response.status);
      }
    } catch (error) {
      console.error('Error creating subcategory:', error);
    }
  };

  const handleAddSubcategoryPress = async () => {
    try {
      if (!selectedSubcategory) {
        console.error('No subcategory selected.');
        return;
      }

      const response = await fetch('https://data.mongodb-api.com/app/lock-and-learn-xqnet/endpoint/addSubcategoryToGrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subcategoryId: selectedSubcategory._id,
          course: selectedSubcategory.name,
          grade: selectedGradeForNewSubcategory,
          subcategoryName: newSubcategoryName,
        }),
      });

      if (response.ok) {
        // Update the subcategories array to add the new subcategory to the selected grade
        const updatedSubcategories = [...subcategories];
        const courseIndex = updatedSubcategories.findIndex(
          (course) => course._id === selectedSubcategory._id
        );

        updatedSubcategories[courseIndex].grades[selectedGradeForNewSubcategory].push(
          newSubcategoryName
        );

        setSubcategories(updatedSubcategories);
        closeNewSubcategoryModal();

        // Reset the newSubcategoryName to an empty string
        setNewSubcategoryName('');
      } else {
        console.error('Failed to add subcategory to grade:', response.status);
      }
    } catch (error) {
      console.error('Error adding subcategory to grade:', error);
    }
  };

  const toggleGradesVisibility = (subcategoryId) => {
    setVisibleGrades((prevVisibleGrades) => ({
      ...prevVisibleGrades,
      [subcategoryId]: !prevVisibleGrades[subcategoryId],
    }));
  };

  const deleteSubcategoryFromGrade = (subcategoryId, grade, subcategoryIndex) => {
    setSelectedSubcategoryToDelete({
      subcategoryId,
      grade,
      subcategoryIndex,
    });
    setIsSubcategoryDeleteModalVisible(true);
  };

  const handleSubcategoryDeleteConfirmation = async () => {
    try {
      // Call the admin password check endpoint
      const response = await fetch('http://localhost:4000/users/adminCheckPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: deletePassword }), // Use the admin password
      });

      const data = await response.json();

      if (response.ok) {
        // Admin password check successful, proceed with subcategory deletion
        const responseDelete = await fetch(
          `http://localhost:4000/subcategories/deleteSubcategoryFromGrade/${selectedSubcategoryToDelete.subcategoryId}/${selectedSubcategoryToDelete.grade}/${selectedSubcategoryToDelete.subcategoryIndex}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (responseDelete.ok) {
          // Subcategory deleted successfully, update the subcategories state
          const updatedSubcategories = subcategories.map((sub) => {
            if (sub._id === selectedSubcategoryToDelete.subcategoryId) {
              const updatedGrades = { ...sub.grades };
              updatedGrades[selectedSubcategoryToDelete.grade].splice(
                selectedSubcategoryToDelete.subcategoryIndex,
                1
              ); // Remove the subcategory at the specified index
              return { ...sub, grades: updatedGrades };
            }
            return sub;
          });

          setSubcategories(updatedSubcategories);
          setIsSubcategoryDeleteModalVisible(false);
        } else {
          console.error(
            'Failed to delete subcategory from grade:',
            selectedSubcategoryToDelete.subcategoryId,
            selectedSubcategoryToDelete.grade,
            selectedSubcategoryToDelete.subcategoryIndex,
            responseDelete.status
          );
        }
      } else {
        // Admin password check failed
        setDeletePasswordError(data.msg || 'Incorrect password. Please try again.');
      }
    } catch (error) {
      console.error('Error handling subcategory delete press:', error);
      setDeletePasswordError('Error checking password. Please try again.');
    }
  };

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setNewSubcategoryName('');
    setPassword('');
    setPasswordError('');
  };

  const openAddSubcategoryModal = (gradeIndex, grade, selectedSubcategory) => {
    setSelectedSubcategory(selectedSubcategory);
    setSelectedSubcategoryIndex(gradeIndex);
    setSelectedGradeForNewSubcategory(grade);
    setIsAddSubcategoryModalVisible(true);
  };

  const closeNewSubcategoryModal = () => {
    setSelectedSubcategoryIndex(null);
    setSelectedGradeForNewSubcategory(null);
    setIsAddSubcategoryModalVisible(false);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalVisible(false);
    setDeletePassword('');
    setDeletePasswordError('');
  };

  const closeSubcategoryDeleteModal = () => {
    setIsSubcategoryDeleteModalVisible(false);
    setDeletePassword('');
    setDeletePasswordError('');
  };

  const openSubcategoryDeleteModal = (subcategoryId) => {
    setSelectedSubcategory(subcategoryId);
    setIsDeleteModalVisible(true);
  };

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Subjects</Text>
          <TouchableOpacity onPress={openModal} style={styles.createButton}>
            <Text style={styles.createButtonText}>Create</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.scrollView}>
          {subcategories.length > 0 ? (
            subcategories.map((subcategory, index) => (
              <View key={index} style={styles.subcategoryContainer}>
                <View style={styles.subcategoryHeader}>
                  <TouchableOpacity onPress={() => toggleGradesVisibility(subcategory._id)}>
                    <Text style={styles.subcategoryTitle}>{subcategory.name}</Text>
                  </TouchableOpacity>

                  {/* Display "Delete" button on the same level as the subject name and on the far right */}
                  <TouchableOpacity onPress={() => openSubcategoryDeleteModal(subcategory._id)}>
                    <Icon source="delete-outline" size={20} color={'#F24E1E'} />
                  </TouchableOpacity>
                </View>

                {/* Displaying the list of grades for the subcategory */}
                {visibleGrades[subcategory._id] &&
                  typeof subcategory.grades === 'object' &&
                  Object.keys(subcategory.grades).length > 0 ? (
                  Object.entries(subcategory.grades).map(([grade, value], gradeIndex) => (
                    <View key={gradeIndex} style={styles.gradeContainer}>
                      <View style={styles.gradeContent}>
                        <Text style={styles.gradeText}>Grade {grade}</Text>
                        {/* "Add Subcategory" button */}
                        <TouchableOpacity
                          onPress={() => openAddSubcategoryModal(gradeIndex, grade, subcategory)}
                        >
                          <Icon source="plus-circle-outline" size={20} color={'#4CAF50'} />
                        </TouchableOpacity>
                      </View>

                      {/* Display each subcategory as a vertical list */}
                      <View style={styles.subcategoryList}>
                        {value.map((subcategoryName, subcategoryIndex) => (
                          <View key={subcategoryIndex} style={styles.subcategoryListItem}>
                            <View style={styles.subcategoryContent}>
                              <Text style={styles.subcategoryText}>{subcategoryName}</Text>
                              <View style={styles.deleteButtonContainer}>
                                <TouchableOpacity
                                  onPress={() =>
                                    deleteSubcategoryFromGrade(
                                      subcategory._id,
                                      grade,
                                      subcategoryIndex
                                    )
                                  }
                                >
                                  <Icon source="close-circle-outline" size={20} color={'#F24E1E'} />
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                        ))}
                      </View>
                    </View>
                  ))
                ) : (
                  <Text style={styles.gradeText}></Text>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.noSubcategoriesText}>No subcategories available</Text>
          )}
        </ScrollView>

        {/* MODALS ======================================================================================= */}
        {/* Modal for subcategory creation */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Enter the name for the new subcategory:</Text>
              <TextInput
                style={styles.passwordInput}
                placeholder="Subcategory Name"
                value={newSubcategoryName}
                onChangeText={(text) => setNewSubcategoryName(text)}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={handleCreatePress}>
                  <Text style={styles.modalButton}>Create</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={closeModal}>
                  <Text style={styles.modalButton}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal for adding subcategory to a grade */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isNewSubcategoryModalVisible}
          onRequestClose={closeNewSubcategoryModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                Enter the name for the new subcategory in Grade {selectedGradeForNewSubcategory}:
              </Text>
              <TextInput
                style={styles.passwordInput}
                placeholder="Subcategory Name"
                value={newSubcategoryName}
                onChangeText={(text) => setNewSubcategoryName(text)}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={handleAddSubcategoryPress}>
                  <Text style={styles.modalButton}>Add Subcategory</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={closeNewSubcategoryModal}>
                  <Text style={styles.modalButton}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isAddSubcategoryModalVisible}
          onRequestClose={closeNewSubcategoryModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                Enter the name for the new subcategory in Grade {selectedGradeForNewSubcategory}:
              </Text>
              <TextInput
                style={styles.passwordInput}
                placeholder="Subcategory Name"
                value={newSubcategoryName}
                onChangeText={(text) => setNewSubcategoryName(text)}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={handleAddSubcategoryPress}>
                  <Text style={styles.modalButton}>Add Subcategory</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={closeNewSubcategoryModal}>
                  <Text style={styles.modalButton}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {/* Modal for delete confirmation */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isDeleteModalVisible}
          onRequestClose={closeDeleteModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Are you sure you want to delete this subject?</Text>
              <Text style={styles.modalTextConfirm}>Enter your password to confirm deletion</Text>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                secureTextEntry={true}
                value={deletePassword}
                onChangeText={(text) => setDeletePassword(text)}
              />
              {deletePasswordError ? (
                <Text style={styles.errorText}>{deletePasswordError}</Text>
              ) : null}
              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={handleDeleteConfirmation} style={styles.confirmButton}>
                  <Text style={styles.confirmButtonText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={closeDeleteModal} style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {/* Modal for delete confirmation */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isSubcategoryDeleteModalVisible}
          onRequestClose={closeSubcategoryDeleteModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                Are you sure you want to delete this subcategory?
              </Text>
              <Text style={styles.modalTextConfirm}>Enter your password to confirm deletion</Text>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                secureTextEntry={true}
                value={deletePassword}
                onChangeText={(text) => setDeletePassword(text)}
              />
              {deletePasswordError ? (
                <Text style={styles.errorText}>{deletePasswordError}</Text>
              ) : null}
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  onPress={handleSubcategoryDeleteConfirmation}
                  style={styles.confirmButton}
                >
                  <Text style={styles.confirmButtonText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={closeSubcategoryDeleteModal} style={styles.cancelButton}>
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
    scrollView: {
      paddingRight: 20,
    },
    subcategoryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    subcategoryText: {
      color: 'grey',
    },
    subcategoryListItem: {
      marginLeft: 10,
    },
    gradeContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    subcategoryContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    deleteButtonContainer: {
      marginLeft: 'auto',
    },
    subcategoryTextContainer: {
      flex: 1,
    },
    deleteSubcategoryButton: {
      color: '#D32F2F',
      fontSize: 14,
      marginTop: 5,
    },
    subcategoryContainer: {
      backgroundColor: '#fff',
      padding: 15,
      marginBottom: 15,
      borderRadius: 8,
      elevation: 2,
    },
    subcategoryTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#4F85FF',
    },
    gradeContainer: {
      marginTop: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
      paddingBottom: 10,
    },
    gradeText: {
      color: '#333',
      fontSize: 18,
      marginBottom: 8,
    },
    addSubcategoryButton: {
      color: '#4CAF50',
      fontSize: 14,
      paddingBottom: 10,
    },
    deleteButton: {
      color: '#D32F2F',
    },
    noSubcategoriesText: {
      fontSize: 16,
      color: '#555',
      textAlign: 'center',
      marginTop: 20,
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
      color: '#333',
    },
    passwordInput: {
      height: 40,
      borderColor: '#ddd',
      borderWidth: 1,
      marginBottom: 15,
      paddingHorizontal: 10,
      borderRadius: 5,
      backgroundColor: '#fff',
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
    modalButton: {
      color: '#4CAF50',
      fontSize: 16,
      fontWeight: 'bold',
      padding: 10,
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
    modalText: {
      fontSize: 23,
      marginBottom: 20,
      textAlign: 'center',
    },
    modalTextConfirm: {
      fontSize: 14,
      marginBottom: 20,
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
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '2%',
      paddingBottom: 20,
    },
    title: {
      color: '#ffffff',
      fontSize: 24,
      textAlign: 'center',
    },
    button: {
      color: '#4F85FF',
      backgroundColor: '#FFFFFF',
      borderRadius: 10,
      marginVertical: 10,
      height: 40,
      paddingHorizontal: 10,
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
    text: {
      color: '#4F85FF',
      fontSize: 20,
    },
    options: {
      flex: 0.75,
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    createButton: {
      backgroundColor: '#ffffff',
      borderRadius: 10,
      marginTop: 10,
      paddingVertical: 10,
      paddingHorizontal: 30,
      justifyContent: 'center',
    },
    createButtonText: {
      color: '#4CAF50',
      fontWeight: 'bold',
      fontSize: 16,
      textAlign: 'center',
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

export default AdminSubcategories;
