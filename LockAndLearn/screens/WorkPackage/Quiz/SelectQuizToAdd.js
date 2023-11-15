import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  CheckBox,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-paper';
import { getUser } from '../../../components/AsyncStorage';

const SelectQuizToAdd = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const workPackageId = route.params.workPackageId;
  const workPackageName = route.params.workPackageName;
  const workPackageGrade = route.params.workPackageGrade;
  const workPackageSubcategory = route.params.workPackageSubcategory;
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuizzes, setSelectedQuizzes] = useState([]);

  const getQuizzes = async () => {
    const user = await getUser();
    try {
      const response = await fetch('http://localhost:4000/quizzes/allQuizzes/' + user._id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        const data = await response.json();
        setQuizzes(data);
      } else {
        console.error('Error fetching quizzes');
      }
    } catch (error) {
      console.error('Network error');
    }
  };

  useEffect(() => {
    // Fetch all quizzes from your API
    getQuizzes();
  }, []);

  // Function to toggle the selection of quiz by its id
  const toggleQuizSelection = (quizId) => {
    if (selectedQuizzes.includes(quizId)) {
      setSelectedQuizzes((prevSelected) => prevSelected.filter((id) => id !== quizId));
    } else {
      setSelectedQuizzes((prevSelected) => [...prevSelected, quizId]);
    }
  };

  // Function to delete a quiz by its id
  const handleDeleteQuiz = async (quizId) => {
    try {
      const response = await fetch(`http://localhost:4000/quizzes/deleteQuiz/${quizId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        console.log('Quiz deleted:', quizId);
        setQuizzes((prevQuizzes) => prevQuizzes.filter((quiz) => quiz._id !== quizId));
      } else {
        console.error('Failed to delete quiz:', response.status);
      }
    } catch (error) {
      console.error('Error deleting quiz:', error);
    }
  };

  // Function to add selected quizzes to the work package
  const addQuizzesToWorkPackage = async () => {
    try {
      if (selectedQuizzes.length === 0) {
        console.log('No quizzes selected to add to the work package.');
        return;
      }
      const response = await fetch(
        `http://localhost:4000/workPackages/addQuizzes/${workPackageId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            quizzes: selectedQuizzes,
          }),
        }
      );
      if (response.ok) {
        console.log('Quizzes added to the work package:', selectedQuizzes);
        navigation.navigate('DisplayWorkPackageContent', {
          workPackageId: workPackageId,
          selectedNewContent: selectedQuizzes,
        });
      } else {
        console.error('Failed to add quizzes to the work package:', response.status);
      }
    } catch (error) {
      console.error('Error adding quizzes to the work package:', error);
    }
  };

  // Function to navigate to create quiz screen
  const navigateToCreateQuiz = () => {
    navigation.navigate('CreateQuiz', {
      workPackageId: workPackageId,
    });
  };

  return (
    <ImageBackground
      source={require('../../../assets/backgroundCloudyBlobsFull.png')}
      resizeMode="cover"
      style={styles.container}
    >
      <View style={styles.containerFile}>
        <View
          style={{
            borderBottomColor: 'lightgrey',
            borderBottomWidth: 1,
            textAlign: 'center',
            alignSelf: 'center',
            paddingBottom: 5,
            width: '100%',
          }}
        >
          <Text style={styles.selectFiles}>Choose Quizzes To Add To Your Work Package:</Text>
          <Text style={styles.workPackageTitle}>
            {workPackageName} - {workPackageGrade}
          </Text>
          {workPackageSubcategory !== 'Choose a Subcategory' && (
            <Text style={styles.workPackageInfo}>{workPackageSubcategory}</Text>
          )}
        </View>
        {/* Display button to navigate to screen to add new quiz */}
        <View style={styles.buttonNavigate}>
          <TouchableOpacity onPress={navigateToCreateQuiz} style={styles.buttonCreateNewQuiz}>
            <Text style={{ color: '#407BFF', fontSize: 15 }}>+ Add New Quiz</Text>
          </TouchableOpacity>
        </View>
        {/* Display all quizzes from user */}
        <ScrollView style={styles.scrollContainer}>
          {quizzes.map((quiz) => (
            <View key={quiz._id} style={styles.quizContainer}>
              {/* checkbox to be changed -> used another lib, as from react native, it is removed */}
              <CheckBox
                value={selectedQuizzes.includes(quiz._id)}
                onValueChange={() => toggleQuizSelection(quiz._id)}
              />
              <TouchableOpacity
                testID="quiz-selection-checkbox"
                style={styles.quizItem}
                onPress={() => toggleQuizSelection(quiz._id)}
              >
                <Text>{quiz.name}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                testID={'delete-quiz-1'}
                onPress={() => handleDeleteQuiz(quiz._id)}
              >
                <View style={styles.deleteButtonBackground}>
                  <Icon source="delete-outline" size={20} color={'#F24E1E'} />
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
        {/* Display button to add quizzes to work package */}
        {selectedQuizzes.length === 0 ? null : (
          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity
              testID="add-quizzes-button"
              onPress={addQuizzesToWorkPackage}
              style={styles.buttonAddMaterial}
            >
              <Text style={styles.buttonText}>Add to Work Package</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    color: '#FFFFFF',
    alignItems: 'center',
    fontSize: 15,
    fontWeight: '500',
  },
  buttonAddMaterial: {
    backgroundColor: '#407BFF',
    width: 190,
    height: 35,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    marginTop: '2%',
    marginBottom: '3%'
  },
  buttonNavigate: {
    alignSelf: 'flex-end',
    marginRight: '5%',
    marginBottom: 5,
    marginTop: 5,
  },
  container: {
    flex: 1,
  },
  quizContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
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
    fontSize: 28,
    fontWeight: '500',
    textAlign: 'center',
    padding: '1%',
  },
  quizItem: {
    fontSize: 18,
    marginVertical: 10,
    color: '#333',
    borderColor: '#333',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '70%',
  },
  deleteButton: {
    // backgroundColor: 'red',
    // width: 30,
    // height: 20,
    // borderRadius: 5,
    // alignItems: 'center',
    // justifyContent: 'center',
    // padding: 8
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  scrollContainer: {
    height: 300,
    width: '100%',
  },
  workPackageTitle: {
    color: '#696969',
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
  },
  workPackageInfo: {
    color: '#696969',
    fontSize: 23,
    fontWeight: '500',
    textAlign: 'center',
    alignSelf: 'center',
  },
  deleteButtonBackground: {
    backgroundColor: 'rgba(242, 78, 30, 0.13)',
    borderRadius: 100,
    padding: 5,
  },
});

export default SelectQuizToAdd;
