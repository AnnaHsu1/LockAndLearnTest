import React, { useState, useEffect } from 'react';
import {
    ImageBackground,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    TextInput
} from 'react-native';
import { getItem } from '../../components/AsyncStorage';

const ContactUs = ({ navigation, route }) => {
    const [fdata, setFdata] = useState({
        email: '',
        name: '',
        subject: '',
        message: '',
    });
    const [errors, setErrors] = useState('');

    const handleSubmit = async () => {
        const token = await getItem('@token');
        const user = JSON.parse(token);
        const userId = user._id;
        // console.log(fdata);
        // Package the user data into a JSON format and ship it to the backend
        try {
            const response = await fetch('https://data.mongodb-api.com/app/lock-and-learn-xqnet/endpoint/createContactUs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: fdata.email,
                    name: fdata.name,
                    subject: fdata.subject,
                    message: fdata.message,
                    userID: userId, 
                }),
            });
            const data = await response.json();
            // console.log(response.status);
            if (response.status === 201) {
                setErrors('');
                // User created successfully
                console.log('Inquiry created successfully in database!', data);
                //Add redirect
                {
                    data?.user.isParent
                        ? navigation.navigate('ParentAccount')
                        : navigation.navigate('UserLandingPage');
                }
            } else {
            setErrors(data.msg);
        }
        } catch (error) {
            console.error('Submitting error when creating user:', error);
        }
    };
    return (
        <ImageBackground
            source={require('../../assets/backgroundCloudyBlobsFull.png')}
            resizeMode="cover"
            style={styles.page}
        >
            <View style={styles.container}>
                <Text style={styles.title}>Contact Us</Text>
                <Text style={styles.titleDescription}>Need to get in touch with us? Please fill out the form with your inquiry or contact us directly at admin@lockandlearn.ca</Text>
                {errors ? <Text style={[styles.box, styles.full_width]}>{errors}</Text> : null}
                <View style={styles.item}>
                    <Text style={styles.field}>Name</Text>
                    <TextInput
                        testID="email-input"
                        style={[styles.textbox, styles.full_width]}
                        value={fdata.name}
                        onChangeText={(newText) => setFdata({ ...fdata, name: newText })}
                    />
                    <Text style={styles.field}>Email</Text>
                    <TextInput
                        testID="email-input"
                        style={[styles.textbox, styles.full_width]}
                        value={fdata.email}
                        onChangeText={(newText) => setFdata({ ...fdata, email: newText })}
                    />
                    <Text style={styles.field}>Subject</Text>
                    <TextInput
                        testID="email-input"
                        style={[styles.textbox, styles.full_width]}
                        value={fdata.subject}
                        onChangeText={(newText) => setFdata({ ...fdata, subject: newText })}
                    />
                    <Text style={styles.field}>Message</Text>
                    <TextInput
                        testID="email-input"
                        multiline={true}
                        style={[styles.textbox, styles.full_width, styles.MessageInputText]}
                        value={fdata.message}
                        onChangeText={(newText) => setFdata({ ...fdata, message: newText })}
                    />
                </View>
                <TouchableOpacity
                    style={styles.buttonSend}
                    onPress={() => {
                        handleSubmit();
                    }}
                >
                    <Text style={styles.textSend}>Send</Text>
                </TouchableOpacity>
            </View>

        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        width: '100%',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        marginTop: '5%',
    },
    title: {
        color: '#4F85FF',
        fontSize: 24,
        textAlign: 'center',
        paddingBottom: 15,
    },
    titleDescription: {
        color: '#696969',
        fontSize: 16,
        textAlign: 'center',
        paddingBottom: 20,
    },
    item: {
        display: 'flex',
        width: '50%',
        paddingVertical: 10,
    },
    field: {
        color: '#ADADAD',
        marginTop: '1%',
    },
    textbox: {
        display: 'flex',
        minHeight: 30,
        borderRadius: 10,
        borderColor: '#407BFF',
        borderStyle: 'solid',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderWidth: 1,
    },
    box: {
        borderWidth: 1,
        borderColor: 'red',
        color: 'red',
        padding: 10,
        marginTop: 10,
    },
    full_width: {
        minWidth: '50%',
    },
    MessageInputText: {
        height: 200,
    },
    buttonSend: {
        width: 190,
        height: 35,
        backgroundColor: '#407BFF',
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '2%',
        marginBottom: '2%'
    },
    textSend: {
        color: '#FFFFFF',
        alignItems: 'center',
        fontSize: 15,
        fontWeight: '500'
    },
});

export default ContactUs;
