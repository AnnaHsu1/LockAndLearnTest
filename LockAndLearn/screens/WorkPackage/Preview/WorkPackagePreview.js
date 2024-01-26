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
import { useNavigation, useRoute } from '@react-navigation/native';
import PropTypes from 'prop-types';

const WorkPackagePreview = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [packages, setPackages] = useState([]);
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

  // function to display the work package information
  const renderPackage = (this_Package) => {
    return (
      <View
        key={this_Package._id}
        style={styles.containerCard}
      >
        <View key={this_Package._id} style={styles.workPackageItemContainer}>
          <TouchableOpacity
            style={{ width: '75%' }}
            onPress={() => {
              navigation.navigate('PackagePreview', {
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
          <Text style={{ color: '#696969', fontSize: 12 }}>
            {this_Package.materials.length} File(s)
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ color: '#696969', fontSize: 12 }}>
            {this_Package.quizzes.length} Quiz(zes)
          </Text>
        </View>
      </View>
    );
  };

  // Function to determine the grade suffix
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

  return (
    <ImageBackground
      source={require('../../../assets/backgroundCloudyBlobsFull.png')}
      resizeMode="cover"
      style={styles.container}
    >
      <View style={styles.containerFile}>
        <Text style={styles.selectFiles}>
          {name} - {grade}{getGradeSuffix(grade)} Grade
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
            testID="reportButton"
          >
            <Text style={styles.buttonReportText}>Report Work Package</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

WorkPackagePreview.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      workPackage: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        grade: PropTypes.number.isRequired,
      }),
    }),
  }).isRequired,
};

const styles = StyleSheet.create({
  containerCard: {
    flexDirection: 'column',
    marginVertical: 5,
    color: '#000000',
    borderColor: '#407BFF',
    borderWidth: 1,
    padding: 10,
    borderRadius: 15,
    alignContent: 'center',
    width: '90%',
    alignSelf: 'center',
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
    marginBottom: '2%',
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
  buttonReportText: {
    color: '#F24E1E',
    borderColor: '#F24E1E',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 40,
  }
});

export default WorkPackagePreview;
