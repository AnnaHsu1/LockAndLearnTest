import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity, ActivityIndicator} from 'react-native';
import Modal from 'react-native-modal';
import { CreateResponsiveStyle, DEVICE_SIZES, minSize } from 'rn-responsive-styles';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';


const AdminFinances = ({ route, navigation }) => {
  const styles = useStyles();
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [detailedTransactions, setDetailedTransactions] = useState([]);
  const [balance, setBalance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllTransactions();
    fetchBalance();
  }, []);

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
    } finally {
      console.log('set loading to false!');
      setLoading(false); // Set loading to false when the request completes
    }
  };
  const fetchBalance = async () => {
    try {
      const response = await fetch('http://localhost:4000/payment/balanceAdmin');
      if (response.ok) {
        const data = await response.json();

        console.log('balance', balance);
        const availableBalance = data.balance.available[0].amount;

        // Access the amount from the pending field
        const pendingAmount = data.balance.pending[0].amount;

        // Add the amounts together
        const totalBalance = (availableBalance + pendingAmount) / 100;

        setBalance(totalBalance);
        console.log('available', totalBalance);
      } else {
        console.error('Failed to fetch balance:', response.status);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  // Fetch more information about the transaction from a selected transaction
  const fetchMoreTransactionInfo = async (stripePurchaseId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/payment/getParentUserName/${stripePurchaseId}`
      );
      const data = await response.json();

      if (response.ok) {
        // Update state with the clicked transaction and its details
        setDetailedTransactions((prevClickedTransactions) => [
          ...prevClickedTransactions,
          { id: stripePurchaseId, details: data.parentName },
        ]);
      } else {
        // Display error message in modal
        setErrorMessage(data.message);
        setErrorModalVisible(true);
        console.error('Error:', data.message);
      }
    } catch (error) {
      // Display error message in modal
      setErrorMessage(error.message);
      setErrorModalVisible(true);
      console.error('Error:', error.message);
    }
  };

  return (
    <View style={styles.page} testID="main-view">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Finances</Text>
        </View>
        {/* Displaying the list of transactions */}
        <View style={styles.userContainer}>
          <Text style={styles.balance}>Balance: $ {balance}</Text>
        </View>
        <ScrollView style={styles.transactionListContainer}>
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <View key={transaction.id} style={styles.userContainer}>
                <Text style={styles.transactionName}>
                  {' '}
                  <Text style={{ fontWeight: 'bold' }}>Transaction ID: </Text>
                  {transaction.id}
                </Text>
                <Text style={styles.userDetails}>
                  {' '}
                  <Text style={{ fontWeight: 'bold' }}>Amount:</Text> {transaction.amount / 100}{' '}
                  {transaction.currency}{' '}
                </Text>
                <Text style={styles.userDetails}>
                  {' '}
                  <Text style={{ fontWeight: 'bold' }}>Status:</Text> {transaction.status}{' '}
                </Text>
                {detailedTransactions.find(
                  (detailedTransaction) => detailedTransaction.id === transaction.id
                ) ? (
                  <View>
                    <View
                      style={{ borderBottomWidth: 1, borderBottomColor: 'black', paddingBottom: 7 }}
                    />
                    <Text style={styles.userDetails}>
                      {/* Display the name of the buyer. */}
                      <Text style={{ fontWeight: 'bold' }}> Name of Buyer: </Text>
                      {
                        detailedTransactions.find(
                          (detailedTransaction) => detailedTransaction.id === transaction.id
                        ).details
                      }
                    </Text>
                    <Text style={styles.userDetails}>
                      {/* Display the time of creation of the payment intent.*/}
                      <Text style={{ fontWeight: 'bold' }}> Payment created on: </Text>
                      {new Date(transaction.created * 1000).toLocaleString()}
                    </Text>
                    <Text style={styles.userDetails}>
                      {/* Display the Stripe client secret key */}
                      <Text style={{ fontWeight: 'bold' }}> Stripe Client Secret Key: </Text>
                      {transaction.client_secret}
                    </Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.content}
                    onPress={() => fetchMoreTransactionInfo(transaction.id)}
                  >
                    <Text style={styles.text}> More details </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.noTransactionsText}>{loading}</Text>
          )}
          {loading && (
            <View>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}
        </ScrollView>
      </View>

      {/* Error Modal */}
      <Modal
        animationType="slide"
        isVisible={errorModalVisible}
        onBackdropPress={() => setErrorModalVisible(false)}
        transparent={true}
        style={{ elevation: 20, justifyContent: 'center', alignItems: 'center' }}
      >
        <View style={styles.modalCard}>
          <Text style={styles.modalText}>{errorMessage}</Text>
          <TouchableOpacity
            style={[styles.modalButton, { backgroundColor: '#4F85FF', borderColor: '#4F85FF'}]}
            onPress={() => setErrorModalVisible(false)}
          >
            <Text style={{fontWeight: 'bold', color: 'white'}}>Okay</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
      maxHeight: '90%',
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 20,
      paddingBottom: 20,
      marginTop: 20,
      borderRadius: 10,
      backgroundColor: '#4F85FF',
    },
    content: {
      backgroundColor: '#4F85FF',
      borderRadius: 5,
      marginVertical: 10,
      paddingVertical: 20,
      paddingHorizontal: 30,
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: wp(10),
      minHeight: hp(5),
      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    },
    userContainer: {
      backgroundColor: '#ffffff',
      borderRadius: 10,
      marginVertical: 10,
      padding: 10,
    },
    balanceContainer: {
      backgroundColor: '#ffffff',
      borderRadius: 10,
      marginVertical: 10,
      padding: 10,
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
    text: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#fff',
    },
    balance: {
      color: '#696969',
      fontSize: 20,
      textAlign: 'center',
    },
    transactionName: {
      color: '#4F85FF',
      fontSize: 15,
      marginBottom: 5,
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
    userDetails: {
      color: 'grey',
      fontSize: 13,
    },

    noUsersText: {
      color: '#ffffff',
      fontSize: 18,
      textAlign: 'center',
      marginTop: 20,
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
    transactionListContainer: {
      paddingRight: 20,
    },
    modal: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalCard: {
      backgroundColor: '#fff',
      borderRadius: 15,
      padding: 20,
      height: 200,
      maxHeight: 200,
      maxWidth: 800,
      marginVertical: 10,
      width: '80%',
      justifyContent: 'space-between',
    },
    modalButton: {
      borderWidth: 1,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 5,
      marginTop: 5,
    },
    modalText: {
        color: '#696969',
        fontSize: 18,
        fontWeight: 'bold',
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
