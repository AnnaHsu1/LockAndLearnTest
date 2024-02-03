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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const QuizzesOverviewScreen = ({ route }) => {
  const navigation = useNavigation();
  const user = route.params.userId;

  const [quizzes, setQuizzes] = useState([]);
  const [deleteConfirmationModalVisible, setDeleteConfirmationModalVisible] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState(null);

  const [aiResponse, setAIResponse] = useState('');

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

  const fetchAIResponse = async (quiz) => {
    const url = 'https://gpts4u.p.rapidapi.com/chatbase';

    // Call the getAllQuizContent function and log its result
    const allQuizContent = getAllQuizContent(quiz);
    console.log('All Quiz Content:', allQuizContent);

    const introText = `Analyze the following quiz content for inappropriate material suitable for children. If any inappropriate content is detected, say "true"; otherwise, say "false". Only say one word.

    Quiz Content:`;

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': '5933339a3bmshb94ea9f04d12ecep1bf05cjsnfeaeca742c45',
        'X-RapidAPI-Host': 'gpts4u.p.rapidapi.com',
      },
      body: JSON.stringify([
        {
          role: 'user',
          content: introText + allQuizContent,
        },
      ]),
    };

    try {
      const response = await fetch(url, options);
      const result = await response.text();
      console.log('AI Response:', result);

      // Check if AI response contains "false" (ignoring case)
      const isApproved = !result.toLowerCase().includes('false');

      // Update the quiz's approved status
      const updatedQuizzes = quizzes.map((q) =>
        q._id === quiz._id ? { ...q, approved: isApproved } : q
      );
      setQuizzes(updatedQuizzes);

      setAIResponse(result);
    } catch (error) {
      console.error('Error fetching AI response:', error);
    }
  };

  const getAllQuizContent = (quiz) => {
    const contentArray = [];

    // Add quiz name to the content
    contentArray.push(`Quiz Name: ${quiz.name}`);

    // Add questions and their details to the content
    quiz.questions.forEach((question, index) => {
      contentArray.push(`\n${quiz.name}`);
      contentArray.push(`\nQuestion ${index + 1}: ${question.questionText}`);
      contentArray.push(`Answer: ${question.answer}`);

      // Add options array to the content
      contentArray.push('Options:');
      question.options.forEach((option, optionIndex) => {
        contentArray.push(`- Option ${optionIndex + 1}: ${option}`);
      });

      // Add inputs array to the content
      contentArray.push('Inputs:');
      question.inputs.forEach((input, inputIndex) => {
        contentArray.push(`- Input ${inputIndex + 1}: ${input}`);
      });
    });

    // Concatenate all content into a single string
    const allQuizContent = contentArray.join('\n');
    return allQuizContent;
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
                  style={{ flex: 1 }}
                >
                  <Text style={styles.quizItem}>{quiz.name}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => fetchAIResponse(quiz)}>
                  {quiz.approved ? (
                    <MaterialIcons name="check-circle" size={40} color="green" />
                  ) : (
                    <MaterialIcons name="published-with-changes" size={40} color="orange" />
                  )}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteQuiz(quiz._id)}>
                  <MaterialIcons testID="delete-button-x" name="delete" size={40} color="red" />
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
            <Text style={styles.createQuizButtonText}>Create New Quiz</Text>
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
          <Text style={styles.confirmationText}>Are you sure you want to delete this quiz?</Text>
          <View style={styles.confirmationButtons}>
            <TouchableOpacity
              testID="deleteConfirmationModal"
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
  selectFiles: {
    color: '#696969',
    fontSize: 36,
    fontWeight: '500',
    marginTop: 20, // Add top margin for more space
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
    width: '80%',
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
    width: '90%',
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#407BFF', // Blue border
    color: '#407BFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  quizItem: {
    flex: 1, // Take up all available space
    fontSize: 22, // Bigger, as per your requirement
    fontWeight: 'bold', // Make text bold
    fontFamily: 'Arial', // Example of a boxy font
    color: '#407BFF', // Same color as in the other screen
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: 'red',
    width: 30,
    height: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createQuizButtonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  createQuizButton: {
    backgroundColor: '#407BFF',
    width: 190,
    height: 45,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  createQuizButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContainer: {
    height: 300,
    width: '70%', // Increase width
  },
});

export default QuizzesOverviewScreen;
