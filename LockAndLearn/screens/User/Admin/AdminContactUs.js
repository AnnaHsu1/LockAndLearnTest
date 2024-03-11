import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { CreateResponsiveStyle, DEVICE_SIZES, minSize, useDeviceSize } from 'rn-responsive-styles';

const AdminContactUs = ({ route, navigation }) => {
    const styles = useStyles();
    const [inquiries, setInquiries] = useState([]);
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    // Fetch contact us inquiries 
    useEffect(() => {
        fetchContactUs();
    }, []);

    // Fetch all inquiries
    const fetchContactUs = async () => {
        try {
            // Correctly formatted fetch request
            const url = 'https://data.mongodb-api.com/app/lock-and-learn-xqnet/endpoint/getContactUs';
            const response = await fetch(url, {
                method: 'GET', // Specify the request method if necessary, GET is default
                headers: {
                    'Content-Type': 'application/json', // Set appropriate headers if required by the endpoint
                }
            });

            if (response.ok) {
                const data = await response.json(); // Parse the JSON response
                console.log("data logged", data);
                setInquiries(data); // Set inquiries state with the fetched data
            } else {
                console.error('Failed to contact us inquiries:', response.status);
            }
        } catch (error) {
            console.error('Error fetching contact us inquiries:', error);
        }
    };

    const openModal = (inquiry) => {
        setSelectedInquiry(inquiry);
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setSelectedInquiry(null);
        setIsModalVisible(false);
    };
    const handleDeletePress = async () => {
        if (!selectedInquiry) return;

        try {
            const response = await fetch(`https://data.mongodb-api.com/app/lock-and-learn-xqnet/endpoint/deleteContactUs?id=${selectedInquiry._id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                const updatedInquiries = inquiries.filter((inquiry) => inquiry._id !== selectedInquiry._id);
                setInquiries(updatedInquiries);
                closeModal();
            } else {
                console.error('Failed to delete inquiry:', response.status);
            }
        } catch (error) {
            console.error('Error deleting inquiry:', error);
        }
    };

    return (
        <View style={styles.page} testID="main-view">
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Inquiries</Text>
                </View>

                <ScrollView>
                    {inquiries.length > 0 ? (
                            <View style={styles.inquiriesContainer}>
                                {inquiries.map((inquiry, index) => (
                                    <View key={index} style={styles.inquiryItem}>
                                        <Text style={[styles.field, styles.boldText]}>Name: </Text>
                                        <Text>{inquiry.name}</Text>
                                        <Text style={[styles.field, styles.boldText]}>Email: </Text>
                                        <Text>{inquiry.email}</Text>
                                        <Text style={[styles.field, styles.boldText]}>Subject: </Text>
                                        <Text>{inquiry.subject}</Text>
                                        <Text style={[styles.field, styles.boldText]}>Message: </Text>
                                        <Text>{inquiry.message}</Text>
                                        <TouchableOpacity onPress={() => openModal(inquiry)}>
                                            <Text style={styles.deleteButton}>Delete</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                           
                            </View>
                        )
                     : (
                        <Text style={styles.emptyCertificatesList}>No inquiries</Text>
                    )}
                </ScrollView>
                {/* Modal for deletion confirmation */}
                <Modal
                    isVisible={isModalVisible}
                    onRequestClose={closeModal}
                    transparent={true}
                    style={{ elevation: 20, justifyContent: 'center', alignItems: 'center' }}
                >
                    <View style={styles.deleteConfirmationModal}>
                        <Text style={styles.confirmationText}>Are you sure you want to delete this inquiry?</Text>
                        <View style={styles.confirmationButtons}>
                            <TouchableOpacity
                                testID="deleteConfirmationModal"
                                onPress={handleDeletePress}
                                style={[styles.confirmButton, { marginRight: 10 }]}
                            >
                                <Text style={styles.confirmButtonText}>Delete</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={closeModal}
                                style={styles.cancelButton}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
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
        inquiryItem: {
            backgroundColor: '#ffffff',
            borderRadius: 10,
            marginVertical: 10,
            padding: 10,
        },
        deleteButton: {
            color: 'red',
            marginTop: 10,
        },

        boldText: {
            fontWeight: 'bold',
        },
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
