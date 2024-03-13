import React, { useState, useEffect } from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  Platform,
} from 'react-native';
import { getUser } from '../../components/AsyncStorage';
import { WorkPackageCard } from '../../components/WorkPackageCard';

const WorkPackage = ({ navigation, route }) => {
  const [workPackages, setWorkPackages] = useState([]);
  const refresh = route.params?.refresh;
  const edited = route.params?.edited;

  const getWorkPackages = async () => {
    try {
      const userToken = await getUser();
      const response = await fetch(
        'https://data.mongodb-api.com/app/lock-and-learn-xqnet/endpoint/getWorkPackagesByInstructorId?instructorID=${userToken._id}',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      let data = await response.json();
      if (response.status === 200) {
        // // if tutor deleted workpackage, don't display it
        data = data.filter((workpackage) => !workpackage.deletedByTutor);
        setWorkPackages(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // When work package is created or deleted
  useEffect(() => {
    getWorkPackages();
  }, [refresh]);

  // When work package is edited
  useEffect(() => {
    if (edited) {
      setWorkPackages([]);
      getWorkPackages();
    }
  }, [edited]);

  return (
    <ImageBackground
      source={require('../../assets/backgroundCloudyBlobsFull.png')}
      resizeMode="cover"
      style={styles.page}
    >
      <View style={styles.container}>
        <View style={styles.cardContainer}>
          <Text style={styles.header}>My Work Packages</Text>
          {workPackages.map((workpackage) => (
            <WorkPackageCard key={workpackage._id} props={workpackage} />
          ))}
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('CreateWorkPackage')}
          >
            <Text style={styles.text}>Create work package</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    width: '100%',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: '5%',
  },
  header: {
    color: '#696969',
    fontSize: 35,
    fontWeight: '500',
    paddingVertical: '3%',
    textAlign: 'center',
  },
  cardContainer: {
    maxWidth: 800,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 250,
    height: 50,
    backgroundColor: '#407BFF',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '5%',
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
});

export default WorkPackage;
