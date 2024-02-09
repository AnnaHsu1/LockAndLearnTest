import React, { useState, useEffect } from 'react';
import {
  ImageBackground,
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
import { WorkPackageCard } from '../../../components/WorkPackageCard';
import { getItem } from '../../../components/AsyncStorage';
import { Icon,} from 'react-native-paper';

const FinanceInstructor = ({ navigation, route }) => {
  const refresh = route.params?.refresh;
  const [workPackages, setWorkPackages] = useState([]);
  const [balance, setBalance] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false); // TEMPORARY FOR STRIPE SETUP, set to false to see the unregistered instructor view
  const [generatedUrl, setGeneratedUrl] = useState(null);
  const [expiryTime, setExpiryTime] = useState(null);
  const [disableButton, setDisableButton] = useState(false);
  const [accountIdToDelete, setAccountIdToDelete] = useState(''); // For devs
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await checkStripeEligibility(); //Comment out to see the unregistered instructor view
  
      // Only proceed with additional fetches if isRegistered is true
      if (isRegistered) {
        await getWorkPackages();
        await fetchBalance();
        await fetchAllTransactions();
      }
  
      console.log('is registered? ', isRegistered);
    };
  
    fetchData();
  }, [refresh, isRegistered]);

  /**
   * Retrieves the recent purchase time for a given work package ID when involved in a transaction.
   * @param {string} workPackageId - The ID of the work package.
   * @returns {string} - The formatted recent purchase time, or an empty string if not found.
   */
  const getRecentPurchaseTime = (workPackageId) => {
    const recentTransaction = transactions.find((transaction) => transaction.id === workPackageId);
    return recentTransaction ? new Date(recentTransaction.created * 1000).toLocaleString() : '';
  };


  const checkStripeEligibility = async () => {
    try {
      const token = await getItem('@token');
      const user = JSON.parse(token);
      const userId = user._id;
      const response = await fetch(`http://localhost:4000/payment/checkStripeCapabilities/${userId}`); // Replace 'currentUserId' with the actual user ID
      const data = await response.json();

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
  const fetchBalance = async () => {
    try {
      const token = await getItem('@token');
      const user = JSON.parse(token);
      const userId = user._id;
      const response = await fetch(`http://localhost:4000/payment/balanceInstructor/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      let data = await response.json();
      if (response.status === 200) {
        console.log('balance', data.revenue);

        setBalance(data.revenue);
      } else {
        console.error('Failed to fetch balance:', response.status);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  /**
   * Fetches all transactions from the server.
   * @returns {Promise<void>} A promise that resolves when the transactions are fetched.
   */
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

  /**
   * Retrieves created work packages for the current instructor.
   * @returns {Promise<void>} A promise that resolves when the work packages are retrieved successfully.
   */
  const getWorkPackages = async () => {
    try {
      const userToken = await getUser();
      const response = await fetch(
        'http://localhost:4000/workPackages/getWorkPackages/' + userToken._id,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
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
            <Text style={styles.balance}>Total revenue: ${balance}</Text>
            <Text style={styles.balance}>Total Sales: {totalWorkPackagesSold} </Text>
            <Text style={styles.balance}>Sales this week: </Text>
            <Text style={styles.balance}>Sales since last login: </Text>
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
                  <Text>Most Recent Purchase: </Text>
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

      {/* Error Modal */}
      {/*<Modal*/}
      {/*    animationType="slide"*/}
      {/*    isVisible={errorModalVisible}*/}
      {/*    onBackdropPress={() => setErrorModalVisible(false)}*/}
      {/*    transparent={true}*/}
      {/*    style={{ elevation: 20, justifyContent: 'center', alignItems: 'center' }}*/}
      {/*>*/}
      {/*    <View style={styles.modalCard}>*/}
      {/*        <Text style={styles.modalText}>{errorMessage}</Text>*/}
      {/*        <TouchableOpacity*/}
      {/*            style={[styles.modalButton, { backgroundColor: '#4F85FF', borderColor: '#4F85FF' }]}*/}
      {/*            onPress={() => setErrorModalVisible(false)}*/}
      {/*        >*/}
      {/*            <Text style={{ fontWeight: 'bold', color: 'white' }}>Okay</Text>*/}
      {/*        </TouchableOpacity>*/}
      {/*    </View>*/}
      {/*</Modal>*/}
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
