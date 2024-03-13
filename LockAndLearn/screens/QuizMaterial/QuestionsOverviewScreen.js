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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';


const QuestionsOverviewScreen = ({ route }) => {
  const navigation = useNavigation();
  const quizId = route.params.quizId;
  const newQuestion = route.params.newQuestion;
  const [questions, setQuestions] = useState([]);
  const userId = route.params.userId; // Add this line to extract userId


  const fetchQuiz = async () => {
    try {
      const response = await fetch(`https://lockandlearn.onrender.com/quizzes/quiz/${quizId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        const data = await response.json();
        setQuestions(data.questions);
      } else {
        console.error('Error fetching quizzes');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [newQuestion]);

  const deleteQuestion = async (questionIndex) => {
    // Filter out the question with the specified ID to delete it
    try {
      const response = await fetch(
        `https://lockandlearn.onrender.com/quizzes/deleteQuestion/${quizId}/${questionIndex}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        const data = await response.json();
        console.log('Updated quiz after deletion:', data);
        setQuestions(data.questions); // Update local state with the updated questions array
      } else {
        console.error('Error deleting question');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/backgroundCloudyBlobsFull.png')}
      resizeMode="cover"
      style={styles.container}
    >
      <View style={styles.containerFile}>
        <Text style={styles.selectFiles}>Your questions</Text>
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.questionList}>
            {questions &&
              questions.map((question, index) => (
                <View key={index} style={styles.questionItemContainer}>
                  <Text style={styles.questionItem}>{question.questionText}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('EditQuestion', {
                        quizId: quizId,
                        questionIndex: index,
                      });
                    }}
                  >
                    <MaterialIcons name="edit" size={40} color="green" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      // Delete the question
                      deleteQuestion(index);
                    }}
                  >
                    <MaterialIcons testID="delete-button-x" name="delete" size={40} color="red" />
                  </TouchableOpacity>
                </View>
              ))}
          </View>
        </ScrollView>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.navigate('QuizzesOverviewScreen', { userId })} // Pass userId
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>


          <View style={styles.addQuestionButtonContainer}>
            <TouchableOpacity
              style={styles.addQuestionButton}
              onPress={() => {
                // Navigate to the QuestionsOverviewScreen and pass the workPackageId
                navigation.navigate('CreateQuestion', {
                  quizId: quizId, // pass id
                });
              }}
            >
              <Text style={styles.addQuestionButtonText}>Add Question</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

QuestionsOverviewScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      quizId: PropTypes.string.isRequired,
      newQuestion: PropTypes.object, // or a more specific shape if you have a defined structure for a question
      userId: PropTypes.string // assuming userId is a string, and not required
    }).isRequired
  }).isRequired
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: 'gray',
    width: 190,
    height: 45,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
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
    color: '#696969', // Or any other color used in the other screen
    fontSize: 36, // Adjust size as per the other screen
    fontWeight: '500',
    marginTop: 20, // Add space at the top
    textAlign: 'center', // Center text if it's the case in the other screen
  },
  questionList: {
    marginTop: '5%',
    alignItems: 'center',
  },
  questionItemContainer: {
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
  questionItem: {
    flex: 1, // Take up all available space
    fontSize: 22, // Bigger, as per your requirement
    fontWeight: 'bold', // Make text bold
    fontFamily: 'Arial', // Example of a boxy font
    color: '#407BFF', // Same color as in the other screen
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: 'red', // Or a consistent color from the other screen
    width: 30,
    height: 20,
    borderRadius: 5, // Less rounded if that's the style on the other screen
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: 'green', // Or use a consistent color from the other screen
    width: 30,
    height: 20,
    borderRadius: 5, // Less rounded if that's the style on the other screen
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },

  addQuestionButtonContainer: {

    alignItems: 'center',
  },
  addQuestionButton: {
    backgroundColor: '#407BFF',
    width: 190,
    height: 45,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addQuestionButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContainer: {
    height: 300, // Or match the height from the other screen
    width: '70%', // Use full width for consistency
  },
});

export default QuestionsOverviewScreen;
