import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Clipboard,
  ActivityIndicator,
  TextInput,
  Modal,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { getUser } from '../../../components/AsyncStorage';
import { getItem } from '../../../components/AsyncStorage';

const FinanceInstructor = ({ navigation, route }) => {
  const refresh = route.params?.refresh;
  const [workPackages, setWorkPackages] = useState([]);
    const [balance, setBalance] = useState([]);
    const [balanceStripe, setBalanceStripe] = useState([]);
    const [balancePending, setBalancePending] = useState([]);
  const [transactions, setTransactions] = useState([]);
    const [isLoading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false); // TEMPORARY FOR STRIPE SETUP, set to false to see the unregistered instructor view
  const [generatedUrl, setGeneratedUrl] = useState(null);
  const [expiryTime, setExpiryTime] = useState(null);
  const [disableButton, setDisableButton] = useState(false);
  const [accountIdToDelete, setAccountIdToDelete] = useState(''); // For devs
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [salesThisWeek, setSalesThisWeek] = useState(0);


  useEffect(() => {
    const fetchData = async () => {
      await checkStripeEligibility(); //Comment out to see the unregistered instructor view
  
      // Only proceed with additional fetches if isRegistered is true
      if (isRegistered) {
        await getWorkPackages();
          await fetchBalanceStripe();
      }
  
      console.log('is registered? ', isRegistered);
    };
  
    fetchData();
  }, [refresh, isRegistered]);


  const checkStripeEligibility = async () => {
    try {
      const token = await getItem('@token');
      const user = JSON.parse(token);
      const userId = user._id;
      //const response = await fetch(`http://localhost:4000/payment/checkStripeCapabilities/${userId}`); // Replace 'currentUserId' with the actual user ID
      
      const response = await fetch(`https://data.mongodb-api.com/app/lock-and-learn-xqnet/endpoint/checkStripeEligibility?instructorId=${userId}`);

      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        const { hasCardPaymentsCapability, hasTransfersCapability } = data;
        const newUserStatus = hasCardPaymentsCapability && hasTransfersCapability;
        setIsRegistered(newUserStatus);
      } else {
        console.error('Error fetching Stripe capabilities:', data.error);
      }
    } catch (error) {
      console.error('Error fetching Stripe capabilities:', error);
    }
  };

  /**
   * Fetches the total revenue balance of the instructor.
   * @returns {Promise<void>} A promise that resolves when the balance is fetched successfully.
   */


    const fetchBalanceStripe = async () => {
        try {
            const token = await getItem('@token');
            const user = JSON.parse(token);
            const userId = user._id;
            const response = await fetch(`http://localhost:4000/payment/balanceInstructorStripe/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            let data = await response.json();

            
            if (response.status === 200) {
                console.log('balance', data.revenue);

                setBalance(data.revenue);

                const availableBalance = data.balance.available[0].amount;
                const totalAvailableBalance = (availableBalance / 100).toFixed(2);

                setBalanceStripe(totalAvailableBalance);

                const pendingBalance = data.balance.pending[0].amount;
                const totalPendingBalance = (-pendingBalance / 100).toFixed(2);
                setBalancePending(totalPendingBalance);
            } else {
                console.error('Failed to fetch balance:', response.status);
            }
        } catch (error) {
            console.error('Error fetching balance:', error);
        }
    };

  /**
   * Fetches transactions from the server.
   * @returns {Promise<void>} A promise that resolves when the transactions are fetched.
   */

    // Function to fetch a transaction by ID
    const fetchTransaction = async (transactionId) => {
        try {
            const response = await fetch(`http://localhost:4000/payment/transactions/${transactionId}`);
            if (response.ok) {
                const data = await response.json();
                return data.payment; // Return the transaction data
            } else {
                console.error('Failed to fetch transaction:', response.status);
                return null; // Return null if the transaction fetch fails
            }
        } catch (error) {
            console.error('Error fetching transaction:', error);
            return null; // Return null if there is an error
        }
    };
    //  function to calculate the count of sales made this week
    const calculateSalesThisWeek = (transactionsData) => {
        let salesThisWeekCount = 0;
        const today = new Date();
        const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay()); // Sunday
        const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (6 - today.getDay())); // Saturday

        transactionsData.forEach((transaction) => {
            const transactionDate = new Date(transaction.created * 1000);
            if (transactionDate >= startOfWeek && transactionDate <= endOfWeek) {
                salesThisWeekCount++;
            }
        });

        return salesThisWeekCount;
    };

  /**
   * Retrieves created work packages for the current instructor.
   * @returns {Promise<void>} A promise that resolves when the work packages are retrieved successfully.
   */
    const getWorkPackages = async () => {
        try {
            const userToken = await getUser();
            const response = await fetch(
                'https://data.mongodb-api.com/app/lock-and-learn-xqnet/endpoint/getWorkPackagesByInstructorId?instructorID=${userToken._id}',
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            let data = await response.json();
            if (response.status === 200) {
                // Filter out deleted work packages
                data = data.filter((workpackage) => !workpackage.deletedByTutor);

                // Extract transaction IDs from work packages
                const transactionIds = data.reduce(
                    (ids, workPackage) => ids.concat(workPackage.stripePurchaseId),
                    []
                );

                // Fetch transactions for the extracted transaction IDs
                const transactionsPromises = transactionIds.map(fetchTransaction);
                const transactionsData = await Promise.all(transactionsPromises);

                // Calculate sales made this week
                const salesThisWeekCount = calculateSalesThisWeek(transactionsData);
                setSalesThisWeek(salesThisWeekCount);

                // Update work packages with recent purchase time
                const updatedWorkPackages = data.map((workPackage) => {
                    // Filter transactions related to this work package
                    const relevantTransactions = transactionsData.filter(transaction =>
                        workPackage.stripePurchaseId.includes(transaction.id)
                    );

                    // Find the latest transaction among relevant transactions
                    const latestTransaction = relevantTransactions.reduce((latest, transaction) => {
                        return !latest || transaction.created > latest.created ? transaction : latest;
                    }, null);

                    // Format recent purchase time or set to null if no transaction found
                    const recentPurchaseTime = latestTransaction ? new Date(latestTransaction.created * 1000).toLocaleString() : null;

                    return {
                        ...workPackage,
                        recentPurchaseTime: recentPurchaseTime,
                    };
                });

                setWorkPackages(updatedWorkPackages);
            }
        } catch (error) {
            console.log(error);
        }
    };

  const totalWorkPackagesSold = workPackages.reduce((total, workPackage) => {
    // Increment the total by the length of the stripePurchaseId array for each work package
    return total + workPackage.stripePurchaseId.length;
}, 0);

  /**
   * Copies the URL to the clipboard.
   */
  const copyToClipboard = () => {
    Clipboard.setString(generatedUrl);
  };

  /**
   * Generates a Stripe setup link for the instructor.
   * @returns {Promise<void>} A promise that resolves when the Stripe setup link is generated.
   */
  const generateStripeSetupLink = async () => {
    try {

      setLoading(true);

      const token = await getItem('@token');
      const user = JSON.parse(token);
      const userId = user._id;
      const response = await fetch(
        `http://localhost:4000/payment/initiateStripeBusinessAccount/${userId}`
      );
      const data = await response.json();
      console.log('Stripe setup link received:', data.url);
      console.log('Expiry time:', data.linkExpiry); // Convert timestamp to Date object

      const newExpiryTime = new Date(data.linkExpiry * 1000).toLocaleString();
      setExpiryTime(newExpiryTime);
      setGeneratedUrl(data.url);
      setLoading(false);
      setDisableButton(true);
    } catch (error) {
      console.log('error in generating stripe setup link: ', error);
      setLoading(false);
    }
  };

  // FOR DEVS: Delete the instructor Stripe accounts 
  const handleDeleteAccount = async () => {
    try {
      const stripeId = accountIdToDelete;

      // Make a request to your server to trigger the account deletion
      const response = await fetch(`http://localhost:4000/payment/delete-account/${stripeId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // You may include additional headers or authentication tokens here
        },
      });

      const data = await response.json();

      if (response.ok) {
        // The account deletion was successful
        console.log('Account deleted successfully: ', stripeId);
      } else {
        // The account deletion failed
        console.log('Account deletion failed:', data);
      }

    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  return (
    <View style={styles.page} testID="main-view">
      <View style={styles.container}>
        {isRegistered ? (
          <View style={styles.header}>
            <Text style={styles.title}>My Finance Dashboard</Text>
          </View>
        ) : (
          <View style={styles.header}>
            <Text style={styles.title}>Finance Setup</Text>
          </View>
        )}

        {!isRegistered && (
          <View style={styles.userContainer}>
            <Text style={styles.balance}>Get started by setting up your Stripe Account.</Text>
            <TouchableOpacity
              style={{
                ...styles.content,
                backgroundColor: '#635BFF',
                flexDirection: 'row',
                alignItems: 'center',
              }}
              disabled={disableButton}
              onPress={() => generateStripeSetupLink()}
              accessible={true}
            >
              <Text style={styles.text}>
                {' '}
                {isLoading
                  ? 'Generating Stripe Link...'
                  : generatedUrl
                  ? 'Stripe Link Generated'
                  : 'Create Setup Link'}{' '}
              </Text>
              {isLoading && (
                <ActivityIndicator size="small" color="white" style={{ marginRight: 10 }} />
              )}
              {!isLoading && (
                <Image
                  source={require('../../../assets/stripeIcon.png')}
                  style={{ width: 35, height: 35 }}
                />
              )}
            </TouchableOpacity>
            {generatedUrl && (
              <View
                style={{
                  ...styles.userContainer,
                  borderWidth: 2,
                  borderColor: 'boldColor',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text>{generatedUrl}</Text>
                <TouchableOpacity onPress={() => copyToClipboard()} style={styles.copyButton}>
                  <Image
                    source={require('../../../assets/copyIcon.png')}
                    style={{ width: 20, height: 20 }}
                  />
                </TouchableOpacity>
              </View>
            )}

            {generatedUrl && (
              <View>
                <Text style={{ fontSize: 13, marginBottom: 50, color: 'red' }}>
                  {' '}
                  This link will expire on {expiryTime}.
                </Text>
              </View>
            )}
            <Text style={{ textAlign: 'center' }}>
              * Please note that without a registered Stripe account, we will not be able to
              transfer the profits to you.
            </Text>
          </View>
        )}

              {/* Displaying the list of transactions */}
              {isRegistered && (
                  <View style={styles.userContainer}>
                      <Text style={styles.balance}>Total revenue: ${balanceStripe}</Text>
                      <Text style={styles.balance}>Total Sales: {totalWorkPackagesSold} </Text>
                      <Text style={styles.balance}>Sales this week: {salesThisWeek} </Text>
                      <Text style={styles.balance}>Revenue transferred: ${balancePending } </Text>
                  </View>
              )}

              {isRegistered && (
                  <ScrollView style={styles.transactionListContainer}>
                      <Text style={styles.title}>My Work Packages</Text>
                      {workPackages.map((workPackage) => (
                          <View key={workPackage._id} style={styles.userContainer}>
                              <View style={styles.workPackageText}>
                                  <Text style={styles.workPackageNameText}>
                                      {`${workPackage.name}`} Grade {`${workPackage.grade}`}
                                  </Text>
                                  <Text>Total Profit: ${`${workPackage.profit}`} </Text>
                                  <Text>Cost: ${`${workPackage.price}`}</Text>
                                  <Text>Quantity Sold: {workPackage.stripePurchaseId.length}</Text>
                                  <Text>Most Recent Purchase: {workPackage.recentPurchaseTime || "No recent purchase"}</Text>
                              </View>
                          </View>
                      ))}
                  </ScrollView>
              )}
        {/* Temporary Modal for test account deletions */}
        <Modal animationType="slide" transparent={true} visible={showDeleteModal}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, height: 200, width: 500 }}>
              <TextInput
                style={{
                  width: '100%',
                  height: 50,
                  borderColor: 'gray',
                  backgroundColor: 'white',
                  borderWidth: 1,
                  borderRadius: 5,
                  padding: 10,
                  marginBottom: 20,
                }}
                placeholder="Enter Account ID to Delete"
                value={accountIdToDelete}
                onChangeText={(text) => setAccountIdToDelete(text)}
              />
              <TouchableOpacity
                style={{
                  backgroundColor: '#D22B2B',
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 10,
                  borderRadius: 5,
                  width: '100%'
                }}
                onPress={handleDeleteAccount}
              >
                <Text style={{ color: 'white' }}> Delete Account </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowDeleteModal(false)}
                style={{
                  backgroundColor: 'white',
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 10,
                  borderRadius: 5,
                  width: '100%',
                }}
              >
                <Text style={{ color: 'black' }}> Cancel </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* ... other components */}

        <TouchableOpacity
          style={{
            ...styles.content,
            backgroundColor: '#635BFF',
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => setShowDeleteModal(true)}
        >
          <Text style={styles.text}> [Dev] Delete Stripe Account Modal </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    maxWidth: '100%',
    flex: 1,
    alignItems: 'center',
  },
  container: {
    minWidth: '40%',
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
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: wp(5),
    minHeight: hp(5),
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  },
  userContainer: {
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
  transactionListContainer: {
    paddingRight: 20,
  },
  workPackageNameText: {
    fontSize: '150%',
    color: '#4F85FF',
  },
  workPackageBox: {
    flexDirection: 'row', // Make the box a row container
    justifyContent: 'space-between', // Align elements horizontally with space between
    alignItems: 'flex-start', // Center vertically
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#4F85FF', // Change the border color to fit your design

    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    alignSelf: 'center',
  },
});

export default FinanceInstructor;
