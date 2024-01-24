import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ImageBackground, TextInput, ScrollView, TouchableOpacity, Switch, FlatList } from 'react-native';
import { getItem } from '../../../components/AsyncStorage';
import { Icon } from 'react-native-paper';

const ChildTimeframes = ({ route, navigation }) => {
    const [child, setChild] = useState({});
    const childSelected = route.params.child;
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const [editMode, setEditMode] = useState(false);
    const [mondayTimeframes, setMondayTimeframes] = useState([
        {   day: "Monday" },
        // {
        //     start: "7:00AM",
        //     end: "9:00AM"
        // },
        // {
        //     start: "4:00PM",
        //     end: "5:00PM"
        // }
    ]);
    const [tuesdayTimeframes, setTuesdayTimeframes] = useState([]);
    const [wednesdayTimeframes, setWednesdayTimeframes] = useState([]);
    const [thursdayTimeframes, setThursdayTimeframes] = useState([]);
    const [fridayTimeframes, setFridayTimeframes] = useState([]);
    const [saturdayTimeframes, setSaturdayTimeframes] = useState([]);
    const [sundayTimeframes, setSundayTimeframes] = useState([]);

    useEffect(() => {
        setChild(childSelected);
    }, []);

    return (
        <ImageBackground
            source={require('../../../assets/backgroundCloudyBlobsFull.png')}
            resizeMode="cover"
            style={styles.container}
        >
                {editMode === false ? (
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
                        <TouchableOpacity
                            onPress={() => setEditMode(true)}
                        >
                            <Text style={{ fontSize: 15, color: '#407BFF' }}>Edit</Text>
                        </TouchableOpacity>
                        <Text style={[styles.title]}>Timeframes</Text>
                        <Icon source="plus" size={17} color='#407BFF' />
                    </View>
                    {mondayTimeframes.map((timeframe) => (
                    <View style={{width:"100%", height: "100%"}}>
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
                                    flex: 1
                                }}
                            >
                                <View
                                    style={{flexDirection: 'column'}}
                                >
                                    <Text style={{fontSize: 15}}>Monday</Text>
                                    <Text style={{ fontSize: 15 }}>7:00AM - 10:00AM</Text>
                                </View>
                                <Switch
                                    trackColor={{false: 'lightgray', true: '#81b0ff'}}
                                    thumbColor={isEnabled ? '#407BFF' : 'gray'}
                                    onValueChange={toggleSwitch}
                                    value={isEnabled}
                                />
                            </View>
                        </View>
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
                                    flex: 1
                                }}
                            >
                                <View
                                    style={{flexDirection: 'column'}}
                                >
                                    <Text style={{fontSize: 15}}>Tuesday</Text>
                                    <Text style={{ fontSize: 15 }}>7:00AM - 10:00AM</Text>
                                </View>
                                <Switch
                                    trackColor={{false: 'lightgray', true: '#81b0ff'}}
                                    thumbColor={isEnabled ? '#407BFF' : 'gray'}
                                    onValueChange={toggleSwitch}
                                    value={isEnabled}
                                />
                            </View>
                        </View>
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
                                    flex: 1
                                }}
                            >
                                <View
                                    style={{flexDirection: 'column'}}
                                >
                                    <Text style={{fontSize: 15}}>Wednesday</Text>
                                    <Text style={{ fontSize: 15 }}>7:00AM - 10:00AM</Text>
                                </View>
                                <Switch
                                    trackColor={{false: 'lightgray', true: '#81b0ff'}}
                                    thumbColor={isEnabled ? '#407BFF' : 'gray'}
                                    onValueChange={toggleSwitch}
                                    value={isEnabled}
                                />
                            </View>
                        </View>
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
                                    flex: 1
                                }}
                            >
                                <View
                                    style={{flexDirection: 'column'}}
                                >
                                    <Text style={{fontSize: 15}}>Thursday</Text>
                                    <Text style={{ fontSize: 15 }}>7:00AM - 10:00AM</Text>
                                </View>
                                <Switch
                                    trackColor={{false: 'lightgray', true: '#81b0ff'}}
                                    thumbColor={isEnabled ? '#407BFF' : 'gray'}
                                    onValueChange={toggleSwitch}
                                    value={isEnabled}
                                />
                            </View>
                        </View>
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
                                    flex: 1
                                }}
                            >
                                <View
                                    style={{flexDirection: 'column'}}
                                >
                                    <Text style={{fontSize: 15}}>Friday</Text>
                                    <Text style={{ fontSize: 15 }}>7:00AM - 10:00AM</Text>
                                </View>
                                <Switch
                                    trackColor={{false: 'lightgray', true: '#81b0ff'}}
                                    thumbColor={isEnabled ? '#407BFF' : 'gray'}
                                    onValueChange={toggleSwitch}
                                    value={isEnabled}
                                />
                            </View>
                        </View>
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
                                    flex: 1
                                }}
                            >
                                <View
                                    style={{flexDirection: 'column'}}
                                >
                                    <Text style={{fontSize: 15}}>Saturday</Text>
                                    <Text style={{ fontSize: 15 }}>7:00AM - 10:00AM</Text>
                                </View>
                                <Switch
                                    trackColor={{false: 'lightgray', true: '#81b0ff'}}
                                    thumbColor={isEnabled ? '#407BFF' : 'gray'}
                                    onValueChange={toggleSwitch}
                                    value={isEnabled}
                                />
                            </View>
                        </View>
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
                                    flex: 1
                                }}
                            >
                                <View
                                    style={{flexDirection: 'column'}}
                                >
                                    <Text style={{fontSize: 15}}>Sunday</Text>
                                    <Text style={{ fontSize: 15 }}>7:00AM - 10:00AM</Text>
                                </View>
                                <Switch
                                    trackColor={{false: 'lightgray', true: '#81b0ff'}}
                                    thumbColor={isEnabled ? '#407BFF' : 'gray'}
                                    onValueChange={toggleSwitch}
                                    value={isEnabled}
                                />
                            </View>
                        </View>
                    </View>
                    ))}
                </View>
                ): (
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
                        <TouchableOpacity
                            onPress={() => setEditMode(false)}
                        >
                            <Text style={{ fontSize: 15, color: '#407BFF' }}>Save</Text>
                        </TouchableOpacity>
                        <Text style={[styles.title]}>Timeframes</Text>
                        <Icon source="plus" size={17} color='#407BFF' />
                    </View>
                    <View style={{width:"100%", height: "100%"}}>
                        {mondayTimeframes.map((timeframe) => (
                        <View style={{width:"100%", height: "100%"}}>
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
                                        flex: 1
                                    }}
                                >
                                    <View
                                        style={{flexDirection: 'column'}}
                                    >
                                        <Text style={{fontSize: 15}}>Monday</Text>
                                        <Text style={{ fontSize: 15 }}>7:00AM - 10:00AM</Text>
                                    </View>
                                    <Icon source="delete-outline" size={20} color={'#F24E1E'} />
                                </View>
                            </View>
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
                                        flex: 1
                                    }}
                                >
                                    <View
                                        style={{flexDirection: 'column'}}
                                    >
                                        <Text style={{fontSize: 15}}>Tuesday</Text>
                                        <Text style={{ fontSize: 15 }}>7:00AM - 10:00AM</Text>
                                    </View>
                                    <Icon source="delete-outline" size={20} color={'#F24E1E'} />
                                </View>
                            </View>
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
                                        flex: 1
                                    }}
                                >
                                    <View
                                        style={{flexDirection: 'column'}}
                                    >
                                        <Text style={{fontSize: 15}}>Wednesday</Text>
                                        <Text style={{ fontSize: 15 }}>7:00AM - 10:00AM</Text>
                                    </View>
                                    <Icon source="delete-outline" size={20} color={'#F24E1E'} />
                                </View>
                            </View>
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
                                        flex: 1
                                    }}
                                >
                                    <View
                                        style={{flexDirection: 'column'}}
                                    >
                                        <Text style={{fontSize: 15}}>Thursday</Text>
                                        <Text style={{ fontSize: 15 }}>7:00AM - 10:00AM</Text>
                                    </View>
                                    <Icon source="delete-outline" size={20} color={'#F24E1E'} />
                                </View>
                            </View>
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
                                        flex: 1
                                    }}
                                >
                                    <View
                                        style={{flexDirection: 'column'}}
                                    >
                                        <Text style={{fontSize: 15}}>Friday</Text>
                                        <Text style={{ fontSize: 15 }}>7:00AM - 10:00AM</Text>
                                    </View>
                                    <Icon source="delete-outline" size={20} color={'#F24E1E'} />
                                </View>
                            </View>
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
                                        flex: 1
                                    }}
                                >
                                    <View
                                        style={{flexDirection: 'column'}}
                                    >
                                        <Text style={{fontSize: 15}}>Saturday</Text>
                                        <Text style={{ fontSize: 15 }}>7:00AM - 10:00AM</Text>
                                    </View>
                                    <Icon source="delete-outline" size={20} color={'#F24E1E'} />
                                </View>
                            </View>
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
                                        flex: 1
                                    }}
                                >
                                    <View
                                        style={{flexDirection: 'column'}}
                                    >
                                        <Text style={{fontSize: 15}}>Sunday</Text>
                                        <Text style={{ fontSize: 15 }}>7:00AM - 10:00AM</Text>
                                    </View>
                                    <Icon source="delete-outline" size={20} color={'#F24E1E'} />
                                </View>
                            </View>
                        </View>
                        ))}
                    </View>
                </View>
                )}              
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
        backgroundColor: 'pink',
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
    }
);

export default ChildTimeframes;
