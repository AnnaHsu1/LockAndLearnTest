import React, { useState, useEffect, useRef } from 'react';
import {
    Text,
    View,
    Image,
    FlatList,
    TouchableOpacity,
    Modal,
    ScrollView,
    ImageBackground,
    StyleSheet,
    Platform,
} from 'react-native';
import { CreateResponsiveStyle, DEVICE_SIZES, minSize, useDeviceSize } from 'rn-responsive-styles';
import { Button, Icon } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { getItem } from '../../components/AsyncStorage';
import WebView from 'react-native-webview';

const WorkPackageCart = () => {
  const navigation = useNavigation();
  const [workPackages, setWorkPackages] = useState([]);
  const [workPackageName, setWorkPackageName] = useState('');
  const [selectedWorkPackage, setSelectedWorkPackage] = useState(null);
  const [modalAddVisible, setModalAddVisible] = useState(false);
  const [removedWPs, setRemovedWP] = useState([]);
  const [paypalUrl, setPaypalUrl] = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  const webViewRef = useRef(null);


  // Function to handle selecting a work package
  const selectWorkPackage = (workPackage) => {
    console.log(workPackage);
    setSelectedWorkPackage(workPackage._id);
    setWorkPackageName(workPackage.name); // Set the work package name for the modal display
    toggleModalAdd();
  };

  // Retrieve the unowned work packages specific to the user
  const fetchWorkPackages = async () => {
    const token = await getItem('@token');
    const user = JSON.parse(token);
    const userId = user._id;
    if (userId) {
      try {
        const response = await fetch(
          `http://localhost:4000/workPackages/fetchWorkpackagesCart/${userId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        if (response.status === 200) {
          const data = await response.json();
          setWorkPackages(data);
        } else {
          console.error('Error fetching workPackagesCart');
        }
      } catch (error) {
        console.error('Network error:', error);
      }
    } else {
      console.log('All work packages owned by the user.');
    }
  };
  // Function to delete a work package in cart
  const handleDeleteFile = async (selectedWorkPackage) => {
    const token = await getItem('@token');
    const user = JSON.parse(token);
    const userId = user._id;
    try {
      const response = await fetch(
        `http://localhost:4000/workPackages/deleteFromCart/${userId}/${selectedWorkPackage}`,
        {
          method: 'DELETE',
        }
      );
      if (response.ok) {
        console.log(response);

        // Update the removed work packages list to be shipped to the WorkPackageBrowsing screen
        setRemovedWP((prevState) => {
          const updatedRemovedWP = [...prevState, selectedWorkPackage];
          //console.log("removed packages list from workpackagecart.js", updatedRemovedWP);
          return updatedRemovedWP;
        });
        fetchWorkPackages();
      }
    } catch (error) {
      console.error('Network error');
    }
  };

  //Function to handle payment upon pressing "Pay Now"
  const handlePayment = async () => {
    try {
      const token = await getItem('@token');
      const user = JSON.parse(token);
      const userId = user._id;

      if (userId) {
        const response = await fetch('http://localhost:4000/payment/initOrder', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            totalPrice: calculateTotalPrice(), //Send the total payment price
          }),
        });

        if (response.ok) {
          const orderData = await response.json();
          console.log('Order received and sent:', orderData);

          if (orderData.id) {
            if (!!orderData?.links) {
                const findUrl = orderData.links.find(data => data?.rel == "approve")
                console.log('find URL: ', findUrl.href)
                setPaypalUrl(findUrl.href)

                
                //May need to change for android
                // Conditionally redirect based on platform
                if (Platform.OS === 'web') {
                    window.location.href = findUrl.href;
                } else {
                    Linking.openURL(findUrl.href)
                        .then(() => {
                            // Optionally, perform any actions after the URL is opened
                        })
                        .catch((err) => {
                            console.error('Error opening PayPal URL:', err);
                        });
                }
            }

          } else {
            const errorDetail = orderData?.details?.[0];
            const errorMessage = errorDetail
              ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
              : JSON.stringify(orderData);

            throw new Error(errorMessage);
          }

        } else {
          console.error('Could not initiate PayPal Checkout...');
        }
      } else {
        console.log('Must be logged in to purchase work packages');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  // Function to capture the payment after the user has approved the payment
  const completeOrder = async (orderId) => {
    try {
        const token = await getItem('@token');
        const user = JSON.parse(token);
        const userId = user._id;
  
        if (userId) {
          const response = await fetch(`http://localhost:4000/payment/${orderId}/capture`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            }
          });
  
          if (response) {
            console.log('response from capture', response);
            alert("Payment successful and confirmed.")
            clearPaypalState()
          }
            
        } else {
          console.log('Must be logged in to purchase work packages2');
        }
      } catch (error) {
        console.error('Network error:', error);
        // Handle network errors or other exceptions
        // ...
      }
}

  const renderPaypalComponent = () => {
    if (Platform.OS === 'web') {
      return (
        <View>
          {paypalUrl && (
            <div>
              <button onClick={clearPaypalState}>Close Modal</button>
              <div style={{ flex: 1 }}>
                <iframe
                  title="PayPal Checkout"
                  src={paypalUrl}
                  width="100%"
                  height="500px" // Adjust the height as needed
                  frameBorder="0"
                />
              </div>
            </div>
          )}
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          {paypalUrl && (
            <View style={{ flex: 1 }}>
              <TouchableOpacity onPress={clearPaypalState} style={{ margin: 24 }}>
                <Text>Close Modal</Text>
              </TouchableOpacity>
              <WebView source={{ uri: paypalUrl }} />
            </View>
          )}
        </View>
      );
    }
  };

  const clearPaypalState = () => {
    setPaypalUrl(''); // Clear PayPal URL to close the iframe
  };

  // Function to toggle the pop up modal for add to cart
  const toggleModalAdd = () => {
    setModalAddVisible(!modalAddVisible);
  };

  // Function to calculate the total price based on the work packages
  const calculateTotalPrice = () => {
    const totalPrice = workPackages.reduce((total, workPackage) => {
      // Convert the price to a number before adding it to the total
      const price = parseFloat(workPackage.price) || 0;
      return total + price;
    }, 0);

    return totalPrice.toFixed(2);
  };

  useEffect(() => {
    fetchWorkPackages();
  }, []);

  // Set the parameters to be sent back to WorkPackageBrowsing
  useEffect(() => {
    // Set parameters when navigating back to WorkPackageBrowsing
    console.log('removed packages list params set from workpackagecart.js', removedWPs);
    navigation.setParams({
      removedWPsList: removedWPs, // Replace with the data you want to send back
    });
  }, [removedWPs]);

  return (
    <ImageBackground
      source={require('../../assets/backgroundCloudyBlobsFull.png')}
      resizeMode="cover"
      style={styles.container}
    >
      <View style={styles.containerFile}>
        <Text style={styles.TitleName}>Your Cart ({workPackages.length})</Text>

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {workPackages.map((workPackage) => (
            // Display the work package details
            <View key={workPackage._id} style={styles.workPackageBox}>
              <View style={styles.workPackageText}>
                <Text style={styles.workPackageNameText}>
                  {`${workPackage.name} - ${workPackage.grade} \n\n`}
                </Text>
                <Text>
                  {`${
                    workPackage.description === undefined ? `` : `${workPackage.description} \n`
                  }`}
                </Text>
                {workPackage.instructorDetails && (
                  <Text>
                    made by {workPackage.instructorDetails.firstName}{' '}
                    {workPackage.instructorDetails.lastName}
                  </Text>
                )}
              </View>
              <View style={styles.priceAndButton}>
                <Text style={{ fontWeight: '700', marginRight: 10 }}>
                  {workPackage.price && workPackage.price !== 0 ? `$${workPackage.price}` : 'Free'}
                </Text>

                <Button
                  key={workPackage._id}
                  mode="contained"
                  contentStyle={{
                    minWidth: '50%',
                    maxWidth: '100%', // Adjust width to fit the content
                    minHeight: 20,
                    justifyContent: 'center', // Adjust alignment as needed
                  }}
                  style={[styles.button]}
                  onPress={() => {
                    selectWorkPackage(workPackage);
                  }}
                  labelStyle={styles.cart} // Apply text styles directly to the button label
                >
                  Remove
                </Button>
              </View>
            </View>
          ))}
          {/* Modal */}
          <Modal
            testID="modalIdentifier"
            animationType="slide"
            transparent={true}
            visible={modalAddVisible}
            onRequestClose={() => {
              toggleModalAdd();
            }}
          >
            <View style={styles.containerDeleteModal}>
              <View style={styles.containerDeleteMaterial}>
                <View style={styles.titleDeleteModal}>
                  <Text style={styles.textDeleteModal}>
                    Are you sure you want to delete {workPackageName} from your cart ?
                  </Text>
                </View>
                <View style={styles.containerDeleteButtonsModal}>
                  <TouchableOpacity
                    style={styles.buttonAddModal}
                    onPress={() => {
                      if (selectedWorkPackage) {
                        handleDeleteFile(selectedWorkPackage); // Pass the selected work package to the function
                      }
                      toggleModalAdd();
                    }}
                  >
                    <Text style={styles.buttonTextAddModal}>Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.buttonCancelModal}
                    onPress={() => {
                      toggleModalAdd();
                    }}
                  >
                    <Text style={styles.buttonTextCancelModal}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
        {/* Order Summary Container */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Order Summary</Text>
        </View>
        <View style={styles.totalPriceContainer}>
          <Text style={styles.totalPriceText}>Total Price: ${calculateTotalPrice()}</Text>
        </View>

        <TouchableOpacity style={styles.viewCartButton} onPress={handlePayment}>
          <Text style={styles.viewCartText}>Pay Now</Text>
        </TouchableOpacity>

        {/*{renderPaypalComponent()}*/}

      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
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
        padding: 20, // Add padding to match the styling in QuizzesOverviewScreen
        paddingBottom: 100,
        // Flex styles to position the Order Summary above ScrollView content
        display: 'flex',
        flexDirection: 'column',

    },
    scrollViewContent: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingBottom: 90, // Space for the "View Cart" button
        marginTop: 20,
    },
    workPackageItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    workPackageNameText: {
        fontSize: '120%',
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
    TitleName: {
        fontSize: 25,
        marginBottom: 10,
        color: '#696969',
    },
    headerContainer: {
        backgroundColor: '#4F85FF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        width: '50%',
        alignItems: 'center',
        marginBottom: 5, // Adjust the margin here
    },
    headerText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    totalPriceContainer: {
        backgroundColor: '#F0F0F0', // Change to desired background color
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: '50%',
        alignItems: 'center',
        marginTop: -5, // Adjust the negative margin here
    },
    totalPriceText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    box: {
        borderWidth: 1,
        borderColor: 'red',
        color: 'red',
        padding: 10,
    },
    input: {
        display: 'flex',
        width: '100%',
        paddingVertical: 10,
    },
    viewCartButton: {
        backgroundColor: '#4F85FF',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        position: 'absolute',
        bottom: 20,
        left: '50%', // Center the button horizontally
        transform: [{ translateX: '-50%' }], // Centering trick
        width: '50%',
        borderRadius: 8,
    },
    viewCartText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    textbox: {
        display: 'flex',
        minHeight: 30,
        borderRadius: 10,
        borderColor: '#407BFF',
        borderStyle: 'solid',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderWidth: 1,
    },
    workPackageBox: {
        flexDirection: 'row', // Make the box a row container
        justifyContent: 'space-between', // Align elements horizontally with space between
        alignItems: 'flex-start', // Center vertically

        borderWidth: 1,
        borderColor: '#4F85FF', // Change the border color to fit your design

        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        width: '50vw', // Set width as a percentage
        alignSelf: 'center',
    },

    button: {
        color: '#ffffff',
        backgroundColor: '#4F85FF',
        borderRadius: 10,
        marginTop: 10,
        height: 40,
    },

    cart: {
        paddingLeft: 10,
        textAlign: 'center',
        justifyContent: 'center',
        fontSize: 20,
    },
    containerDeleteModal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    containerDeleteMaterial: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 25,
        width: 262,
    },
    titleDeleteModal: {
        alignItems: 'center',
        width: '100%',
    },
    textDeleteModal: {
        fontSize: 16,
        color: '#696969',
        fontWeight: '500',
        textAlign: 'center',
    },
    containerDeleteButtonsModal: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingTop: '10%',
    },
    buttonAddModal: {
        backgroundColor: '#407BFF',
        marginRight: 20,
        width: 100,
        borderRadius: 10,
        padding: 5,
    },
    buttonTextAddModal: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    buttonCancelModal: {
        backgroundColor: 'grey',
        width: 100,
        borderRadius: 10,
        padding: 5,
    },
    buttonTextCancelModal: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    orderSummaryContainer: {
        position: 'absolute',
        bottom: 80, // Adjust based on the required spacing from Pay Now button
        width: '50%',
        backgroundColor: '#4F85FF',
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        left: '50%', // Center the button horizontally
        transform: [{ translateX: '-50%' }], // Centering trick
    },
    orderSummaryTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    workPackageText: {
        flex: 1, // Allow text to wrap within the available space
    },
});

export default WorkPackageCart;
