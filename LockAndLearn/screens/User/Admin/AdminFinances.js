import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import { CreateResponsiveStyle, DEVICE_SIZES, minSize, useDeviceSize } from 'rn-responsive-styles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const AdminFinances = ({ route, navigation }) => {
  const styles = useStyles();
  const [isModalVisible, setModalVisible] = useState(false);
  const [transactions, setTransactions] = useState([]);


    useEffect(() => {
        fetchAllTransactions();
    }, []);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const fetchAllTransactions = async () => {
        try {
            const response = await fetch('http://localhost:4000/payment/transactions');
            if (response.ok) {
                const data = await response.json();
                console.log('Updated transactions:', data);

                setTransactions(data.payments);

            } else {
                console.error('Failed to fetch transactions:', response.status);
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    return (
        <View style={styles.page} testID="main-view">
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>
                        Finances
                    </Text>
                </View>
                {/* Displaying the list of transactions */}
                <ScrollView style={styles.transactionListContainer}>
                    {transactions.length > 0 ? (
                        transactions.map((transaction) => (
                            <View key={transaction.id} style={styles.transactionContainer}>
                                <Text> Transaction ID: {transaction.id} </Text>
                                <Text> Amount: {transaction.amount / 100} {transaction.currency}  </Text>
                                <Text> Status: {transaction.status}  </Text>
                            </View>
                        ))  
                    ) : (
                        <Text style={styles.noTransactionsText}>No transactions available</Text>
                    )}
                </ScrollView>
            </View>
        </View>
    );
};

const useStyles = CreateResponsiveStyle(
  {
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

export default AdminFinances;
