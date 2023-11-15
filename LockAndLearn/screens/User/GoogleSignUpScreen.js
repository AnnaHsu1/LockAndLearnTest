import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { StyleSheet, Text, TextInput, View, Image, navigation } from 'react-native';
import { RadioButton, Button } from 'react-native-paper';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { CreateResponsiveStyle, DEVICE_SIZES, minSize, useDeviceSize } from 'rn-responsive-styles';
import {
  getItem,
  setItem,
  removeItem,
  setUserTokenWithExpiry,
} from '../../components/AsyncStorage';

WebBrowser.maybeCompleteAuthSession();

const GoogleSignUpScreen = ({ route, navigation }) => {
  const styles = useStyles();
  const deviceSize = useDeviceSize();
  const [checked, setChecked] = React.useState('first');
  const { userInfo } = route.params;
  const [googleUser, setGoogleUser] = useState(null);

  const [fdata, setFdata] = useState({
    FirstName: '',
    LastName: '',
    isParent: null,
    Email: '',
    Password: '',
    CPassword: '',
    DOB: '',
  });

  const [errors, setErrors] = useState({
    Fields: '',
    Email: '',
    DOB: '',
  });

  // useEffect to watch for changes in checked state and update fdata.Account
  useEffect(() => {
    setFdata((prevFdata) => ({
      ...prevFdata,
      isParent: checked,
    }));
  }, [checked]);

  useEffect(() => {
    setGoogleUser(userInfo);
    // console.log('Google User props', userInfo);
  }, [userInfo]);

  const configureFdata = () => {
    fdata.FirstName = googleUser.given_name;
    fdata.LastName = googleUser.family_name;
    fdata.Email = googleUser.email;
    fdata.Password = googleUser.id;
    fdata.CPassword = googleUser.id;
    // console.log('fdata', fdata);
  };

  const handleSubmit = async () => {
    configureFdata();

    try {
      const response = await fetch('http://localhost:4000/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fdata), // Send user data as JSON
      });
      const data = await response.json();
      if (response.status === 201) {
        // User created successfully
        console.log('User created successfully in database!', data);
        // await setItem('@token', JSON.stringify(data.user));
        await setUserTokenWithExpiry('@token', data.user);
        //Add redirect
        {
          data?.user.isParent
            ? navigation.navigate('ParentAccount')
            : navigation.navigate('UserLandingPage');
        }
      } else {
        setErrors({
          Fields: '',
          DOB: '',
        });
        if (data.msg === 'All fields must be filled.') {
          setErrors((prevErrors) => ({
            ...prevErrors,
            Fields: data.msg,
          }));
        } else if (
          data.msg === 'Invalid email format.' ||
          data.msg === 'Email is already in use.' ||
          data.msg === 'Email is already in use.'
        ) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            Email: data.msg,
          }));
        } else if (data.msg === 'Invalid date of birth. Date cannot be ahead of today.') {
          setErrors((prevErrors) => ({
            ...prevErrors,
            DOB: data.msg,
          }));
        }
      }
    } catch (error) {
      console.error('Submitting error when creating google user:', error);
    }
  };

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        {googleUser ? (
          <Text style={styles.title}>Hey {googleUser.given_name}!</Text>
        ) : (
          <Text style={styles.title}>Hey!</Text>
        )}
        {errors.Fields ? <Text style={styles.box}>{errors.Fields}</Text> : null}
        {errors.Email ? <Text style={{ color: 'red' }}>{errors.Email}</Text> : null}
        {errors.DOB ? <Text style={{ color: 'red' }}>{errors.DOB}</Text> : null}
        {/* Account type */}
        <View style={styles.item}>
          <Text style={styles.field}>Please select your account type</Text>
          <View style={[styles.radio, styles.row]}>
            <View style={[styles.radio_item, styles.row]}>
              <RadioButton
                value="true"
                status={checked === 'true' ? 'checked' : 'unchecked'}
                onPress={() => setChecked('true')}
                color="#4F85FF"
              />
              <Text style={checked === 'true' ? styles.checked : styles.field}>Parent</Text>
            </View>

            <View style={[styles.radio_item, styles.row]}>
              <RadioButton
                value="false"
                status={checked === 'false' ? 'checked' : 'unchecked'}
                onPress={() => setChecked('false')}
                color="#4F85FF"
              />
              <Text style={checked === 'false' ? styles.checked : styles.field}>Teacher</Text>
            </View>
          </View>

          <View style={styles.item}>
            <Text style={styles.field}>Birth Date (YYYY-MM-DD)</Text>
            <TextInput
              testID="birthdate-input"
              style={[styles.textbox, styles.full_width]}
              value={fdata.DOB}
              onChangeText={(newText) => setFdata({ ...fdata, DOB: newText })}
            />
            {errors.DOB ? <Text style={{ color: 'red' }}>{errors.DOB}</Text> : null}
          </View>

          <Button
            testID="signup-button"
            mode="contained"
            onPress={() => {
              handleSubmit();
            }}
            style={[styles.button, styles.full_width]}
          >
            Complete account
          </Button>
        </View>
      </View>
    </View>
  );
};

const useStyles = CreateResponsiveStyle(
  {
    page: {
      backgroundColor: '#ffffff',
      maxWidth: wp('100%'),
      flex: 1,
      alignItems: 'center',
    },
    container: {
      minWidth: wp('90%'),
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 20,
    },
    item: {
      display: 'flex',
      width: '100%',
      paddingVertical: 10,
    },
    row: {
      flexDirection: 'row',
    },
    nameInput: {
      justifyContent: 'space-between',
    },
    radio: {
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    radio_item: {
      alignItems: 'center',
      alignContent: 'center',
    },
    title: {
      color: '#4F85FF',
      fontSize: 24,
      textAlign: 'left',
    },
    button: {
      color: '#ffffff',
      backgroundColor: '#4F85FF',
      borderRadius: 10,
    },
    field: {
      color: '#ADADAD',
    },
    checked: {
      color: '#000',
    },
    textbox: {
      display: 'flex',
      minHeight: 30,
      borderRadius: 10,
      borderColor: '#407BFF',
      borderStyle: 'solid',
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderWidth: 1,
    },
    box: {
      borderWidth: 1,
      borderColor: 'red',
      color: 'red',
      padding: 10,
      marginTop: 10,
    },
  },
  {
    [minSize(DEVICE_SIZES.MD)]: {
      container: {
        minWidth: 500,
        width: 500,
      },
    },
  }
);

export default GoogleSignUpScreen;
