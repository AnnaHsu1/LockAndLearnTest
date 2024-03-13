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
import { getItem } from '../../../components/AsyncStorage';
const CheckoutForm = ({ stripePayingSplits }) => {
  //console.log('Stripe Paying Splits:', stripePayingSplits);
  const navigation1 = useNavigation();
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);


  /**
   * Handles the form submission for the checkout process.
   * @param {Event} e - The form submission event.
   * @returns {Promise<void>} - A promise that resolves when the submission is complete.
   */
  const handleSubmit = async (e) => {
    e?.preventDefault?.();
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
      setMessage('Payment successful!');
      transferToPurchasedWorkPackage(userId, paymentIntent.id, paymentIntent.amount);
      await processTransfers(stripePayingSplits); // Process and split the payments to all the relevant parties
      navigation1.navigate('PurchaseSuccessPage'); 
    } else {
      console.log('Payment failed');
    }

    setIsProcessing(false);
  };

  
  /**
   * Transfers work package information to the backend, where it will be stored in the purchasedWorkPackage collection of the user.
   * 
   * @param {string} userId - The ID of the buyer.
   * @param {string} stripeId - The ID of the Stripe payment.
   * @param {string} stripeSale - The sale price from Stripe.
   * @returns {Promise<void>} - A promise that resolves when the transfer is successful or rejects with an error.
   */
  const transferToPurchasedWorkPackage = async (userId, stripeId, stripeSale) => {
    try {
      const response = await fetch(`https://lockandlearn.onrender.com/payment/transferWorkPackages/${userId}/${stripeId}/${stripeSale}`, {
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

  /**
   * Sends the payment splits to the backend for processing, where the payments will be split and transferred to the relevant parties on Stripe.
   * @param {Array} stripePayingSplits - The array of stripe paying splits.
   * @returns {Promise} - A promise that resolves when the transfers are processed.
   */
  const processTransfers = async (stripePayingSplits) => {
    try {
      const response = await fetch(`https://lockandlearn.onrender.com/payment/transferPayments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stripePayingSplits: stripePayingSplits,
        }),
      });
  
      const data = await response.json();
      console.log('Transfers processed:', data);
    } catch (error) {
      console.error('Error processing transfers:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View testID="payment-form">
        <PaymentElement testID="payment-element" />
        <TouchableOpacity
          disabled={isProcessing || !stripe || !elements}
          style={styles.buttonBox}
          onPress={handleSubmit} 
        >
          <Text testID="button-text" style={styles.buttonText}>{isProcessing ? 'Processing ... ' : 'Pay now'}</Text>
        </TouchableOpacity>
        {/* Show any error or success messages */}
        {message && <View id="payment-message">{message}</View>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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