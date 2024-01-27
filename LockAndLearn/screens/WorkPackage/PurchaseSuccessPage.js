import React from 'react';
import {
    ImageBackground,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image
} from 'react-native';


const PurchaseSuccessPage = ({ navigation, route }) => {

    return (
        <ImageBackground
            source={require('../../assets/backgroundCloudyBlobsFull.png')}
            resizeMode="cover"
            style={styles.page}
        >
            <View style={styles.container}>
                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Payment Successful!</Text>
                <View style={styles.cardContainer}>

                <Image
                    source={require('../../assets/check.png')}
                    style={styles.image}
                    testID="checkImage"
                />
                <Text style={styles.successText}>Thank you for your purchase</Text>
                <Text style={styles.subText}>
                    Reviews help us keep up with your needs and also help others make confident decisions about their children's education.
                </Text>
                <TouchableOpacity
                    testID="returnDashboardButton"
                    style={styles.returnDashboardButton}
                    onPress={() => {
                        navigation.navigate('ParentAccount');
                    }}
                >
                    <Text style={styles.buttonText}>Return to Dashboard</Text>
                </TouchableOpacity>
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
        justifyContent: 'center',
        width: '100%',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        marginTop: '5%',
    },
    header: {
        color: '#696969',
        fontSize: 24,
        fontWeight: '450',
        paddingVertical: '3%',
        textAlign: 'center',
    },
    button: {
        width: 250,
        height: 50,
        backgroundColor: '#407BFF',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '5%',
    },
    text: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '500',
    },
    viewCartButton: {
        backgroundColor: '#4F85FF',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        position: 'relative',
        bottom: 0,
        width: '50%',
        borderRadius: 8,
        verticalAlign: 'bottom',
    },
    returnDashboardButton: {
        backgroundColor: '#4F85FF',
        alignItems: 'center',
        paddingVertical: 15,
        width: '60%',
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    successText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subText: {
        fontSize: 11,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    cardContainer: {
        maxWidth: 800,
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2, // Add border styles as needed
        borderColor: '#407BFF', // Add border color as needed
        borderRadius: 15, // Add border radius as needed
        padding: 20, // Add padding as needed
        marginTop: 20, // Adjust margin top as needed
    },
    image: {
        width: 100, // Adjust dimensions as needed
        height: 100, // Adjust dimensions as needed
        resizeMode: 'contain', // Or use 'cover' or 'stretch' based on how you want the image to fit
    },
});

export default PurchaseSuccessPage;
