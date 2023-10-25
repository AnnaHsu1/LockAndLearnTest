import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Platform, ImageBackground } from 'react-native';
import { React, useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { TouchableOpacity } from 'react-native';

// Import the navigation actions and hooks from React Navigation
import { useNavigation } from "@react-navigation/native";

const workPackages = [
    { id: 1, name: 'Math-25' },
    { id: 2, name: 'Science-30' },
    { id: 3, name: 'History-22' },
    // will be dynamic with db
  ];
  

const SelectWorkPackageScreen = () => {
    const [fileName, setFileName] = useState([]);
    const navigation = useNavigation();


    return (
        <ImageBackground
        source={require('../../assets/backgroundCloudyBlobsFull.png')}
        resizeMode="cover"
        style={styles.container}
      >
        <View style={styles.containerFile}>
            <Text style={styles.selectFiles}>Select a Work Package</Text>
            <View style={styles.workPackageList}>
                {workPackages.map((workPackage) => (
                    <TouchableOpacity
                        key={workPackage.id}
                        onPress={() => {
                            // Navigate to QuestionsOverviewScreen
                            navigation.navigate('QuestionsOverviewScreen', {
                                workPackageId: workPackage.id, // pass id
                            });
                        }}
                    >
                        <Text style={styles.workPackageItem}>{workPackage.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={styles.createPackageButtonContainer}>
                <TouchableOpacity
                    style={styles.createPackageButton}
                    onPress={() => {
                        // Handle the "Create Package" button click
                    }}
                >
                    <Text style={styles.createPackageButtonText}>Create Package</Text>
                </TouchableOpacity>
            </View>
        </View>
      </ImageBackground>
    );
};

const styles = StyleSheet.create({
    createPackageButtonContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    createPackageButton: {
        backgroundColor: '#407BFF',
        width: 190,
        height: 45,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    createPackageButtonText: {
        color: '#FFFFFF',
        fontSize: 20,
    },    
    workPackageList: {
        marginTop: '5%',
        alignItems: 'center',
    },
    workPackageItem: {
        fontSize: 18,
        marginVertical: 10,
        color: '#333', 
        borderColor: '#333', 
        borderWidth: 1, 
        padding: 10, 
        borderRadius: 5, 
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
      backgroundColor: '#FAFAFA',
      alignItems: 'center',
      width: '100%',
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
      marginTop: '5%',
    },
    selectFiles: {
      color: '#696969',
      fontSize: 36,
      fontWeight: '500',
      marginTop: '1%',
    },
    supportedFormats: {
      color: '#ADADAD',
      fontSize: 15,
      fontWeight: '600',
      textAlign: 'center',
      marginTop: '95%',
    },
    imageUpload: {
      resizeMode: 'contain',
      width: 198,
      height: 250,
    },
    filesText: {
      padding: 10,
    },
    filesName: {
      padding: 0,
    },
    buttonUpload: {
      backgroundColor: '#407BFF',
      width: 190,
      height: 45,
      borderRadius: 9,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
    },
    buttonText: {
      color: '#FFFFFF',
      alignItems: 'center',
      fontSize: 20,
      fontWeight: '500',
    },
  });

export default SelectWorkPackageScreen;