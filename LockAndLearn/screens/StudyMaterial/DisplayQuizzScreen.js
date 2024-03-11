import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  CheckBox,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import { set } from 'mongoose';

const DisplayQuizzScreen = ({ route }) => {
  const navigation = useNavigation();
  const childID = route.params.child_ID;
  const quizId = route.params.quizId;
  const questionIndex = route.params.questionIndex;
  const quizLength = route.params.quizLength;
  const packageID = route.params.packageId;
  const subject = route.params.subject;
  const [questions, setQuestions] = useState(route.params.questions || []);

  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState('Short Answer');
  const [inputs, setInputs] = useState(['']);
  const [inputsAns, setInputsAns] = useState(['']);

  const [answer, setAnswer] = useState('');
  const [isTrue, setIsTrue] = useState(null);

  // array to record all answers child takes during the quiz
  const [answers, setAnswers] = useState(Array(quizLength).fill(null));
  console.log('ANSWERS ARRAY ', answers);

  // array to record all solutions to questions
  const [solutions, setSolutions] = useState(Array(quizLength).fill(null));

  // will be needed for CORRECTION OF QUIZ
  const [isTrueAnswer, setIsTrueAnswer] = useState(false);

  const [options, setOptions] = useState([
    { id: 'A', text: '', isCorrect: false },
    { id: 'B', text: '', isCorrect: false },
    { id: 'C', text: '', isCorrect: false },
    { id: 'D', text: '', isCorrect: false },
  ]);

  // willbe needed for CORRECTION OF QUIZ
  const [optionsAnswer, setOptionsAnswer] = useState([
    { id: 'A', text: '', isCorrect: false },
    { id: 'B', text: '', isCorrect: false },
    { id: 'C', text: '', isCorrect: false },
    { id: 'D', text: '', isCorrect: false },
  ]);

  // console.log(quizId + "CreateQuestions1");
  const questionTypes = [
    'Short Answer',
    'Multiple Choice Question',
    'True or False',
    'Fill In The Blanks',
    'Another Type',
  ];

  // Function to grade the quiz
  const handleGrade = (answersArray, solutionsArray) => {
    console.log('ANSWERS FROM HANDLEGRADE ', answersArray);
    console.log('SOLUTIONS FROM HANDLEGRADE ', solutionsArray);

    let counter = 0;
    const length = quizLength;
    for (let i = 0; i < length; i++) {
      if (Array.isArray(answersArray[i]) && Array.isArray(solutionsArray[i])) {
        // Compare arrays of strings
        if (
          answersArray[i].length === solutionsArray[i].length &&
          answersArray[i].every((val, idx) => val === solutionsArray[i][idx])
        ) {
          counter++;
        }
      } else if (answersArray[i] === solutionsArray[i]) {
        // Compare strings
        counter++;
      }
    }
    console.log('COUNTER', counter);
    return counter;
  };

  const handleTrueFalseChange = (newValue, questionIndex) => {
    setIsTrue(newValue);
    setAnswer(newValue ? 'True' : 'False');

    // SAVES CORRECT ANSWER FOR MCQ QUESTIONS IN ANSWERS ARRAY
    const newArray = [...answers];
    newArray[questionIndex] = newValue ? 'True' : 'False';
    setAnswers(newArray);
  };

  const handleSetAnswer = (text, questionIndex) => {
    // SAVES CORRECT ANSWER FOR MCQ QUESTIONS IN ANSWERS ARRAY
    setAnswer(text);
    const newArray = [...answers];
    newArray[questionIndex] = text;
    setAnswers(newArray);
  };

  const handleSetCorrectAnswer = (index, questionIndex, textAnswer) => {
    const updatedOptions = options.map((option, i) => ({
      ...option,
      isCorrect: i === index,
    }));
    setOptions(updatedOptions);
    setAnswer(updatedOptions[index].text); // Assuming you want to store the correct answer's text

    // SAVES CORRECT ANSWER FOR MCQ QUESTIONS IN ANSWERS ARRAY
    const newArray = [...answers];
    newArray[questionIndex] = textAnswer;
    setAnswers(newArray);
  };

  // Define a function to handle text input changes for fill-in-the-blanks
  const handleInputTextChange = (text, index, questionIndex) => {
    const updatedInputs = [...inputsAns];
    updatedInputs[index] = text;
    setInputsAns(updatedInputs);

    // SAVES CORRECT ANSWER FOR FILL IN THE BLANKS QUESTIONS IN ANSWERS ARRAY
    const newArray = [...answers];
    newArray[questionIndex] = inputs;
    setAnswers(newArray);
  };
  // Fetch the current question from the server
  const fetchQuestion = async () => {
    try {
      const response = await fetch(
        `https://data.mongodb-api.com/app/lock-and-learn-xqnet/endpoint/getQuestion?quizId=${quizId}&questionIndex=${questionIndex}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Response:', response);

      if (response.status === 200) {
        const question = await response.json();
        console.log('Question:', question);
        setQuestions((questions) => [...questions, question]);
        console.log('QUESTIONS ARRAY', questions);
        let ans = '';
        setQuestionText(question.questionText || ''); // Ensuring a string is always set
        setQuestionType(question.questionType || '');
        setAnswer(question.answer || '');

        // For multiple choice questions, ensure that each option text is a string
        if (question.questionType === 'Multiple Choice Question') {
          // Hypothetical transformation if the API response is different
          const newOptions = question.options.map((option, index) => ({
            id: String.fromCharCode(65 + index),
            text: option, // assuming the API returns a simple array of strings
            isCorrect: question.answer === option,
          }));
          setOptionsAnswer(newOptions);
          ans = question.answer;
        }
        if (question.questionType === 'True or False') {
          setIsTrueAnswer(question.answer === 'True'); // Assuming 'answer' is the field where true/false is stored
          // setAnswer(question.answer); // The answer should already be "True" or "False"
          ans = question.answer;
        }
        if (question.questionType === 'Short Answer' || question.questionType === 'Another Type') {
          // setAnswer(question.answer || ''); // Assuming 'answer' contains the short answer text
          ans = question.answer;
        } else if (question.questionType === 'Fill In The Blanks') {
          console.log('INPUTS', question.inputs);
          setInputs(question.inputs || ['']); // Make sure you receive an array of strings for blanks
          // setAnswer(question.inputs || ['']);
          ans = question.inputs || [''];
        }
        console.log('ANSWER FOR THIS QUESTION->', ans);
        const newArray = [...solutions]; // Create a copy of the array
        newArray[questionIndex] = ans; // Insert the item at the specified index
        setSolutions(newArray);
        console.log('SOLUTIONS ARRAY', solutions);
      } else {
        console.error('Error fetching question. Status:', response.status);
        // It's a good practice to handle different statuses to give more context to errors
        const errorData = await response.json();
        console.error('Error details:', errorData.error);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  const fetchThreshold = async () => {
    // add part fetching threshold
    const response = await fetch(
      `https://data.mongodb-api.com/app/lock-and-learn-xqnet/endpoint/getPreviousPassingGrades?childId=${childID}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const data = await response.json();
    console.log('DATAAAAAAA', data);

    const subjectObject = data.find((sub) => sub.name === subject);
    const threshold =
      subjectObject && (subjectObject.grade || subjectObject.grade === 0)
        ? subjectObject.grade
        : 50;

    console.log('THRESHOLD', threshold);

    return threshold;
  };

  const saveQuizResult = async (numOfCorrectAnswers) => {
    console.log('num of correct answers', numOfCorrectAnswers);
    const threshold = await fetchThreshold();
    console.log('THRESHOLDDDDDDD', threshold);
    const grade = (numOfCorrectAnswers / quizLength) * 100;
    const status = threshold > grade ? 'failed' : 'passed';
    try {
      const newChildQuizResult = {
        childID: childID,
        quizID: quizId,
        answers: answers,
        score: grade,
        status: status,
        date: Date.now(),
        packageID: packageID,
      };
      console.log('NEW QUIZ RESULT OBJECT', newChildQuizResult);

      const response = await fetch(
        'https://data.mongodb-api.com/app/lock-and-learn-xqnet/endpoint/addChildQuizResults',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newChildQuizResult),
        }
      );

      if (response.status === 201 || response.status === 200) {
        console.log('newChildQuizResult successfully saved in database!');
      }
      else {
        const data = await response.json();
        console.log('Error creating newChildQuizResult:', data);
      }
    } catch (error) {
      console.error('Error creating newChildQuizResult:', error);
      // Handle network errors or server issues
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, [questionIndex]);

  return (
    <ImageBackground
      source={require('../../assets/backgroundCloudyBlobsFull.png')}
      resizeMode="cover"
      style={styles.container}
    >
      <View style={styles.containerFile}>
        <View style={styles.contentContainer}>
          <Text style={styles.selectFiles}>Question {questionIndex + 1}</Text>
          <Text style={styles.questionText}>{questionText}</Text>
          {questionType === 'True or False' && (
            <View style={styles.checkboxContainer}>
              <View style={styles.checkboxRow}>
                <CheckBox
                  value={answers[questionIndex] === 'True'}
                  testID="option-True"
                  onValueChange={() => handleTrueFalseChange(true, questionIndex)}
                />
                <Text style={styles.trueNfalseText}>True</Text>
              </View>
              <View style={styles.checkboxRow}>
                <CheckBox
                  value={answers[questionIndex] === 'False'}
                  testID="option-False"
                  onValueChange={() => handleTrueFalseChange(false, questionIndex)}
                />
                <Text style={styles.trueNfalseText}>False</Text>
              </View>
            </View>
          )}

                    {questionType === "Multiple Choice Question" && (
                        <View style={styles.multipleChoiceContainer}>
                            {optionsAnswer.map((option, index) => (
                                <View key={option.id} style={styles.multipleChoiceRow}>
                                    <Text
                                        style={styles.multipleChoiceText}
                                        testID={`option-text-${option.id}`}
                                    >
                                        {option.text}
                                    </Text>
                                    <CheckBox
                                        value={answers[questionIndex] === option.text}
                                        testID={`option-correct-${option.id}`} // Add testID for each option checkbox
                                        onValueChange={() => handleSetCorrectAnswer(index, questionIndex, option.text)}
                                    />

                                </View>
                            ))}
                        </View>
                    )}
                    {questionType === "Fill In The Blanks" && (
                        <>
                            {/* <Text>Enter words you want to be blank here:</Text> */}
                            {inputs.map((input, index) => (
                                <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <TextInput
                                        style={styles.answerInput}
                                        placeholder="Enter Word"
                                        value={inputsAns[index]}
                                        onChangeText={(text) =>
                                            handleInputTextChange(text, index, questionIndex)}
                                    />
                                </View>
                            ))}
                        </>
                    )}
                    {questionType !== "True or False" && questionType !== "Multiple Choice Question" && questionType !== "Fill In The Blanks" && (
                        <TextInput
                            style={styles.answerInput}
                            placeholder="Enter the answer here"
                            value={answers[questionIndex] || ""}
                            onChangeText={(text) => handleSetAnswer(text, questionIndex)}
                        />
                    )}
                </View>
                <View style={styles.buttonContainer}>
                    {questionIndex >= 1 && (
                        <TouchableOpacity
                            style={styles.previousButton}
                            onPress={() => {
                                navigation.navigate('DisplayQuizzScreen', {
                                    quizId: quizId,
                                    quizLength: quizLength,
                                    questionIndex: questionIndex - 1,
                                    child_ID: childID,
                                    subject: subject,
                                    packageId: packageID,
                                });
                            }}
                        >
                            <Text style={styles.previousButtonText}>Previous</Text>
                        </TouchableOpacity>
                    )}
                    {questionIndex <= quizLength - 2 && (
                        <TouchableOpacity
                            style={styles.nextButton}
                            onPress={() => {
                                navigation.navigate('DisplayQuizzScreen', {
                                    quizId: quizId,
                                    quizLength: quizLength,
                                    questionIndex: questionIndex + 1,
                                    child_ID: childID,
                                    subject: subject,
                                    packageId: packageID,
                                });
                            }}
                        >
                            <Text style={styles.nextButtonText} testID='save-button'>Next</Text>
                        </TouchableOpacity>
                    )}
                    {questionIndex === quizLength - 1 && (
                        <TouchableOpacity
                            style={styles.finishQuizButton}
                            onPress={() => {
                                fetchQuestion();
                                const grade = handleGrade(answers, solutions);
                                saveQuizResult(grade);
                                navigation.navigate('QuizGradeScreen', {
                                    childID: childID,
                                    quizId: quizId,
                                    numOfCorrectAnswers: grade,
                                    quizLength: quizLength,
                                    answers: answers,
                                    solutions: solutions,
                                    questions: questions,
                                    subject: subject,
                                });
                            }}
                        >
                            <Text style={styles.finishQuizButtonText} testID='save-button'>Finish Quiz</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </ImageBackground>
    );
};

DisplayQuizzScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      quizId: PropTypes.string.isRequired,
      questionIndex: PropTypes.number.isRequired,
      quizLength: PropTypes.number.isRequired,
      questions: PropTypes.array, // Add more specific type details if possible
    }).isRequired,
  }).isRequired,
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
    width: '90%', // Set a fixed width for the container
    height: '90%',
    maxWidth: 800, // Optional: set a maximum width for larger screens
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: '5%',
    alignSelf: 'center', // Center the container
  },
  selectFiles: {
    color: '#696969',
    fontSize: 36,
    fontWeight: '500',
    marginTop: '1%',
  },
  questionText: {
    fontSize: 24,
    color: '#333',
    textAlign: 'left',
    marginTop: 50,
  },
  multipleChoiceContainer: {
    width: '80%',
    margin: 20,
  },
  multipleChoiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1, // Add a bottom border
    borderBottomColor: '#ccc', // Set the color of the border to gray
    paddingBottom: 10, // Add some padding at the bottom
  },
  multipleChoiceText: {
    flex: 1,
    height: 40,
    padding: 10,
    marginRight: 10,
    flexDirection: 'row',
    fontSize: 20,
    alignItems: 'center',
    marginVertical: 8,
  },
  trueNfalseText: {
    fontSize: 18, // Larger font size
    fontWeight: '500', // Medium font weight
    marginLeft: 10, // Add some space between the checkbox and the text
  },
  checkboxContainer: {
    marginVertical: 20, // Add vertical space around the whole container
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 20, // Add space between the rows
  },
  answerInput: {
    width: '80%',
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    margin: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // Aligns children to the right
    width: '100%', // Ensures the container takes the full width
    paddingHorizontal: 20, // Padding for spacing from the screen edge
    paddingBottom: 20,
  },
  contentContainer: {
    flex: 1, // Takes up all available space
    width: '100%',
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#407BFF',
    width: 190,
    height: 45,
    borderRadius: 9,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  finishQuizButton: {
    backgroundColor: '#1E4D8B',
    width: 190,
    height: 45,
    borderRadius: 9,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  finishQuizButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  previousButton: {
    backgroundColor: 'gray',
    width: 190,
    height: 45,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 10,
  },
  previousButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default DisplayQuizzScreen;
