import { StatusBar, StyleSheet, Text, View, ImageBackground, TextInput, TouchableOpacity, CheckBox } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from "@react-navigation/native";

const QuizGradeScreen = ({ route }) => {
    const navigation = useNavigation();
    const quizId = route.params.quizId;
    const grade = route.params.numOfCorrectAnswers;
    const quizLength = route.params.quizLength;


    useEffect(() => {
    }, []);

    return (
        <ImageBackground
            source={require('../../assets/backgroundCloudyBlobsFull.png')}
            resizeMode="cover"
            style={styles.container}
        >
            <View style={styles.containerFile}>
                <Text style={styles.gradeText}>You got {grade} correct answers out of {quizLength}!</Text>
                <Text style={styles.gradeText}>Your grade is {((grade/quizLength) * 100).toFixed(0)} %</Text>
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
    
});

export default QuizGradeScreen;
