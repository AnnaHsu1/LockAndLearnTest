import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import Modal from 'react-native-modal';
import { useWindowDimensions } from 'react-native';

export const WorkPackageCard = ({ props }) => {
  const [workpackage, setWorkPackage] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deviceWidth, setDeviceWidth] = useState(0);
  const { height, width } = useWindowDimensions();
  const navigation = useNavigation();
  let isPub = false;

  const [isPublished, setIsPublished] = useState(workpackage.isPublished);


  const deleteWorkPackage = async () => {
    try {
      const response = await fetch(
        'https://lockandlearn.onrender.com/workPackages/deleteWorkPackage/' + props._id,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 200) {
        navigation.navigate('WorkPackage', { refresh: workpackage._id });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const publishWorkPackage = async (workPackageId) => {
    // modify fiels of isPublished from false to true and save workpackage to db
    
    try {
      const response = await fetch(
        `https://lockandlearn.onrender.com/workPackages/publishWorkPackage/${workPackageId}`,
        {
          method: 'PUT', // Use PUT since we're updating part of the resource
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.status === 200) {
        console.log('Work package published successfully.');
        // Optionally, refresh the data or navigate as needed
        // navigation.navigate('WorkPackageList', { refresh: true });
        console.log("workpackage after publishing", workpackage);
        setIsPublished(true);

      } else {
        console.error('Failed to publish work package. Status:', response.status);
      }
    } catch (error) {
      console.error('Error publishing work package:', error);
    }
  };

  const getGradeSuffix = (grade) => {
    if (grade >= 11 && grade <= 13) {
      return 'th';
    }
  
    const lastDigit = grade % 10;
  
    switch (lastDigit) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };

  useEffect(() => {
    setDeviceWidth(width);
    console.log("props", props)
    setWorkPackage(props);
  }, []);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('PackageOverview', { workPackage: workpackage })}
    >
      <View style={styles.cardContent}>
        <View style={[{ justifyContent: 'space-between' }]}>
          <View style={[styles.row, { justifyContent: 'space-between' }]}>
            <Text style={styles.header}>
              {workpackage.name} - {workpackage.grade}{getGradeSuffix(workpackage.grade)} Grade
            </Text>
            {/* The Edit and Delete Buttons should only show if the workpackage is not published */}
            {workpackage.isPublished === false || isPublished ? (
              <View style={styles.row}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('EditWorkPackage', { workpackage: props })}
                >
                  <Icon source="square-edit-outline" size={20} color={'#407BFF'} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <Icon source="delete-outline" size={20} color={'#F24E1E'} />
                </TouchableOpacity>
              </View>) : (<View></View>
            )}
          </View>
          <Text style={styles.price}>${workpackage.price}</Text>
          <Text style={[styles.text, { paddingTop: 10 }]}>
            {/* for small screens we need to sub string the description even more */}
            {deviceWidth < 450
              ? workpackage.description?.substr(0, 50) + '...'
              : // check device width and description length to sub string the description
              deviceWidth < 800 && workpackage.description?.length > 150
              ? workpackage.description?.substr(0, 150) + '...'
              : workpackage.description?.length < 390
              ? workpackage.description
              : workpackage.description?.substr(0, 390) + '...'}
          </Text>
        </View>
        <View style={styles.lastRow}>
          <Text style={styles.text}>
            {workpackage.packageCount} {workpackage.packageCount == 1 ? 'package' : 'packages'}
          </Text>
          {workpackage.isPublished === true || isPublished ? (
              <View style={styles.published}>
                <Text style={styles.buttonText}>Published</Text>
                <Icon source="check" size={20} color={'white'} />
              </View>
            ) : (
              <TouchableOpacity
                style={styles.publishButton}
                onPress={() => publishWorkPackage(workpackage._id)}
              >
                <Text style={styles.buttonText}>Publish</Text>
              </TouchableOpacity>
            )}
        </View>
      </View>
      <Modal
        animationType="slide"
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        transparent={true}
        style={{ elevation: 20, justifyContent: 'center', alignItems: 'center' }}
      >
        <View style={styles.modalCard}>
          <Text style={styles.text}>Are you sure you want to delete this work package?</Text>
          <View>
            <TouchableOpacity
              style={[styles.modalButton, { borderColor: 'red' }]}
              onPress={() => deleteWorkPackage()}
            >
              <Text style={{ color: 'red' }}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { borderColor: '#696969' }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: '#696969' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderColor: '#407BFF',
    borderWidth: 1,
    borderRadius: 15,
    height: 250,
    maxHeight: 250,
    maxWidth: 800,
    marginVertical: 10,
    width: '100%',
  },
  cardContent: {
    padding: 20,
    height: '100%',
    justifyContent: 'space-between',
  },
  header: {
    color: '#4F85FF',
    fontSize: 24,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
  },
  price: {
    color: '#5FB01F',
    fontSize: 18,
    fontWeight: '500',
  },
  text: {
    color: '#696969',
    fontSize: 18,
    fontWeight: '300',
  },
  modal: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    height: 400,
    maxHeight: 250,
    maxWidth: 800,
    marginVertical: 10,
    width: '80%',
    justifyContent: 'space-between',
  },
  modalButton: {
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginTop: 10,
  },
  lastRow: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
  },
  publishButton: {
    backgroundColor: '#407BFF', 
    borderRadius: 5, 
    padding: 10,
  },
  published: {
    backgroundColor: 'green', 
    borderRadius: 5, 
    padding: 10,
    flexDirection: 'row', 
    alignItems: 'center',
  },
  buttonText: {
    color: 'white', 
  },
});
