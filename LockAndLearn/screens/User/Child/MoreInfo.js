import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ImageBackground, ScrollView } from 'react-native';
import { useWindowDimensions } from 'react-native';
import PropTypes from 'prop-types';
import { Icon } from 'react-native-paper';

const MoreInfo = ({ route, navigation }) => {
  const [deviceWidth, setDeviceWidth] = useState(0);
  const { width } = useWindowDimensions();
  const child = route.params?.child;
  const workPackage = route.params?.workPackage;
  const [grades, setGrades] = useState([]);
  const [status, setStatus] = useState([]);
  const [childAnswers, setChildAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingGrade, setIsLoadingGrade] = useState(true);
  const [isLoadingChildAnswer, setIsLoadingChildAnswer] = useState(true);
  const [isLoadingChildStatus, setIsLoadingChildStatus] = useState(true);

  // inital fetch
  useEffect(() => {
    fetchQuestions(workPackage._id);
    fetchChildQuizResults(workPackage._id, child._id);
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
        if (data.length > 0) {
          data.forEach((thisPackage) => {
            thisPackage.forEach((result) => {
              // store latest status for each package
              const childStatus = {
                packageID: result.packageID,
                quizID: result.quizID,
                status: result.status[result.status.length - 1],
              };
              status.push(childStatus);
              // store latest grade for each package
              grades.push(result.score[result.score.length - 1]);
              // store child results for each package
              const childAnswer = {
                childAnswers: result.childAnswers,
                packageID: result.packageID,
                quizID: result.quizID,
              }
              childAnswers.push(childAnswer);
            });
          });
          setIsLoadingChildStatus(false);
          setIsLoadingGrade(false);
          setIsLoadingChildAnswer(false);
        }
    }
    } catch (error) {
      console.error('Network error:', error);
    }
  };
  
  // function to get questions for a work package
  const fetchQuestions = async (workPackageId) => {
    try {
      const response = await fetch(`https://data.mongodb-api.com/app/lock-and-learn-xqnet/endpoint/getQuestions?id=${workPackageId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 201) {
        const data = await response.json();
        if (data.length > 0) {
          setQuestions(data);
          setIsLoading(false);
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
      <ScrollView style={styles.containerFile}>
        <Text style={styles.selectFiles} testID='header'>Details for {child.firstName}</Text>
        <Text style={styles.grade} testID='header'>on Subject - Grade 10</Text>
        {/* Display grade */}
        {isLoadingGrade ? (
          <Text style={{alignSelf:'center'}} >Loading grade...</Text>
        ) : (
          <Text style={styles.gradeText} >Child's grade: {(grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(2)}%</Text>
        )}
        <View style={styles.quizContainer}>
          {isLoading && isLoadingGrade && isLoadingChildAnswer && isLoadingChildStatus ? (
            <Text style={{alignSelf:'center'}} >Loading quizzes...</Text>
          ) : (
            questions.map((item, index) => {
              const statusColor = status.find(aStatus => aStatus.packageID === item.packageID)?.status === 'passed' ? '#0FA958' : '#A90F0F';
              return (
                // Display each quiz with its questions and answers
                <View 
                  key={index}
                  style={[styles.singleQuizContainer, {borderColor: statusColor}]}  
                >
                  <View
                    style={styles.quizTitle}
                  >
                    {isLoadingGrade ? (
                      <Text style={{alignSelf:'center'}} >Loading quiz...</Text>
                    ) : (
                      <Text style={styles.textTitleQuiz}>Quiz {index + 1}</Text>
                    )}  
                    {/* Display if child passed (#0FA958) or failed (#A90F0F) the quiz with icon */}
                    <Icon source={statusColor === '#0FA958' ? "check-bold" : "close-thick"} size={22} color={statusColor === '#0FA958' ? "#0FA958" : "#A90F0F"} />
                  </View>
                  {/* Display the coresponding questions, answers and child's answers */}
                  {item.questions.map((qa, qIndex) => {
                    const matchingChildAnswer = childAnswers.find(answer => answer.packageID === item.packageID && answer.quizID === item.quizID);
                    return (
                      <View 
                        key={qIndex}
                        style={styles.singleQuestionAnswerContainer}
                      >
                        {qIndex !== 0 && (
                          <View
                            style={[styles.divider, {borderColor: statusColor}]} 
                          />
                        )}
                        <Text style={[styles.subTitleQuiz, { paddingTop: qIndex !== 0 ? 10 : 5 }]}>Question {qIndex + 1}</Text>
                        <Text>{qa.questionText}</Text>
                        <Text style={styles.subTitleQuiz}>Answer</Text>
                        <Text>{qa.answer}</Text>
                        <Text style={styles.subTitleQuiz}>Child's Answer:</Text>
                        {/* Handle child's answer */}
                        {matchingChildAnswer && matchingChildAnswer.childAnswers && matchingChildAnswer.childAnswers.length > qIndex ? (
                          matchingChildAnswer.childAnswers[qIndex] ? (
                            <Text>{matchingChildAnswer.childAnswers[qIndex]}</Text>
                          ) : (
                            <Text>No answer</Text>
                          )                          
                        ) : (
                          <Text>No answer</Text>
                        )}
                      </View>
                    );
                  })}
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );                 
};

// Prop type check
MoreInfo.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      child: PropTypes.object.isRequired,
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
  grade: {
    color: '#696969',
    fontSize: 25,
    marginTop: -5,
    fontWeight: '500',
    textAlign: 'center',
  },
  gradeText: {
    marginTop: 5,
    alignSelf: 'center',
    fontSize: 17
  },
  quizContainer: {
    marginTop: 5,
    width: '80%',
    paddingHorizontal: 20,
    alignSelf: 'center'
  },
  singleQuizContainer: {
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
    marginBottom: 15,
  },
  quizTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textTitleQuiz: {
    fontSize:24,
    fontWeight: 300
  },
  singleQuestionAnswerContainer: {
    paddingHorizontal: 20,
  },
  divider: {
    paddingTop: 10,
    borderBottomWidth: 1,
  },
  subTitleQuiz: {
    fontSize: 20,
    fontWeight: 450
  },
});

export default MoreInfo;