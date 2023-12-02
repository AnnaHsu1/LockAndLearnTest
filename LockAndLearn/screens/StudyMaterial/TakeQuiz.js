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
// import { getUser } from '../../components/AsyncStorage';

const TakeQuiz = ({ route }) => {
  const navigation = useNavigation();

  const [quizzes, setQuizzes] = useState([]);

  const fetchQuizzes = async () => {
    console.log("AAAAAAAAAA FETCH QUIZZES");
    try {
      const response = await fetch('http://localhost:4000/quizzes/allQuizzes', {
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

  useEffect(() => {
    fetchQuizzes();
  }, []);

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
                <TouchableOpacity>
                  <Text style={styles.quizItem}>{quiz.name}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.takeQuizButton}
                  onPress={() => {
                    navigation.navigate('DisplayQuizzScreen', {
                      quizId: quiz._id,
                      quizLength: quiz.questions.length,
                      questionIndex: 0,
                    });
                  }}
                >
                  <Text style={styles.takeQuizButtonText} testID="delete-button-x">
                    Take Quiz
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
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
  takeQuizButton: {
    backgroundColor: '#007bff', // A shade of blue
    paddingVertical: 10, // Vertical padding
    paddingHorizontal: 20, // Horizontal padding
    borderRadius: 5, // Rounded corners
    alignItems: 'center', // Center items horizontally
    justifyContent: 'center', // Center items vertically
    margin: 10, // Margin around the button
    width: 150, // Width of the button
  },
  takeQuizButtonText: {
    color: 'white', // Text color
    fontSize: 18, // Font size
    fontWeight: 'bold', // Font weight
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
    width: 500,
  },
});

export default TakeQuiz;
