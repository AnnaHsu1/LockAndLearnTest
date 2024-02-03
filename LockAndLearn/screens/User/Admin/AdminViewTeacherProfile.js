import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { CreateResponsiveStyle, DEVICE_SIZES, minSize } from 'rn-responsive-styles';
import { useRoute } from '@react-navigation/native';
import { WorkPackageCard } from '../../../components/WorkPackageCard';

const AdminViewTeacherProfile = ({ route, navigation }) => {
  const styles = useStyles();
  const [workPackages, setWorkPackages] = useState([]);
  const userId = route.params?.userId;

  // Existing states and effects

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
          <Text style={styles.title}>Profile of </Text>
        </View>
        <ScrollView style={styles.userListContainer}>
          {workPackages.map((workPackage) => (
            // Display the work package details
            <View key={workPackage._id} style={styles.workPackageBox}>
              <View style={styles.workPackageText}>
                <TouchableOpacity
                  key={workPackage._id}
                  onPress={() => {
                    console.log(workPackage);
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
                  {`${workPackage.description === undefined ? `` : `${workPackage.description}`}`}
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
              <View style={styles.priceAndButton}>
                <Text style={styles.priceWP}>
                  {workPackage.price && workPackage.price !== 0
                    ? `$${workPackage.price} CAD`
                    : 'Free'}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
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
      flexDirection: 'row',
      maxHeight: 200,
      justifyContent: 'space-between',
      alignItems: 'center',
      borderColor: '#4F85FF',
      borderRadius: 8,
      padding: 10,
      marginBottom: 10,
      width: '50vw',
      alignSelf: 'center',
    },
    workPackageItem: {
      fontSize: 16,
      marginVertical: 10,
      color: '#000000',
      borderColor: '#407BFF',
      borderWidth: 1,
      padding: 13,
      borderRadius: 15,
    },
    workPackageItemContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
    },
    workPackageNameText: {
      fontSize: '150%',
      color: '#4F85FF',
    },
    TitleName: {
      fontSize: 25,
      marginBottom: 10,
      color: '#696969',
    },
    container: {
      flex: 1,
      position: 'absolute',
      backgroundColor: 'blue',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    containerFile: {
      flex: 1,
      backgroundColor: '#FAFAFA',
      alignItems: 'center',
      width: '100%',
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
      marginTop: '5%',
      padding: 20, // Add padding to match the styling in QuizzesOverviewScreen
      paddingBottom: 100,
    },
    priceWP: {
      fontWeight: '700',
      marginRight: 10,
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

export default AdminViewTeacherProfile;
