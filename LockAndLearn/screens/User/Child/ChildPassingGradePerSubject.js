import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, FlatList, TextInput, ScrollView } from 'react-native';
import { Icon } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import { getItem } from '../../../components/AsyncStorage';
import { Button } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';

const ChildPassingGradePerSubject = ({ route, navigation }) => {
    const [child, setChild] = useState({});
    const childSelected = route.params.child;
    const [workPackages, setWorkPackages] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const hasError = subjects.some(subject => subject.errorMessage);

    
    // const [prevPassingGradesArray, setPrevPassingGradesArray] = useState([]);

    const [fdata, setFdata] = useState({});

    // function to get all previously assigned work packages from the child
    const fetchPrevPassingGrades = async () => {
        const response = await fetch(`http://localhost:4000/child/getPreviousPassingGrades/${childSelected._id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        });
        const data = await response.json();
        console.log("DATAAAAAAA", data);
        return data;
        // setPrevPassingGradesArray(data);
    };

    // function to get all owned work packages from the user
    const fetchWorkPackages = async (displayOwned = false) => {
        const prevPassingGradesArray = await fetchPrevPassingGrades();

        const token = await getItem('@token');
        const user = JSON.parse(token);
        const userId = user._id;
        console.log("USER ID",userId);
        console.log("PREVIOUS PASSING GRADES", prevPassingGradesArray);
        if (userId) {
            try {
                const response = await fetch( 
                    `http://localhost:4000/workPackages/fetchWorkpackagesParent/${userId}?displayOwned=${displayOwned}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
                if (response.status === 200) {
                    const data = await response.json();
                    console.log("work paxkages", data);
                    setWorkPackages(data);

                    // Extract names of subjects and remove duplicates
                    const uniqueNames = [...new Set(data.map(item => item.name))];
                    console.log("Unique Names", uniqueNames);

                    // Create subjects array with name and grade from prevPassingGrades if it exists
                    const subjectsWithGrades = uniqueNames.map(name => {
                        // Find the matching subject in prevPassingGrades
                        const foundSubject = prevPassingGradesArray.find(subject => subject.name === name);
                        
                        // If found, use its grade, else set initial blank grade
                        const grade = foundSubject ? foundSubject.grade : "";

                        return {
                            name: name,
                            grade: grade,
                            errorMessage: "" // Initially a blank error message
                        };
                    });

                    setSubjects(subjectsWithGrades);
                

                } else {
                    console.error('Error fetching workPackages');
                }
            } catch (error) {
                console.error('Network error:', error);
            }
        } else {
            console.log('No work package found')
        }
    };

    const handleUpdateUserSubjectsPassingGrade = async () => {
        try {
            // Log the original subjects array
            console.log("Original SUBJECTS", subjects);

            // Transform the subjects array to only include subject and grade
            const transformedSubjects = subjects.map(({ name, grade }) => ({ name, grade }));

            // Log the transformed subjects array
            console.log("Transformed SUBJECTS", transformedSubjects);
            console.log("CHILD IDDDD", childSelected._id);
          const response = await fetch(`http://localhost:4000/child/updateUserSubjectsPassingGrade/${childSelected._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ subjects: transformedSubjects }),
          });
      
          if (!response.ok) {
            throw new Error('Server responded with an error.');
          }
      
          console.log('User subjects updated successfully');
          // Additional logic on successful update
        } catch (error) {
          console.error('Error updating user subjects:', error);
          // Handle errors here
        }
        navigation.navigate('ChildSettings', { child: child }); 
      };


    const handleGradeChange = (newGrade, index) => {
        // console.log("NEW NUMBERS",newGrade);
        //const gradeNumber = parseInt(newGrade, 10);
        const gradeNumber = newGrade;
    
        // console.log("GRADE NUMBERS",gradeNumber);
        // Always update the grade with the new input
        const updatedSubjects = subjects.map((subject, i) => {
          if (i === index) {
            const updatedSubject = { ...subject, grade: newGrade };
    
            // Validate the grade and set the error message if invalid
            if (newGrade === "" || (!isNaN(gradeNumber) && gradeNumber >= 1 && gradeNumber <= 100)) {
              updatedSubject.errorMessage = ""; // Valid input, so clear any error message
            } else {
              updatedSubject.errorMessage = "Invalid grade. Enter a number from 1 to 100 or leave blank.";
            }
    
            return updatedSubject;
          }
          return subject;
        });
    
        setSubjects(updatedSubjects);
    };
    useEffect(() => {
        setChild(childSelected);
        fetchWorkPackages(true);
    }, []);

    return (
        <ImageBackground
            source={require('../../../assets/backgroundCloudyBlobsFull.png')}
            resizeMode="cover"
            style={styles.container}
        >
            <View style={styles.containerFile}>
                <Text style={styles.title}>Set Subject Passing Grades for:</Text>
                <Text style={styles.selectFiles}>{child.firstName} {child.lastName}</Text>
                {/* Display all subjects with their corresponding text box for grade setting */}
                <Text style={styles.instructionText}>Please Choose a Number between 1 and 100</Text>
                <ScrollView style={styles.scrollContainer}>
                {subjects.map((subject, index) => (
                    <View key={index} style={styles.subjectRow}>
                        <View style={styles.subjectDetails}>
                            <MaterialIcons name="school" size={20} style={styles.subjectIcon} />
                            <Text style={styles.subjectName}>{subject.name}</Text>
                        </View>
                        <TextInput 
                            testID={`subject-input-${index}`}
                            style={styles.subjectInput} 
                            value={subject.grade} 
                            onChangeText={(text) => handleGradeChange(text, index)}
                        />
                        {subject.errorMessage && (
                            <MaterialIcons name="error" size={20} style={styles.errorIcon} />
                        )}
                    </View>
                ))}
                </ScrollView>
                <View style={styles.buttonRow}>
                    <Button
                        testID="cancel-buttons"
                        mode="contained"
                        onPress={() => navigation.navigate('ChildSettings', { child: child })}
                        style={[styles.button, styles.cancelButton]}
                    >
                        <Text style={styles.buttonText}>CANCEL</Text>
                    </Button>
                    <Button
                        testID="save-buttons"
                        mode="contained"
                        onPress={() => handleUpdateUserSubjectsPassingGrade()}
                        style={[
                            styles.button, 
                            styles.saveButton, 
                            hasError ? styles.disabledButton : null
                        ]}
                        disabled={hasError}
                    >
                        <Text style={styles.buttonText}>SAVE</Text>
                    </Button>
                </View>
            </View>
            
        </ImageBackground>
    );
};

ChildPassingGradePerSubject.propTypes = {
    route: PropTypes.shape({
      params: PropTypes.shape({
        child: PropTypes.object.isRequired, // Define the shape further if needed
      }),
    }).isRequired,
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }).isRequired,
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
        width: '80%', // Adjust for responsiveness
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingTop: '5%', // Space from top
    },
    selectFiles: {
        color: '#333', // Darker shade for better readability
        fontSize: 30, // Adjusted for better readability
        fontWeight: '500',
        marginBottom: '3%', // Space below the text
        textAlign: 'center',
    },
    title: {
        color: '#333', // Darker shade for better readability
        fontSize: 20, // Adjusted for better readability
        fontWeight: '500',
        marginBottom: '3%', // Space below the text
        textAlign: 'center',
    },
    subjectRow: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Aligns children at both ends
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        marginBottom: 10,
        width: '70%',
        alignSelf: 'center',
        borderRadius: 10,
        padding: 10,
    },
    scrollContainer: {
        width: '70%',
    },
    subjectDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1, // Takes available space, pushing TextInput and errorIcon to the right
    },
    subjectName: {
        flex: 1,
        fontSize: 20, // Increased font size
        fontFamily: 'YourPrettierFont', // Replace with your font
        paddingLeft: 10, // Space after the icon
    },
    subjectInput: {
        width: '20%',
        borderWidth: 2,
        borderColor: '#407BFF',
        borderRadius: 10,
        padding: 10,
        fontSize: 16,
        color: '#333333',
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 2,
    },
    subjectIcon: {
        color: '#407BFF',
    },
    errorIcon: {
        color: 'red',
        fontSize: 20, // Adjust size as needed
        fontWeight: 'bold',
        marginLeft: 5, // Space from the input field
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '70%',
        alignSelf: 'center',
        marginTop: 20,
    },
    button: {
        flex: 1,
        borderRadius: 10,
        marginHorizontal: 5, // Add space between buttons
    },
    disabledButton: {
        backgroundColor: '#E0F7FA', // very light blue color
      },
    cancelButton: {
        backgroundColor: 'gray', // Cancel button color
        width: '20%', // Reduced width
        height: 50, // Increased height
        borderRadius: 10, // Rounded corners
        justifyContent: 'center', // Center content vertically
        marginHorizontal: 5, // Spacing between buttons
    },
    saveButton: {
        backgroundColor: '#4F85FF', // Save button color
        width: '20%', // Reduced width
        height: 50, // Increased height
        borderRadius: 10, // Rounded corners
        justifyContent: 'center', // Center content vertically
        marginHorizontal: 5, // Spacing between buttons
    },
    buttonText: {
        color: '#ffffff', // Text color for buttons
    },
    child: {
        color: '#ffffff', // Text color for buttons
        padding: 10, // Padding inside the button
    },
    instructionText: {
        textAlign: 'center', // Center the text within the Text component
        padding: 10,
        fontSize: 20,
        color: '#333333',
        margin: 5,
        alignSelf: 'center', // Center the Text component within its parent
    },
    }
);

export default ChildPassingGradePerSubject;
