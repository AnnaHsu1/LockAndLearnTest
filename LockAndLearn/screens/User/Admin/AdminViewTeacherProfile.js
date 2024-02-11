import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { CreateResponsiveStyle, DEVICE_SIZES, minSize } from 'rn-responsive-styles';
import { Button } from 'react-native-paper';
import PropTypes from 'prop-types';

const AdminViewTeacherProfile = ({ route, navigation }) => {
  const styles = useStyles();
  const [workPackages, setWorkPackages] = useState([]);
  const userId = route.params?.userId;

  const getWorkPackages = async () => {
    try {
      const response = await fetch('http://localhost:4000/workPackages/getWorkPackages/' + userId, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
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
    getWorkPackages();
  }, []); // Dependency array is empty, so this runs once on mount

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Created Work Packages</Text>
        </View>
        <ScrollView style={styles.userListContainer}>
          {workPackages.map((workPackage) => (
            // Display the work package details
            <View key={workPackage._id} style={styles.workPackageBox}>
              <View style={styles.workPackageText}>
                <TouchableOpacity
                  key={workPackage._id}
                  onPress={() => {
                    console.log('Previewing ' + workPackage);
                    navigation.navigate('WorkPackagePreview', { workPackage });
                  }}
                >
                  <Text style={styles.workPackageNameText}>{`${workPackage.name}`}</Text>
                </TouchableOpacity>

                <View style={styles.containerTag}>
                  <View style={styles.tagBox}>
                    <Text style={styles.tagText} selectable={false}>
                      {`${workPackage.grade}${getGradeSuffix(workPackage.grade)}`} grade
                    </Text>
                  </View>
                </View>

                <Text style={styles.workPackageDescription}>
                  {`${workPackage.description === undefined ? `` : `${workPackage.description}`
                    }`}
                </Text>

                {workPackage.instructorDetails && (
                  <Text style={[styles.instructorDetails, { marginTop: 10 }]}>
                    Made by{' '}
                    <Text style={styles.boldText}>
                      {workPackage.instructorDetails.firstName}{' '}
                      {workPackage.instructorDetails.lastName}
                    </Text>
                  </Text>
                )}
              </View>
              <View style={styles.buttonContainer}>
                <Text style={styles.priceWP}>
                  {workPackage.price && workPackage.price !== 0
                    ? `$${workPackage.price} CAD`
                    : 'Free'}
                </Text>
                <Button
                  key={workPackage._id}
                  mode="contained"
                  style={styles.previewButton}
                  onPress={() => {
                    console.log(workPackage);
                    navigation.navigate('WorkPackagePreview', { workPackage });
                  }}
                >
                  Preview
                </Button>
              </View>
            </View>
          ))}

        </ScrollView>
      </View>
    </View>
  );
};

AdminViewTeacherProfile.propTypes = {
  route: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
};

const useStyles = CreateResponsiveStyle(
  {
    containerTag: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    workPackageText: {
      flex: 1, // Allow text to wrap within the available space
    },
    workPackageBox: {
      backgroundColor: '#fff',
      padding: 15,
      marginBottom: 15,
      borderRadius: 8,
      elevation: 2,
    },
    workPackageNameText: {
      fontSize: '150%',
      color: '#4F85FF',
    },
    container: {
      flex: 1,
      position: 'absolute',
      backgroundColor: 'blue',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    priceWP: {
      fontWeight: '700',
      fontSize: '120%',
      color: '#696969',
    },
    title: {
      color: '#4F85FF',
      fontSize: 24,
      textAlign: 'center',
      paddingBottom: 20,
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
    userListContainer: {
      paddingRight: 20,
    },
    tagBox: {
      backgroundColor: '#7393B3',
      borderTopLeftRadius: 10,
      borderBottomLeftRadius: 10,
      borderTopRightRadius: 70,
      borderBottomRightRadius: 70,
      paddingVertical: 5,
      paddingHorizontal: 10,
      marginTop: 6,
      marginBottom: 6,
    },
    tagText: {
      textAlign: 'center',
      color: 'white',
    },
    containerTag: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    boldText: {
      fontWeight: 'bold',
    },
    workPackageDescription: {
      fontSize: '110%',
      color: '#696969',
    },
    instructorDetails: {
      fontSize: '80%',
      color: '#696969',
    },
    previewButton: {
      maxWidth: 130,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
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

export default AdminViewTeacherProfile;
