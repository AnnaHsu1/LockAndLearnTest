import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getUser } from '../../../components/AsyncStorage';
import PropTypes from 'prop-types';

const SelectQuizToAdd = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const params = route.params;
  const { wp_id, name, grade } = params?.workPackage;
  const { p_id, p_materials, subcategory, description } = params?.package;
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
        // set checked (true) to checkboxes that are already selected in the package
        const quizzesInDb = await fetch(`http://localhost:4000/packages/fetchQuizzes/${p_id}`, {
          method: 'GET',
        });
        const selectedQuizzesDb = await quizzesInDb.json();
        setSelectedQuizzes(selectedQuizzesDb);
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

  // Function to add selected quizzes to the work package
  const addQuizzesToWorkPackage = async () => {
    try {
      const response = await fetch(`https://data.mongodb-api.com/app/lock-and-learn-xqnet/endpoint/addContentPackage?id=${p_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentType: 'quiz',
          quizzes: selectedQuizzes,
        }),
      });
      if (response.ok) {
        navigation.navigate('EditPackage', {
          package: {
            p_id: p_id,
            p_quizzes: selectedQuizzes,
            p_materials: p_materials,
            subcategory: subcategory,
            description: description,
          },
          workPackage: {
            name: name,
            grade: grade,
            wp_id: wp_id,
          },
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
      workPackageId: wp_id,
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
          <Text style={styles.selectFiles}>Choose Quizzes To Add To Your Package:</Text>
          <Text style={styles.workPackageTitle}>
            {name} - {grade}
          </Text>
          {subcategory !== 'Choose a Subcategory' && (
            <Text style={styles.workPackageInfo}>{subcategory}</Text>
          )}
        </View>
        {/* Display button to navigate to screen to add new quiz */}
        <View style={styles.buttonNavigate}>
          <TouchableOpacity onPress={navigateToCreateQuiz} style={styles.buttonCreateNewQuiz}>
            <Text style={{ color: '#407BFF', fontSize: 15 }}>+ New Quiz</Text>
          </TouchableOpacity>
        </View>
        {/* Display all quizzes from user */}
        <View style={styles.centeredContainer}>
          <ScrollView style={styles.scrollContainer}>
            {quizzes.map((quiz) => (
              <TouchableOpacity
                key={quiz._id}
                testID="quiz-selection-checkbox"
                style={[
                  styles.quizItem,
                  { backgroundColor: quiz.approved ? 'white' : '#FAFAFA' },
                  { opacity: quiz.approved ? 1 : 0.5 },
                  selectedQuizzes.includes(quiz._id) && {
                    borderColor: '#407BFF',
                    backgroundColor: '#407BFF1A',
                  },
                ]}
                onPress={() => {
                  if (quiz.approved) {
                    toggleQuizSelection(quiz._id);
                  }
                }}
                disabled={!quiz.approved}
              >
                <Text
                  style={{
                    color: selectedQuizzes.includes(quiz._id) ? '#407BFF' : quiz.approved ? '#696969' : 'grey',
                  }}
                >
                  {quiz.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        {/* Display button to add quizzes to work package */}
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            testID="add-quizzes-button"
            onPress={addQuizzesToWorkPackage}
            style={styles.buttonAddMaterial}
          >
            <Text style={styles.buttonText}>Add to Work Package</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

SelectQuizToAdd.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      workPackage: PropTypes.shape({
        wp_id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        grade: PropTypes.string.isRequired,
      }),
      package: PropTypes.shape({
        p_id: PropTypes.string.isRequired,
        p_materials: PropTypes.array,
        subcategory: PropTypes.string,
        description: PropTypes.string,
      }),
    }),
  }),
};

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    marginBottom: '3%',
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
    justifyContent: 'center',
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
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
    borderColor: '#696969',
    backgroundColor: '#696969',
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
});

export default SelectQuizToAdd;
