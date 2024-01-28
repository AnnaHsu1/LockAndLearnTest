import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { CreateResponsiveStyle, DEVICE_SIZES, minSize } from 'rn-responsive-styles';

const AdminQuizzes = ({ route, navigation }) => {
  const styles = useStyles();
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  //fetching quizzes to be able to view
  const fetchQuizzes = async () => {
    try {
      const response = await fetch('http://localhost:4000/quizzes/allQuizzes');
      if (response.ok) {
        const data = await response.json();
        setQuizzes(data);
      } else {
        console.error('Failed to fetch quizzes:', response.status);
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const deleteQuiz = async (quizId) => {
    try {
      const response = await fetch(`http://localhost:4000/quizzes/deleteQuiz/${quizId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        const updatedQuizzes = quizzes.filter((quiz) => quiz._id !== quizId);
        setQuizzes(updatedQuizzes);
        closeModal();
      } else {
        console.error('Failed to delete quiz:', response.status);
      }
    } catch (error) {
      console.error('Error deleting quiz:', error);
    }
  };

  const openModal = (quizId) => {
    setSelectedQuiz(quizId);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setSelectedQuiz(null);
    setIsModalVisible(false);
    setPassword('');
    setPasswordError('');
  };


  const handleDeletePress = async () => {
    try {
      // Call the admin login endpoint to check the admin password
      const response = await fetch('http://localhost:4000/users/adminCheckPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Admin login successful, proceed with quiz deletion
        deleteQuiz(selectedQuiz);
      } else {
        // Admin login failed
        setPasswordError(data.msg || 'Incorrect password. Please try again.');
      }
    } catch (error) {
      console.error('Error handling delete press:', error);
      setPasswordError('Error checking password. Please try again.');
    }
  };



  useEffect(() => {
    fetchQuizzes();
  }, []);

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Quizzes</Text>
        </View>

        {/* Displaying the list of quizzes inside the ScrollView */}
        <ScrollView style={styles.scrollView}>
          {quizzes.length > 0 ? (
            quizzes.map((quiz, index) => (
              <View key={index} style={styles.quizContainer}>
                <Text style={styles.quizTitle}>{quiz.name}</Text>
                <Text style={styles.quizDetail}>ID: {quiz._id}</Text>
                <Text style={styles.quizDetail}>Created by: {quiz.userId}</Text>
                <TouchableOpacity onPress={() => openModal(quiz._id)}>
                  <Text style={styles.deleteButton}>Delete</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.noQuizzesText}>No quizzes available</Text>
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
              <Text style={styles.modalText}>Are you sure you want to delete this quiz?</Text>
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
    quizDetail: {
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
    quizContainer: {
      backgroundColor: '#ffffff',
      borderRadius: 10,
      marginVertical: 10,
      padding: 10,
    },
    quizTitle: {
      color: '#4F85FF',
      fontSize: 18,
      marginBottom: 5,
      fontWeight: 'bold',
    },
    noQuizzesText: {
      color: '#ffffff',
      fontSize: 18,
      textAlign: 'center',
      marginTop: 20,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
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
    modalTextConfirm: {
      fontSize: 14,
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
    deleteButton: {
      color: 'red',
      marginTop: 10,
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
    scrollView: {
      paddingRight: 20,
    }
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

export default AdminQuizzes;
