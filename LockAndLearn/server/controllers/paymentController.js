const fetch = require('node-fetch')
const express = require('express');
const router = express.Router();
require('dotenv').config({ path: '../.env' });
const base = "https://api-m.sandbox.paypal.com";
const User = require('../schema/userSchema.js');

const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

const stripe = require("stripe")(STRIPE_SECRET_KEY);
// Creates an order and returns the order ID
router.post("/initOrder", async (req, res) => {
    try {
      const { totalPrice } = req.body;
      const { jsonResponse, httpStatusCode } = await createOrder(totalPrice);
      res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
      console.error("Failed to create order:", error);
      res.status(500).json({ error: "Failed to create order." });
    }
  });

// Completes the transaction and captures the funds
router.post("/:orderID/capture", async (req, res) => {
  try {
    const { orderID } = req.params;
    const { jsonResponse, httpStatusCode } = await captureOrder(orderID);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to capture order." });
  }
});

// Endpoint to transfer work packages from CartWorkPackage to purchasedWorkPackage
router.post("/transferWorkPackages/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log(userId);
        // Assuming you have a User model and CartWorkPackage and purchasedWorkPackage fields
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Move all CartWorkPackages to purchasedWorkPackages
        user.purchasedWorkPackages.push(...user.CartWorkPackages);
        user.CartWorkPackages = []; // Empty the CartWorkPackages array

        // Save the updated user
        await user.save();

        // Send a success response
        res.status(200).json({ message: 'All work packages transferred to purchased successfully' });
    } catch (error) {
        console.error('Error transferring work packages to purchased:', error);
        res.status(500).json({ error: 'An error occurred while transferring work packages to purchased.' });
    }
});


// Generates an access token from the PayPal API using credentials from the .env file
const generateAccessToken = async () => {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error('MISSING_API_CREDENTIALS');
    }

    const auth = Buffer.from(PAYPAL_CLIENT_ID + ':' + PAYPAL_CLIENT_SECRET).toString('base64');
    console.log("before sending response")
    const response = await fetch(`${base}/v1/oauth2/token`, {
      method: 'POST',
      body: 'grant_type=client_credentials',
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Failed to generate Access Token:', error);
  }
};

// Creates an order using the PayPal API endpoint
const createOrder = async (totalPrice) => {
  // use the cart information passed from the front-end to calculate the purchase unit details
  console.log('Now in createOrder with price of: ', totalPrice);

  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders`;
  const payload = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'CAD', 
          value: totalPrice.toString(), 
        },
      },
    ],
      application_context: {
        // TODO: UPDATE THE URL ONCE DEPLOYED
          user_action: "PAY_NOW",
          "payment_method": {
              "payee_preferred": "UNRESTRICTED"
          },
        return_url: "https://localhost:19006/return",
        cancel_url: "https://localhost:19006/cancel"
    }
  };

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
      // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
      // "PayPal-Mock-Response": '{"mock_application_codes": "MISSING_REQUIRED_PARAMETER"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "PERMISSION_DENIED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
    },
    method: 'POST',
    body: JSON.stringify(payload),
  });

    return handleResponse(response);
  };

// Captures the order funds using the PayPal API endpoint
const captureOrder = async (orderID) => {
    try {
        const accessToken = await generateAccessToken();
        const url = `${base}/v2/checkout/orders/${orderID}/capture`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
                // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
                // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
                // "PayPal-Mock-Response": '{"mock_application_codes": "INSTRUMENT_DECLINED"}'
                // "PayPal-Mock-Response": '{"mock_application_codes": "TRANSACTION_REFUSED"}'
                // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
            },
        });

        return handleResponse(response);
    } catch (error) {
        console.error('Failed to capture order:', error);
        throw new Error('Failed to capture order.');
    }
  
};

// Handles the response from the PayPal API endpoints
async function handleResponse(response) {
  try {
    const jsonResponse = await response.json();
    const status = response.status;

    console.log('Response JSON:', jsonResponse);
    console.log('HTTP Status Code:', status);

    return {
      jsonResponse,
      httpStatusCode: status
     };
  } catch (err) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
}



/*STRIPE PAYMENT*/
router.get("/config", (req, res) => {
    console.log("config endpoint hit!");
    console.log(process.env.STRIPE_PUBLISHABLE_KEY);
    res.send({
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
});

router.post("/initOrderStripe", async (req, res) => {
    try {
        console.log("initOrderStripe endpoint hit!");
        const { totalPrice } = req.body;
        console.log("server total price: ", totalPrice);

        if (!totalPrice) {
            throw new Error("Total price is missing or invalid.");
        }
        // Convert the string to a floating-point number
        const priceInDollars = parseFloat(totalPrice);

        // Convert the price to an integer representing cents (assuming it's in dollars)
        const amountInCents = Math.round(priceInDollars * 100); // Rounding to the nearest cent

        console.log("amount in cents", amountInCents);
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'cad',
        });

        console.log("Sending client secret...");
        // Send publishable key and PaymentIntent details to client
        res.send({
            clientSecret: paymentIntent.client_secret,
        });
        console.log("Sent to front-end.");
    } catch (e) {
        console.error(e); // Log the error for debugging
        return res.status(400).send({
            error: {
                message: e.message || "An error occurred while processing the payment.",
            },
        });
    }
});

module.exports = router;