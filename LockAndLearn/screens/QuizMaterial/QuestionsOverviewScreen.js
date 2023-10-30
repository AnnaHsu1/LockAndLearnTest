import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from "@react-navigation/native";

const QuestionsOverviewScreen = ({ route }) => {
    const navigation = useNavigation();
    const quizId = route.params.quizId;
    const [questions, setQuestions] = useState([]);
    

    useEffect(() => {
        const fetchQuiz = async () => {
        try {
            const response = await fetch(`https://localhost:4000/quizzes/quiz/${quizId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
            });
            if (response.status === 200) {
            const data = await response.json();
            setQuestions(data.questions);
            } else {
            console.error("Error fetching quizzes");
            }
        } catch (error) {
            console.error("Network error:", error);
        }
        }

        fetchQuiz();
    }, []);


    const deleteQuestion = async (questionIndex) => {
        // Filter out the question with the specified ID to delete it
        try {
            const response = await fetch(`https://localhost:4000/quizzes/deleteQuestion/${quizId}/${questionIndex}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            console.log("Response:", response);
    
            if (response.status === 200) {
                const data = await response.json();
                console.log("Updated quiz after deletion:", data);
                setQuestions(data.questions);  // Update local state with the updated questions array
            } else {
                console.error("Error deleting question");
            }
        } catch (error) {
            console.error("Network error:", error);
        }
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
                                    deleteQuestion(index);
                                }}
                                style={styles.deleteButton}
                            >
                                <Text style={styles.deleteButtonText}>X</Text>
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
        marginRight: 10,
    },
    deleteButton: {
        backgroundColor: 'red',
        width: 30,
        height: 20,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteButtonText: {
        color: 'white',
        fontSize: 15,
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
        width: 600,
    },
});

export default QuestionsOverviewScreen;
