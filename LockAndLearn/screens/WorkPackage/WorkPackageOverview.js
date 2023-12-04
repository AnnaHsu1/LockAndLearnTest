import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, FlatList } from 'react-native';
import { Icon } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import { getItem } from '../../components/AsyncStorage';

const WorkPackageOverview = () => {
  const navigation = useNavigation();
  const [workPackages, setWorkPackages] = useState([]);
  const [deleteConfirmationModalVisible, setDeleteConfirmationModalVisible] = useState(false);
  const [selectedWorkPackageId, setSelectedWorkPackageId] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Fetch work packages when the screen is focused
      fetchWorkPackages();
    });
  
    // Clean up function (optional)
    return unsubscribe;
  }, [navigation]);
  

  // function to get all work packages from the user
  const fetchWorkPackages = async () => {
    const token = await getItem('@token');
    const user = JSON.parse(token);
    const userId = user._id;
    if (userId) {
      try {
        const response = await fetch(
          `http://localhost:4000/workPackages/fetchWorkpackages/${userId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        if (response.status === 200) {
          const data = await response.json();
          setWorkPackages(data);
        } else {
          console.error('Error fetching workPackages');
        }
      } catch (error) {
        console.error('Network error:', error);
      }
    } else {
      console.log('No work package found');
    }
  };

  // function to delete a work package
  const deleteWorkPackage = async (workPackageId) => {
    try {
      setSelectedWorkPackageId(workPackageId);
      setDeleteConfirmationModalVisible(true);
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  // function to display the work package information
  const renderWorkPackage = (workPackage) => {
    return (
      <View key={workPackage._id} style={styles.workPackageItemContainer}>
        {workPackage.subcategory === 'Choose a Subcategory' ? (
          <TouchableOpacity
            style={{ width: '80%' }}
            onPress={() => {
              navigation.navigate('DisplayWorkPackageContent', { workPackageId: workPackage._id });
            }}
          >
            <Text style={styles.workPackageItem}>
              {workPackage.name} - {workPackage.grade}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{ width: '80%' }}
            onPress={() => {
              navigation.navigate('DisplayWorkPackageContent', { workPackageId: workPackage._id });
            }}
          >
            <Text style={styles.workPackageItem}>
              {workPackage.name} - {workPackage.grade} - {workPackage.subcategory}
            </Text>
          </TouchableOpacity>
        )}
        <Text testID={`price-${workPackage._id}`}>{workPackage.price}$</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('DisplayWorkPackageContent', { workPackageId: workPackage._id });
          }}
          testID={`editButton-${workPackage._id}`}
        >
          <Icon source="square-edit-outline" size={20} color={'#407BFF'} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            deleteWorkPackage(workPackage._id);
          }}
          style={styles.deleteButton}
          testID={`deleteButton-${workPackage._id}`}
        >
          <Icon source="delete-outline" size={20} color={'#F24E1E'} />
        </TouchableOpacity>
      </View>
    );
  };

  // function to delete a work package
  const confirmDelete = async () => {
    if (selectedWorkPackageId) {
      try {
        const response = await fetch(
          `http://localhost:4000/workPackages/delete/${selectedWorkPackageId}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        if (response.status === 200) {
          console.log('Work Package: "' + selectedWorkPackageId + '" Deleted');
          setDeleteConfirmationModalVisible(false);
          fetchWorkPackages();
        } else {
          console.error('Error deleting work package');
        }
      } catch (error) {
        console.error('Network error:', error);
      }
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/backgroundCloudyBlobsFull.png')}
      resizeMode="cover"
      style={styles.container}
    >
      <View style={styles.containerFile}>
        <Text style={styles.selectFiles}>My Work Packages</Text>
        {/* Display all work packages from the user */}
        <FlatList
          data={workPackages}
          renderItem={({ item }) => renderWorkPackage(item)}
          keyExtractor={(item) => item._id}
          style={{ width: '100%', marginTop: '2%' }}
          contentContainerStyle={{ paddingHorizontal: '5%' }}
          ListEmptyComponent={() => (
            // Display when no work packages are found
            <View style={{ alignItems: 'center', marginTop: 20 }}>
              <Text>No created work packages</Text>
            </View>
          )}
        />
        {/* Display button to create a new work package */}
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('CreateWorkPackage', {
                workPackage: 'nameofworkpackage',
              });
            }}
            style={styles.buttonUpload}
            testID="uploadButton"
          >
            <Text style={styles.buttonText}>Create Work Package</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Display modal for confirming deletion of file/quiz */}
      <Modal
        isVisible={deleteConfirmationModalVisible}
        onBackdropPress={() => setDeleteConfirmationModalVisible(false)}
        transparent={true}
        style={{ elevation: 20, justifyContent: 'center', alignItems: 'center' }}
      >
        <View style={styles.deleteConfirmationModal}>
          <Text style={styles.confirmationText}>
            Are you sure you want to delete this work package?
          </Text>
          <View style={styles.confirmationButtons}>
            <TouchableOpacity
              testID="deleteConfirmationModal"
              onPress={confirmDelete}
              style={[styles.confirmButton, { marginRight: 10 }]}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setDeleteConfirmationModalVisible(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  deleteConfirmationModal: {
    width: '50%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmationText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  confirmationButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  confirmButton: {
    backgroundColor: '#F24E1E',
    padding: 10,
    borderRadius: 10,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#407BFF',
    padding: 10,
    borderRadius: 10,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  containerFile: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    width: '100%',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: '5%',
  },
  selectFiles: {
    color: '#696969',
    fontSize: 35,
    fontWeight: '500',
    marginTop: '1%',
    textAlign: 'center',
  },
  workPackageItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  workPackageItem: {
    fontSize: 16,
    marginVertical: 10,
    color: '#000000',
    borderColor: '#696969',
    borderWidth: 1,
    padding: 13,
    borderRadius: 15,
  },
  deleteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(242, 78, 30, 0.13)',
    borderRadius: 100,
    padding: 5,
  },
  buttonUpload: {
    backgroundColor: '#407BFF',
    width: 190,
    height: 35,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    marginTop: '5%',
    marginBottom: '5%',
  },
  buttonText: {
    color: '#FFFFFF',
    alignItems: 'center',
    fontSize: 15,
    fontWeight: '500',
  },
});

export default WorkPackageOverview;
