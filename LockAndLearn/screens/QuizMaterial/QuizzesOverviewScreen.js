import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import { getUser } from '../../components/AsyncStorage';

const QuizzesOverviewScreen = ({ route }) => {
  const navigation = useNavigation();
  const user = route.params.userId;

  const [quizzes, setQuizzes] = useState([]);
  const [deleteConfirmationModalVisible, setDeleteConfirmationModalVisible] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState(null);

  const fetchQuizzes = async () => {
    const user = await getUser();
    try {
      const response = await fetch('http://localhost:4000/quizzes/allQuizzes/' + user._id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        const data = await response.json();
        setQuizzes(data);
      } else {
        console.error('Error fetching quizzes');
      }
    } catch (error) {
      console.error('Network error');
    }
  };

  const deleteQuiz = (quizId) => {
    setSelectedQuizId(quizId);
    setDeleteConfirmationModalVisible(true);
  };

  const confirmDelete = async () => {
    if (selectedQuizId) {
      try {
        const response = await fetch(`http://localhost:4000/quizzes/deleteQuiz/${selectedQuizId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          console.log('Quiz Deleted');
          setDeleteConfirmationModalVisible(false);
          fetchQuizzes();
        } else {
          console.error('Error deleting quiz');
        }
      } catch (error) {
        console.error('Network error', error);
      }
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [user]);

  return (
    <ImageBackground
      source={require('../../assets/backgroundCloudyBlobsFull.png')}
      resizeMode="cover"
      style={styles.container}
    >
      <View style={styles.containerFile}>
        <Text style={styles.selectFiles}>Quizzes</Text>
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.quizList}>
            {quizzes.map((quiz) => (
              <View key={quiz._id} style={styles.quizItemContainer}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('QuestionsOverviewScreen', {
                      quizId: quiz._id,
                    });
                  }}
                >
                  <Text style={styles.quizItem}>{quiz.name}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteQuiz(quiz._id)}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteButtonText} testID="delete-button-x">
                    X
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
        <View style={styles.createQuizButtonContainer}>
          <TouchableOpacity
            style={styles.createQuizButton}
            onPress={() => {
              navigation.navigate('CreateQuiz');
            }}
          >
            <Text style={styles.createQuizButtonText}>Create</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        isVisible={deleteConfirmationModalVisible}
        onBackdropPress={() => setDeleteConfirmationModalVisible(false)}
        transparent={true}
        style={{ elevation: 20, justifyContent: 'center', alignItems: 'center' }}
      >
        <View style={styles.deleteConfirmationModal}>
          <Text style={styles.confirmationText}>
            Are you sure you want to delete this quiz?
          </Text>
          <View style={styles.confirmationButtons}>
            <TouchableOpacity
              testID='deleteConfirmationModal'
              onPress={() => {
                confirmDelete();
                setDeleteConfirmationModalVisible(false);
              }}
              style={[styles.confirmButton, { marginRight: 10 }]}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setDeleteConfirmationModalVisible(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  deleteConfirmationModal: {
    width: '50%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmationText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  confirmationButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  confirmButton: {
    backgroundColor: '#F24E1E',
    padding: 10,
    borderRadius: 10,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#407BFF',
    padding: 10,
    borderRadius: 10,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
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
  quizList: {
    marginTop: '5%',
    alignItems: 'center',
  },
  quizItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quizItem: {
    fontSize: 18,
    marginVertical: 10,
    color: '#333',
    borderColor: '#333',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    width: 30,
    height: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  createQuizButtonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  createQuizButton: {
    backgroundColor: '#407BFF',
    width: 190,
    height: 45,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createQuizButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContainer: {
    height: 300,
    width: 300,
  },
});

export default QuizzesOverviewScreen;
