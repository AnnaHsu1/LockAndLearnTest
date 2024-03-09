import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { CreateResponsiveStyle, DEVICE_SIZES, minSize } from 'rn-responsive-styles';
import { Button, Icon } from 'react-native-paper';
import PropTypes from 'prop-types';

const ForgotPassword = ({ route, navigation }) => {
  const [child, setChild] = useState({});
  const childSelected = route.params.child;

  // On page load, set child to child pass through route parameters
  useEffect(() => {
    setChild(childSelected);
  }, []);

  return <View style={styles.page}></View>;
};

ForgotPassword.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      child: PropTypes.shape({
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        // Add other properties of 'child' object here with their respective types
      }),
    }).isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    // Add other navigation functions and properties if they are used in your component
  }).isRequired,
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    maxWidth: '100%',
    flex: 1,
    alignItems: 'center',
  },
});

export default ForgotPassword;
