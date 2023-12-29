const fetch = require('node-fetch')
const express = require('express');
const router = express.Router();
require('dotenv').config({ path: '../.env' });
const base = "https://api-m.sandbox.paypal.com";

const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;



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
      return_url: "https://example.com/return",
      cancel_url: "https://example.com/cancel"
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
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderID}/capture`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer access_token${accessToken}`,
      // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
      // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
      // "PayPal-Mock-Response": '{"mock_application_codes": "INSTRUMENT_DECLINED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "TRANSACTION_REFUSED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
    },
  });

  return handleResponse(response);
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

module.exports = router;