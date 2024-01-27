import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import { CreateResponsiveStyle, DEVICE_SIZES, minSize } from 'rn-responsive-styles';
import { Button, Icon } from 'react-native-paper';
import PropTypes from 'prop-types';

const ChildSettings = ({ route, navigation }) => {
  const styles = useStyles();
  const [child, setChild] = useState({});
  const childSelected = route.params.child;

  // On page load, set child to child pass through route parameters
  useEffect(() => {
    setChild(childSelected);
  }, []);

  return (
    <View style={styles.page}>
      <View style={[styles.container, { justifyContent: 'space-between' }]}>
        <View style={styles.header}>
          <Icon source="account-circle" color="#fff" size={30} />
          <Text style={styles.title}>
            {child.firstName} {child.lastName}
          </Text>
        </View>
        <View style={[{ flex: 1, justifyContent: 'space-around' }]}>
          {/* Device Controls */}
          <Button
            testID="device-controls"
            mode="contained"
            onPress={() => {
              console.log('See performance');
            }}
            style={[styles.button, styles.full_width]}
          >
            <Text style={styles.text}>Device Controls</Text>
          </Button>
          {/* Passing Grade*/}
          <Button
            testID="passing-grade"
            mode="contained"
            onPress={() => {
              navigation.navigate('ChildPassingGradePerSubject', { child: child });
            }}
            style={[styles.button, styles.full_width]}
          >
            <Text style={styles.text}>Passing Grade</Text>
          </Button>
          {/* Scheduling */}
          <Button
            testID="scheduling"
            mode="contained"
            onPress={() => {
              navigation.navigate('ChildTimeframes', { child: child });
            }}
            style={[styles.button, styles.full_width]}
          >
            <Text style={styles.text}>Scheduling</Text>
          </Button>
        </View>
      </View>
    </View>
  );
};

ChildSettings.propTypes = {
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

const useStyles = CreateResponsiveStyle(
  {
    page: {
      backgroundColor: '#ffffff',
      maxWidth: '100%',
      flex: 1,
      alignItems: 'center',
    },
    container: {
      minWidth: '90%',
      minHeight: '50%',
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 20,
      marginTop: 20,
      borderRadius: 10,
      backgroundColor: '#4F85FF',
    },
    header: {
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '20%',
    },
    title: {
      color: '#ffffff',
      fontSize: 24,
      textAlign: 'center',
      paddingTop: 15,
    },
    button: {
      color: '#4F85FF',
      backgroundColor: '#ffffff',
      borderRadius: 10,
      marginVertical: 10,
      height: 80,
      justifyContent: 'center',
      minWidth: 100,
    },
    modalButtons: {
      borderRadius: 10,
      marginVertical: 10,
      height: 50,
      justifyContent: 'center',
      minWidth: 100,
    },
    full_width: {
      minWidth: '100%',
    },
    bottomCloud: {
      display: 'flex',
      justifyContent: 'flex-end',
      width: '100%',
      height: 250,
      resizeMode: 'stretch',
    },
    text: {
      color: '#4F85FF',
      fontSize: 20,
      padding: 10,
    },
    options: {
      flex: 0.75,
      justifyContent: 'space-around',
      alignItems: 'center',
    },
  },
  {
    [minSize(DEVICE_SIZES.MD)]: {
      container: {
        minWidth: 500,
        width: 500,
      },
      bottomCloud: {
        width: '100%',
        height: 300,
        resizeMode: 'stretch',
        flex: 1,
      },
    },
  }
);

export default ChildSettings;
