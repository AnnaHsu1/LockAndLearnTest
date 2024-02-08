import React, { useState, useEffect } from 'react';
import {
    ImageBackground,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    ScrollView
} from 'react-native';

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
import { getUser } from '../../../components/AsyncStorage';
import { WorkPackageCard } from '../../../components/WorkPackageCard';
import { getItem } from '../../../components/AsyncStorage';
const FinanceInstructor = ({ navigation, route }) => {
    const refresh = route.params?.refresh;
    const [workPackages, setWorkPackages] = useState([]);
    const [balance, setBalance] = useState([]);

    useEffect(() => {
        getWorkPackages();
        fetchBalance();
    }, [refresh]);

    const fetchBalance = async () => {
        try {
            const token = await getItem('@token');
            const user = JSON.parse(token);
            const userId = user._id;
            const response = await fetch(`http://localhost:4000/payment/balanceInstructor/${userId}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
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


return (
    <View style={styles.page} testID="main-view">
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Finances</Text>
            </View>
            {/* Displaying the list of transactions */}
            <View style={styles.userContainer}>
                <Text style={styles.balance}>Total revenue: ${balance}</Text>
                <Text style={styles.balance}>Total Sales: </Text>
                <Text style={styles.balance}>Sales this week: </Text>
                <Text style={styles.balance}>Sales since last login: </Text>
            </View>
            <ScrollView style={styles.transactionListContainer}>
                <Text style={styles.text}>My Work Packages</Text>
                {workPackages.map((workPackage) => (
                    <View key={workPackage._id} style={styles.userContainer}>
                        <View style={styles.workPackageText}>
                            <Text style={styles.workPackageNameText}>{`${workPackage.name}`}</Text>
                            <Text >Total Profit: $</Text>
                            <Text >Cost: $</Text>
                            <Text >Quantity Sold: </Text>
    
                        </View>
                    </View>
                ))}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('CreateWorkPackage')}
                >
                </TouchableOpacity>
            </ScrollView>
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
        minWidth: '70%',
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
        paddingVertical: 20,
        paddingHorizontal: 30,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: wp(10),
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
