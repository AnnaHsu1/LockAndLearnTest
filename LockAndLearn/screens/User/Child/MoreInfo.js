import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, FlatList } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { getUser } from '../../../components/AsyncStorage';
import { useWindowDimensions } from 'react-native';
import PropTypes from 'prop-types';
import { Icon } from 'react-native-paper';

const MoreInfo = ({ route, navigation }) => {
  const [workPackages, setWorkPackages] = useState([]);
  const [deviceWidth, setDeviceWidth] = useState(0);
  const { width } = useWindowDimensions();
  const child = route.params?.child;
  const workPackage = route.params?.workPackage;
  const [grades, setGrades] = useState([]);
  const [childAnswers, setChildAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [questionsID, setQuestionsID] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingGrade, setIsLoadingGrade] = useState(true);

  // inital fetch
  useEffect(() => {
    fetchChildQuizResults(workPackage._id, child._id);
    fetchQuestions(workPackage._id);
  }, []);



  // function to child quiz results given work package id and child id
  const fetchChildQuizResults = async (workPackageId, childId) => {
    try {
      const response = await fetch(`http://localhost:4000/childQuizResults/getQuizResultsGivenWpID/${childId}/${workPackageId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 201) {
        const data = await response.json();
        console.log(data);
        if (data.length > 0) {
          data.forEach((thisPackage) => {
            // console.log(thisPackage);
            thisPackage.forEach((result) => {
              // store latest grade for each package
              grades.push(result.score[result.score.length - 1]);
              setIsLoadingGrade(false);
              // setGrades((prevGrades) => ({
              //   ...prevGrades,
              //   [result.packageID]: result.score[result.score.length - 1],
              // }));
              // store child results for each package
              setChildAnswers((prevChildAnswers) => ({
                ...prevChildAnswers,
                [result.packageID]: result.childAnswers,
            }));
          });
          });
        }
    }
    } catch (error) {
      console.error('Network error:', error);
    }
  };
  
  // function to get questions for a work package
  const fetchQuestions = async (workPackageId) => {
    try {
      const response = await fetch(`http://localhost:4000/workPackages/getQuestions/${workPackageId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 201) {
        const data = await response.json();
        if (data.length > 0) {
          
          // questions.push(data);
          console.log(data);
          setQuestions(data);
          setIsLoading(false);
          // data.forEach((result) => {
          //   console.log(result);
          //   result.questions.forEach((question) => {
          //     console.log(question);
          //     questions.push(question);
          //   });
          // });
          // data.forEach((result) => {
          //   setQuestions((prevQuestions) => ({
          //     ...prevQuestions,
          //     [result.packageID]: result.questions,
          //   }));
          // });
        }
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  return (
    <ImageBackground
      source={require('../../../assets/backgroundCloudyBlobsFull.png')}
      resizeMode="cover"
      style={styles.container}
    >
      <View style={styles.containerFile}>
        {/* Display title and name of child */}
        <Text style={styles.selectFiles} testID='header'>Details for {child.firstName}</Text>
        <Text style={styles.selectFiles2} testID='header'>on Subject - Grade 10</Text>
        {/* Display overview details */}
        {isLoadingGrade ? (
          <Text>Loading...</Text>
        ) : (
          <Text>Child's grade: {(grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(2)}</Text>
        )}
        {console.log('Child Answers:', childAnswers)} 
        <View style={{ marginTop: 5, width: '100%', backgroundColor: "pink" }}>
          {isLoading ? (
            <Text>Loading...</Text>
          ) : (
            questions.map((item, index) => (
              <View key={index}>
                {/* <Text>{item.packageID}</Text> */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: 'lightblue',
                    padding: 10,
                    margin: 10,
                  }}
                >
                  <Text>Question</Text>
                  <Icon name="plus" size={30} color="#900" />
                </View>
                {item.questions.map((qa, qIndex) => ( // Renaming 'question' to 'qa' for clarity
                  <View key={qIndex}>
                    <Text>Question</Text>
                    <Text>{qa.questionText}</Text>
                    <Text>Answer</Text>
                    <Text>{qa.answer}</Text>
                    <Text>Child's Answer</Text>
                  </View>
                ))}
              </View>
            ))
          )}
        </View>
      </View>
    </ImageBackground>
  );
};

MoreInfo.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      child: PropTypes.object.isRequired, // or more specific shape if you know the structure
    }),
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  statusText: {
    marginVertical: 3,
    color: 'white',
    fontSize: 14,
    alignSelf: 'center',
    justifyContent:'center',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonAddMaterial: {
    backgroundColor: '#407BFF',
    width: 190,
    height: 35,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    marginTop: 10,
    marginBottom: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc',
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
    fontSize: 35,
    fontWeight: '500',
    marginTop: '2%',
    textAlign: 'center',
  },
  selectFiles2: {
    color: '#696969',
    fontSize: 25,
    marginTop: -5,
    fontWeight: '500',
    textAlign: 'center',
  },
  workPackageItemContainer: {
    alignItems: 'center',
    width: '100%',
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  workPackageItem: {
    borderColor: '#407BFF',
    borderWidth: 1,
    padding: 13,
    borderRadius: 15,
    height: 150,
    justifyContent: 'space-between',
  },
  workPackageTitle: {
    fontSize: 24,
    color: '#407BFF',
  },
  workPackageText: {
    fontSize: 14,
    color: '#696969',
  },
  buttonText: {
    color: '#FFFFFF',
    alignItems: 'center',
    fontSize: 15,
    fontWeight: '500',
  },
});

export default MoreInfo;