import { PaymentElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getItem } from '../../components/AsyncStorage';
const CheckoutForm = ({ navigation, route }) => {
  const navigation1 = useNavigation();
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await getItem('@token');
    const user = JSON.parse(token);
    const userId = user._id;

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { paymentIntent, error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // No return_url needed
      },
      redirect: 'if_required',
    });

    if (error) {
      if (error.type === 'card_error' || error.type === 'validation_error') {
        setMessage(error.message);
      } else {
        setMessage('An unexpected error occurred.');
      }
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Payment succeeded, you can navigate to the success screen
      setMessage('Payment successful!');
      transferToPurchasedWorkPackage(userId);
      navigation1.navigate('PurchaseSuccessPage'); // Replace 'SuccessScreen' with your screen name
    } else {
      console.log('Payment failed');
    }

    setIsProcessing(false);
  };
  const transferToPurchasedWorkPackage = async (userId) => {
    try {
      const response = await fetch(`http://localhost:4000/payment/transferWorkPackages/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        console.log('Work packages transferred to purchasedWorkPackage successfully.');
      } else {
        console.error('Error transferring work packages:', response.statusText);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View id="payment-form">
        <PaymentElement id="payment-element" />
        <TouchableOpacity
          disabled={isProcessing || !stripe || !elements}
          style={styles.buttonBox}
          onPress={handleSubmit} 
        >
          <Text style={styles.buttonText}>{isProcessing ? 'Processing ... ' : 'Pay now'}</Text>
        </TouchableOpacity>
        {/* Show any error or success messages */}
        {message && <View id="payment-message">{message}</View>}
      </View>
    </View>
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
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonBox: {
        backgroundColor: '#4F85FF',
        alignItems: 'center',
        paddingVertical: 8,
        width: '60%',
        borderRadius: 8,
        marginTop: 20,
    },
});

export default CheckoutForm;