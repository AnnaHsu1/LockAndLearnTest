import { StatusBar, StyleSheet, Text, View, ImageBackground, TextInput, TouchableOpacity, CheckBox } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from "@react-navigation/native";

const QuizGradeScreen = ({ route }) => {
    const navigation = useNavigation();
    const quizId = route.params.quizId;
    const grade = route.params.numOfCorrectAnswers;
    const quizLength = route.params.quizLength;
    const answers = route.params.answers;
    const questions = route.params.questions;
    const solutions = route.params.solutions;
    const [results, setResults] = useState([]);


    useEffect(() => {

        console.log("ANSWERS FROM GRADE:",answers);
        console.log("SOLUTIONS FROM GRADE",solutions);
        console.log("QUESTIONS FROM GRADE",questions);

        let tempResults = [];

        // Loop through the answers and solutions arrays and compare them
        for (let i = 0; i < quizLength; i++) {
            // If the answer and solution are both arrays and of equal length
            if (Array.isArray(answers) && Array.isArray(solutions) 
            && answers.length === solutions.length){
            // Compare arrays of strings
                //if correct answer, populate results with true
                if (answers[i] === solutions[i]) {
                    tempResults.push(true);
                }
                //if incorrect answer, populate results with false
                else {
                    tempResults.push(false);
                }
            } else {
                console.log("Error: answers and solutions are not arrays of equal length");
            }
        };
        //set results to tempResults
        setResults(tempResults);
    }, []);

    const RenderResults = () => {
        return (
            <View style={styles.listQuestions}>
                <Text style={styles.gradeText}>Here are the results:</Text>
                <View style={{flexDirection: "row"}}>
                    <Text style={styles.headerQuestion}>Question</Text>
                    <Text style={styles.headerAnswer}>Your Answer</Text>
                    <Text style={styles.headerResult}>Result</Text>
                </View>

                {results.map((result, index) => {
                    return (
                        <View>
                            <View key={index} style={styles.containerQuestion}>
                                <Text style={styles.containerQuestionText}>
                                    {questions[index].questionText}
                                </Text>
                                <Text style={styles.containerAnswer}>
                                    {answers[index]}
                                </Text>
                                
                                {result ? (
                                    <Text style={styles.containerCorrectAnswer}>
                                        ✔
                                    </Text>
                                ) : (
                                    <Text style={styles.containerIncorrectAnswer}>
                                        ✘
                                    </Text>
                                )}
                            </View>
                            <Text style={styles.textExplanation}>
                                Explanation: 
                            </Text>
                            <Text>
                                {questions[index].explanation || "No explanation provided"}
                            </Text>

                        </View>
                    );
                })}
            </View>
        );
    }

    return (
        <ImageBackground
            source={require('../../assets/backgroundCloudyBlobsFull.png')}
            resizeMode="cover"
            style={styles.container}
        >
            <View style={styles.containerFile}>
                <Text style={styles.gradeText}>You got {grade} correct answers out of {quizLength}!</Text>
                <Text style={styles.gradeText}>Your grade is {((grade/quizLength) * 100).toFixed(0)} %</Text>
                <RenderResults />
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
        alignItems: 'left',
        justifyContent: 'center', // Ensure content is vertically centered
        width: '90%',
        maxWidth: 800,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        marginTop: '5%',
        alignSelf: 'center',
        padding: 20, // Add padding for better spacing
    },
    gradeText: {
        fontSize: 22, // Larger font size for better readability
        color: '#333', // Dark color for the text
        fontWeight: 'bold', // Bold font weight
        textAlign: 'center', // Center align the text
        marginBottom: 10, // Space below the text
    },
    //Container for the list of questions
    listQuestions: {
        flexDirection: 'column',
    },
    //Container for each question
    containerQuestion: {
        fontSize: 18,
        color: '#333',
        fontWeight: 'bold',
        textAlign: 'left',
        marginBottom: 10,
        flexDirection: 'row',
    },
    containerQuestionText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'left',
        marginBottom: 10,
        width: "61.5%",
    },
    //Container for the given answer
    containerAnswer: {
        fontSize: 16,
        color: '#333',
        textAlign: 'left',
        marginBottom: 10,
        width: "27%",
    },
    // Display a green background color and border if correct, red if incorrect
    containerCorrectAnswer: {
        backgroundColor: 'green',
        textAlign: 'center',
        justifyContent: 'center',
        color: 'white',
        width: "4%",
        borderRadius: 100,
    },
    containerIncorrectAnswer: {
        backgroundColor: 'red',
        textAlign: 'center',
        justifyContent: 'center',
        color: 'white',
        width: "4%",
        borderRadius: 100,
    },
    headerQuestion: {
        fontSize: 20,
        color: '#333',
        fontWeight: 'bold',
        textAlign: 'center',
        marginRight: "50%",
    },
    headerAnswer: {
        fontSize: 20,
        color: '#333',
        fontWeight: 'bold',
        textAlign: 'center',
        marginRight: "10%",
    },
    headerResult: {
        fontSize: 20,
        color: '#333',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    textExplanation: {
        fontSize: 18,
        color: '#333',
        fontWeight: 'bold',
        textAlign: 'left',
        marginBottom: 5,
    },
    
});

export default QuizGradeScreen;
