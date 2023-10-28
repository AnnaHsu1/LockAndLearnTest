import React, { useState } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from "@react-navigation/native";

const QuestionsOverviewScreen = ({ route }) => {
    const navigation = useNavigation();
    const { workPackageId } = route.params;
    const [questions, setQuestions] = useState([
        { id: 1, name: 'True or False: The Earth is flat.' },
        { id: 2, name: 'True or False: Water boils at 100 degrees Celsius at sea level.' },
        { id: 3, name: 'True or False: The moon is made of cheese.' },
        { id: 4, name: 'True or False: The capital of Japan is Tokyo.' },
        { id: 5, name: 'What is the capital of France?' },
        { id: 6, name: 'Explain Newton\'s second law of motion.' },
        { id: 7, name: 'Who wrote \'Romeo and Juliet\'?' },
    ]);

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
                <Text style={styles.selectFiles}>Create Your Questions</Text>
                <View style={styles.questionList}>
                    {questions.map((question) => (
                        <View key={question.id} style={styles.questionItemContainer}>
                            <TouchableOpacity
                                onPress={() => {
                                    // Goes to a page/modal where you can edit the question
                                }}
                            >
                                <Text style={styles.questionItem}>{question.name}</Text>
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
                <View style={styles.createQuestionButtonContainer}>
                  <TouchableOpacity
                      style={styles.createQuestionButton}
                      onPress={() => {
                          // Navigate to the QuestionsOverviewScreen and pass the workPackageId
                          navigation.navigate('CreateQuestion', {
                              workPackageId: workPackageId, // pass id
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
});

export default QuestionsOverviewScreen;
