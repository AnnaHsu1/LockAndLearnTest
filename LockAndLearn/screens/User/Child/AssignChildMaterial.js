import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, FlatList } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { getUser } from '../../../components/AsyncStorage';
import { useWindowDimensions } from 'react-native';
import PropTypes from 'prop-types';

const AssignChildMaterial = ({ route, navigation }) => {
  const [workPackages, setWorkPackages] = useState([]);
  const [checkedboxItems, setCheckedboxItems] = useState({});
  const [previouslyAssigned, setPreviouslyAssigned] = useState([]);
  const [deviceWidth, setDeviceWidth] = useState(0);
  const { height, width } = useWindowDimensions();
  const child = route.params?.child;

  // function to get all previously assigned work packages from the child
  const fetchPreviouslyAssignedWorkPackages = async () => {
    const response = await fetch(`http://localhost:4000/child/getWorkPackages/${child._id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    setPreviouslyAssigned(data);
  };

  // function to get all owned work packages from the user
  const fetchWorkPackages = async (displayOwned = false) => {
    const user = await getUser();
    const userId = user._id;
      try {
        const response = await fetch(
          `http://localhost:4000/workPackages/fetchWorkpackagesParent/${userId}?displayOwned=${displayOwned}`,
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
          data.forEach((workPackage) => {
            setCheckedboxItems((prevCheckedboxItems) => ({
              ...prevCheckedboxItems,
              [workPackage._id]: previouslyAssigned.includes(workPackage._id),
            }));
          });
        } else {
          console.error('Error fetching workPackages');
        }
      } catch (error) {
        console.error('Network error:', error);
      }
  };

  // function to toggle checkbox based on the wp id
  const toggleCheckbox = (workPackage) => {
    setCheckedboxItems((prevCheckedboxItems) => ({
      ...prevCheckedboxItems,
      [workPackage._id]: !prevCheckedboxItems[workPackage._id] || false,
    }));
  };

  // inital fetch
  useEffect(() => {
    fetchPreviouslyAssignedWorkPackages();
    setDeviceWidth(width);
  }, []);

  useEffect(() => {
    setDeviceWidth(width);
  }, [width]);

  // fetch workpackages that user has access to then display the work packages corresponding to the child
  useEffect(() => {
    fetchWorkPackages(true);
  }, [previouslyAssigned]);

  // function to check if there is any wp selected: return true if there is no wp selected
  const isAddButtonDisabled = () => {
    for (var key in checkedboxItems) {
      if (checkedboxItems[key] == true) {
        return false;
      }
    }
    return true;
  };

  // function to add selected wp to the child
  const handleAddingChildMaterial = async () => {
    const selectedFiles = Object.entries(checkedboxItems)
      .filter(([key, value]) => value)
      // only take the key (wp id)
      .map(([key, value]) => key);
    const response = await fetch(`http://localhost:4000/child/addChildMaterial/${child._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        materials: selectedFiles,
      }),
    });
    navigation.navigate('ChildProfile', { child: child });
  };

// function to display the work package information
  const renderWorkPackage = (workPackage) => {
    return (
      <View key={workPackage._id} style={styles.workPackageItemContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center', width: '60%' }}>
          <Checkbox
            status={checkedboxItems[workPackage._id] ? 'checked' : 'unchecked'}
            onPress={() => toggleCheckbox(workPackage)}
            color="#407BFF"
          />
          <TouchableOpacity style={{ width: '100%' }}>
            <View style={styles.workPackageItem}>
              <View>
                <Text style={styles.workPackageTitle}>
                  {workPackage.name} - {workPackage.grade}
                </Text>
                <Text style={styles.workPackageText}>
                  {deviceWidth < 600
                    ? workPackage.description?.substr(0, 50) + '...'
                    : // check device width and description length to sub string the description
                    deviceWidth < 1020 && workPackage.description?.length > 200
                    ? workPackage.description?.substr(0, 150) + '...'
                    : workPackage.description?.length < 390
                    ? workPackage.description
                    : workPackage.description?.substr(0, 390) + '...'}
                </Text>
              </View>

              <Text style={[styles.workPackageText, { marginTop: 5 }]}>
                {workPackage.packageCount} {workPackage.packageCount > 1 ? 'packages' : 'package'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ImageBackground
      source={require('../../../assets/backgroundCloudyBlobsFull.png')}
      resizeMode="cover"
      style={styles.container}
    >
      <View style={styles.containerFile}>
        {/* Display title and name of child */}
        <Text style={styles.selectFiles} testID='header'>Assign Work for {child.firstName}</Text>
        {/* Display all work packages */}
        <FlatList
          data={workPackages}
          renderItem={({ item }) => renderWorkPackage(item)}
          keyExtractor={(item) => item._id}
          style={{ width: '100%', marginTop: '2%' }}
          contentContainerStyle={{ paddingHorizontal: '5%' }}
          ListEmptyComponent={() => (
            // Display when no work packages are found
            <View style={{ alignItems: 'center', marginTop: 20 }}>
              <Text>No work owned packages</Text>
            </View>
          )}
        />
        {/* display button to add selected wp*/}
        <TouchableOpacity
          onPress={() => handleAddingChildMaterial()}
          style={[styles.buttonAddMaterial, isAddButtonDisabled() && styles.disabledButton]}
          disabled={isAddButtonDisabled()}
        >
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

AssignChildMaterial.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      child: PropTypes.object.isRequired, // or more specific shape if you know the structure
    }),
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  buttonAddMaterial: {
    backgroundColor: '#407BFF',
    width: 190,
    height: 35,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    marginTop: 10,
    marginBottom: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc',
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
    marginTop: '2%',
    textAlign: 'center',
  },
  childInfo: {
    color: '#696969',
    fontSize: 22,
    marginTop: '1%',
    textAlign: 'center',
  },
  workPackageItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
  },
  workPackageItem: {
    borderColor: '#407BFF',
    borderWidth: 1,
    padding: 13,
    borderRadius: 15,
    height: 150,
    justifyContent: 'space-between',
  },
  workPackageTitle: {
    fontSize: 18,
    color: '#407BFF',
    paddingBottom: 5,
  },
  workPackageText: {
    fontSize: 14,
    color: '#696969',
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

export default AssignChildMaterial;
