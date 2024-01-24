import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, TouchableOpacity, TextInput } from 'react-native';
import { CreateResponsiveStyle, DEVICE_SIZES, minSize, useDeviceSize } from 'rn-responsive-styles';
import { Button, Icon } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { getUser } from '../../../components/AsyncStorage';

const ParentMainAccountScreen = ({ navigation }) => {
  const styles = useStyles();
  const deviceSize = useDeviceSize();
  const route = useRoute();

  const [user, setUser] = useState(); // State to track authentication
  const [children, setChildren] = useState([]);
  const [parentalAccess, setParentalAccess] = useState(false);
  const [createPin, setCreatePin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const selectChild = (child) => {
    if (child) {
      // todo: redirect to either lock or free time screen depending on child's schedule
      // navigation.navigate('Locking');
      navigation.navigate('FreeTimeSession');
      // navigation.navigate('ChildProfile', { child: child });
    }
  };

  const handleRequest = async (newAccess) => {
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
      console.log(createPin, confirmPin);
      console.log(user._id);

      const response = await fetch('http://localhost:4000/users/createPIN/' + user._id, {
        method: 'POST',
        credentials: 'include', // Include cookies in the request
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pin: confirmPin }), // Send confirmPin in the request body
      });
      const data = await response.json();
    } else {
      // Returning access
      if (!pin) {
        setError('Please enter a PIN');
        return;
      }
      if (pin !== user.parentalAccessPIN) {
        setError('Incorrect PIN');
        return;
      }
    }
    setParentalAccess(!parentalAccess);
    navigation.navigate('ParentAccount', { child: null });
  };

  const getChildren = async () => {
    try {
      const user = await getUser();
      const response = await fetch('http://localhost:4000/child/getchildren/' + user._id, {
        method: 'GET',
        credentials: 'include', // Include cookies in the request
      });
      const data = await response.json();

      setUser(user);
      setChildren(data);
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
        <Text style={styles.title}>Welcome back alicelicielcileiclileie {user.firstName}!</Text>
      ) : (
        <Text style={styles.title}>Welcome back</Text>
      )}

      {parentalAccess ? (
        <View style={[styles.container, { alignItems: 'center' }]}>
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
          <View style={styles.requestAccess}>
            <View style={[{ width: '100%' }]}>
              <View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
                <Icon source="account-child-outline" color="#fff" size={30} />
                <Text style={styles.requestAccessTitle}>Parental Access</Text>
              </View>

              <View style={[styles.pin]}>
                {/* First time access */}
                {user.parentalAccessPIN ? (
                  <>
                    {/* Returning access */}
                    <Text style={styles.requestAccessText}>Enter PIN</Text>
                    <TextInput
                      style={styles.pinInput}
                      onChangeText={(pin) => setPin(pin)}
                      value={pin}
                    />
                    <TouchableOpacity
                      mode="contained"
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
                  <>
                    <Text style={styles.requestAccessText}>
                      It seems like this is your first time requesting parental access
                    </Text>
                    <Text style={styles.requestAccessText}>Please create a PIN</Text>
                    <TextInput
                      style={styles.pinInput}
                      onChangeText={(createPin) => setCreatePin(createPin)}
                      value={createPin}
                    />
                    <Text style={styles.requestAccessText}>Confirm PIN</Text>
                    <TextInput
                      style={styles.pinInput}
                      onChangeText={(confirmPin) => setConfirmPin(confirmPin)}
                      value={confirmPin}
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
                    marginTop: 10,
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
        <View style={styles.container}>
          {children ? <Text style={styles.text}>Select a Child </Text> : null}
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
          <StatusBar style="auto" />
          <Text
            style={[
              styles.text,
              { color: '#4F85FF', fontSize: 14, textAlign: 'center', paddingTop: 20 },
            ]}
            // todo: change navigation to ParentAccess with modal
            onPress={() => setParentalAccess(!parentalAccess)}
          >
            Parent Access
          </Text>
        </View>
      )}

      <Image style={styles.bottomCloud} source={require('../../../assets/bottomClouds.png')} />
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
      paddingTop: 20,
    },
    title: {
      color: '#4F85FF',
      fontSize: 24,
      textAlign: 'center',
      paddingVertical: 20,
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
      padding: 10,
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
      padding: 40,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    requestAccessTitle: {
      color: '#fff',
      fontSize: 20,
      fontWeight: 'bold',
    },
    requestAccessText: {
      color: '#fff',
      fontSize: 16,
      paddingTop: 10,
    },
    pin: {
      width: '100%',
      paddingTop: 20,
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

export default ParentMainAccountScreen;
