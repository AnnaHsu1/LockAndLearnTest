import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getItem, getUser } from '../../components/AsyncStorage';

const CreateQuiz = () => {
  const [quizName, setQuizName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const createQuiz = async () => {
    try {
      setLoading(true);

      const userId = await getUser();

      if (!userId) {
        // Handle the case where userId is undefined
        console.log('User ID not found');
        return;
      }

      if (quizName.trim() === '') {
        // Show an alert or handle the case where the quiz name is empty
        return;
      }

      // Prepare the quiz object with the entered name and userId
      const newQuiz = {
        name: quizName,
        userId: userId, // Add userId to the quiz object
        questions: [], // Initially, the questions array is empty
      };

      // Send a POST request to create the quiz
      const response = await fetch('http://localhost:4000/quizzes/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newQuiz),
      });

      if (response.status === 200 || 201) {
        // Quiz created successfully, you can handle the response if needed

        // Navigate to the QuestionsOverviewScreen
        navigation.navigate('QuizzesOverviewScreen', {
          userId: userId, // Change this to your default value
        });
        setQuizName('');
      } else {
        // Handle errors or display a message
      }
    } catch (error) {
      console.error('Error creating quiz:', error);
      // Handle network errors or server issues
    } finally {
      setLoading(false);
    }
  };

  const cancelCreateQuiz = () => {
    const userId = getUser();
    // Navigate to the QuizzesOverviewScreen and pass the userId
    navigation.navigate('QuizzesOverviewScreen', {
      userId: userId,
    });
  };

  return (
    <ImageBackground
      source={require('../../assets/backgroundCloudyBlobsFull.png')}
      resizeMode="cover"
      style={styles.container}
    >
      <View style={styles.containerFile}>
        <Text style={styles.enterQuizName} testID="quiz-name">
          Enter Quiz Name
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Quiz Name"
          value={quizName}
          onChangeText={(text) => setQuizName(text)}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={cancelCreateQuiz}
            testID="cancel-create-quiz-button"
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.createQuizButton}
            onPress={createQuiz}
            disabled={loading}
            testID="create-quiz-button"
          >
            <Text style={styles.createQuizButtonText}>Create Quiz</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  cancelButton: {
    backgroundColor: 'gray',
    width: 120,
    height: 45,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cancelButtonText: {
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
    padding: 20, // Add padding to match the styling in QuizzesOverviewScreen
    shadowColor: '#000', // Adds shadow for depth
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  enterQuizName: {
    fontSize: 40, 
    marginBottom: 25,
    color: '#696969',
    alignSelf: 'center', 
    marginTop: 100,
  },
  input: {
    height: 60,
    width: '40%', 
    borderColor: '#407BFF', // Change to a blue color
    backgroundColor: '#E6F0FF', // Optional: Light blue background
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    alignSelf: 'center', // Center align the input
    borderRadius: 10, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    fontSize: 18, // Increase font size for the input text
    color: '#333', // Text color (optional: if you want to change the input text color)
    placeholderTextColor: '#C0C0C0',
  },
  createQuizButton: {
    backgroundColor: '#407BFF',
    width: 190,
    height: 45,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  createQuizButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default CreateQuiz;
