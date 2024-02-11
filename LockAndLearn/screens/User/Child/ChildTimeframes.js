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
  ScrollView,
} from 'react-native';
import { Button, Icon } from 'react-native-paper';
import { useWindowDimensions } from 'react-native';
import { Divider } from '@rneui/themed';
import PropTypes from 'prop-types';
import DropDownPicker from 'react-native-dropdown-picker';

const ChildTimeframes = ({ route, navigation }) => {
  const [child, setChild] = useState({});
  const childSelected = route?.params?.child;
  const [isEnabled, setIsEnabled] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [addMode, setAddMode] = useState(false);
  const [addedSuccessful, setAddedSuccessful] = useState(false);
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [selectedDay, setSelectedDay] = useState('');
  const [starthour, setStartHour] = useState('');
  const [startminute, setStartMinute] = useState('');
  const [endhour, setEndHour] = useState('');
  const [endminute, setEndMinute] = useState('');
  const [deviceWidth, setDeviceWidth] = useState(0);
  const { width } = useWindowDimensions();
  const [toggleSwitchItem, setToggleSwitchItem] = useState({});
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [timeframeId, setTimeframeId] = useState('');
  const [periodDate, setPeriodDate] = useState('');
  const [timeframes, setTimeframes] = useState([]);
  const [error, setError] = useState('');
  const [editStartHour, setEditStartHour] = useState({});
  const [editStartMinute, setEditStartMinute] = useState({});
  const [editEndHour, setEditEndHour] = useState({});
  const [editEndMinute, setEditEndMinute] = useState({});
  const [editSubject, setEditSubject] = useState({});
  const [subjectDropdownOpen, setSubjectDropdownOpen] = useState({});
  const [preferences, setPreferences] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [open, setOpen] = useState(false);

  // Set the edit start hour/start minute/end hour/end minute states & subject states
  const setEditTime = (timeframes) => {
    Object.keys(timeframes).map((day) => {
      const startTimes = timeframes[day].map((time) => Object.values(time)[3]);
      const endTimes = timeframes[day].map((time) => Object.values(time)[4]);
      const subject = timeframes[day].map((time) => Object.values(time)[5]);
      startTimes.forEach((time, index) => {
        const startHourTime = {
          [timeframes[day][index]._id]: time.substring(0, 2),
        };
        setEditStartHour((prevStartHour) => {
          return {
            ...prevStartHour,
            ...startHourTime,
          };
        });
        const startMinuteTime = {
          [timeframes[day][index]._id]: time.substring(3, 5),
        };
        setEditStartMinute((prevStartMinute) => {
          return {
            ...prevStartMinute,
            ...startMinuteTime,
          };
        });
        const endHourTime = {
          [timeframes[day][index]._id]: endTimes[index].substring(0, 2),
        };
        setEditEndHour((prevEndHour) => {
          return {
            ...prevEndHour,
            ...endHourTime,
          };
        });
        const endMinuteTime = {
          [timeframes[day][index]._id]: endTimes[index].substring(3, 5),
        };
        setEditEndMinute((prevEndMinute) => {
          return {
            ...prevEndMinute,
            ...endMinuteTime,
          };
        });
        const subjectToAdd = {
          [timeframes[day][index]._id]: subject[index],
        };
        setEditSubject((prevSubject) => {
          return {
            ...prevSubject,
            ...subjectToAdd,
          };
        });
        const subjectDropdownOpenToAdd = {
          [timeframes[day][index]._id]: false,
        };
        setSubjectDropdownOpen((prevSubjectDropdownOpen) => {
          return {
            ...prevSubjectDropdownOpen,
            ...subjectDropdownOpenToAdd,
          };
        });
      });
    });
  };

  // Save the edited timeframes
  const saveEditTimeframes = async () => {
    try {
      const response = await fetch('http://localhost:4000/timeframes/updateEditTimeframe', {
        method: 'PUT',
        credentials: 'include', // Include cookies in the request
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timeframeIds: Object.keys(editStartHour),
          editStartHours: Object.values(editStartHour),
          editStartMinutes: Object.values(editStartMinute),
          editEndHours: Object.values(editEndHour),
          editEndMinutes: Object.values(editEndMinute),
          editSubjects: Object.values(editSubject),
        }),
      });
      const data = await response.json();
      if (response.status != 200) {
        console.log(data.msg);
        setError(data.msg);
      } else {
        // console.log('Timeframe updated successfully!');
        setEditMode(false);
        getChildTimeframes();
        setError('');
      }
    } catch (error) {
      console.log(error.msg);
    }
  };

  // Retrieve timeframes from the database
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
        // console.log('Timeframes retrieved successfully!');
        // console.log(data);
        getSwitchesStatus(data);
        const orderedTimeframes = orderSortTimeframes(data);
        // console.log('orderedTimeframes', orderedTimeframes);
        setTimeframes(orderedTimeframes);
        setEditTime(orderedTimeframes);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getChildPreferences = async () => {
    try {
      const response = await fetch(
        'http://localhost:4000/child/getPreferences/' + childSelected._id,
        {
          method: 'GET',
          credentials: 'include', // Include cookies in the request
        }
      );
      const data = await response.json();
      if (response.status != 200) {
        console.log(data.msg);
      } else {
        // console.log(data);
        data.forEach((preference) => {
          const preferenceObj = {
            label: preference,
            value: preference,
          };
          setPreferences((prevPreferences) => [...prevPreferences, preferenceObj]);
        });
        // console.log('Preferences retrieved successfully!');
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
  };

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

  // Add a new timeframe
  const addTimeframe = async () => {
    try {
      const response = await fetch('http://localhost:4000/timeframes/addtimeframe', {
        method: 'POST',
        credentials: 'include', // Include cookies in the request
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          childId: childSelected._id,
          day: selectedDay,
          startTime:
            (starthour.length < 2 ? `0${starthour}` : starthour) +
            ':' +
            (startminute.length < 2 ? `0${startminute}` : startminute),
          endTime:
            (endhour.length < 2 ? `0${endhour}` : endhour) +
            ':' +
            (endminute.length < 2 ? `0${endminute}` : endminute),
          subject: selectedSubject,
        }),
      });

      const data = await response.json();

      if (response.status != 201) {
        console.log(data.msg);
        setError(data.msg);
      } else {
        // console.log('Timeframe added successfully!');
        setAddMode(false);
        clearAddFields();
        setAddedSuccessful(true);
        setSelectedSubject('');
        setError('');
      }
    } catch (error) {
      console.log(error.msg);
    }
  };

  // Clear the add timeframe fields
  const clearAddFields = () => {
    setStartHour('');
    setStartMinute('');
    setEndHour('');
    setEndMinute('');
    setSelectedDay('');
  };

  // Toggle switch for timeframes based on timeframe id
  const toggleSwitch = async (timeframeId) => {
    setToggleSwitchItem((prevToggleSwitchItem) => ({
      ...prevToggleSwitchItem,
      [timeframeId]: !prevToggleSwitchItem[timeframeId] || false,
    }));
  };

  // Update the database when a switch is toggled
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
        // console.log('Timeframe updated successfully!');
      }
    } catch (error) {
      console.log(error.msg);
    }
  };

  // Toggle pop up modal for deleting a timeframe
  const toggleDeleteModal = () => {
    setDeleteModalVisible(!isDeleteModalVisible);
  };

  // Delete a timeframe
  const handleDeleteTimeframe = async (timeframeId) => {
    try {
      const response = await fetch(
        'http://localhost:4000/timeframes/deletetimeframe/' + timeframeId,
        {
          method: 'DELETE',
          credentials: 'include', // Include cookies in the request
        }
      );
      const data = await response.json();
      if (response.status != 200) {
        console.log(data.msg);
        setError(data.msg);
      } else {
        // console.log('Timeframe deleted successfully!');
        getChildTimeframes();
        // when the timeframe is deleted, the edit fields of that timeframe are deleted
        const editStartHourCopy = { ...editStartHour };
        delete editStartHourCopy[timeframeId];
        setEditStartHour(editStartHourCopy);
        const editStartMinuteCopy = { ...editStartMinute };
        delete editStartMinuteCopy[timeframeId];
        setEditStartMinute(editStartMinuteCopy);
        const editEndHourCopy = { ...editEndHour };
        delete editEndHourCopy[timeframeId];
        setEditEndHour(editEndHourCopy);
        const editEndMinuteCopy = { ...editEndMinute };
        delete editEndMinuteCopy[timeframeId];
        setEditEndMinute(editEndMinuteCopy);
        const editSubjectCopy = { ...editSubject };
        delete editSubjectCopy[timeframeId];
        setEditSubject(editSubjectCopy);
      }
    } catch (error) {
      console.log(error.msg);
    }
  };

  // Cancel adding a new timeframe
  const cancel = () => {
    setAddMode(!addMode);
    setError('');
  };

  // Cancel editing a new timeframe
  const cancelEdit = () => {
    setEditMode(!editMode);
    setError('');
  };

  useEffect(() => {
    setDeviceWidth(width);
    setChild(childSelected);
    getChildTimeframes();
    getChildPreferences();
  }, []);

  // Update the database when a switch is toggled
  useEffect(() => {
    updateSwitch();
  }, [toggleSwitchItem]);

  // Retrieve timeframes from the database
  useEffect(() => {
    getChildTimeframes();
    setAddedSuccessful(false);
  }, [addedSuccessful]);

  return (
    <ImageBackground
      source={require('../../../assets/backgroundCloudyBlobsFull.png')}
      resizeMode="cover"
      style={[styles.container, { flex: 1, width: '100%', height: '100%' }]}
    >
      <ScrollView
        style={{ width: '100%', alignContent: 'center' }}
        contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
      >
        <View style={[styles.containerFile]}>
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
            <TouchableOpacity
              onPress={() => setEditMode(addMode ? null : !editMode)}
              disabled={addMode}
              style={{ opacity: addMode ? 0.5 : 1 }}
              testID="edit-timeframe"
            >
              {editMode ? (
                addMode ? (
                  // if editMode is true and addMode is true
                  <Text style={{ fontSize: 15, color: '#407BFF' }}>Edit</Text>
                ) : // for mobile
                deviceWidth < 450 ? (
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ marginRight: 1 }}>
                      <Icon source="close" size={17} color="#F24E1E" />
                    </View>
                    <Icon source="check" size={17} color="#407BFF" />
                  </View>
                ) : (
                  // if editMode is true and addMode is false
                  <View style={{ flexDirection: 'row', marginLeft: -40 }}>
                    <TouchableOpacity onPress={() => cancelEdit()}>
                      <Text style={{ fontSize: 15, color: '#F24E1E', marginRight: 10 }}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity testID="save-edit" onPress={() => saveEditTimeframes()}>
                      <Text style={{ fontSize: 15, color: '#407BFF' }}>Save</Text>
                    </TouchableOpacity>
                  </View>
                )
              ) : (
                // if editMode is false
                <Text style={{ fontSize: 15, color: '#407BFF' }}>Edit</Text>
              )}
            </TouchableOpacity>
            <Text style={[styles.title]}>Timeframes</Text>
            {/* if editMode is true,  addMode is also true */}
            <TouchableOpacity onPress={cancel} testID="add-timeframe">
              {addMode ? (
                <Text style={{ fontSize: 15, color: '#F24E1E' }}>Cancel</Text> // if addMode is true
              ) : (
                <Icon source="plus" size={17} color="#407BFF" /> // if addMode is false
              )}
            </TouchableOpacity>
          </View>
          {error ? (
            <View style={[{ width: '80%', margin: 20, borderColor: '#F24E1E', borderWidth: 1 }]}>
              <Text
                style={{ color: '#F24E1E', fontSize: 14, textAlign: 'center', paddingVertical: 10 }}
                testID="error-message"
              >
                {error}
              </Text>
            </View>
          ) : null}
          {/* adding new timeframes */}
          {addMode ? (
            <View style={[{ width: '100%', flexDirection: 'row' }]}>
              {/* change to row */}
              <View style={[{ flexDirection: 'column', margin: 10 }]}>
                {days.map((day) => (
                  <View key={day}>
                    <View
                      style={[
                        {
                          paddingVertical: 10,
                          borderColor: selectedDay === day ? '#407BFF' : '#D3D3D3',
                          borderWidth: 2,
                          marginHorizontal: 10,
                          marginVertical: 5,
                          width: 100,
                          borderRadius: 5,
                        },
                      ]}
                    >
                      <TouchableOpacity
                        style={[{ alignItems: 'center', justifyContent: 'center', fontSize: 14 }]}
                        onPress={() => setSelectedDay(day)}
                        testID={day}
                      >
                        <Text>{day}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
              <View style={[{ justifyContent: 'space-between', alignItems: 'center', flex: 1 }]}>
                <View
                  style={[
                    {
                      flexDirection: width < 620 ? 'column' : 'row',
                      marginTop: width < 620 ? 20 : 0,
                      alignItems: 'center',
                      flex: 1,
                      gap: 30,
                      zIndex: 2000,
                    },
                  ]}
                >
                  <View style={{ zIndex: 9999 }}>
                    <Text style={[{ color: '#333', fontSize: 16 }]}>Subject</Text>
                    <DropDownPicker
                      open={open}
                      value={selectedSubject}
                      placeholder="Select a subject"
                      items={preferences}
                      setOpen={setOpen}
                      setValue={setSelectedSubject}
                      testID="subject-dropdown-picker-add"
                      style={{
                        borderColor: '#407BFF',
                        backgroundColor: '#fafafa',
                        borderWidth: 1,
                        borderRadius: 5,
                      }}
                      containerStyle={{
                        zIndex: 9999,
                        backgroundColor: '#fafafa',
                        width: 200,
                        height: 40,
                      }}
                      maxHeight={500}
                      disabledStyle={{
                        opacity: 1, // if the dropdown is disabled, the opacity is 0.5
                      }}
                    />
                  </View>
                  <View>
                    <View style={[{ marginVertical: 10 }]}>
                      <Text style={[{ color: '#333', fontSize: 16 }]}>Start time</Text>
                      <View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
                        <TextInput
                          style={[
                            styles.timeframeInput,
                            {
                              marginRight: 5,
                            },
                          ]}
                          placeholder="HH"
                          keyboardType="numeric"
                          value={starthour}
                          onChangeText={setStartHour}
                          maxLength={2}
                          testID="start-hour"
                        />
                        <Text>:</Text>
                        <TextInput
                          style={[
                            styles.timeframeInput,
                            {
                              marginLeft: 5,
                            },
                          ]}
                          placeholder="MM"
                          keyboardType="numeric"
                          value={startminute}
                          onChangeText={setStartMinute}
                          maxLength={2}
                          testID="start-minute"
                        />
                      </View>
                    </View>
                    <View style={[{ marginVertical: 10 }]}>
                      <Text style={[{ color: '#333', fontSize: 16 }]}>End time</Text>
                      <View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
                        <TextInput
                          style={[
                            styles.timeframeInput,
                            {
                              marginRight: 5,
                            },
                          ]}
                          placeholder="HH"
                          keyboardType="numeric"
                          value={endhour}
                          onChangeText={setEndHour}
                          maxLength={2}
                          testID="end-hour"
                        />
                        <Text>:</Text>
                        <TextInput
                          style={[
                            styles.timeframeInput,
                            {
                              marginLeft: 5,
                            },
                          ]}
                          placeholder="MM"
                          keyboardType="numeric"
                          value={endminute}
                          onChangeText={setEndMinute}
                          maxLength={2}
                          testID="end-minute"
                        />
                      </View>
                    </View>
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
                      paddingVertical: 10,
                    },
                  ]}
                  onPress={addTimeframe}
                >
                  <Text style={[{ color: '#407BFF', fontSize: 18 }]}>Save</Text>
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
                    const startTimes = timeframes[day].map((time) => Object.values(time)[3]);
                    const endTimes = timeframes[day].map((time) => Object.values(time)[4]);
                    const subject = timeframes[day].map((time) => Object.values(time)[5]);
                    const timePeriods = [];
                    // display message if there are no time periods for the day
                    if (startTimes.length === 0 && day === 'Sunday') {
                      timePeriods.push(
                        <View
                          key={`${day}-empty`}
                          style={{ width: '70%', alignItems: 'center', marginBottom: 5 }}
                        >
                          <Text style={{ fontSize: 15, textAlign: 'center' }}>
                            Add timeframes by clicking on the + to start Lock and Learn!
                          </Text>
                        </View>
                      );
                    }
                    // display day (Monday, ..., Sunday) if there are time periods for the day
                    if (startTimes.length > 0) {
                      timePeriods.push(
                        <View
                          key={`${day}-heading`}
                          style={{
                            flexDirection: 'row',
                            width: '70%',
                            alignItems: 'center',
                            marginBottom: 5,
                          }}
                        >
                          <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{day}</Text>
                        </View>
                      );
                    }
                    // display time periods for the day
                    startTimes.forEach((time, index) => {
                      timePeriods.push(
                        <View key={`${day}-${index}`} style={styles.timePeriod}>
                          <View>
                            <Text style={{ fontSize: 16, fontWeight: '600', color: '#407BFF' }}>
                              {subject[index] ? subject[index] : 'No subject'}
                            </Text>
                            <Text style={{ fontSize: 15 }}>
                              {time} - {endTimes[index]}
                            </Text>
                          </View>
                          <Switch
                            trackColor={{ false: 'lightgray', true: '#81b0ff' }}
                            thumbColor={isEnabled ? '#407BFF' : 'gray'}
                            onValueChange={() => toggleSwitch(timeframes[day][index]._id)}
                            value={toggleSwitchItem[timeframes[day][index]._id] || false}
                          />
                        </View>
                      );
                      // add divider if is last time period of the day
                      if (index === startTimes.length - 1 && day !== 'Sunday') {
                        timePeriods.push(
                          <Divider
                            key={`${day}-${index}-divider`}
                            style={{ width: '75%', marginTop: 15, marginBottom: 20 }}
                            color="#407BFF"
                            width={1}
                            orientation="horizontal"
                          />
                        );
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
                    const startTimes = timeframes[day].map((time) => Object.values(time)[3]);
                    const endTimes = timeframes[day].map((time) => Object.values(time)[4]);
                    const timePeriods = [];
                    // display message if there are no time periods for the day
                    if (
                      startTimes.length === 0 &&
                      day === 'Monday' &&
                      day === 'Tuesday' &&
                      day === 'Monday' &&
                      day === 'Wednesday' &&
                      day === 'Thursday' &&
                      day === 'Friday' &&
                      day === 'Saturday' &&
                      day === 'Sunday'
                    ) {
                      timePeriods.push(
                        <View
                          key={`${day}-empty`}
                          style={{ width: '70%', alignItems: 'center', marginBottom: 5 }}
                        >
                          <Text style={{ fontSize: 15, textAlign: 'center' }}>
                            Add timeframes by clicking on the + to start Lock and Learn!
                          </Text>
                        </View>
                      );
                    }
                    // display day (Monday, ..., Sunday) if there are time periods for the day
                    if (startTimes.length > 0) {
                      timePeriods.push(
                        <View
                          key={`${day}-heading`}
                          style={{
                            flexDirection: 'row',
                            width: '70%',
                            alignItems: 'center',
                            marginBottom: 5,
                          }}
                        >
                          <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{day}</Text>
                        </View>
                      );
                    }
                    // display time periods for the day
                    startTimes.forEach((time, index) => {
                      timePeriods.push(
                        <View
                          key={`${day}-${index}`}
                          style={[
                            styles.timePeriod,
                            {
                              flexDirection: 'column',
                              zIndex: subjectDropdownOpen[timeframes[day][index]._id] ? 9999 : 1,
                            },
                          ]}
                        >
                          <View
                            style={{
                              zIndex: 10000,
                              marginBottom: 10,
                              justifyContent: 'space-between',
                              flexDirection: 'row',
                              width: '100%',
                            }}
                          >
                            <DropDownPicker
                              // corresponding to the time period open boolean
                              open={subjectDropdownOpen[timeframes[day][index]._id]}
                              // corresponding to the time period subject value
                              value={editSubject[timeframes[day][index]._id]}
                              placeholder="Select a subject"
                              items={preferences}
                              testID={`subject-dropdown-picker-edit-${day}-${index}-${timeframes[day][index]._id}`}
                              // set the open boolean to the opposite of the current open boolean
                              setOpen={(open) => {
                                setSubjectDropdownOpen((prevSubjectDropdownOpen) => {
                                  const updatedSubjectDropdownOpen = {};
                                  for (const key in prevSubjectDropdownOpen) {
                                    updatedSubjectDropdownOpen[key] =
                                      key === timeframes[day][index]._id ? open : false;
                                  }
                                  return updatedSubjectDropdownOpen;
                                });
                              }}
                              // setValue={setTempSubject}
                              onSelectItem={(item) => {
                                setEditSubject((prevSubject) => {
                                  return {
                                    ...prevSubject,
                                    [timeframes[day][index]._id]: item.value,
                                  };
                                });
                              }}
                              style={{
                                borderColor: '#407BFF',
                                backgroundColor: '#fafafa',
                                borderWidth: 1,
                                borderRadius: 5,
                              }}
                              containerStyle={{
                                backgroundColor: '#fafafa',
                                width: 200,
                              }}
                              maxHeight={500}
                            />
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}
                            >
                              <TouchableOpacity
                                onPress={() => {
                                  toggleDeleteModal();
                                  setTimeframeId(timeframes[day][index]._id);
                                  setPeriodDate(day + ' ' + time + ' ' + endTimes[index]);
                                }}
                                testID={`delete-${day}-${index}-${timeframes[day][index]._id}`}
                              >
                                <Icon source="delete-outline" size={20} color={'#F24E1E'} />
                              </TouchableOpacity>
                            </View>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              width: '100%',
                              justifyContent: 'space-between',
                            }}
                          >
                            <TextInput
                              style={[
                                styles.timeframeInput,
                                {
                                  marginRight: 5,
                                },
                              ]}
                              placeholder="HH"
                              keyboardType="numeric"
                              testID={`start-hour-input-edit-${day}-${index}-${timeframes[day][index]._id}`}
                              value={editStartHour[timeframes[day][index]._id]}
                              onChangeText={(text) => {
                                setEditStartHour((prevStartHour) => {
                                  return {
                                    ...prevStartHour,
                                    [timeframes[day][index]._id]: text,
                                  };
                                });
                              }}
                              maxLength={2}
                            />
                            <Text>:</Text>
                            <TextInput
                              style={[
                                styles.timeframeInput,
                                {
                                  marginLeft: 5,
                                },
                              ]}
                              placeholder="MM"
                              keyboardType="numeric"
                              testID={`start-minute-input-edit-${day}-${index}-${timeframes[day][index]._id}`}
                              value={editStartMinute[timeframes[day][index]._id]}
                              onChangeText={(text) => {
                                setEditStartMinute((prevStartMinute) => {
                                  return {
                                    ...prevStartMinute,
                                    [timeframes[day][index]._id]: text,
                                  };
                                });
                              }}
                              maxLength={2}
                            />
                            <Text> - </Text>
                            <TextInput
                              style={[
                                styles.timeframeInput,
                                {
                                  marginRight: 5,
                                },
                              ]}
                              placeholder="HH"
                              keyboardType="numeric"
                              testID={`end-hour-input-edit-${day}-${index}-${timeframes[day][index]._id}`}
                              value={editEndHour[timeframes[day][index]._id]}
                              onChangeText={(text) => {
                                setEditEndHour((prevEndHour) => {
                                  return {
                                    ...prevEndHour,
                                    [timeframes[day][index]._id]: text,
                                  };
                                });
                              }}
                              maxLength={2}
                            />
                            <Text>:</Text>
                            <TextInput
                              style={[
                                styles.timeframeInput,
                                {
                                  marginLeft: 5,
                                },
                              ]}
                              placeholder="MM"
                              keyboardType="numeric"
                              testID={`end-minute-input-edit-${day}-${index}-${timeframes[day][index]._id}`}
                              value={editEndMinute[timeframes[day][index]._id]}
                              onChangeText={(text) => {
                                setEditEndMinute((prevEndMinute) => {
                                  return {
                                    ...prevEndMinute,
                                    [timeframes[day][index]._id]: text,
                                  };
                                });
                              }}
                              maxLength={2}
                            />
                          </View>
                        </View>
                      );
                      // add divider if is last time period of the day
                      if (index === startTimes.length - 1 && day !== 'Sunday') {
                        timePeriods.push(
                          <Divider
                            key={`${day}-${index}-divider`}
                            style={{ width: '75%', marginTop: 15, marginBottom: 20 }}
                            color="#407BFF"
                            width={1}
                            orientation="horizontal"
                          />
                        );
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
          testID="delete-modal"
        >
          {/* display modal's background */}
          <View style={styles.modalContainer}>
            {/* display modal */}
            <View style={styles.modalView1}>
              <Text style={styles.text}>Are you sure you want to delete</Text>
              <Text style={styles.textName}>{periodDate} ?</Text>
              {/* {console.log(periodDate)} */}
              <View style={styles.modalView}>
                <Button
                  style={styles.modalNoButton}
                  mode="contained"
                  testID="delete-timeframe-no-button"
                  onPress={() => {
                    toggleDeleteModal();
                  }}
                >
                  <Text style={styles.modalButtonText}>No</Text>
                </Button>
                <Button
                  style={styles.modalYesButton}
                  mode="contained"
                  testID="delete-timeframe-yes-button"
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
      </ScrollView>
    </ImageBackground>
  );
};

ChildTimeframes.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      child: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        // Include other properties of the child object as needed
      }),
    }).isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    // Include other navigation properties and methods as needed
  }).isRequired,
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
    width: '90%',
    maxWidth: 800,
    borderRadius: 5,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 50,
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
    marginBottom: 10,
  },
  timeframeInput: {
    borderColor: '#407BFF',
    borderWidth: 1,
    width: 75,
    height: 40,
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 14,
  },
});

export default ChildTimeframes;
