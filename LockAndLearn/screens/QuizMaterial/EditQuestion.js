import { StatusBar, StyleSheet, Text, View, ImageBackground, TextInput, TouchableOpacity, CheckBox } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from "@react-navigation/native";
import { Picker } from '@react-native-picker/picker';

const EditQuestion = ({ route }) => {
    const navigation = useNavigation();
    const quizId = route.params.quizId;
    const questionIndex = route.params.questionIndex;

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
    // console.log(quizId + "CreateQuestions1");
    const questionTypes = ["Short Answer", "Multiple Choice Question", "True or False", "Fill In The Blanks", "Another Type"];

    const handleTrueFalseChange = (newValue) => {
        setIsTrue(newValue);
        setAnswer(newValue ? "True" : "False");
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
        setAnswer(updatedOptions[index].text); // Assuming you want to store the correct answer's text
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

    const handleSaveQuestion = async () => {
        const updatedQuestion = {
            quizId: quizId,
            questionIndex: questionIndex,
            questionText: questionText,
            questionType: questionType,
            answer: answer, // This line will include the answer for the "Short Answer" question type
            options: options.map(option => option.text),
        };
        // const correctOption = options.find(option => option.isCorrect);
        // updatedQuestion.answer = correctOption ? correctOption.text : '';
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
        }
        else if (questionType === 'True or False') {
            updatedQuestion.answer = isTrue ? 'True' : 'False';
        } else if (questionType === 'Fill In The Blanks') {
            updatedQuestion.inputs = inputs; // Make sure this matches what your backend expects
        }

        try {
            const response = await fetch(`http://localhost:4000/quizzes/updateQuestion/${quizId}/${questionIndex}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedQuestion),
            });

            if (response.status === 200) {
                console.log('Question successfully updated.');
                navigation.navigate('QuestionsOverviewScreen', {
                    quizId: quizId,
                    newQuestion: updatedQuestion,
                });
            } else {
                console.error('Error updating question. Status:', response.status);
                // Handle the error (e.g., show an error message to the user)
            }
        } catch (error) {
            console.error('Network error:', error);
            // Handle network errors (e.g., show an error message to the user)
        }

        console.log(quizId + "xxxxxx" + questionIndex)
    };

    const fetchQuestion = async () => {
        try {
            const response = await fetch(`http://localhost:4000/quizzes/getQuestion/${quizId}/${questionIndex}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            console.log("Response:", response);

            if (response.status === 200) {
                const question = await response.json();

                setQuestionText(question.questionText || ''); // Ensuring a string is always set
                setQuestionType(question.questionType || '');
                setAnswer(question.answer || '');

                // For multiple choice questions, ensure that each option text is a string
                if (question.questionType === "Multiple Choice Question") {
                    // Hypothetical transformation if the API response is different
                    const newOptions = question.options.map((option, index) => ({
                        id: String.fromCharCode(65 + index),
                        text: option, // assuming the API returns a simple array of strings
                        isCorrect: question.answer === option,
                    }));
                    setOptions(newOptions);
                } if (question.questionType === "True or False") {
                    setIsTrue(question.answer === "True"); // Assuming 'answer' is the field where true/false is stored
                    setAnswer(question.answer); // The answer should already be "True" or "False"
                } if (question.questionType === "Short Answer") {
                    setAnswer(question.answer || ''); // Assuming 'answer' contains the short answer text
                }
                else if (question.questionType === "Fill In The Blanks") {
                    setInputs(question.inputs || ['']); // Make sure you receive an array of strings for blanks
                }
            } else {
                console.error("Error fetching question. Status:", response.status);
                // It's a good practice to handle different statuses to give more context to errors
                const errorData = await response.json();
                console.error("Error details:", errorData.error);
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    }

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

    useEffect(() => {
        fetchQuestion();
    }, []);

    return (
        <ImageBackground
            source={require('../../assets/backgroundCloudyBlobsFull.png')}
            resizeMode="cover"
            style={styles.container}
        >
            <View style={styles.containerFile}>
                <Text style={styles.selectFiles}>Question {questionIndex}</Text>
                <Picker
                    selectedValue={questionType}
                    testID="questionTypePicker"
                    onValueChange={(itemValue) => {
                        setQuestionType(itemValue);
                        setAnswer('');
                        setIsTrue(false);
                        setOptions([ // Make sure this is an array
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
                {questionType === "True or False" && (
                    <View style={styles.checkboxContainer}>
                        <View style={styles.checkboxRow}>
                            <CheckBox
                                value={isTrue}
                                testID="option-True"
                                onValueChange={() => handleTrueFalseChange(true)}
                            />
                            <Text>True</Text>
                        </View>
                        <View style={styles.checkboxRow}>
                            <CheckBox
                                value={!isTrue}
                                testID="option-False"
                                onValueChange={() => handleTrueFalseChange(false)}
                            />
                            <Text>False</Text>
                        </View>
                    </View>
                )}

                {questionType === "Multiple Choice Question" && (
                    <View style={styles.multipleChoiceContainer}>
                        {options.map((option, index) => (
                            <View key={option.id} style={styles.multipleChoiceRow}>
                                <TextInput
                                    style={styles.multipleChoiceInput}
                                    testID={`option-input-${option.id}`} // Add testID for each option input
                                    placeholder={`Option ${option.id}`}
                                    value={option.text}
                                    onChangeText={(text) => handleOptionTextChange(text, index)}
                                />
                                <CheckBox
                                    value={option.isCorrect}
                                    testID={`option-correct-${option.id}`} // Add testID for each option checkbox
                                    onValueChange={() => handleSetCorrectAnswer(index)}
                                />
                            </View>
                        ))}
                    </View>
                )}


                {questionType === "Fill In The Blanks" && (
                    <>
                        <Text>Enter words you want to be blank here:</Text>
                        {inputs.map((input, index) => (
                            <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TextInput
                                    style={styles.answerInput}
                                    placeholder="Enter Word"
                                    value={input}
                                    onChangeText={(text) => handleInputTextChange(text, index)}
                                />
                                <TouchableOpacity style={styles.removeButton} testID="remove-blank-input" onPress={() => removeInput(index)}>
                                    <Text style={styles.buttonText}>-</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                        <TouchableOpacity style={styles.addButton} testID="add-blank-input" onPress={addInput}>
                            <Text style={styles.buttonText}>+</Text>
                        </TouchableOpacity>
                    </>
                )}
                {questionType !== "True or False" && questionType !== "Multiple Choice Question" && questionType !== "Fill In The Blanks" && (
                    <TextInput
                        style={styles.answerInput}
                        placeholder="Enter the answer here"
                        value={answer}
                        onChangeText={(text) => setAnswer(text)}
                    />
                )}
                <View style={styles.buttonContainer}>
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
                    styles.saveQuestionButton,
                    isFormValid()
                        ? styles.saveQuestionButtonEnabled
                        : styles.saveQuestionButtonDisabled,
                    ]}
                    onPress={() => {
                    handleSaveQuestion(); // Call the function to save the question
                    navigation.navigate('QuestionsOverviewScreen', {
                        quizId: quizId,
                    });
                    }}
                    disabled={!isFormValid()} // Disable the button if the form is not valid
                >
                    <Text style={styles.saveQuestionButtonText} testID='save-button'>Save</Text>
                </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    saveQuestionButton: {
        backgroundColor: '#407BFF',
        width: 190,
        height: 45,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginHorizontal: 10,
      },
      saveQuestionButtonEnabled: {
        backgroundColor: '#407BFF', // Keep the original color when enabled
      },
      saveQuestionButtonDisabled: {
        backgroundColor: '#D3D3D3', // Set a light grey color when disabled
      },
      saveQuestionButtonText: {
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
    buttonContainer: {
        flexDirection: 'row',     // Aligns children (buttons) in a row
        justifyContent: 'center', // Centers the buttons in the container
        alignItems: 'center',     // Centers the buttons vertically
        marginVertical: 10,
    },
    saveQuestionButton: {
        backgroundColor: '#407BFF',
        width: 190,
        height: 45,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginHorizontal: 10,
    },
    saveQuestionButtonText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
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
    addButton: {
        backgroundColor: '#407BFF',
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        margin: 5
    },
    removeButton: {
        backgroundColor: 'red',
        width: 25,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12.5,
        marginLeft: 10
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold'
    },
});

export default EditQuestion;
