import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from "@react-navigation/native";

const workPackages = [
    { id: 1, name: 'Math - Grade 7' },
    { id: 2, name: 'Science - Grade 4' },
    { id: 3, name: 'History - Grade 5' },
    { id: 4, name: 'History - Grade 10' },
    { id: 5, name: 'French - Grade 12' },
    // will be dynamic with db
];

const SelectWorkPackageScreen = () => {
    const [fileName, setFileName] = useState([]);
    const navigation = useNavigation();

    const createQuizForWorkPackage = async (workPackageId) => {
        // Find the selected work package based on workPackageId
        const selectedWorkPackage = workPackages.find((workPackage) => workPackage.id === workPackageId);
    
        if (selectedWorkPackage) {
            const nameOfPackage = selectedWorkPackage.name;
    
            // Prepare the quiz object with the updated name
            const newQuiz = {
                name: `Quiz for ${nameOfPackage}`,
                workPackageId,
                questions: [], // Initially, the questions array is empty
            };
    
            try {
                // Send a POST request to create the quiz
                const response = await fetch('http://localhost:4000/quizzes/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newQuiz),
                });
    
                if (response.status === 200) {
                    // Quiz created successfully, you can handle the response if needed
                } else {
                    // Handle errors or display a message
                }
            } catch (error) {
                // Handle network errors or server issues
            }
        } else {
            console.error(`Work package with ID ${workPackageId} not found.`);
        }
    };
    

    return (
        <View style={styles.container}>
            <Text style={styles.selectFiles}>Select a Work Package</Text>
            <View style={styles.workPackageList}>
                {workPackages.map((workPackage) => (
                    <TouchableOpacity
                        key={workPackage.id}
                        onPress={() => {
                            // Create a quiz when a work package is pressed
                            createQuizForWorkPackage(workPackage.id);
                            console.log(workPackage.id);

                            // Navigate to QuestionsOverviewScreen (if needed)
                            navigation.navigate('QuizzesOverviewScreen', {
                                workPackageId: workPackage.id,
                            });
                        }}
                    >
                        <Text style={styles.workPackageItem}>{workPackage.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={styles.createPackageButtonContainer}>
                <TouchableOpacity
                    style={styles.createPackageButton}
                    onPress={() => {
                        // Handle the "Create Package" button click
                    }}
                >
                    <Text style={styles.createPackageButtonText}>Create Package</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    createPackageButtonContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    createPackageButton: {
        backgroundColor: '#407BFF',
        width: 190,
        height: 45,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    createPackageButtonText: {
        color: '#FFFFFF',
        fontSize: 20,
    },
    workPackageList: {
        marginTop: '5%',
        alignItems: 'center',
    },
    workPackageItem: {
        fontSize: 18,
        marginVertical: 10,
        color: '#333',
        borderColor: '#333',
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
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

export default SelectWorkPackageScreen;