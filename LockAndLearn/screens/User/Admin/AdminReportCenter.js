import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import { CreateResponsiveStyle, DEVICE_SIZES, minSize, useDeviceSize } from 'rn-responsive-styles';

const AdminReportCenter = ({ route, navigation }) => {
  const styles = useStyles();
  const [isModalVisible, setModalVisible] = useState(false);
  const [reports, setReports] = useState([]);
  const [workPackages, setWorkPackages] = useState({});

  useEffect(() => {
    fetchReports(); // Fetch reports when the component mounts
  }, []);

  useEffect(() => {
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

    fetchWorkPackages();
  }, [reports]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const fetchUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:4000/users/getUser/${userId}`);
      if (response.status === 200) {
        const user = await response.json();
        return user;
      } else {
        console.error('Error fetching user');
        return null;
      }
    } catch (error) {
      console.error('Network error:', error);
      return null;
    }
  };

  const fetchReports = async () => {
    try {
      const response = await fetch('http://localhost:4000/reports/all-reports');
      if (response.status === 200) {
        const data = await response.json();

        // Update each report item with reporter information
        const updatedReports = await Promise.all(
          data.map(async (item) => {
            const reporter = await fetchReporter(item.reporterId);
            return { ...item, reporter };
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

  const fetchReporter = async (reporterId) => {
    try {
      const response = await fetch(`http://localhost:4000/users/getUser/${reporterId}`);
      if (response.status === 200) {
        const reporter = await response.json();
        return reporter;
      } else {
        console.error('Error fetching reporter');
        return null;
      }
    } catch (error) {
      console.error('Network error:', error);
      return null;
    }
  };

  const renderReportItems = () => (
    <ScrollView>
      {reports.map((item) => (
        <View key={item._id} style={styles.reportItem}>
          <Text style={styles.text}>
            Report ID: {item._id}
            {'\n'}
            Work Package ID: {item.idOfWp}
            {'\n'}
            Time of Report: {item.timeOfReport}
            {'\n'}
            Reporter ID: {item.reporterId}
            {'\n'}
            Reason: {item.reason}
            {'\n'}
            {/* Display additional work package properties */}
            {workPackages[item.idOfWp] && (
              <>
                Work Package Name: {workPackages[item.idOfWp].name}
                {'\n'}
                Description: {workPackages[item.idOfWp].description}
                {'\n'}
                Price: {workPackages[item.idOfWp].price}
                {'\n'}
                Package Count: {workPackages[item.idOfWp].packageCount}
                {'\n'}
                Instructor ID: {workPackages[item.idOfWp].instructorID}
              </>
            )}
            {/* Display reporter information */}
            {item.reporter && (
              <>
                First Name: {item.reporter.firstName}
                {'\n'}
                Last Name: {item.reporter.lastName}
                {'\n'}
                Email: {item.reporter.email}
                {'\n'}
              </>
            )}
          </Text>
        </View>
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
      minHeight: '20%',
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
