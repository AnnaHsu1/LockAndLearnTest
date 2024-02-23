import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { CreateResponsiveStyle, DEVICE_SIZES, minSize, useDeviceSize } from 'rn-responsive-styles';

const AdminContactUs = ({ route, navigation }) => {
    const styles = useStyles();




    return (
        <View style={styles.page} testID="main-view">
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Inquiries</Text>
                </View>
            </View>
        </View>
    );
};

const useStyles = CreateResponsiveStyle(
    {
        subText: {
            fontSize: 18,
            color: '#696969',
        },
        subTitle: {
            fontSize: 20,
            fontWeight: 'bold',
        },
        boldText: {
            fontSize: 25,
            fontWeight: 'bold',
        },
        reportItem: {
            backgroundColor: '#ffffff',
            borderRadius: 10,
            marginVertical: 10,
            padding: 15,
        },
        page: {
            backgroundColor: '#ffffff',
            maxWidth: '100%',
            flex: 1,
            alignItems: 'center',
        },
        container: {
            flex: 1,
            minWidth: '90%',
            minHeight: '65%',
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 20,
            marginTop: 20,
            borderRadius: 10,
            backgroundColor: '#4F85FF',
            marginBottom: 15,
            paddingBottom: 15,
        },
        header: {
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: 10,
        },
        title: {
            color: '#ffffff',
            fontSize: 24,
            textAlign: 'center',
            paddingTop: 15,
        },
        button: {
            color: '#4F85FF',
            backgroundColor: '#ffffff',
            borderRadius: 10,
            marginVertical: 10,
            height: 80,
            justifyContent: 'center',
            minWidth: 100,
        },
        modalButtons: {
            borderRadius: 10,
            marginVertical: 10,
            height: 50,
            justifyContent: 'center',
            minWidth: 100,
        },
        bgRed: {
            backgroundColor: '#FF0000',
        },
        bgWhite: {
            backgroundColor: '#ffffff',
        },
        full_width: {
            minWidth: '100%',
        },
        bottomCloud: {
            display: 'flex',
            justifyContent: 'flex-end',
            width: '100%',
            height: 250,
            resizeMode: 'stretch',
        },
        text: {
            color: '#4F85FF',
            fontSize: 20,
        },
        options: {
            flex: 0.75,
            justifyContent: 'space-around',
            alignItems: 'center',
        },
        link: {
            color: '#ffffff',
            fontSize: 12,
            textAlign: 'center',
            justifyContent: 'flex-end',
        },
        // Add a style for the ScrollView container
        scrollViewContainer: {
            flexGrow: 1,
            paddingRight: 20,
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

export default AdminContactUs;
