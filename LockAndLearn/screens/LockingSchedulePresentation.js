import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, TextInput } from 'react-native';

// Import the navigation actions and hooks from React Navigation
import { useNavigation } from "@react-navigation/native";

const LockingSchedulePresentation = () => {
    const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordBorderColor, setPasswordBorderColor] = useState('#407BFF');

  const closeSession = () => {
    if (password === '1234') {
      // Navigate to the "Home" screen when the password is "1234"
      navigation.navigate("Home");
    } else {
      setPasswordBorderColor('red');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText} testID="header-time">9:41</Text>
        <TouchableOpacity style={styles.endSessionButton} onPress={() => setModalVisible(true)} testID="end-session-button">
          <Text style={styles.endSessionText}>End Session</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.lessonContent}>
        <Text style={styles.lessonTitle} testID="lesson-title">Lesson Schedule</Text>
        <Text style={styles.subject} testID="subject-text">Math</Text>
        <Text style={styles.duration} testID="subject-time">⏱️ 1h40</Text>
        <Text style={styles.details} testID="subject-title1">• Additions</Text>
        <Text style={styles.details} testID="subject-title2">• Subtractions</Text>
        <Text style={styles.details} testID="subject-quiz">• Quiz (30 questions)</Text>
        <Text style={styles.passCriteria} testID="subject-passCriteria">
          The quiz must be passed with a grade of 75% or higher
        </Text>
        <TouchableOpacity
            style={styles.startLearningButton}
            onPress={() => navigation.navigate('StudyMaterial')}
            testID="start-learning-button"
        >
            <Text style={styles.startLearningText}>Start Learning</Text>
        </TouchableOpacity>
        {/* <Image
          source={require('../assets/learning_illustration.png')}
          style={styles.learningIllustration}
        /> */}
      </View>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle} testID="modal-title">End Session</Text>
            <Text style={styles.modalText} testID="enterPasswordText">Enter Password:</Text>
            <TextInput
              style={[styles.modalInput, { borderColor: passwordBorderColor }]}
              testID="passwordInput"
              secureTextEntry={true}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordBorderColor('#407BFF');
              }}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={closeSession}>
                <Text style={styles.modalButtonText}>Enter</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  endSessionButton: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 5,
  },
  endSessionText: {
    color: '#3E5CAA',
  },
  lessonContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonTitle: {
    fontSize: 36,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  subject: {
    fontSize: 28,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  duration: {
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  details: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  passCriteria: {
    fontSize: 18,
    color: '#FFFFFF',
    marginVertical: 20,
  },
  startLearningButton: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  startLearningText: {
    color: '#3E5CAA',
    fontSize: 18,
  },
  learningIllustration: {
    width: 250,
    height: 250,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 30,
    width: '80%',
    height: '40%',
    borderRadius: 10,
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#3E5CAA',
    marginBottom: 20,
  },
  modalText: {
    marginBottom: 10,
    color: '#3E5CAA',
  },
  modalInput: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#407BFF',
    borderRadius: 5,
    padding: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    backgroundColor: '#407BFF',
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default LockingSchedulePresentation;
