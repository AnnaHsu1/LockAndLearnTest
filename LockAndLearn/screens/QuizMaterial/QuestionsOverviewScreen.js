import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image, Platform, ImageBackground } from 'react-native';
import { React, useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { TouchableOpacity } from 'react-native';

// Import the navigation actions and hooks from React Navigation
import { useNavigation } from "@react-navigation/native";

const questions = [
    { id: 1, name: 'True or False: The Earth is flat.' },
    { id: 2, name: 'True or False: Water boils at 100 degrees Celsius at sea level.' },
    { id: 3, name: 'True or False: The moon is made of cheese.' },
    { id: 4, name: 'True or False: The capital of Japan is Tokyo.' },
    { id: 5, name: 'What is the capital of France?' },
    { id: 6, name: 'Explain Newton\'s second law of motion.' },
    { id: 7, name: 'Who wrote \'Romeo and Juliet\'?' },
    // will be dynamic
  ];
  

const QuestionsOverviewScreen = () => {
    const navigation = useNavigation();
    const [fileName, setFileName] = useState([]);

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
                    <TouchableOpacity
                        key={question.id}
                        onPress={() => {
                            //goes on a page/modal where we can edit the question
                        }}
                    >
                        <Text style={styles.questionItem}>{question.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={styles.createQuestionButtonContainer}>
                <TouchableOpacity
                    style={styles.createQuestionButton}
                    onPress={() => {
                        // Navigate to the CreateQuestion screen
                        navigation.navigate('CreateQuestion', {
                            // You can pass any additional data or parameters if needed
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
    questionList: {
        marginTop: '5%',
        alignItems: 'center',
    },
    questionItem: {
        fontSize: 18,
        marginVertical: 10,
        color: '#333', // Text color (adjust as needed)
        borderColor: '#333', // Dark grey outline color
        borderWidth: 1, // Border width
        padding: 10, // Padding around each item
        borderRadius: 5, // Border radius for rounded corners
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
    supportedFormats: {
      color: '#ADADAD',
      fontSize: 15,
      fontWeight: '600',
      textAlign: 'center',
      marginTop: '95%',
    },
    imageUpload: {
      resizeMode: 'contain',
      width: 198,
      height: 250,
    },
    filesText: {
      padding: 10,
    },
    filesName: {
      padding: 0,
    },
    buttonUpload: {
      backgroundColor: '#407BFF',
      width: 190,
      height: 45,
      borderRadius: 9,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
    },
    buttonText: {
      color: '#FFFFFF',
      alignItems: 'center',
      fontSize: 20,
      fontWeight: '500',
    },
  });

export default QuestionsOverviewScreen;