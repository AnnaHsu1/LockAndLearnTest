import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ImageBackground,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Icon } from 'react-native-paper';
import { useWindowDimensions } from 'react-native';

const ChildTimeframes = ({ route, navigation }) => {
  const [child, setChild] = useState({});
  const childSelected = route.params.child;
  const [isEnabled, setIsEnabled] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [addMode, setAddMode] = useState(false);
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const [selectedDay, setSelectedDay] = useState('');
  const [starthour, setStartHour] = useState('');
  const [startminute, setStartMinute] = useState('');
  const [endhour, setEndHour] = useState('');
  const [endminute, setEndMinute] = useState('');
  const [deviceWidth, setDeviceWidth] = useState(0);
  const { height, width } = useWindowDimensions();
  const [toggleSwitchItem, setToggleSwitchItem] = useState({});
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  //   const [mondayTimeframes, setMondayTimeframes] = useState([
  //     { day: 'Monday' },
  //     // {
  //     //     start: "7:00AM",
  //     //     end: "9:00AM"
  //     // },
  //     // {
  //     //     start: "4:00PM",
  //     //     end: "5:00PM"
  //     // }
  //   ]);
  //   const [tuesdayTimeframes, setTuesdayTimeframes] = useState([]);
  //   const [wednesdayTimeframes, setWednesdayTimeframes] = useState([]);
  //   const [thursdayTimeframes, setThursdayTimeframes] = useState([]);
  //   const [fridayTimeframes, setFridayTimeframes] = useState([]);
  //   const [saturdayTimeframes, setSaturdayTimeframes] = useState([]);
  //   const [sundayTimeframes, setSundayTimeframes] = useState([]);

  const [timeframes, setTimeframes] = useState([]);

  const getChildTimeframes = async () => {
    try {
      const response = await fetch(
        'http://localhost:4000/timeframes/gettimeframes/' + childSelected._id,
        {
          method: 'GET',
          credentials: 'include', // Include cookies in the request
        }
      );
      const data = await response.json();
      if (response.status != 200) {
        console.log(data.msg);
      } else {
        console.log('Timeframes retrieved successfully!');
        // console.log(data);
        setTimeframes(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Toggle switches to be on/off based on the timeframes retrieved from the database
  const getSwitchesStatus = (timeframes) => {
    var switchesStatus = {};
    timeframes.forEach(function (timeframe) {
      switchesStatus[timeframe._id] = timeframe.isActive;
    }); 
    setToggleSwitchItem(switchesStatus);
  }

  // Order and sort timeframes by day and start time
  const orderSortTimeframes = (timeframes) => {
    // group timeframes by day (monday to sunday)
    var groupedTimeframes = {};
    timeframes.forEach(function (a) {
      groupedTimeframes[a.day] = groupedTimeframes[a.day] || [];
      groupedTimeframes[a.day].push(a);
    });
    // sort by day and start time (00:00 to 23:59)
    var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    var orderedTimeframes = {};
    days.forEach(function (day) {
      orderedTimeframes[day] = groupedTimeframes[day] || [];
      orderedTimeframes[day] = orderedTimeframes[day].sort(function (a, b) {
        return a.startTime.localeCompare(b.startTime);
      });
    });
    return orderedTimeframes;
  };

  const addTimeframe = async () => {
    try {
      console.log(selectedDay, starthour, startminute, endhour, endminute);
      const response = await fetch('http://localhost:4000/timeframes/addtimeframe', {
        method: 'POST',
        credentials: 'include', // Include cookies in the request
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          childId: childSelected._id,
          day: selectedDay,
          startTime: starthour + ':' + startminute,
          endTime: endhour + ':' + endminute,
        }),
      });

      const data = await response.json();

      if (response.status != 201) {
        console.log(data.msg);
      } else {
        console.log('Timeframe added successfully!');
        setAddMode(false);
        clearAddFields();
      }
    } catch (error) {
      console.log(error.msg);
    }
  };

  const clearAddFields = () => {
    setStartHour('');
    setStartMinute('');
    setEndHour('');
    setEndMinute('');
    setSelectedDay('');
  };

  useEffect(() => {
    setDeviceWidth(width);
    setChild(childSelected);
    getChildTimeframes();
  }, []);

  // Function to toggle switch for timeframes based on timeframe id
  const toggleSwitch = async (timeframeId) => {
    setToggleSwitchItem((prevToggleSwitchItem) => ({
      ...prevToggleSwitchItem,
      [timeframeId]: !prevToggleSwitchItem[timeframeId] || false,
    }));
  }
  
  // Function to update the database when a switch is toggled
  const updateSwitch = async () => {
    try {
      if (Object.keys(toggleSwitchItem).length === 0) {
        return;
      }
      const response = await fetch('http://localhost:4000/timeframes/updateTimeframe', {
        method: 'PUT',
        credentials: 'include', // Include cookies in the request
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timeframeIds: Object.keys(toggleSwitchItem),
          switchesStatus: Object.values(toggleSwitchItem),
        }),
      });
      const data = await response.json();
      if (response.status != 200) {
        console.log(data.msg);
      } else {
        console.log('Timeframe updated successfully!');
      }
    } catch (error) {
      console.log(error.msg);
    }
  }

  // Function to toggle pop up modal for deleting a timeframe
  const toggleDeleteModal = () => {
    setDeleteModalVisible(!isDeleteModalVisible);
  };

  // Function to delete a timeframe
  const handleDeleteTimeframe = async (timeframeId) => {
    try {
      const response = await fetch('http://localhost:4000/timeframes/deletetimeframe/' + timeframeId, {
        method: 'DELETE',
        credentials: 'include', // Include cookies in the request
      });
      const data = await response.json();
      if (response.status != 200) {
        console.log(data.msg);
      } else {
        console.log('Timeframe deleted successfully!');
        getChildTimeframes();
      }
    } catch (error) {
      console.log(error.msg);
    }
  };

  return (
    <ImageBackground
      source={require('../../../assets/backgroundCloudyBlobsFull.png')}
      resizeMode="cover"
      style={styles.container}
    >
      <View style={styles.containerFile}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '80%',
            alignSelf: 'center',
          }}
        >
          {/* if addMode is true, then setEditMode is disabled */}
          <TouchableOpacity onPress={() => setEditMode(addMode ? null : !editMode)} disabled={addMode} style={{ opacity: addMode ? 0.5 : 1 }}>
            {editMode ? (
              addMode ? (
                // if editMode is true and addMode is true
                <Text style={{ fontSize: 15, color: '#407BFF' }}>Edit</Text>
              ) : (
                // for mobile
                deviceWidth < 450 ? (
                  <View style={{ flexDirection:"row" }}>
                    <View style={{ marginRight: 1 }}>
                      <Icon source="close" size={17} color="#F24E1E" />
                    </View>
                    <Icon source="check" size={17} color="#407BFF" />
                  </View>
                ) : (
                  // if editMode is true and addMode is false
                  <View style={{flexDirection:"row"}}>
                    <Text style={{ fontSize: 15, color: '#F24E1E', marginRight: 10 }}>Cancel</Text>
                    <Text style={{ fontSize: 15, color: '#407BFF' }}>Save</Text>
                  </View>
                )
              )
            ) : (
              // if editMode is false
              <Text style={{ fontSize: 15, color: '#407BFF' }}>Edit</Text>
            )}
          </TouchableOpacity>
          <Text style={[styles.title]}>Timeframes</Text>
          {/* if editMode is true,  addMode is also true */}
          <TouchableOpacity onPress={() => setAddMode(!addMode)} >
            {addMode ? (
              <Text style={{ fontSize: 15, color: '#F24E1E' }}>Cancel</Text> // if addMode is true
            ) : (
              <Icon source="plus" size={17} color="#407BFF" /> // if addMode is false
            )}
          </TouchableOpacity>
        </View>
        {/* adding new timeframes */}
        {addMode ? (
          <View style={[{ width: '100%' }]}>
            {/* change to row */}
            <View style={[{ flexDirection: 'column' }]}>
              {days.map((day) => (
                <View style={{ flexDirection: 'column' }}>
                  <View
                    style={[
                      {
                        paddingVertical: 10,
                        borderColor: selectedDay === day ? '#407BFF' : '#D3D3D3',
                        borderWidth: 1,
                        marginHorizontal: 5,
                        width: 100,
                        borderRadius: 5,
                      },
                    ]}
                  >
                    <TouchableOpacity
                      style={[{ alignItems: 'center', justifyContent: 'center', fontSize: 14 }]}
                      onPress={() => setSelectedDay(day)}
                    >
                      <Text>{day}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
            <View style={[{ alignItems: 'center', justifyContent: 'center' }]}>
              <View>
                <Text style={[{ color: '#000', fontSize: 16 }]}>Start</Text>
                <View style={[{ flexDirection: 'row' }]}>
                  <TextInput
                    style={[
                      {
                        borderColor: '#407BFF',
                        borderWidth: 1,
                        width: 50,
                        borderRadius: 5,
                        textAlign: 'center',
                        fontSize: 14,
                      },
                    ]}
                    placeholder="HH"
                    keyboardType="numeric"
                    value={starthour}
                    onChangeText={setStartHour}
                    maxLength={2}
                  />
                  <Text>:</Text>
                  <TextInput
                    style={[
                      {
                        borderColor: '#407BFF',
                        borderWidth: 1,
                        width: 50,
                        borderRadius: 5,
                        textAlign: 'center',
                        fontSize: 14,
                      },
                    ]}
                    placeholder="MM"
                    keyboardType="numeric"
                    value={startminute}
                    onChangeText={setStartMinute}
                    maxLength={2}
                  />
                </View>
              </View>
              <View>
                <Text style={[{ color: '#000', fontSize: 16 }]}>End</Text>
                <View style={[{ flexDirection: 'row' }]}>
                  <TextInput
                    style={[
                      {
                        borderColor: '#407BFF',
                        borderWidth: 1,
                        width: 50,
                        borderRadius: 5,
                        textAlign: 'center',
                        fontSize: 14,
                      },
                    ]}
                    placeholder="HH"
                    keyboardType="numeric"
                    value={endhour}
                    onChangeText={setEndHour}
                    maxLength={2}
                  />
                  <Text>:</Text>
                  <TextInput
                    style={[
                      {
                        borderColor: '#407BFF',
                        borderWidth: 1,
                        width: 50,
                        borderRadius: 5,
                        textAlign: 'center',
                        fontSize: 14,
                      },
                    ]}
                    placeholder="MM"
                    keyboardType="numeric"
                    value={endminute}
                    onChangeText={setEndMinute}
                    maxLength={2}
                  />
                </View>
              </View>
              <TouchableOpacity
                style={[
                  {
                    width: '80%',
                    borderColor: '#407BFF',
                    borderWidth: 1,
                    borderRadius: 5,
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                ]}
                onPress={addTimeframe}
              >
                <Text style={[{ color: '#407BFF' }]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            {!editMode ? (
              /* viewing time frames */
              <View style={{ width: '100%', height: '100%' }}>
                {timeframes.map((timeframe) => (
                  <View>
                    <View
                      style={{
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flex: 1,
                        backgroundColor: '#FAFAFA',
                        marginBottom: 10,
                        width: '100%',
                        alignSelf: 'center',
                      }}
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          width: '111%',
                          alignItems: 'center',
                          justifyContent: 'space-around',
                          flex: 1,
                        }}
                      >
                        <View style={{ flexDirection: 'column' }}>
                          <Text style={{ fontSize: 15 }}>{timeframe.day}</Text>
                          <Text style={{ fontSize: 15 }}>
                            {timeframe.startTime} - {timeframe.endTime}
                          </Text>
                        </View>
                        <Switch
                          trackColor={{ false: 'lightgray', true: '#81b0ff' }}
                          thumbColor={isEnabled ? '#407BFF' : 'gray'}
                          onValueChange={toggleSwitch}
                          value={isEnabled}
                        />
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              /* editing time frame*/
              <View style={{ width: '100%', height: '100%' }}>
                {timeframes.map((timeframe) => (
                  <View>
                    <View
                      style={{
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flex: 1,
                        backgroundColor: '#FAFAFA',
                        marginBottom: 10,
                        width: '100%',
                        alignSelf: 'center',
                      }}
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          width: '111%',
                          alignItems: 'center',
                          justifyContent: 'space-around',
                          flex: 1,
                        }}
                      >
                        <View style={{ flexDirection: 'column' }}>
                          <Text style={{ fontSize: 15 }}>{timeframe.day}</Text>
                          <Text style={{ fontSize: 15 }}>
                            {timeframe.startTime} - {timeframe.endTime}
                          </Text>
                        </View>
                        <Icon source="delete-outline" size={20} color={'#F24E1E'} />
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  buttonEdit: {
    backgroundColor: '#407BFF',
    width: 85,
    height: 35,
    borderRadius: 9,
    alignItems: 'center',
    padding: 8,
    // marginTop: 10,
    alignSelf: 'center',
  },
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
    // backgroundColor: '#FAFAFA',
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    width: '90%',
    borderRadius: 5,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 20,
    marginBottom: 60,
  },
  title: {
    color: '#333', // Darker shade for better readability
    fontSize: 20, // Adjusted for better readability
    fontWeight: '500',
    textAlign: 'center',
  },
  subjectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Aligns children at both ends
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
    width: '70%',
    alignSelf: 'center',
    borderRadius: 10,
    padding: 10,
  },
  scrollContainer: {
    width: '70%',
  },
  subjectDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // Takes available space, pushing TextInput and errorIcon to the right
  },
  subjectName: {
    flex: 1,
    fontSize: 20, // Increased font size
    fontFamily: 'YourPrettierFont', // Replace with your font
    paddingLeft: 10, // Space after the icon
  },
  subjectInput: {
    width: '20%',
    borderWidth: 2,
    borderColor: '#407BFF',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    color: '#333333',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  subjectIcon: {
    color: '#407BFF',
  },
  errorIcon: {
    color: 'red',
    fontSize: 20, // Adjust size as needed
    fontWeight: 'bold',
    marginLeft: 5, // Space from the input field
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '70%',
    alignSelf: 'center',
    marginTop: 20,
  },
  button: {
    flex: 1,
    borderRadius: 10,
    marginHorizontal: 5, // Add space between buttons
  },
  disabledButton: {
    backgroundColor: '#E0F7FA', // very light blue color
  },
  cancelButton: {
    backgroundColor: 'gray', // Cancel button color
    width: '20%', // Reduced width
    height: 50, // Increased height
    borderRadius: 10, // Rounded corners
    justifyContent: 'center', // Center content vertically
    marginHorizontal: 5, // Spacing between buttons
  },
  saveButton: {
    backgroundColor: '#4F85FF', // Save button color
    width: '20%', // Reduced width
    height: 50, // Increased height
    borderRadius: 10, // Rounded corners
    justifyContent: 'center', // Center content vertically
    marginHorizontal: 5, // Spacing between buttons
  },
  buttonText: {
    color: '#ffffff', // Text color for buttons
  },
  child: {
    color: '#ffffff', // Text color for buttons
    padding: 10, // Padding inside the button
  },
});

export default ChildTimeframes;
