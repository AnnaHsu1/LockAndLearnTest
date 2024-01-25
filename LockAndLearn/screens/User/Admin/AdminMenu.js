import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import { CreateResponsiveStyle, DEVICE_SIZES, minSize, useDeviceSize } from 'rn-responsive-styles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Button, Icon } from 'react-native-paper';

const AdminMenu = ({ route, navigation }) => {
  const styles = useStyles();
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {}, []);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon source="account-circle" color="#fff" size={30} />
          <Text style={styles.title}>Admin Menu</Text>
        </View>
        <ScrollView style={styles.ScrollView}>
          {/* Accounts */}
          <Button
            testID="admin-accounts"
            mode="contained"
            onPress={() => {
              navigation.navigate('AdminAccount');
            }}
            style={[styles.button, styles.full_width]}
          >
            <Text style={styles.text}>Accounts</Text>
          </Button>
          {/* Finance */}
          <Button
            testID="admin-finance"
            mode="contained"
            onPress={() => {
              navigation.navigate('AdminFinances');
            }}
            style={[styles.button, styles.full_width]}
          >
            <Text style={styles.text}>Finances</Text>
          </Button>
          {/* Work Packages */}
          <Button
            testID="admin-workpackages"
            mode="contained"
            onPress={() => {
              navigation.navigate('AdminWorkPackages');
            }}
            style={[styles.button, styles.full_width]}
          >
            <Text style={styles.text}>Work Packages</Text>
          </Button>
          {/* Files */}
          <Button
            testID="admin-files"
            mode="contained"
            onPress={() => {
              navigation.navigate('AdminFiles');
            }}
            style={[styles.button, styles.full_width]}
          >
            <Text style={styles.text}>Study Material</Text>
          </Button>
          {/* Quizzies */}
          <Button
            testID="admin-quizzes"
            mode="contained"
            onPress={() => {
              navigation.navigate('AdminQuizzes');
            }}
            style={[styles.button, styles.full_width]}
          >
            <Text style={styles.text}>Quizzes</Text>
          </Button>
          {/* Subcategories */}
          <Button
            testID="admin-subcategories"
            mode="contained"
            onPress={() => {
              navigation.navigate('AdminSubcategories');
            }}
            style={[styles.button, styles.full_width]}
          >
            <Text style={styles.text}>Subjects</Text>
          </Button>
          {/* Certificates to Approve */}
          <Button
            testID="admin-certificates"
            mode="contained"
            onPress={() => {
              navigation.navigate('AdminCertificates');
            }}
            style={[styles.button, styles.full_width]}
          >
            <Text style={styles.text}>Certificates to Review</Text>
          </Button>
          {/* Report Center */}
          <Button
            testID="admin-reportcenter"
            mode="contained"
            onPress={() => {
              navigation.navigate('AdminReportCenter');
            }}
            style={[styles.button, styles.full_width]}
          >
            <Text style={styles.text}>Report Center</Text>
          </Button>
        </ScrollView>
      </View>

      {/* Modal to confirm the deletion of a child */}
      <Modal
        testID="delete-child-modal"
        isVisible={isModalVisible}
        onRequestClose={toggleModal}
        transparent={true}
        style={{ justifyContent: 'center', alignItems: 'center' }}
      >
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 20,
            padding: 20,
          }}
        >
          <Text style={styles.text}></Text>

          {/* Cancel */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <Button
              testID="close-modal-button"
              style={[styles.modalButtons, styles.bgWhite]}
              title="Hide modal"
              mode="contained"
              onPress={() => {
                toggleModal();
              }}
            >
              <Text style={{ color: '#4F85FF', fontSize: 20 }}>No</Text>
            </Button>

            {/* Confirm child deletion */}
            <Button
              testID="delete-child-button"
              style={[styles.modalButtons, styles.bgRed]}
              title="Delete child"
              mode="contained"
              onPress={() => {
                toggleModal();
              }}
            >
              <Text style={{ color: '#fff', fontSize: 20 }}>Yes</Text>
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const useStyles = CreateResponsiveStyle(
  {
    page: {
      backgroundColor: '#ffffff',
      maxWidth: '100%',
      flex: 1,
      alignItems: 'center',
    },
    container: {
      minWidth: '90%',
      minHeight: '95%',
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 20,
      marginTop: 20,
      borderRadius: 10,
      backgroundColor: '#4F85FF',
    },
    header: {
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '20%',
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
    ScrollView: {
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

export default AdminMenu;
