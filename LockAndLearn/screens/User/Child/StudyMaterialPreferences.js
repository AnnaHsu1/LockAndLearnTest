import { useState, useEffect } from 'react';
import React from 'react';
import { StyleSheet, Text, View, ImageBackground, FlatList, TouchableOpacity } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { ToastContainer, toast } from 'react-toastify';
import PropTypes from 'prop-types';

const StudyMaterialPreferences = ({ route, navigation }) => {
  const childInfo = route.params.child;
  const [fdata, setFdata] = useState({
    FirstName: childInfo.firstName,
    LastName: childInfo.lastName,
    Grade: childInfo.grade,
    ParentId: childInfo.parentId,
    Preferences: childInfo.preferences,
  });
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    fetchSubcategories();
  }, []);

  //fetching all the subcategories
  const fetchSubcategories = async () => {
    try {
      const response = await fetch('http://localhost:4000/subcategories/fetchAll');
      if (response.ok) {
        const data = await response.json();
        setSubcategories(data);
      } else {
        console.error('Failed to fetch subcategories:', response.status);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const [checkedboxItems, setCheckedboxItems] = useState({});
  const [selectedSubject, setSelectedSubject] = useState([]);
  const [selectedLabels, setSelectedLabels] = useState([]);

  const toggleCheckbox = (id) => {
    setCheckedboxItems((prevCheckedboxItems) => {
      const updatedCheckedboxItems = {
        ...prevCheckedboxItems,
        [id]: !prevCheckedboxItems[id] || false,
      };
      updateSelectedSubjects(updatedCheckedboxItems);
      return updatedCheckedboxItems;
    });
  };

  const updateSelectedSubjects = (updatedCheckedboxItems) => {
    const subject = Object.keys(updatedCheckedboxItems)
      .filter((key) => updatedCheckedboxItems[key])
      .map(String);

    setSelectedSubject(subject);
    const labels = subcategories
      .filter((item) => subject.includes(item._id))
      .map((item) => item.name);

    setSelectedLabels(labels);
  };

  const savePreferencesHandler = async () => {
    try {
      const updatedFdata = {
        ...fdata,
        Preferences: selectedLabels,
      };
      await fetch('http://localhost:4000/child/updatechild/' + childInfo._id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFdata),
      });

      toast.success('Preferences saved successfully!');
      setTimeout(() => {
        navigation.navigate('ParentAccount');
      }, 1000);
    } catch (error) {
      toast.error('Failed to save preferences.');
    }
  };

  return (
    <ImageBackground
      source={require('../../../assets/backgroundCloudyBlobsFull.png')}
      resizeMode="cover"
      style={styles.container}
    >
      <View style={styles.containerContentModalFilter}>
        <ToastContainer
          position="top-center"
          hideProgressBar
          closeOnClick
          theme="dark"
          style={{ marginTop: '70px' }}
        />

        <Text style={styles.learningSubjectTitle}>Learning Subject Preferences</Text>

        <View style={styles.preferencesContainer}>
          <Text style={styles.learningSubjectSubTitle}>
            Customize your child's learning experience
          </Text>

          {/* display each row with checkbox and filter text */}
          <FlatList
            style={{ marginTop: '3%', flexGrow: 0.2, height: '70%' }}
            data={subcategories}
            keyExtractor={(item) => item._id.toString()}
            numColumns={3}
            renderItem={({ item }) => (
              <View style={styles.checkedboxItemsContainer}>
                <Checkbox
                  status={checkedboxItems[item._id] ? 'checked' : 'unchecked'}
                  onPress={() => toggleCheckbox(item._id)}
                  testID={`checkbox-${item._id}`}
                  color="#4F85FF"
                />
                <Text>{item.name}</Text>
              </View>
            )}
          />
          <TouchableOpacity
            onPress={savePreferencesHandler}
            style={styles.savePreferencesButton}
            testID="savePreferencesButton"
          >
            <Text style={styles.buttonText}>Save Preferences</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

StudyMaterialPreferences.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      child: PropTypes.object.isRequired,
    }),
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  learningSubjectTitle: {
    color: '#696969',
    fontSize: 35,
    fontWeight: '500',
    marginTop: '2%',
    textAlign: 'center',
  },
  savePreferencesButton: {
    backgroundColor: '#4F85FF',
    width: 190,
    height: 35,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  buttonText: {
    color: '#ffffff',
    backgroundColor: '#4F85FF',
    borderRadius: 10,
  },
  learningSubjectSubTitle: {
    color: '#696969',
    fontSize: 20,
    fontWeight: '300',
    marginTop: '3%',
    textAlign: 'center',
  },
  preferencesContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 20,
    minHeight: '75%',
    minWidth: '30%',
  },
  containerContentModalFilter: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingTop: '1%',
    paddingBottom: '1.5%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainerFilter: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  containerFilterTextTitle: {
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: '1%',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  containerSearchBar: {
    paddingHorizontal: '4%',
    paddingTop: '3%',
    paddingBottom: '2%',
  },
  textInputSearch: {
    borderWidth: 1,
    padding: '2%',
    marginBottom: '0.5%',
    backgroundColor: '#D9D9D9',
    borderRadius: 10,
    borderColor: '#D9D9D9',
  },
  checkedboxItemsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: 120,
    fontSize: 30,
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
});

export default StudyMaterialPreferences;
