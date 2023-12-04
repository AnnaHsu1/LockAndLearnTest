import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  Dimensions,
} from 'react-native';
import { Icon } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import Modal from 'react-native-modal';
import { getItem } from '../../../components/AsyncStorage';

const PackageOverview = ({ props }) => {
  const route = useRoute();
  const navigation = useNavigation();
  const [packages, setPackages] = useState([]);
  const [deleteConfirmationModalVisible, setDeleteConfirmationModalVisible] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const params = route.params;
  const { _id, name, grade } = params?.workPackage;
  const { width } = Dimensions.get('window');
  const maxTextWidth = width * 0.9;

  // when screen loads, get all work packages from the user & update when a new package is added
  useEffect(() => {
    fetchPackages();
  }, [params]);

  // function to get work package information
  const fetchPackages = async () => {
    try {
      const response = await fetch(`http://localhost:4000/packages/fetchPackages/${_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        const data = await response.json();
        setPackages(data);
      } else {
        console.error('Error fetching workPackage');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  // function to delete a work package
  const deletePackage = async (_id) => {
    try {
      setSelectedPackageId(_id);
      setDeleteConfirmationModalVisible(true);
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  // function to display the work package information
  const renderPackage = (this_Package) => {
    return (
      <View
        key={this_Package._id}
        style={{
          flexDirection: 'column',
          marginVertical: 5,
          color: '#000000',
          borderColor: '#407BFF',
          borderWidth: 1,
          padding: 10,
          borderRadius: 15,
        }}
      >
        <View key={this_Package._id} style={styles.workPackageItemContainer}>
          <TouchableOpacity
            style={{ width: '75%' }}
            onPress={() => {
              navigation.navigate('EditPackage', {
                workPackage: {
                  wp_id: _id,
                  name: name,
                  grade: grade,
                },
                package: {
                  p_id: this_Package._id,
                  subcategory: this_Package.subcategory,
                  description: this_Package.description,
                  p_materials: this_Package.materials,
                  p_quizzes: this_Package.quizzes,
                },
              });
            }}
          >
            <Text style={styles.workPackageItem}>{this_Package.subcategory}</Text>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('EditPackage', {
                  workPackage: {
                    wp_id: _id,
                    name: name,
                    grade: grade,
                  },
                  package: {
                    p_id: this_Package._id,
                    subcategory: this_Package.subcategory,
                    description: this_Package.description,
                    p_materials: this_Package.materials,
                    p_quizzes: this_Package.quizzes,
                  },
                });
              }}
              testID={`editButton-${this_Package._id}`}
            >
              <Icon source="square-edit-outline" size={20} color={'#407BFF'} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                deletePackage(this_Package._id);
              }}
              testID={`deleteButton-${this_Package._id}`}
            >
              <Icon source="delete-outline" size={20} color={'#F24E1E'} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
          <Text
            numberOfLines={3}
            ellipsizeMode="middle"
            style={{ maxWidth: maxTextWidth, color: '#696969' }}
          >
            {this_Package.description}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ color: '#696969' }}>{this_Package.materials.length} file(s)</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ color: '#696969' }}>{this_Package.quizzes.length} question(s)</Text>
        </View>
      </View>
    );
  };

  // function to delete a work package
  const confirmDelete = async () => {
    if (selectedPackageId) {
      try {
        const response = await fetch(`http://localhost:4000/packages/delete/${selectedPackageId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.status === 200) {
          setDeleteConfirmationModalVisible(false);
          fetchPackages();
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
      source={require('../../../assets/backgroundCloudyBlobsFull.png')}
      resizeMode="cover"
      style={styles.container}
    >
      <View style={styles.containerFile}>
        <Text style={styles.selectFiles}>
          {name} - {grade}
        </Text>
        {/* Display all work packages from the user */}
        <FlatList
          data={packages}
          renderItem={({ item }) => renderPackage(item)}
          keyExtractor={(item) => item._id}
          style={{ width: '100%' }}
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
              navigation.navigate('CreatePackage', {
                workPackage: params.workPackage,
              });
            }}
            style={styles.buttonUpload}
            testID="uploadButton"
          >
            <Text style={styles.buttonText}>Add package</Text>
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
          <Text style={styles.confirmationText}>Are you sure you want to delete this package?</Text>
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
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  workPackageItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  workPackageItem: {
    fontSize: 16,
    color: '#407BFF',
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

export default PackageOverview;
