import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, FlatList } from 'react-native';
import { Icon } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import { getItem } from '../../../components/AsyncStorage';

const ViewPurchasedMaterial = ({ route, navigation }) => {

    const [workPackages, setWorkPackages] = useState([]);

    // function to get all owned work packages from the user
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
                    setWorkPackages(data);
                } else {
                    console.error('Error fetching workPackages');
                }
            } catch (error) {
                console.error('Network error:', error);
            }
        } else {
            console.log('No work package found')
        }
    };

    // function to display the work package information
    const renderWorkPackage = (workPackage) => {
        return (
            <View key={workPackage._id} style={styles.workPackageItemContainer}>
                <TouchableOpacity
                    style={{ width: '80%' }}
                >
                    <Text style={styles.workPackageItem}>
                        {workPackage.name} - {workPackage.grade} - {workPackage.price && workPackage.price !== 0 ? `$${workPackage.price}` : 'Free'}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    useEffect(() => {
        fetchWorkPackages(true);
    }, []);

    return (
        <ImageBackground
            source={require('../../../assets/backgroundCloudyBlobsFull.png')}
            resizeMode="cover"
            style={styles.container}
        >
            <View style={styles.containerFile}>
                <Text style={styles.selectFiles}>Owned Work Packages</Text>
                {/* Display all work packages */}
                <FlatList
                    data={workPackages}
                    renderItem={({ item }) => renderWorkPackage(item)}
                    keyExtractor={(item) => item._id}
                    style={{ width: '100%', marginTop: '2%' }}
                    contentContainerStyle={{ paddingHorizontal: '5%' }}
                    ListEmptyComponent={() => (
                        // Display when no work packages are found
                        <View style={{ alignItems: 'center', marginTop: 20 }}>
                            <Text>No owned work packages</Text>
                        </View>
                    )}
                />

            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    deleteConfirmationModal: {
        width: '50%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    confirmationText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
    confirmationButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    confirmButton: {
        backgroundColor: '#F24E1E',
        padding: 10,
        borderRadius: 10,
    },
    confirmButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: '#407BFF',
        padding: 10,
        borderRadius: 10,
    },
    cancelButtonText: {
        color: 'white',
        fontWeight: 'bold',
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
        borderColor: '#696969',
        borderWidth: 1,
        padding: 13,
        borderRadius: 15,
    },
    deleteButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(242, 78, 30, 0.13)',
        borderRadius: 100,
        padding: 5,
    },
    buttonUpload: {
        backgroundColor: '#407BFF',
        width: 190,
        height: 35,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        marginTop: '5%',
        marginBottom: '5%'
    },
    buttonText: {
        color: '#FFFFFF',
        alignItems: 'center',
        fontSize: 15,
        fontWeight: '500',
    },
    }
);

export default ViewPurchasedMaterial;
