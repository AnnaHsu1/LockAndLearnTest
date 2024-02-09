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

  const deleteWorkPackage = async () => {
    try {
      const response = await fetch(
        'http://localhost:4000/workPackages/deleteWorkPackage/' + props._id,
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
            <View style={styles.row}>
              <TouchableOpacity
                onPress={() => navigation.navigate('EditWorkPackage', { workpackage: props })}
              >
                <Icon source="square-edit-outline" size={20} color={'#407BFF'} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Icon source="delete-outline" size={20} color={'#F24E1E'} />
              </TouchableOpacity>
            </View>
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

        <Text style={styles.text}>
          {workpackage.packageCount} {workpackage.packageCount == 1 ? 'package' : 'packages'}
        </Text>
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
});
