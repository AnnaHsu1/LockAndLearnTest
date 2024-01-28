import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const StudyMaterial = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText} testID="lessonTime">
          9:41
        </Text>
      </View>

      <View style={styles.studyContent}>
        <Text style={styles.lessonTitle} testID="lesonTitle">
          Additions
        </Text>
        <Text style={styles.studyDetail} testID="lesonContent">
          1 + 1 = 2
        </Text>
        <TouchableOpacity style={styles.takeQuizButton} onPress={() => navigation.navigate('TakeQuiz')}>
          <Text style={styles.takeQuizText} testID="takeQuizButton">
            Take Quiz
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#407BFF',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  studyContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonTitle: {
    fontSize: 36,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  studyDetail: {
    fontSize: 28,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  takeQuizButton: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 5,
  },
  takeQuizText: {
    color: '#3E5CAA',
    fontSize: 18,
  },
});

export default StudyMaterial;
