import React from 'react';
import {
    ImageBackground,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image
} from 'react-native';


const ContactUs = ({ navigation, route }) => {
    const [fdata, setFdata] = useState({
        email: '',
        name: '',
        subject: '',
        message: '',
    });
    const handleSubmit = async () => {
        const token = await getItem('@token');
        const user = JSON.parse(token);
        const userId = user._id;
        // console.log(fdata);
        // Package the user data into a JSON format and ship it to the backend
        try {
            const response = await fetch('http://localhost:4000/users/createContactUs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fdata, userID: userId, }), // Send user data as JSON
            });
            const data = await response.json();
            // console.log(response.status);
            if (response.status === 201) {
                // User created successfully
                console.log('User created successfully in database!', data);
                await setUserTokenWithExpiry('@token', data.user);
                //Add redirect
                {
                    data?.user.isParent
                        ? navigation.navigate('ParentAccount')
                        : navigation.navigate('UserLandingPage');
                }
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
                <View style={styles.item}>
                    <Text style={styles.field}>Email</Text>
                    <TextInput
                        testID="email-input"
                        style={[styles.textbox, styles.full_width]}
                        value={fdata.email}
                        onChangeText={(newText) => setFdata({ ...fdata, email: newText })}
                    />
                </View>
               
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
        paddingBottom: 20,
    },
    item: {
        display: 'flex',
        width: '100%',
        paddingVertical: 10,
    },
    field: {
        color: '#ADADAD',
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
        minWidth: '100%',
    },
});

export default ContactUs;
