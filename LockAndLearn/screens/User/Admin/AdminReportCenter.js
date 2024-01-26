import React, { useState, useEffect } from 'react';
import { Text, View, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import { CreateResponsiveStyle, DEVICE_SIZES, minSize, useDeviceSize } from 'rn-responsive-styles';

const AdminReportCenter = ({ route, navigation }) => {
    const styles = useStyles();
    const [isModalVisible, setModalVisible] = useState(false);
    const [reports, setReports] = useState([]);

    useEffect(() => {
        fetchReports(); // Fetch reports when the component mounts
    }, []);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const fetchReports = async () => {
        try {
            const response = await fetch('http://localhost:4000/reports/all-reports');
            if (response.status === 200) {
                const data = await response.json();
                setReports(data);
            } else {
                console.error('Error fetching reports');
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    };

    const renderReportItem = ({ item }) => (
        <View style={styles.reportItem}>
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
            </Text>
        </View>
    );

    return (
        <View style={styles.page} testID="main-view">
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Report Center</Text>
                </View>
                <FlatList
                    data={reports}
                    renderItem={renderReportItem}
                    keyExtractor={(item) => item._id}
                />
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
