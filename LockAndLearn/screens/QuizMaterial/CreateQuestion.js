import { StatusBar, StyleSheet, Text, View, ImageBackground, TextInput, TouchableOpacity, Picker, CheckBox } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from "@react-navigation/native";

const CreateQuestion = ({ route }) => {
    const navigation = useNavigation();
    const { quizId } = route.params;
    const [questionText, setQuestionText] = useState('');
    const [questionType, setQuestionType] = useState('');
    const [inputs, setInputs] = useState(['']);
    const [answer, setAnswer] = useState('');
    const [isTrue, setIsTrue] = useState(false);
    const [multipleChoiceAnswers, setMultipleChoiceAnswers] = useState({
        A: { text: '', isCorrect: false },
        B: { text: '', isCorrect: false },
        C: { text: '', isCorrect: false },
        D: { text: '', isCorrect: false },
    });
    const [questions, setQuestions] = useState([]);
    console.log(quizId + "CreateQuestions1");
    const questionTypes = ["Short Answer", "Multiple Choice Question", "True or False", "Fill In The Blanks", "Another Type"];
    const handleCreateQuestion = async () => {
        // Create a new question object based on the user's input
        const newQuestion = {
            questionText,
            questionType,
        };

        if (questionType === "True or False") {
            newQuestion.answer = answer;
        } else if (questionType === "Multiple Choice Question") {
            newQuestion.multipleChoiceAnswers = Object.keys(multipleChoiceAnswers).map((key) => ({
                text: multipleChoiceAnswers[key].text,
                isCorrect: multipleChoiceAnswers[key].isCorrect,
            }));
        } else if (questionType === "Fill In The Blanks") {
            newQuestion.fillInTheBlanks = inputs;
        } else {
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
            console.log(response);

            if (response.ok) {
                // Question created successfully, you can handle the response here
                const result = await response.json();
                console.log('Question created:', result);

                // Clear the form after adding the question
                setQuestionText('');
                setQuestionType('');
                setAnswer('');
                setIsTrue(false);
                setMultipleChoiceAnswers({
                    A: { text: '', isCorrect: false },
                    B: { text: '', isCorrect: false },
                    C: { text: '', isCorrect: false },
                    D: { text: '', isCorrect: false },
                });
                setInputs(['']);
            } else {
                // Handle error response
                console.error('Failed to create question:', response.statusText);
            }
        } catch (error) {
            console.error('Error creating question:', error);
        }
    };

    const handleTrueFalseChange = (newValue) => {
        setIsTrue(newValue);
        setAnswer(newValue ? "True" : "False");
    };

    const handleSetCorrectAnswer = (key) => {
        // Update the correct answer for the multiple choice question
        const updatedAnswers = { ...multipleChoiceAnswers };
        Object.keys(updatedAnswers).forEach((answerKey) => {
            updatedAnswers[answerKey].isCorrect = false;
        });
        updatedAnswers[key].isCorrect = true;
        setMultipleChoiceAnswers(updatedAnswers);
    };
    const addInput = () => {
        setInputs(prevInputs => [...prevInputs, '']);
    }
    const removeInput = (index) => {
        setInputs(prevInputs => prevInputs.filter((_, idx) => idx !== index));
    }

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
                    onValueChange={(itemValue) => {
                        setQuestionType(itemValue);
                        console.log(itemValue + " iv-qt "+ questionType);
                        setAnswer('');
                        setIsTrue(false);
                        setMultipleChoiceAnswers({
                            A: { text: '', isCorrect: false },
                            B: { text: '', isCorrect: false },
                            C: { text: '', isCorrect: false },
                            D: { text: '', isCorrect: false },
                        });
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
                                onValueChange={() => handleTrueFalseChange(true)}
                            />
                            <Text>True</Text>
                        </View>
                        <View style={styles.checkboxRow}>
                            <CheckBox
                                value={!isTrue}
                                onValueChange={() => handleTrueFalseChange(false)}
                            />
                            <Text>False</Text>
                        </View>
                    </View>
                )}
                {questionType === "Multiple Choice Question" && (
                    <View style={styles.multipleChoiceContainer}>
                        {Object.keys(multipleChoiceAnswers).map((key) => (
                            <View key={key} style={styles.multipleChoiceRow}>
                                <TextInput
                                    style={styles.multipleChoiceInput}
                                    placeholder={`Enter answer ${key}`}
                                    value={multipleChoiceAnswers[key].text}
                                    onChangeText={(text) => {
                                        const updatedAnswers = { ...multipleChoiceAnswers };
                                        updatedAnswers[key].text = text;
                                        setMultipleChoiceAnswers(updatedAnswers);
                                    }}
                                />
                                <CheckBox
                                    value={multipleChoiceAnswers[key].isCorrect}
                                    onValueChange={() => handleSetCorrectAnswer(key)}
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
                                onChangeText={(text) => {
                                    const newInputs = [...inputs];
                                    newInputs[index] = text;
                                    setInputs(newInputs);
                                }}
                            />
                            <TouchableOpacity style={styles.removeButton} onPress={() => removeInput(index)}>
                                <Text style={styles.buttonText}>-</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                    <TouchableOpacity style={styles.addButton} onPress={addInput}>
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
                <TouchableOpacity
                    style={styles.createQuestionButton}
                    onPress={() => {
                        handleCreateQuestion(); // Call the function to create the question
                        console.log("ANSWER:" + answer);
                        // Navigate to the QuestionsOverviewScreen and pass the workPackageId
                        navigation.navigate('QuestionsOverviewScreen', {
                        //    workPackageId: workPackage.id, // pass id
                        });
                    }}
                >
                    <Text style={styles.createQuestionButtonText}>Create Question</Text>
                </TouchableOpacity>
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

export default CreateQuestion;
