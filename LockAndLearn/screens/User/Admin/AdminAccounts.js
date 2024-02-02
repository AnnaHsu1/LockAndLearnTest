import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { CreateResponsiveStyle, DEVICE_SIZES, minSize } from 'rn-responsive-styles';

const AdminAccount = ({ route, navigation }) => {
  const styles = useStyles();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const response = await fetch('http://localhost:4000/users/allUsers');
      if (response.ok) {
        const data = await response.json();
        // Filter out the admin account
        const nonAdminUsers = data.filter((user) => user.email !== 'admin@lockandlearn.ca');
        setUsers(nonAdminUsers);
      } else {
        console.error('Failed to fetch users:', response.status);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:4000/users/deleteUser/${userId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        const updatedUsers = users.filter((user) => user._id !== userId);
        setUsers(updatedUsers);
        closeModal();
      } else {
        console.error('Failed to delete user:', response.status);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const openModal = (userId) => {
    setSelectedUser(userId);
    console.log('xxxxx' + userId);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsModalVisible(false);
    setPassword('');
    setPasswordError('');
  };

  const handleDeletePress = async () => {
    try {
      // Call the admin password check endpoint
      const response = await fetch('http://localhost:4000/users/adminCheckPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Admin password check successful, proceed with user deletion
        deleteUser(selectedUser);
      } else {
        // Admin password check failed
        setPasswordError(data.msg || 'Incorrect password. Please try again.');
      }
    } catch (error) {
      console.error('Error handling delete press:', error);
      setPasswordError('Error checking password. Please try again.');
    }
  };

  const handleUserProfileNavigation = (userId) => {
    // Navigate to AdminViewTeacherProfile and pass user._id
    navigation.navigate('AdminViewTeacherProfile', { userId });
  };

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Accounts</Text>
        </View>
        {/* Displaying the list of users */}
        <ScrollView style={styles.userListContainer}>
          {users.length > 0 ? (
            users.map((user, index) => (
              <View
                key={index}
                style={user.isParent ? styles.userContainerTutor : styles.userContainerTutor}
              >
                <TouchableOpacity onPress={() => handleUserProfileNavigation(user._id)}>
                  <Text style={[styles.userName, !user.isParent && styles.userNameTutor]}>
                    {user.firstName} {user.lastName}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.userDetails}>Email: {user.email}</Text>
                <Text style={styles.userDetails}>Birthday: {user.birthDate}</Text>
                <TouchableOpacity onPress={() => openModal(user._id)}>
                  <Text style={styles.deleteButton}>Delete</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.noUsersText}>No users available</Text>
          )}
        </ScrollView>
        {/* Modal for deletion confirmation */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Are you sure you want to delete this user?</Text>
              <Text style={styles.modalTextConfirm}>Enter your password to confirm deletion</Text>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                secureTextEntry={true}
                value={password}
                onChangeText={(text) => setPassword(text)}
              />
              {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={handleDeletePress} style={styles.confirmButton}>
                  <Text style={styles.confirmButtonText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={closeModal} style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const useStyles = CreateResponsiveStyle(
  {
    passwordInput: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 15,
      paddingHorizontal: 10,
    },
    errorText: {
      color: 'red',
      fontSize: 14,
      marginBottom: 10,
    },
    userName: {
      color: '#4F85FF',
      fontSize: 18,
      marginBottom: 5,
      textDecorationLine: 'underline',
    },

    userNameTutor: {
      fontWeight: 'bold',
      textDecorationLine: 'underline',
    },

    userContainerTutor: {
      backgroundColor: '#ffffff',
      borderRadius: 10,
      marginVertical: 10,
      padding: 10,
    },

    userDetails: {
      color: 'grey',
      fontSize: 16,
    },

    noUsersText: {
      color: '#ffffff',
      fontSize: 18,
      textAlign: 'center',
      marginTop: 20,
    },
    page: {
      backgroundColor: '#ffffff',
      maxWidth: '100%',
      flex: 1,
      alignItems: 'center',
    },
    container: {
      minWidth: '90%',
      minHeight: '65%',
      maxHeight: '90%',
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 20,
      paddingBottom: 20,
      marginTop: 20,
      borderRadius: 10,
      backgroundColor: '#4F85FF',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '2%',
      paddingBottom: 20,
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
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    modalContent: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 20,
      width: '50%',
      alignItems: 'center',
    },
    modalText: {
      fontSize: 23,
      marginBottom: 20,
      textAlign: 'center',
    },
    modalTextConfirm: {
      fontSize: 14,
      marginBottom: 20,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      borderRadius: 10,
      marginVertical: 10,
      height: 50,
      justifyContent: 'center',
      minWidth: 100,
    },
    confirmButton: {
      backgroundColor: '#F24E1E',
      padding: 10,
      borderRadius: 10,
      marginRight: 70,
      justifyContent: 'center',
    },
    confirmButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    cancelButton: {
      backgroundColor: '#407BFF',
      padding: 10,
      borderRadius: 10,
      justifyContent: 'center',
    },
    cancelButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    deleteButton: {
      color: 'red',
      marginTop: 10,
    },
    userListContainer: {
      paddingRight: 20,
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

export default AdminAccount;
