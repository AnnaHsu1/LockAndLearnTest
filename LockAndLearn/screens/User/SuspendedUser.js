import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { CreateResponsiveStyle, DEVICE_SIZES, minSize } from 'rn-responsive-styles';
import { Button } from 'react-native-paper';

const SuspendedUser = ({ route, navigation }) => {
  const styles = useStyles();


  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Your account has been suspended</Text>
        </View>

      </View>
    </View>
  );
};

const useStyles = CreateResponsiveStyle(
  {
    containerTag: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    workPackageText: {
      flex: 1, // Allow text to wrap within the available space
    },
    workPackageBox: {
      backgroundColor: '#fff',
      padding: 15,
      marginBottom: 15,
      borderRadius: 8,
      elevation: 2,
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
    workPackageItemContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
    },
    workPackageNameText: {
      fontSize: '150%',
      color: '#4F85FF',
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
    },
    title: {
      color: '#4F85FF',
      fontSize: 24,
      textAlign: 'center',
      paddingBottom: 20,
    },
    page: {
      backgroundColor: '#ffffff',
      maxWidth: '100%',
      flex: 1,
      alignItems: 'center',
    },
    container: {
      minWidth: '90%',
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
    userListContainer: {
      paddingRight: 20,
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
    boldText: {
      fontWeight: 'bold', // Make the instructor's name bold
    },
    workPackageDescription: {
      fontSize: '110%',
      color: '#696969',
    },
    instructorDetails: {
      fontSize: '80%',
      color: '#696969',
    },
    previewButton:{
      maxWidth: 130,
    }
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

export default SuspendedUser;
