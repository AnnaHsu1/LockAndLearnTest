import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ImageBackground,
  TouchableOpacity,
  Switch,
  Modal,
} from 'react-native';
import { Button, Icon } from 'react-native-paper';
import { useWindowDimensions } from 'react-native';
import { Divider } from '@rneui/themed';

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
  const [timeframeId, setTimeframeId] = useState('');
  const [periodDate, setPeriodDate] = useState('');

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
        getSwitchesStatus(data);
        const orderedTimeframes = orderSortTimeframes(data);
        console.log("orderedTimeframes", orderedTimeframes);
        setTimeframes(orderedTimeframes);
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

  useEffect(() => {
    updateSwitch();
  }, [toggleSwitchItem]);
  
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
                  <View style={{flexDirection:"row", marginLeft: -40}}>
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
              <View
                style={{
                  alignItems: 'center',
                  marginBottom: 10,
                  width: '100%',
                  height: '100%',
                  marginTop: 5,
                }}
              >
                {/* go through all days (Monday -> Sunday) */}
                {Object.keys(timeframes).map((day) => {
                  const startTimes = timeframes[day].map(time => Object.values(time)[3]);
                  const endTimes = timeframes[day].map(time => Object.values(time)[4]);
                  const timePeriods = [];  
                  // display message if there are no time periods for the day
                  if (startTimes.length === 0 && day === "Sunday") {
                    timePeriods.push(
                      <View key={`${day}-empty`} style={{ width: '70%', alignItems: 'center', marginBottom: 5 }}>
                        <Text style={{ fontSize: 15, textAlign: 'center' }}>Add timeframes by clicking on the + to start Lock and Learn!</Text>
                      </View>
                    );
                  }
                  // display day (Monday, ..., Sunday) if there are time periods for the day
                  if (startTimes.length > 0) {
                    timePeriods.push(
                      <View key={`${day}-heading`} style={{ flexDirection: 'row', width: '70%', alignItems: 'center', marginBottom: 5 }}>
                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{day}</Text>
                      </View>
                    );
                  }
                  // display time periods for the day
                  startTimes.forEach((time, index) => {
                    timePeriods.push(
                      <View
                        key={`${day}-${index}`}
                        style={styles.timePeriod}
                      >
                          <Text style={{ fontSize: 15 }}>
                            {time} - {endTimes[index]}
                          </Text>
                        <Switch
                          trackColor={{ false: 'lightgray', true: '#81b0ff' }}
                          thumbColor={isEnabled ? '#407BFF' : 'gray'}
                          onValueChange={() => toggleSwitch(timeframes[day][index]._id)}
                          value={toggleSwitchItem[timeframes[day][index]._id] || false}
                        />
                      </View> 
                    )
                    // add divider if is last time period of the day
                    if (index === startTimes.length - 1 && day !== "Sunday") {
                      timePeriods.push(
                        <Divider 
                          key={`${day}-${index}-divider`}
                          style={{ width: "75%", marginTop: 15, marginBottom: 20}}
                          color="#407BFF"
                          width={1}
                          orientation="horizontal"
                        />
                      )
                    }
                  });
                  return timePeriods;
                })}
              </View>
            ) : (
              /* editing time frame*/
              <View
              style={{
                alignItems: 'center',
                marginBottom: 10,
                width: '100%',
                height: '100%',
                marginTop: 5,
              }}
            >
              {/* go through all days (Monday -> Sunday) */}
              {Object.keys(timeframes).map((day) => {
                const startTimes = timeframes[day].map(time => Object.values(time)[3]);
                const endTimes = timeframes[day].map(time => Object.values(time)[4]);
                const timePeriods = [];  
                // display message if there are no time periods for the day
                if (startTimes.length === 0 && day === "Sunday") {
                  timePeriods.push(
                    <View key={`${day}-empty`} style={{ width: '70%', alignItems: 'center', marginBottom: 5 }}>
                      <Text style={{ fontSize: 15, textAlign: 'center' }}>Add timeframes by clicking on the + to start Lock and Learn!</Text>
                    </View>
                  );
                }
                // display day (Monday, ..., Sunday) if there are time periods for the day
                if (startTimes.length > 0) {
                  timePeriods.push(
                    <View key={`${day}-heading`} style={{ flexDirection: 'row', width: '70%', alignItems: 'center', marginBottom: 5 }}>
                      <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{day}</Text>
                    </View>
                  );
                }
                // display time periods for the day
                startTimes.forEach((time, index) => {
                  console.log("delete", day, time, endTimes[index])
                  timePeriods.push(
                    <View
                      key={`${day}-${index}`}
                      style={styles.timePeriod}
                    >
                        <Text style={{ fontSize: 15 }}>
                          {time} - {endTimes[index]}
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              console.log("edit", day, time, endTimes[index])
                              setPeriodDate(day + ' ' + time + ' ' + endTimes[index]);
                            }}
                          >
                            <Icon source="square-edit-outline" size={20} color={'#407BFF'} />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              toggleDeleteModal();
                              setTimeframeId(timeframes[day][index]._id);
                              setPeriodDate(day + ' ' + time + ' ' + endTimes[index]);
                            }}
                          >
                            <Icon source="delete-outline" size={20} color={'#F24E1E'} />
                          </TouchableOpacity>
                        </View>
                    </View> 
                  )
                  // add divider if is last time period of the day
                  if (index === startTimes.length - 1 && day !== "Sunday") {
                    timePeriods.push(
                      <Divider 
                        key={`${day}-${index}-divider`}
                        style={{ width: "75%", marginTop: 15, marginBottom: 20}}
                        color="#407BFF"
                        width={1}
                        orientation="horizontal"
                      />
                    )
                  }
                });
                return timePeriods;
              })}
            </View>
            )}
          </>
        )}
      </View>
      {/* Pop-up: Confirmation to delete timeframe */}
      <Modal
        transparent={true}
        visible={isDeleteModalVisible}
        onRequestClose={toggleDeleteModal}
      >
        {/* display modal's background */}
        <View style={styles.modalContainer}>
          {/* display modal */}
          <View style={styles.modalView1}>
            <Text style={styles.text}>Are you sure you want to delete</Text>
            <Text style={styles.textName}>{periodDate} ?</Text>
            {console.log(periodDate)}
            <View style={styles.modalView}>
              <Button
                style={styles.modalNoButton}
                mode="contained"
                onPress={() => {
                  toggleDeleteModal();
                }}
              >
                <Text style={styles.modalButtonText}>No</Text>
              </Button>
              <Button
                style={styles.modalYesButton}
                mode="contained"
                onPress={() => {
                  toggleDeleteModal();
                  handleDeleteTimeframe(timeframeId);
                }}
              >
                <Text style={styles.modalButtonText}>Yes</Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
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
  button: {
    flex: 1,
    borderRadius: 10,
    marginHorizontal: 5, // Add space between buttons
  },
  textName: {
    color: 'black',
    fontSize: 16,
    paddingBottom: 45,
    textAlign: 'center',
  },
  modalView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
  },
  modalNoButton: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    width: '20%',
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'grey',
  },
  modalYesButton: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    width: '20%',
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF4136',
  },
  modalContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalView1: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: 250,
    height: 200,
  },
  timePeriod: {
    flexDirection: 'row',
    width: '65%',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
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
});

export default ChildTimeframes;
