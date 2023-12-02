import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  CheckBox,
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

const CreateQuestion = ({ route }) => {
  const navigation = useNavigation();
  const { quizId } = route.params;
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState('Short Answer');
  const [inputs, setInputs] = useState(['']);
  const [answer, setAnswer] = useState('');
  const [isTrue, setIsTrue] = useState(false);
  const [options, setOptions] = useState([
    { id: 'A', text: '', isCorrect: false },
    { id: 'B', text: '', isCorrect: false },
    { id: 'C', text: '', isCorrect: false },
    { id: 'D', text: '', isCorrect: false },
  ]);
  const [questions, setQuestions] = useState([]);
  // console.log(quizId + "CreateQuestions1");
  const questionTypes = [
    'Short Answer',
    'Multiple Choice Question',
    'True or False',
    'Fill In The Blanks',
    'Another Type',
  ];
  const handleCreateQuestion = async () => {
    // Create a new question object based on the user's input
    const newQuestion = {
      questionText,
      questionType,
      answer: questionType === 'True or False' ? answer : '', // Set answer or an empty string
      isTrue: questionType === 'True or False' ? isTrue : false, // Set isTrue or false
      //multipleChoiceAnswers: questionType === "Multiple Choice Question" ? multipleChoiceAnswers : [], // Set multipleChoiceAnswers or an empty array
      inputs: questionType === 'Fill In The Blanks' ? inputs : [], // Set inputs or an empty array
      options:
        questionType === 'Multiple Choice Question' ? options.map((option) => option.text) : [], // Set options for multiple-choice questions or an empty array
    };

    // Assign properties to the question object based on the question type
    // if (questionType === 'Multiple Choice Question') {
    //   // For multiple choice, include options and the answer indicating the correct option
    //   newQuestion.options = options.map((option) => option.text);
    //   newQuestion.answer = options.find((option) => option.isCorrect)?.text || '';
    // } 
    if (questionType === 'Multiple Choice Question') {
      const allOptionsFilled = options.every(option => option.text.trim() !== '');
      const isAnswerChosen = options.some(option => option.isCorrect);
  
      if (!allOptionsFilled) {
        alert('Please fill in all option texts.');
        return;
      }
  
      if (!isAnswerChosen) {
        alert('Please select a correct answer.');
        return;
      }
    } else if (questionType === 'True or False') {
      // For true or false, the answer is a boolean
      newQuestion.answer = answer; // Assuming answer is either 'True' or 'False'
    } else if (questionType === 'Fill In The Blanks') {
      // For fill in the blanks, include the array of inputs
      newQuestion.fillInTheBlanks = inputs;
    } else {
      // For any other type, include a single answer
      newQuestion.answer = answer;
    }

    // Make a POST request to your server to create the question
    try {
      const response = await fetch(`http://localhost:4000/quizzes/addQuestion/${quizId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newQuestion),
      });
      // console.log(response);

      if (response.ok) {
        // Question created successfully, you can handle the response here
        const result = await response.json();
        // console.log('Question created:', result);

        // Clear the form after adding the question
        setQuestionText('');
        setQuestionType('');
        setAnswer('');
        setIsTrue(false);
        setOptions([
          { id: 'A', text: '', isCorrect: false },
          { id: 'B', text: '', isCorrect: false },
          { id: 'C', text: '', isCorrect: false },
          { id: 'D', text: '', isCorrect: false },
        ]);
        setInputs(['']);
      } else {
        // Handle error response
        console.error('Failed to create question:', response.statusText);
      }
      navigation.navigate('QuestionsOverviewScreen', {
        quizId: quizId,
        newQuestion: newQuestion,
      });
    } catch (error) {
      console.error('Error creating question:', error);
    }
  };

  const handleTrueFalseChange = (newValue) => {
    setIsTrue(newValue);
    setAnswer(newValue ? 'True' : 'False');
  };

  const handleOptionTextChange = (text, index) => {
    const updatedOptions = options.map((option, i) => {
      if (i === index) {
        return { ...option, text: text };
      }
      return option;
    });
    setOptions(updatedOptions);
  };

  const handleSetCorrectAnswer = (index) => {
    const updatedOptions = options.map((option, i) => ({
      ...option,
      isCorrect: i === index,
    }));
    setOptions(updatedOptions);
  };

  // Define a function to add a new input field
  const addInput = () => {
    setInputs([...inputs, '']);
  };

  // Define a function to remove an input field at a given index
  const removeInput = (index) => {
    const updatedInputs = [...inputs];
    updatedInputs.splice(index, 1);
    setInputs(updatedInputs);
  };

  // Define a function to handle text input changes for fill-in-the-blanks
  const handleInputTextChange = (text, index) => {
    const updatedInputs = [...inputs];
    updatedInputs[index] = text;
    setInputs(updatedInputs);
  };

  // Define a function to check if the form is valid
  const isFormValid = () => {
    if (questionType === 'Short Answer') {
      return questionText.trim() !== '' && answer.trim() !== '';
    } else if (questionType === 'Multiple Choice Question') {
      const allOptionsFilled = options.every((option) => option.text.trim() !== '');
      const isAnswerChosen = options.some((option) => option.isCorrect);

      return questionText.trim() !== '' && allOptionsFilled && isAnswerChosen;
    } else if (questionType === 'True or False') {
      return questionText.trim() !== '' && (isTrue || !isTrue);
    } else if (questionType === 'Fill In The Blanks') {
      return (
        questionText.trim() !== '' &&
        inputs.every((input) => input.trim() !== '')
      );
    }

    // For other types, consider them valid if questionText is not empty
    return questionText.trim() !== '';
  };

  return (
    <ImageBackground
      source={require('../../assets/backgroundCloudyBlobsFull.png')}
      resizeMode="cover"
      style={styles.container}
    >
      <View style={styles.containerFile}>
        <Text style={styles.selectFiles}>Question</Text>
        <Picker
          selectedValue={questionType}
          testID="questionTypePicker"
          onValueChange={(itemValue) => {
            setQuestionType(itemValue);
            setAnswer('');
            setIsTrue(false);
            setOptions([
              // Make sure this is an array
              { id: 'A', text: '', isCorrect: false },
              { id: 'B', text: '', isCorrect: false },
              { id: 'C', text: '', isCorrect: false },
              { id: 'D', text: '', isCorrect: false },
            ]);
          }}
          style={styles.questionTypePicker}
        >
          {questionTypes.map((type, index) => (
            <Picker.Item key={index} label={type} value={type} />
          ))}
        </Picker>
        <TextInput
          style={styles.questionInput}
          placeholder="Enter your question here"
          value={questionText}
          onChangeText={(text) => setQuestionText(text)}
        />
        {questionType === 'True or False' && (
          <View style={styles.checkboxContainer}>
            <View style={styles.checkboxRow}>
              <CheckBox value={isTrue} onValueChange={() => handleTrueFalseChange(true)} />
              <Text>True</Text>
            </View>
            <View style={styles.checkboxRow}>
              <CheckBox value={!isTrue} onValueChange={() => handleTrueFalseChange(false)} />
              <Text>False</Text>
            </View>
          </View>
        )}
        {questionType === 'Multiple Choice Question' && (
          <View style={styles.multipleChoiceContainer}>
            {options.map((option, index) => (
              <View key={option.id} style={styles.multipleChoiceRow}>
                <TextInput
                  style={styles.multipleChoiceInput}
                  testID={`option-input-${option.id}`}
                  placeholder={`Option ${option.id}`}
                  value={option.text}
                  onChangeText={(text) => handleOptionTextChange(text, index)}
                />
                <CheckBox
                  value={option.isCorrect}
                  onValueChange={() => handleSetCorrectAnswer(index)}
                />
              </View>
            ))}
          </View>
        )}

        {questionType === 'Fill In The Blanks' && (
          <>
            <Text>Enter words you want to be blank here:</Text>
            {inputs.map((input, index) => (
              <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                  style={styles.answerInput}
                  placeholder="Enter Word"
                  value={input}
                  onChangeText={(text) => handleInputTextChange(text, index)} // Call handleInputTextChange
                />
                <TouchableOpacity
                  style={styles.removeButton}
                  testID="remove-blank-input"
                  onPress={() => removeInput(index)}
                >
                  <Text style={styles.buttonText}>-</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addButton} testID="add-blank-input" onPress={addInput}>
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </>
        )}
        {questionType !== 'True or False' &&
          questionType !== 'Multiple Choice Question' &&
          questionType !== 'Fill In The Blanks' && (
            <TextInput
              style={styles.answerInput}
              placeholder="Enter the answer here"
              value={answer}
              onChangeText={(text) => setAnswer(text)}
            />
          )}
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => {
          navigation.navigate('QuestionsOverviewScreen', {
            quizId: quizId,
          });
        }}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.createQuestionButton,
          isFormValid()
            ? styles.createQuestionButtonEnabled
            : styles.createQuestionButtonDisabled,
        ]}
        onPress={() => {
          handleCreateQuestion(); // Call the function to create the question
          navigation.navigate('QuestionsOverviewScreen', {
            quizId: quizId,
          });
        }}
        disabled={!isFormValid()} // Disable the button if the form is not valid
      >
        <Text style={styles.createQuestionButtonText} testID="create-question">
          Create Question
        </Text>
      </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  cancelButton: {
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
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  createQuestionButton: {
    backgroundColor: '#407BFF',
    width: 190,
    height: 45,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createQuestionButtonEnabled: {
    backgroundColor: '#407BFF', // Keep the original color when enabled
  },
  createQuestionButtonDisabled: {
    backgroundColor: '#D3D3D3', // Set a light grey color when disabled
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
  questionTypePicker: {
    width: '80%',
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    margin: 20,
  },
  questionInput: {
    width: '80%',
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    margin: 20,
  },
  multipleChoiceContainer: {
    width: '80%',
    margin: 20,
  },
  multipleChoiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  multipleChoiceInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  checkboxContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    margin: 20,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  createQuestionButton: {
    backgroundColor: '#407BFF',
    width: 190,
    height: 45,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createQuestionButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#407BFF',
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    margin: 5,
  },
  removeButton: {
    backgroundColor: 'red',
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12.5,
    marginLeft: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CreateQuestion;
