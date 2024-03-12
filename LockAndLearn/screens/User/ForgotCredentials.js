import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import PropTypes from 'prop-types';
import { CiCircleCheck } from 'react-icons/ci';
import emailjs from '@emailjs/browser';

const ForgotCredentials = ({ route, navigation }) => {
  const credential = route.params?.credential;

  const [emailTo, setEmailTo] = useState('');
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [error, setError] = useState('');

  const userExist = async () => {
    try {
      const response = await fetch(
        'https://data.mongodb-api.com/app/lock-and-learn-xqnet/endpoint/getUserByEmail?email=' +
          emailTo
      );
      if (response.status != 200) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.log(error.msg);
    }
  };

  const sendEmail = async () => {
    const userExists = await userExist();
    // User does not exist
    if (!userExists) {
      setError('User does not exist! Please try again...');
      return;
    }

    const templateParams = {
      to_email: emailTo,
    };

    if (credential === 'password') {
      // Send email forgot password
      await emailjs.send(
        'service_dli3uxv',
        'template_xb5grlm',
        templateParams,
        '6c2FzSRkKYEfzJ5VA'
      );
      setConfirmationSent(true);
    } else if (credential == 'pin') {
      // Send email forgot PIN
      await emailjs.send(
        'service_7tt8qrc',
        'template_98ikbxb',
        templateParams,
        'yLk4-T5Ql27rmRllv'
      );
      setConfirmationSent(true);
    }
  };

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        {!confirmationSent ? (
          // Enter email to send confirmation
          <>
            <Text style={styles.title}>
              Did you forget your {credential == 'password' ? 'password' : 'parental PIN'}?
            </Text>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <View style={styles.inputContainer}>
              <Text style={styles.text}>Please enter your email</Text>
              <TextInput
                style={styles.textInput}
                value={emailTo}
                onChangeText={setEmailTo}
                testID="email"
              />
            </View>
            <TouchableOpacity onPress={sendEmail} style={styles.button} testID="submit">
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </>
        ) : (
          //   Add time lag for message then back to screen
          <View style={styles.message}>
            <Text style={styles.title}>
              Reset confirmation email sent! Please wait patiently...
            </Text>
            <CiCircleCheck color="green" size={100} />
          </View>
        )}
      </View>
    </View>
  );
};

ForgotCredentials.propTypes = {
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
  message: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'red',
    alignItems: 'center',
    padding: 10,
    marginTop: 20,
  },
});

export default ForgotCredentials;
