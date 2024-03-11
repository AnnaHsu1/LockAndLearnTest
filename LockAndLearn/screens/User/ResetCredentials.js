import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import PropTypes from 'prop-types';

const ResetPassword = ({ route, navigation }) => {
  var bcrypt = require('bcryptjs');

  const userEmail = route.params.email;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleResetPassword = async () => {
    if (password === confirmPassword) {
      //   Send to server
      console.log('Password reset');

      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);

      try {
        const response = await fetch(
          'https://data.mongodb-api.com/app/lock-and-learn-xqnet/endpoint/resetPassword',
          {
            method: 'PUT',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: userEmail,
              password: hash,
            }),
          }
        );
        const data = await response.json();
        if (response.status != 200) {
          console.log(data.msg);
          setError(data.msg);
        } else {
          navigation.navigate('Login');
        }
      } catch (error) {
        console.log(error.msg);
      }
    } else {
      console.log('Passwords do not match');
    }
  };

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <Text style={styles.title}>Reset password for {userEmail}</Text>
        <View style={[styles.inputContainer, { gap: 10 }]}>
          <View style={{ width: '100%' }}>
            <Text style={styles.text}>Please enter your new password</Text>
            <TextInput
              testID="password"
              style={styles.textInput}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
            />
          </View>
          <View style={{ width: '100%' }}>
            <Text style={styles.text}>Please confirm your new password</Text>
            <TextInput
              testID="confirmPassword"
              style={styles.textInput}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={true}
            />
          </View>
        </View>
        <TouchableOpacity
          onPress={handleResetPassword}
          style={styles.button}
          testID="submit-reset-password"
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

ResetPassword.propTypes = {
  route: PropTypes.shape({}).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    // Add other navigation functions and properties if they are used in your component
  }).isRequired,
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    maxWidth: '100%',
    alignItems: 'center',
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    paddingTop: 20,
    paddingHorizontal: 30,
    maxWidth: 500,
  },
  title: {
    fontSize: 22,
    color: '#ADADAD',
  },
  text: {
    fontSize: 16,
    color: '#ADADAD',
  },
  inputContainer: {
    alignItems: 'flex-start',
    height: 250,
    justifyContent: 'center',
  },
  textInput: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#407BFF',
    borderRadius: 5,
    padding: 10,
  },
  button: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#407BFF',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#407BFF',
    fontSize: 16,
  },
});

export default ResetPassword;
