import React, { useState, useEffect } from 'react';
import {
    ImageBackground,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { loadStripe } from "@stripe/stripe-js";
import { getItem } from '../../../components/AsyncStorage';

const Payment = ({ navigation, route }) => {
    const { totalPrice } = route.params || {};
    const { workPackages } = route.params || {};
    const [stripePromise, setStripePromise] = useState(null);
    const [clientSecret, setClientSecret] = useState("");
    const [stripePayingSplits, setStripePayingSplits] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await getItem('@token');
                const user = JSON.parse(token);
                const userId = user._id;
                // Fetch publishable key
                const configResponse = await fetch("http://localhost:4000/payment/config");
                const { publishableKey } = await configResponse.json();
                console.log("Received PK: ", publishableKey);
                setStripePromise(loadStripe(publishableKey));
                console.log("Stripe Promise set.");

                // Fetch client secret
                const orderResponse = await fetch(`http://localhost:4000/payment/initOrderStripe/${userId}`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        totalPrice: totalPrice,
                        workPackagesInCart: workPackages,
                    }),
                });
                const { clientSecret, stripePayingSplits } = await orderResponse.json();
                console.log("Received CS:", clientSecret);
                console.log('**Received paying splits: ', stripePayingSplits);
                setClientSecret(clientSecret);
                setStripePayingSplits(stripePayingSplits);
                console.log("Client Secret set.");
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData(); // Execute the combined fetch logic
    }, [totalPrice, setStripePromise, setClientSecret, setStripePayingSplits]);



    return (
        <ImageBackground
            source={require('../../../assets/backgroundCloudyBlobsFull.png')}
            resizeMode="cover"
            style={styles.page}
        >
            <View style={styles.container}>
                <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#696969' }}>Payment Information</Text>
                <Text style={{ fontSize: 24, color: '#696969' }}>Total Price: ${totalPrice} CAD</Text>
                {clientSecret && stripePromise && (
                    <View style={styles.cardContainer}>
                        {/* Add a container around the Stripe elements */}
                        <Elements testID="stripe-elements-container" stripe={stripePromise} options={{ clientSecret }}>
                            <CheckoutForm stripePayingSplits={stripePayingSplits} />
                        </Elements>
                    </View>
                )}
               
                
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
    header: {
        color: '#696969',
        fontSize: 24,
        fontWeight: '450',
        paddingVertical: '3%',
        textAlign: 'center',
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
});

export default Payment;