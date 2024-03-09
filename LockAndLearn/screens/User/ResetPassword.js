import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import PropTypes from 'prop-types';

const ResetPassword = ({ route, navigation }) => {
  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <Text style={styles.title}>Reset Password</Text>
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
