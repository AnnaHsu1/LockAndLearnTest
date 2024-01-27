import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { CreateResponsiveStyle, DEVICE_SIZES, minSize, useDeviceSize } from 'rn-responsive-styles';

const AdminReportCenter = ({ route, navigation }) => {
  const styles = useStyles();
  const [reports, setReports] = useState([]);
  const [workPackages, setWorkPackages] = useState({});

  useEffect(() => {
    fetchReports(); // Fetch reports when the component mounts
  }, []);

  useEffect(() => {
    fetchWorkPackages();
  }, [reports]);

  // Fetch work packages when the component mounts or when reports change
  const fetchWorkPackages = async () => {
    const workPackagesData = {};
    await Promise.all(
      reports.map(async (item) => {
        const workPackage = await fetchWorkPackage(item.idOfWp);
        workPackagesData[item.idOfWp] = workPackage;
      })
    );
    setWorkPackages(workPackagesData);
  };

  const fetchReports = async () => {
    try {
      const response = await fetch('http://localhost:4000/reports/all-reports');
      if (response.status === 200) {
        const data = await response.json();

        // Update each report item with work package information
        const updatedReports = await Promise.all(
          data.map(async (item) => {
            const workPackage = await fetchWorkPackage(item.idOfWp);
            console.log('Fetched Work Package:', workPackage);

            const instructorId = workPackage?.instructorID || null;
            console.log('Instructor ID:', instructorId);

            const instructor = await fetchUser(instructorId);
            console.log('Fetched Instructor:', instructor);

            const reporter = await fetchUser(item.reporterId);
            console.log('Fetched Reporter:', reporter);

            return { ...item, instructor, reporter };
          })
        );

        setReports(updatedReports);
      } else {
        console.error('Error fetching reports');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  const fetchWorkPackage = async (workPackageId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/workPackages/fetchWorkPackageById/${workPackageId}`
      );
      if (response.status === 200) {
        const data = await response.json();
        return data;
      } else {
        console.error('Error fetching work package');
        return null;
      }
    } catch (error) {
      console.error('Network error:', error);
      return null;
    }
  };

  const fetchUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:4000/users/getUser/${userId}`);
      if (response.status === 200) {
        const instructor = await response.json();
        return instructor;
      } else {
        console.error('Error fetching instructor');
        return null;
      }
    } catch (error) {
      console.error('Network error:', error);
      return null;
    }
  };

  const handleReportItemClick = (workPackageId, workPackageName, workPackageGrade) => {
    navigation.navigate('WorkPackagePreview', {
      workPackage: {
        _id: workPackageId,
        name: workPackageName,
        grade: workPackageGrade,
      },
    });
    console.log('Clicked on Report with Work Package ID:', workPackageId);
  };

  const renderReportItems = () => (
    <ScrollView>
      {reports.map((item) => (
        <TouchableOpacity
          key={item._id}
          style={styles.reportItem}
          onPress={() =>
            handleReportItemClick(
              item.idOfWp,
              workPackages[item.idOfWp]?.name,
              workPackages[item.idOfWp]?.grade
            )
          }
        >
          <Text style={styles.text}>
            {/* Display additional work package properties */}
            {workPackages[item.idOfWp] && (
              <>
                <Text style={styles.boldText}>
                  {workPackages[item.idOfWp].name} - {workPackages[item.idOfWp].grade}
                </Text>
                {'\n'}
                <Text style={styles.subText}>
                  {workPackages[item.idOfWp].description}
                  {'\n'}${workPackages[item.idOfWp].price}
                  {'\n'}
                  {workPackages[item.idOfWp].packageCount} {'package(s)'}
                  {'\n'}
                </Text>
              </>
            )}
            {/* Display instructor information */}
            {item.instructor && (
              <>
                <Text style={styles.subTitle}>Instructor</Text>
                {'\n'}
                <Text style={styles.subText}>
                  {item.instructor.firstName} {item.instructor.lastName}
                  {'\n'}
                  {item.instructor.email}
                  {'\n'}
                </Text>
              </>
            )}
            {/* Display reporter information */}
            {item.reporter && (
              <>
                <Text style={styles.subTitle}>Reporter</Text>
                {'\n'}
                <Text style={styles.subText}>
                  {item.reporter.firstName} {item.reporter.lastName}
                  {'\n'}
                  {item.reporter.email}
                  {'\n'}
                </Text>
              </>
            )}
            <Text style={styles.subTitle}>Reason</Text>
            {'\n'}
            <Text style={styles.subText}>
              {item.reason}
              {'\n'}
              {item.timeOfReport}
              {'\n'}
            </Text>
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <View style={styles.page} testID="main-view">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Report Center</Text>
        </View>
        {renderReportItems()}
      </View>
    </View>
  );
};

const useStyles = CreateResponsiveStyle(
  {
    subText: {
      fontSize: 18,
      color: '#696969',
    },
    subTitle: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    boldText: {
      fontSize: 25,
      fontWeight: 'bold',
    },
    reportItem: {
      backgroundColor: '#ffffff',
      borderRadius: 10,
      marginVertical: 10,
      padding: 15,
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
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 20,
      marginTop: 20,
      borderRadius: 10,
      backgroundColor: '#4F85FF',
    },
    header: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: 10,
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
    modalButtons: {
      borderRadius: 10,
      marginVertical: 10,
      height: 50,
      justifyContent: 'center',
      minWidth: 100,
    },
    bgRed: {
      backgroundColor: '#FF0000',
    },
    bgWhite: {
      backgroundColor: '#ffffff',
    },
    full_width: {
      minWidth: '100%',
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
    options: {
      flex: 0.75,
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    link: {
      color: '#ffffff',
      fontSize: 12,
      textAlign: 'center',
      justifyContent: 'flex-end',
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

export default AdminReportCenter;
