import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from "@react-navigation/native";

const QuestionsOverviewScreen = ({ route }) => {
    const navigation = useNavigation();
    const quizId = route.params.quizId;

    const [questions, setQuestions] = useState([]);
    const [error, setError] = useState(null);
    

    useEffect(() => {
        const fetchQuiz = async () => {
        try {
            const response = await fetch(`http://localhost:4000/quizzes/quiz/${quizId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
            });
            console.log("XXXXXXXX",response);
            console.log(quizId,response);
            if (response.status === 200) {
            const data = await response.json();
            console.log("WWWWWWWWW",data.questions);
            setQuestions(data.questions);
            } else {
            const errorMessage = await response.text();
            setError(errorMessage);
            console.error("Error fetching quizzes:", errorMessage);
            }
        } catch (error) {
            setError("Network error");
            console.error("Network error:", error);
        }
        }

        fetchQuiz();
    }, []);


    const deleteQuestion = (questionId) => {
        // Filter out the question with the specified ID to delete it
        const updatedQuestions = questions.filter((question) => question.id !== questionId);
        setQuestions(updatedQuestions);
    };

    return (
        <ImageBackground
            source={require('../../assets/backgroundCloudyBlobsFull.png')}
            resizeMode="cover"
            style={styles.container}
        >
            <View style={styles.containerFile}>
                <Text style={styles.selectFiles}>Create your Questions</Text>
                <ScrollView style={styles.scrollContainer}>
                <View style={styles.questionList}>
                    {questions && questions.map((question, index) => (
                        <View key={index} style={styles.questionItemContainer}>
                            <TouchableOpacity
                                onPress={() => {
                                    // Goes to a page/modal where you can edit the question
                                }}
                            >
                                <Text style={styles.questionItem}>{question.questionText}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    // Delete the question
                                    deleteQuestion(question.id);
                                }}
                                style={styles.deleteButton}
                            >
                                <Text style={styles.deleteButtonText}>-</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
                </ScrollView>
                <View style={styles.createQuestionButtonContainer}>
                  <TouchableOpacity
                      style={styles.createQuestionButton}
                      onPress={() => {
                          // Navigate to the QuestionsOverviewScreen and pass the workPackageId
                          navigation.navigate('CreateQuestion', {
                              quizId: quizId, // pass id
                          });
                          console.log(quizId);
                      }}
                  >
                      <Text style={styles.createQuestionButtonText}>Create Question</Text>
                  </TouchableOpacity>
                </View>
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
    questionList: {
        marginTop: '5%',
        alignItems: 'center',
    },
    questionItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    questionItem: {
        fontSize: 18,
        marginVertical: 10,
        color: '#333',
        borderColor: '#333',
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
    },
    deleteButton: {
        backgroundColor: 'red',
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteButtonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    createQuestionButtonContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    createQuestionButton: {
        backgroundColor: '#407BFF',
        width: 190,
        height: 45,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    createQuestionButtonText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    scrollContainer: {
        height: 300, 
        width: 300,
    },
});

export default QuestionsOverviewScreen;
