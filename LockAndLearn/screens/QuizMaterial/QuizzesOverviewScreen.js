import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from "@react-navigation/native";

const QuizzesOverviewScreen = ({ route }) => {
    const navigation = useNavigation();
    const { workPackageId } = route.params;

    const [quizzes, setQuizzes] = useState([]);
    const [error, setError] = useState(null);

    const fetchQuizzes = async () => {
        try {
            const response = await fetch('http://localhost:4000/quizzes/allQuizzes', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
            });
            // console.log("AAAAAAAA",response);
            if (response.status === 200) {
            const data = await response.json();
            // console.log("BBBBBBBB",data);
            setQuizzes(data);
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

    const deleteQuiz = async (quizId) => {
        // Filter out the quizzes with the specified ID to delete it
        try {
            const response = await fetch(`http://localhost:4000/quizzes/deleteQuiz/${quizId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
    
            if (response.status === 200) {
                console.log("Quiz deleted successfully");
                const data = await response.json();
                fetchQuizzes();
            } else {
                const errorMessage = await response.text();
                setError(errorMessage);
                console.error("Error deleting quiz:", errorMessage);
            }
        } catch (error) {
            setError("Network error");
            console.error("Network error:", error);
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
                                <TouchableOpacity
                                    onPress={() => {
                                        navigation.navigate('QuestionsOverviewScreen', {
                                            quizId: quiz._id,
                                        });
                                    }}
                                >
                                    <Text style={styles.quizItem}>{quiz.name}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        // Delete the quiz
                                        deleteQuiz(quiz._id);
                                    }}
                                    style={styles.deleteButton}
                                >
                                    <Text style={styles.deleteButtonText}>X</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </ScrollView>
                <View style={styles.createQuizButtonContainer}>
                  <TouchableOpacity
                      style={styles.createQuizButton}
                      onPress={() => {
                          // Navigate to the QuestionsOverviewScreen and pass the workPackageId
                          navigation.navigate('CreateQuestion', {
                              workPackageId: workPackageId, // pass id
                          });
                      }}
                  >
                      <Text style={styles.createQuizButtonText}>New Quiz</Text>
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
        width: 300,
    },
});

export default QuizzesOverviewScreen;
