import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { DEVICE_SIZES, minSize } from 'rn-responsive-styles';
import { Button, Icon, Checkbox } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { getItem } from '../../components/AsyncStorage';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import '../../carousel.css';

const WorkPackageBrowsingScreen = ({ route }) => {
  const navigation = useNavigation();
  const [workPackages, setWorkPackages] = useState([]);
  const [cartWorkPackages, setCartWorkPackages] = useState([]);
  const numberOfWorkPackagesToLoad = 100;
  const [modalAddVisible, setModalAddVisible] = useState(false);
  const [workPackageName, setWorkPackageName] = useState('');
  const [selectedWorkPackageID, setSelectedWorkPackageID] = useState(null);
  const [selectedWorkPackage, setSelectedWorkPackage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [user, setUser] = useState(null);
  const [children, setChildren] = useState([]);
  const [suggestedWorkPackages, setSuggestedWorkPackages] = useState([]);
  const [checkedGrade, setCheckedGrade] = useState([]);

  // Function to handle selecting a work package
  const selectWorkPackage = (workPackage) => {
    console.log(workPackage);
    setSelectedWorkPackage(workPackage);
    setSelectedWorkPackageID(workPackage._id);
    setWorkPackageName(workPackage.name);
    toggleModalAdd();
  };
  // Function to set the error message and clear it after a specified duration
  const setTemporaryErrorMessage = (message, duration = 3000) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, duration);
  };

  useEffect(() => {
    initializeCheckedGrade();
    fetchWorkPackages();
    fetchCartWorkPackages();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getItem('@token');
        if (token) {
          const user = JSON.parse(token);
          const response = await fetch('http://localhost:4000/child/getchildren/' + user._id, {
            method: 'GET',
            credentials: 'include', // Include cookies in the request
          });
          const data = await response.json();
          setUser(user);
          setChildren(data);
        } else {
          console.log('User not found in AsyncStorage');
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const getRandomWorkPackages = (childPreferences, allWorkPackages) => {
    let updatedSuggestedWorkPackages = [];
    let filteredWorkPackages = allWorkPackages.filter((workPackage) =>
      childPreferences.includes(workPackage.name)
    );

    if (filteredWorkPackages.length > 5) {
      for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * filteredWorkPackages.length);
        updatedSuggestedWorkPackages.push(filteredWorkPackages[randomIndex]);
        filteredWorkPackages.splice(randomIndex, 1);
      }
    } else {
      updatedSuggestedWorkPackages = filteredWorkPackages;
    }

    return updatedSuggestedWorkPackages;
  };

  useEffect(() => {
    let childSuggestedWorkPackages = {};

    for (let childKey in children) {
      let child = children[childKey];
      let childPreferences = child.preferences;

      childSuggestedWorkPackages[childKey] = getRandomWorkPackages(childPreferences, workPackages);
    }

    setSuggestedWorkPackages(childSuggestedWorkPackages);
  }, [children, workPackages]);

  // Retrieve the unowned work packages specific to the user
  const fetchWorkPackages = async (displayOwned = false) => {
    const token = await getItem('@token');
    const user = JSON.parse(token);
    const userId = user._id;
    if (userId) {
      try {
        const response = await fetch(
          `http://localhost:4000/workPackages/fetchWorkpackagesParent/${userId}?displayOwned=${displayOwned}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        if (response.status === 200) {
          const data = await response.json();
          setWorkPackages(data.slice(0, numberOfWorkPackagesToLoad));
        } else {
          console.error('Error fetching workPackagesBrowse');
        }
      } catch (error) {
        console.error('Network error:', error);
      }
    } else {
      console.log('All work packages owned by the user.');
    }
  };

  // Function to fetch user's cart work packages and update state
  const fetchCartWorkPackages = async () => {
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
          const userCartWorkPackages = data || [];
          console.log('Initial cart work packages', userCartWorkPackages);
          setCartWorkPackages(userCartWorkPackages);
        } else {
          console.error('Error fetching user cart work packages');
        }
      } catch (error) {
        console.error('Network error:', error);
      }
    } else {
      console.log('No packages in cart.');
    }
  };

  // Filter Workpackages by grade checked.
  const filterWorkPackagesByGrade = async (displayOwned = false) => {
    const token = await getItem('@token');
    const user = JSON.parse(token);
    const userId = user._id;
    let filteredResults = [];
    if (userId) {
      try {
        const response = await fetch(
          `http://localhost:4000/workPackages/fetchWorkpackagesParent/${userId}?displayOwned=${displayOwned}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        if (response.status === 200) {
          const data = await response.json();
          const workPackageArray = data.slice(0, numberOfWorkPackagesToLoad);
          if (checkedGrade.every((val) => val === false)) {
            filterWorkPackagesByText((displayOwned = false), workPackageArray);
          } else {
            for (let x in workPackageArray) {
              if (
                (workPackageArray[x].grade === '1st Grade' || workPackageArray[x].grade === '1') &&
                checkedGrade[0] === true
              ) {
                filteredResults.push(workPackageArray[x]);
              }
              if (
                (workPackageArray[x].grade === '2nd Grade' || workPackageArray[x].grade === '2') &&
                checkedGrade[1] === true
              ) {
                filteredResults.push(workPackageArray[x]);
              }
              if (
                (workPackageArray[x].grade === '3rd Grade' || workPackageArray[x].grade === '3') &&
                checkedGrade[2] === true
              ) {
                filteredResults.push(workPackageArray[x]);
              }
              if (
                (workPackageArray[x].grade === '4th Grade' || workPackageArray[x].grade === '4') &&
                checkedGrade[3] === true
              ) {
                filteredResults.push(workPackageArray[x]);
              }
              if (
                (workPackageArray[x].grade === '5th Grade' || workPackageArray[x].grade === '5') &&
                checkedGrade[4] === true
              ) {
                filteredResults.push(workPackageArray[x]);
              }
              if (
                (workPackageArray[x].grade === '6th Grade' || workPackageArray[x].grade === '6') &&
                checkedGrade[5] === true
              ) {
                filteredResults.push(workPackageArray[x]);
              }
              if (
                (workPackageArray[x].grade === '7th Grade' || workPackageArray[x].grade === '7') &&
                checkedGrade[6] === true
              ) {
                filteredResults.push(workPackageArray[x]);
              }
              if (
                (workPackageArray[x].grade === '8th Grade' || workPackageArray[x].grade === '8') &&
                checkedGrade[7] === true
              ) {
                filteredResults.push(workPackageArray[x]);
              }
              if (
                (workPackageArray[x].grade === '9th Grade' || workPackageArray[x].grade === '9') &&
                checkedGrade[8] === true
              ) {
                filteredResults.push(workPackageArray[x]);
              }
              if (
                (workPackageArray[x].grade === '10th Grade' ||
                  workPackageArray[x].grade === '10') &&
                checkedGrade[9] === true
              ) {
                filteredResults.push(workPackageArray[x]);
              }
              if (
                (workPackageArray[x].grade === '11th Grade' ||
                  workPackageArray[x].grade === '11') &&
                checkedGrade[10] === true
              ) {
                filteredResults.push(workPackageArray[x]);
              }
              if (
                (workPackageArray[x].grade === '12th Grade' ||
                  workPackageArray[x].grade === '12') &&
                checkedGrade[11] === true
              ) {
                filteredResults.push(workPackageArray[x]);
              }
            }
            if (document.getElementById('Search').value != '') {
              filterWorkPackagesByText((displayOwned = false), filteredResults);
            } else {
              setWorkPackages(filteredResults);
            }
          }
        } else {
          console.error('Error fetching workPackagesBrowse');
        }
      } catch (error) {
        console.error('Network error:', error);
      }
    } else {
      console.log('All work packages owned by the user.');
    }
  };

  // Filter Workpackages by search text.
  const filterWorkPackagesByText = async (displayOwned = false, gradeFilteredResults) => {
    const searchValue = document.getElementById('Search').value.toLowerCase();
    const filteredResults = [];

    for (let x in gradeFilteredResults) {
      if (gradeFilteredResults[x].name.toLowerCase().includes(searchValue)) {
        filteredResults.push(gradeFilteredResults[x]);
      }
    }
    setWorkPackages(filteredResults);
  };

  // function to store the WP in an array and send to database
  const handleAddWPToCart = async (selectedWorkPackage) => {
    try {
      const token = await getItem('@token');
      const user = JSON.parse(token);
      const userId = user._id;
      console.log(selectedWorkPackage);
      if (!userId || !selectedWorkPackage) {
        console.error('User ID or selected work package is missing');
        return;
      }
      const response = await fetch(`http://localhost:4000/workPackages/addToCart/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          CartWorkPackages: selectedWorkPackage,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Work package added to cart');
      } else {
        setTemporaryErrorMessage(data.error);
        console.error(data.error);
      }
    } catch (error) {
      console.error('Error adding work package to user:', error);
    }
  };

  // Function to check if a work package is in the user's cart
  const isInUserCart = (workPackageId) => {
    return cartWorkPackages.some((workPackage) => workPackage._id === workPackageId);
  };

  // Function to toggle the pop up modal for add to cart
  const toggleModalAdd = () => {
    setModalAddVisible(!modalAddVisible);
  };

  // Function to update the cart work packages state upon returning from the cart screen
  const updateCartUponReturn = (cartUpdateInfo) => {
    // Filter out the removed work packages from the cart work packages array
    const updatedCartWorkPackages = cartWorkPackages.filter((item) => {
      const stringId = String(item._id); // Convert _id to string for comparison
      return !cartUpdateInfo.removedWPsList.includes(stringId);
    });

    // Update the CartWorkPackages state
    setCartWorkPackages(updatedCartWorkPackages);
  };

  //If the user returns from the cart screen, update the cart work packages state
  useEffect(() => {
    if (route.params && route.params.removedWP) {
      // Update the state of cart work packages array
      updateCartUponReturn(route.params.removedWP);
    }
  }, [route.params?.removedWP]);

  // Function to handle the checkbox state
  const handleCheckbox = (grade) => {
    const tempArray = [...checkedGrade];

    switch (grade) {
      case 1:
        tempArray[0] = !tempArray[0];
        break;
      case 2:
        tempArray[1] = !tempArray[1];
        break;
      case 3:
        tempArray[2] = !tempArray[2];
        break;
      case 4:
        tempArray[3] = !tempArray[3];
        break;
      case 5:
        tempArray[4] = !tempArray[4];
        break;
      case 6:
        tempArray[5] = !tempArray[5];
        break;
      case 7:
        tempArray[6] = !tempArray[6];
        break;
      case 8:
        tempArray[7] = !tempArray[7];
        break;
      case 9:
        tempArray[8] = !tempArray[8];
        break;
      case 10:
        tempArray[9] = !tempArray[9];
        break;
      case 11:
        tempArray[10] = !tempArray[10];
        break;
      case 12:
        tempArray[11] = !tempArray[11];
        break;
      default:
        break;
    }
    setCheckedGrade(tempArray);
  };

  const clearFilter = () => {
    initializeCheckedGrade();
    document.getElementById('Search').value = '';
    fetchWorkPackages();
  };

  // Function to initialize the checkedGrade array to false
  const initializeCheckedGrade = () => {
    const tempArray = [];
    for (let i = 0; i < 12; i++) {
      tempArray.push(false);
    }
    setCheckedGrade(tempArray);
  };

  const CheckboxComponent = ({ label, checked, onChange }) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 8,
          marginHorizontal: 8,
        }}
      >
        <Checkbox status={checked ? 'checked' : 'unchecked'} onPress={onChange} color="blue" />
        <Text
          style={{
            fontWeight: 'none',
            marginLeft: -5,
            fontSize: 14,
            color: '#333',
            lineHeight: 24,
          }}
        >
          {label}
        </Text>
      </View>
    );
  };

  // Function to determine the grade suffix
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

  // Function to fetch user by ID
  const fetchUserById = async (userId) => {
    try {
      // Replace 'your-api-endpoint' with the actual API endpoint for fetching user by ID
      const response = await fetch(`http://localhost:4000/users/getUser/${userId}`);

      if (!response.ok) {
        throw new Error(`Error fetching user: ${response.statusText}`);
      }

      const user = await response.json();
      return user;
    } catch (error) {
      console.error('Error fetching user by ID:', error.message);
      throw new Error('An error occurred while fetching the user by ID.');
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/backgroundCloudyBlobsFull.png')}
      resizeMode="cover"
      style={styles.container}
    >
      <View style={styles.containerFile}>
        <View style={styles.page}>
          <Text style={styles.TitleName}>Explore</Text>
          <input id="Search" type="text" placeholder="Search" style={styles.textbox} />
          <Text
            style={{
              color: '#696969',
              fontSize: 20,
              fontWeight: '300',
              marginTop: '1%',
              textAlign: 'center',
            }}
          >
            Filter Work Packages by school grade
          </Text>
          <View style={styles.filterContainer}>
            <View style={styles.checkboxGroupStyle}>
              <CheckboxComponent
                label="1st"
                checked={checkedGrade[0]}
                onChange={() => {
                  handleCheckbox(1);
                }}
              />
              <CheckboxComponent
                label="2nd"
                checked={checkedGrade[1]}
                onChange={() => {
                  handleCheckbox(2);
                }}
              />
              <CheckboxComponent
                label="3rd"
                checked={checkedGrade[2]}
                onChange={() => {
                  handleCheckbox(3);
                }}
              />
              <CheckboxComponent
                label="4th"
                checked={checkedGrade[3]}
                onChange={() => {
                  handleCheckbox(4);
                }}
              />
            </View>
            <View style={styles.checkboxGroupStyle}>
              <CheckboxComponent
                label="5th"
                checked={checkedGrade[4]}
                onChange={() => {
                  handleCheckbox(5);
                }}
              />
              <CheckboxComponent
                label="6th"
                checked={checkedGrade[5]}
                onChange={() => {
                  handleCheckbox(6);
                }}
              />
              <CheckboxComponent
                label="7th"
                checked={checkedGrade[6]}
                onChange={() => {
                  handleCheckbox(7);
                }}
              />
              <CheckboxComponent
                label="8th"
                checked={checkedGrade[7]}
                onChange={() => {
                  handleCheckbox(8);
                }}
              />
            </View>
            <View style={styles.checkboxGroupStyle}>
              <CheckboxComponent
                label="9th"
                checked={checkedGrade[8]}
                onChange={() => {
                  handleCheckbox(9);
                }}
              />
              <CheckboxComponent
                label="10th"
                checked={checkedGrade[9]}
                onChange={() => {
                  handleCheckbox(10);
                }}
              />
              <CheckboxComponent
                label="11th"
                checked={checkedGrade[10]}
                onChange={() => {
                  handleCheckbox(11);
                }}
              />
              <CheckboxComponent
                label="12th"
                checked={checkedGrade[11]}
                onChange={() => {
                  handleCheckbox(12);
                }}
              />
            </View>
          </View>
          <View style={styles.containerFilterButtons}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.buttonFilter}
                onPress={() => {
                  filterWorkPackagesByGrade();
                }}
              >
                <Icon source="filter" size={30} color="#000" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonClearFilter}
                onPress={() => {
                  clearFilter();
                }}
              >
                <Icon source="filter-remove-outline" size={30} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ maxHeight: 600 }}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <View>
                {children.map((child, childIndex) => (
                  <View style={styles.viewChildPreferences} key={child.id}>
                    <Text style={styles.child}>
                      Suggested Work Packages for {child.firstName} {child.lastName}
                    </Text>
                    <Carousel style={styles.carousel}>
                      {Array.isArray(suggestedWorkPackages[childIndex]) &&
                        suggestedWorkPackages[childIndex].map((workPackage) => (
                          <View key={workPackage._id} style={styles.carouselWorkPackageBox}>
                            <View style={styles.workPackageText}>
                              <Text
                                style={styles.workPackageNameText}
                              >{`${workPackage.name}`}</Text>

                              <View style={styles.containerTag}>
                                <View style={styles.tagBox}>
                                  <Text style={styles.tagText} selectable={false}>
                                    {`${workPackage.grade}${getGradeSuffix(workPackage.grade)}`}{' '}
                                    grade
                                  </Text>
                                </View>
                              </View>

                              <Text style={styles.workPackageDescription}>
                                {`${
                                  workPackage.description === undefined
                                    ? ``
                                    : `${workPackage.description} \n`
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
                            <View style={styles.priceAndButton}>
                              <Text style={styles.priceWP}>
                                {workPackage.price && workPackage.price !== 0
                                  ? `$${workPackage.price} CAD`
                                  : 'Free'}
                              </Text>
                              <Button
                                key={workPackage._id}
                                mode="contained"
                                contentStyle={{
                                  minWidth: '50%',
                                  maxWidth: '100%',
                                  minHeight: 20,
                                  justifyContent: 'center',
                                  flexWrap: 'wrap',
                                }}
                                style={[styles.previewButton]}
                                onPress={() => {
                                  console.log('Previewing ' + workPackage);
                                  navigation.navigate('WorkPackagePreview', { workPackage });
                                }}
                                labelStyle={{ ...styles.cart, color: 'white' }}
                                disabled={isInUserCart(workPackage._id)}
                              >
                                Preview
                              </Button>
                              <Button
                                key={workPackage._id}
                                testID="addButton-wp1"
                                mode="contained"
                                contentStyle={{
                                  minWidth: '50%',
                                  maxWidth: '100%',
                                  minHeight: 20,
                                  justifyContent: 'center',
                                  backgroundColor: isInUserCart(workPackage._id)
                                    ? '#25B346'
                                    : undefined,
                                  flexWrap: 'wrap',
                                }}
                                style={[styles.button]}
                                onPress={() => {
                                  selectWorkPackage(workPackage);
                                }}
                                labelStyle={{ ...styles.cart, color: 'white' }}
                                disabled={isInUserCart(workPackage._id)}
                              >
                                {isInUserCart(workPackage._id) ? 'Added to Cart' : 'Add to Cart'}
                              </Button>
                            </View>
                          </View>
                        ))}
                    </Carousel>
                  </View>
                ))}
              </View>
              <Text style={styles.child}>Explore Work Packages</Text>
              {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
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
                      {`${
                        workPackage.description === undefined ? `` : `${workPackage.description}`
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
                  <View style={styles.priceAndButton}>
                    <Text style={styles.priceWP}>
                      {workPackage.price && workPackage.price !== 0
                        ? `$${workPackage.price} CAD`
                        : 'Free'}
                    </Text>
                    <Button
                      key={workPackage._id}
                      mode="contained"
                      contentStyle={{
                        minWidth: '50%',
                        maxWidth: '100%',
                        minHeight: 20,
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                      }}
                      style={[styles.previewButton]}
                      onPress={() => {
                        console.log(workPackage);
                        navigation.navigate('WorkPackagePreview', { workPackage });
                      }}
                      labelStyle={{ ...styles.cart, color: 'white' }}
                      disabled={isInUserCart(workPackage._id)}
                    >
                      Preview
                    </Button>
                    <Button
                      key={workPackage._id}
                      testID="addButton-wp1"
                      mode="contained"
                      contentStyle={{
                        minWidth: '50%',
                        maxWidth: '100%', // Adjust width to fit the content
                        minHeight: 20,
                        justifyContent: 'center', // Adjust alignment as needed
                        backgroundColor: isInUserCart(workPackage._id) ? '#25B346' : undefined,
                        flexWrap: 'wrap',
                      }}
                      style={[styles.button]}
                      onPress={() => {
                        // Pass the selected work package to the function
                        selectWorkPackage(workPackage);
                      }}
                      labelStyle={{ ...styles.cart, color: 'white' }}
                      disabled={isInUserCart(workPackage._id)} // Disable button if already in cart
                    >
                      {isInUserCart(workPackage._id) ? 'Added to Cart' : 'Add to Cart'}
                    </Button>
                  </View>
                </View>
              ))}
              {/* Modal */}
              <Modal
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
                        Are you sure you want to add to the cart {workPackageName}?
                      </Text>
                    </View>
                    <View style={styles.containerDeleteButtonsModal}>
                      <TouchableOpacity
                        style={styles.buttonAddModal}
                        onPress={() => {
                          if (selectedWorkPackageID) {
                            handleAddWPToCart(selectedWorkPackageID); // Pass the selected work package to the function
                            // Update the CartWorkPackages state on frontend
                            setCartWorkPackages((prevCart) => [...prevCart, selectedWorkPackage]);
                            //New cart work packages
                            console.log(cartWorkPackages);
                          }
                          toggleModalAdd();
                        }}
                      >
                        <Text style={styles.buttonTextAddModal}>Add</Text>
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
          </View>
          <TouchableOpacity
            testID="viewCartButton"
            style={styles.viewCartButton}
            onPress={() => {
              navigation.navigate('WorkPackageCart');
            }}
          >
            <Text style={styles.viewCartText}>View Cart ({cartWorkPackages.length})</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create(
  {
    page: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
    },
    carousel: {
      maxWidth: '100%',
      autoWidth: false,
    },
    viewPreferences: {
      flex: 1,
      maxHeight: 300,
      flexDirection: 'column',
    },
    viewChildPreferences: {
      display: 'flex',
      maxHeight: 200,
    },
    child: {
      fontSize: 20,
      marginBottom: 10,
      marginTop: 50,
      color: '#696969',
      fontWeight: 'bold',
      fontSize: 'x-large',
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
      fontSize: '120%',
      color: '#696969',
      textAlign: 'right',
    },
    title: {
      color: '#4F85FF',
      fontSize: 24,
      textAlign: 'center',
      paddingBottom: 20,
    },
    carouselScrollViewContent: {
      borderRadius: '25px',

      Height: '100%',
      width: '100%',
      paddingHorizontal: 80,
    },
    scrollViewContent: {
      borderRadius: '25px',
      flexGrow: 1,
      position: 'relative',
      Height: '10%',
      width: '100%',
      paddingHorizontal: 80,
      paddingBottom: 80, // Space for the "View Cart" button
    },
    workPackageNameText: {
      fontSize: '150%',
      color: '#4F85FF',
    },
    viewCartButton: {
      backgroundColor: '#4F85FF',
      alignItems: 'center',
      paddingVertical: 15,
      paddingHorizontal: 20,
      position: 'relative',
      bottom: 0,
      width: '50%',
      borderRadius: 8,
      verticalAlign: 'bottom',
    },
    viewCartText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    close: {
      color: 'white',
    },
    field: {
      color: '#ADADAD',
    },
    errorMessage: {
      color: 'red',
    },
    button: {
      color: '#ffffff',
      backgroundColor: '#4F85FF',
      borderRadius: 10,
      marginTop: 10,
      height: 40,
      flexWrap: 'wrap',
    },
    previewButton: {
      color: '#ffffff',
      backgroundColor: '#96B6FD',
      borderRadius: 10,
      marginTop: 10,
      height: 40,
      flexWrap: 'wrap',
    },
    cart: {
      paddingLeft: 0,
      textAlign: 'center',
      justifyContent: 'center',
      fontSize: 20,
      flexWrap: 'wrap',
    },
    selectFiles: {
      color: '#696969',
      fontSize: 35,
      fontWeight: '500',
      marginTop: '1%',
      textAlign: 'center',
    },
    workPackageItemContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
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
    box: {
      borderWidth: 1,
      borderColor: 'red',
      color: 'red',
      padding: 10,
    },
    bottomCloud: {
      display: 'flex',
      justifyContent: 'flex-end',
      width: '100%',
      height: 250,
      resizeMode: 'stretch',
    },
    input: {
      display: 'flex',
      width: '100%',
      paddingVertical: 10,
    },
    textbox: {
      display: 'flex',
      minHeight: 30,
      width: '20%',
      minWidth: 200,
      borderRadius: 10,
      borderColor: '#407BFF',
      borderStyle: 'solid',
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderWidth: 1,
    },
    carouselWorkPackageBox: {
      flexDirection: 'row',
      maxHeight: 200,
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#4F85FF',
      borderRadius: 8,
      padding: 10,
      width: '60%',
      alignSelf: 'center',
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
    workPackageText: {
      flex: 1, // Allow text to wrap within the available space
    },
    filterContainer: {
      backgroundColor: 'FAFAFA',
      width: '100%',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkboxGroupStyle: {
      backgroundColor: 'FAFAFA',
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
      alignSelf: 'top',
      alignItems: 'center',
    },
    checkBoxStyle: {
      backgroundColor: 'white',
      width: '5%',
      minWidth: 50,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    buttonFilter: {
      backgroundColor: '#4F85FF',
      alignItems: 'center',
      justifyContent: 'center',
      width: '30%',
      height: 40,
      borderRadius: 8,
      marginHorizontal: 23, // Adjust the margin as needed for spacing
      paddingVertical: 0,
    },
    buttonClearFilter: {
      backgroundColor: '#B2BEB5',
      alignItems: 'center',
      justifyContent: 'center',
      width: '30%',
      height: 40,
      borderRadius: 8,
      marginHorizontal: 23, // Adjust the margin as needed for spacing
      paddingVertical: 0,
    },
    containerFilterButtons: {
      backgroundColor: 'FAFAFA',
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignSelf: 'top',
      alignItems: 'center',
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
      paddingVertical: 20,
    },
    workPackageDescription: {
      fontSize: '110%',
      color: '#696969',
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
    instructorDetails: {
      fontSize: '80%',
      color: '#696969',
    },
    boldText: {
      fontWeight: 'bold', // Make the instructor's name bold
    },
    buttonContainer: {
      flexDirection: 'row',
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

export default WorkPackageBrowsingScreen;
