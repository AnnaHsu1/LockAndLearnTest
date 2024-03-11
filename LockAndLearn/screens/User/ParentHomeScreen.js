import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, TouchableOpacity, TextInput } from 'react-native';
import { CreateResponsiveStyle, DEVICE_SIZES, minSize, useDeviceSize } from 'rn-responsive-styles';
import { Button, Icon } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { getUser } from '../../components/AsyncStorage';
import bcrypt from 'bcryptjs';

const ParentHomeScreen = ({ navigation }) => {
  const styles = useStyles();
  const route = useRoute();

  const [user, setUser] = useState();
  const [children, setChildren] = useState([]);
  const [parentalAccess, setParentalAccess] = useState(false);
  const [createPin, setCreatePin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  // Select a child and navigate to see if it is time to lock or free time
  const selectChild = async (child) => {
    if (child) {
      (await isLockingTime(child))
        ? navigation.navigate('Locking')
        : navigation.navigate('FreeTimeSession');
      // console.log(await isLockingTime(child));
    }
  };

  // Check if it is locking time with timeframes that are returned
  const isLockingTime = async (child) => {
    try {
      // console.log(child);
      const response = await fetch(
        `https://data.mongodb-api.com/app/lock-and-learn-xqnet/endpoint/getTimeframes?childId=${child._id}`
      );

      // Array of timeframes
      const data = await response.json();
      console.log(data);
      if (response.status != 200) {
        // Error with request
        setError('Error with request');
        return;
      } else {
        // No error with request
        // Check if there are any timeframes
        if (data.length == 0) {
          // No timeframes
          setError('No schedule set for this child');
          return;
        } else {
          var isLockingTime = false;
          const timeframes = data;

          // Get the current date
          const date = new Date();
          // Get the current day, hour, and minute
          const day = date.toString().substring(0, 3);
          const hour = date.getHours();
          const min = date.getMinutes();

          timeframes.forEach((timeframe) => {
            // 1. Check day
            if (timeframe.day.substring(0, 3) == day) {
              // 2. Check active
              if (timeframe.isActive) {
                const startTime = timeframe.startTime.split(':');
                const endTime = timeframe.endTime.split(':');
                const startHour = parseInt(startTime[0]);
                const startMin = parseInt(startTime[1]);
                const endHour = parseInt(endTime[0]);
                const endMin = parseInt(endTime[1]);
                // 3. Check time
                if (
                  (hour > startHour || (hour === startHour && min >= startMin)) &&
                  (hour < endHour || (hour === endHour && min <= endMin))
                ) {
                  console.log('Locking time');
                  isLockingTime = true;
                }
              }
            }
          });
          return isLockingTime;
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Handle the request for parental access
  const handleRequest = async (newAccess) => {
    let success = null;
    if (newAccess) {
      // First time access
      if (!createPin || !confirmPin) {
        setError('Please enter a PIN');
        return;
      }
      if (createPin !== confirmPin) {
        setError('PINs do not match');
        return;
      }

      try {
        const salt = await bcrypt.genSalt();
        const pinEncrypted = await bcrypt.hash(confirmPin, salt);
        const response = await fetch(
          'https://data.mongodb-api.com/app/lock-and-learn-xqnet/endpoint/createParentPIN',
          {
            method: 'POST',
            credentials: 'include', // Include cookies in the request
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: user.email, pin: pinEncrypted }), // Send confirmPin in the request body
          }
        );
        if (response.status != 200) {
          setError('Error with request');
          return;
        }
        if (response.status == 200) {
          success = await response.json();
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      // Returning access
      if (!pin) {
        setError('Please enter a PIN');
        return;
      } else {
        try {
          const response = await fetch(
            'https://data.mongodb-api.com/app/lock-and-learn-xqnet/endpoint/getParentPIN',
            {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email: user.email }),
            }
          );

          if (response.status != 200) {
            setError('Error with request');
            return;
          }
          if (response.status == 200) {
            const data = await response.json();
            const encryptedPIN = data.parentalAccessPIN;
            success = await bcrypt.compare(pin, encryptedPIN);
          }
        } catch (err) {
          console.log(err);
        }
      }
    }
    if (success) {
      setParentalAccess(!parentalAccess);
      navigation.navigate('ParentAccount', { child: null });
    } else {
      setError('Incorrect PIN');
    }
  };

  // Get the children of the user
  const getChildren = async () => {
    try {
      const user = await getUser();
      setUser(user);
      const response = await fetch(
        'https://data.mongodb-api.com/app/lock-and-learn-xqnet/endpoint/getChildren',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user._id }),
        }
      );
      const data = await response.json();
      if (response.status != 200) {
        setError(
          'No child found. Please create a PIN to access parental controls and to create a child.'
        );
        return;
      } else {
        setChildren(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getChildren();

    // Check if there are updated children passed as a parameter via route.params.
    if (route.params && route.params.updatedChildren) {
      // Update the state with the updated children.
      setChildren(route.params.updatedChildren);
    }
  }, [route.params]);

  return (
    <View style={styles.page}>
      {user ? (
        <Text style={styles.title}>Welcome back {user.firstName}!</Text>
      ) : (
        <Text style={styles.title}>Welcome back</Text>
      )}
      {/* Is parent requesting parental access, if yes then show the pin inputs, else show children */}
      {parentalAccess || children.length == 0 ? (
        <View style={[styles.container, { alignItems: 'center' }]}>
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
          <View style={styles.requestAccess}>
            <View style={[{ width: '100%' }]}>
              <View
                style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}
              >
                <Icon source="account-child-outline" color="#fff" size={25} />
                <Text style={styles.requestAccessTitle}>Parental Access</Text>
              </View>

              <View style={[styles.pin]}>
                {/* First time access */}
                {user?.parentalAccessPIN != '' ? (
                  <>
                    {/* Returning access */}
                    <Text style={styles.requestAccessText}>Enter PIN</Text>
                    <TextInput
                      style={styles.pinInput}
                      testID="pin-input"
                      onChangeText={(pin) => setPin(pin)}
                      value={pin}
                    />
                    <Text style={styles.link} onPress={() => navigation.navigate('ForgotCredentials', { credentials: 'pin' })}>
                      Forgot PIN?
                    </Text>
                    <TouchableOpacity
                      mode="contained"
                      testID='confirm-button'
                      onPress={() => {
                        handleRequest(false);
                      }}
                      style={[
                        {
                          backgroundColor: '#4F85FF',
                          borderRadius: 10,
                          marginTop: 10,
                          height: 40,
                          alignItems: 'center',
                          justifyContent: 'center',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          {
                            color: '#fff',
                            borderColor: '#fff',
                            borderWidth: 1,
                            width: '100%',
                            textAlign: 'center',
                            padding: 10,
                          },
                        ]}
                      >
                        Confirm
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  // First time access
                  <>
                    <Text style={styles.requestAccessText}>
                      It seems like this is your first time requesting parental access.
                    </Text>
                    <Text style={styles.requestAccessText}>Please create a PIN</Text>
                    <TextInput
                      style={styles.pinInput}
                      onChangeText={(createPin) => setCreatePin(createPin)}
                      value={createPin}
                      testID="create-pin-input"
                    />
                    <Text style={styles.requestAccessText}>Confirm PIN</Text>
                    <TextInput
                      style={styles.pinInput}
                      onChangeText={(confirmPin) => setConfirmPin(confirmPin)}
                      value={confirmPin}
                      testID="confirm-pin-input"
                    />
                    <TouchableOpacity
                      mode="contained"
                      onPress={() => {
                        handleRequest(true);
                      }}
                      style={[
                        {
                          backgroundColor: '#4F85FF',
                          borderRadius: 10,
                          marginTop: 10,
                          height: 40,
                          alignItems: 'center',
                          justifyContent: 'center',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          {
                            color: '#fff',
                            borderColor: '#fff',
                            borderWidth: 1,
                            width: '100%',
                            textAlign: 'center',
                            padding: 10,
                          },
                        ]}
                      >
                        Confirm
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>

              <TouchableOpacity
                mode="contained"
                onPress={() => {
                  setParentalAccess(!parentalAccess);
                }}
                style={[
                  {
                    backgroundColor: '#4F85FF',
                    borderRadius: 10,
                    marginTop: 5,
                    height: 40,
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                ]}
              >
                <Text style={[{ color: '#fff' }]}>Go Back</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        // Show children
        <View style={styles.container}>
          {children.length != 0 ? (
            <>
              <Text style={styles.text}>Select a Child</Text>
              {children.map((child) => (
                <Button
                  key={child._id}
                  testID={`child-${child._id}`}
                  mode="contained"
                  contentStyle={{
                    minWidth: '90%',
                    maxWidth: '90%',
                    minHeight: 78,
                    justifyContent: 'flex-start',
                  }}
                  onPress={() => {
                    selectChild(child);
                  }}
                  style={[styles.button, styles.full_width]}
                >
                  <Icon source="account-circle" color="#fff" size={20} />
                  <Text style={styles.child}>{child.firstName}</Text>
                </Button>
              ))}
            </>
          ) : null}

          <StatusBar style="auto" />
          <Text
            style={[
              styles.text,
              { color: '#4F85FF', fontSize: 14, textAlign: 'center', paddingTop: 20 },
            ]}
            onPress={() => setParentalAccess(!parentalAccess)}
          >
            Parent Access
          </Text>
        </View>
      )}

      <Image style={styles.bottomCloud} source={require('../../assets/bottomClouds.png')} />
    </View>
  );
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
      minHeight: '65%',
      paddingLeft: 20,
      paddingRight: 20,
    },
    title: {
      color: '#4F85FF',
      fontSize: 24,
      textAlign: 'center',
      paddingTop: 20,
      paddingBottom: 10,
    },
    button: {
      color: '#ffffff',
      backgroundColor: '#4F85FF',
      borderRadius: 10,
      marginTop: 10,
      height: 78,
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
      color: '#ADADAD',
      fontSize: 20,
    },
    errorContainer: {
      borderColor: '#FF0000',
      borderWidth: 1,
      width: '100%',
      marginVertical: 10,
    },
    errorText: {
      color: '#FF0000',
      fontSize: 16,
      padding: 5,
    },
    child: {
      paddingLeft: 10,
      textAlign: 'center',
      justifyContent: 'center',
      fontSize: 20,
    },
    requestAccess: {
      backgroundColor: '#4F85FF',
      borderRadius: 25,
      paddingHorizontal: 40,
      paddingTop: 15,
      paddingBottom: 10,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    requestAccessTitle: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    requestAccessText: {
      color: '#fff',
      fontSize: 14,
      paddingVertical: 10,
      textAlign: 'center',
    },
    pin: {
      width: '100%',
      paddingTop: 5,
    },
    pinInput: {
      height: 40,
      borderColor: '#fff',
      borderWidth: 1,
      backgroundColor: '#fff',
      borderRadius: 10,
      marginTop: 10,
      marginBottom: 10,
      width: '100%',
      paddingLeft: 10,
    },
    link: {
      color: '#fff',
      fontSize: 12,
      paddingBottom: 20,
      textAlign: 'center',
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

export default ParentHomeScreen;
