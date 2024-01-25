const fetch = require('node-fetch')
const express = require('express');
const router = express.Router();
require('dotenv').config({ path: '../.env' });
const base = "https://api-m.sandbox.paypal.com";
const User = require('../schema/userSchema.js');
const WorkPackage = require('../schema/workPackage.js'); // Import the WorkPackage model
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

const increaseTeacherRevenue = async (teacherId, amount) => {
    try {
        const teacher = await User.findById(teacherId);

        if (!teacher) {
            throw new Error('Teacher not found');
        }

        if (teacher.isParent) {
            throw new Error('Cannot increase revenue for a non-teacher user.');
        }

        teacher.revenue += amount;
        await teacher.save();
    } catch (error) {
        console.error('Error increasing teacher revenue:', error);
        throw new Error('Failed to increase teacher revenue.');
    }
};

// Function to calculate the total revenue based on an array of work package IDs
const calculateTotalRevenue = async (workPackageIds) => {
    try {
        // Assuming WorkPackage model has a 'price' field
        const workPackages = await WorkPackage.find({ _id: { $in: workPackageIds } });
        const totalRevenue = workPackages.reduce((acc, workPackage) => acc + workPackage.price, 0);

        return totalRevenue;
    } catch (error) {
        console.error('Error calculating total revenue:', error);
        throw error;
    }
};


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
        // Fetch the teacher ID for each work package and update purchasedWorkPackages array
        //const updatedPurchasedWorkPackages = await Promise.all(
        //    user.CartWorkPackages.map(async (workPackageId) => {
        //        // Fetch the work package by ID
        //        const workPackage = await WorkPackage.findById(workPackageId);
        //        if (!workPackage) {
        //            console.error(`Work package not found with ID: ${workPackageId}`);
        //            return null; // or handle as needed
        //        }

        //        // Fetch the teacher ID from the fetched work package
        //        const teacherId = workPackage.instructorID;
        //        console.log(teacherId);
        //        // Increase revenue for the teacher (if the user is a teacher)
        //        if (user.isParent) {
        //            const totalRevenue = calculateTotalRevenue([workPackageId]); // Assuming calculateTotalRevenue expects an array
        //            await increaseTeacherRevenue(teacherId, totalRevenue);
        //        }

        //        return workPackageId;
        //    })
        //);

        //// Move all CartWorkPackages to purchasedWorkPackages
        //user.purchasedWorkPackages.push(...updatedPurchasedWorkPackages);
        //user.CartWorkPackages = []; // Empty the CartWorkPackages array

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

router.post("/initOrderStripe/:userId", async (req, res) => {
    try {
        console.log("initOrderStripe endpoint hit!");
        const { totalPrice } = req.body;
        const userId = req.params.userId;
        const user = await User.findById(userId);
        console.log("server total price: ", totalPrice);
        console.log("user", user);
        if (!totalPrice) {
            throw new Error("Total price is missing or invalid.");
        }
        // Convert the string to a floating-point number
        const priceInDollars = parseFloat(totalPrice);

        // Convert the price to an integer representing cents (assuming it's in dollars)
        const amountInCents = Math.round(priceInDollars * 100); // Rounding to the nearest cent

        console.log("amount in cents", amountInCents);
        const userFullName = user.firstName +" " + user.lastName;
        console.log("full name", userFullName);
        const customer = await stripe.customers.create({
            name: userFullName,
            email: user.email,
        });
        console.log(customer.id);
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'cad',
            customer: customer.id,
        });

        console.log("Sending client secret...");
        // Send publishable key and PaymentIntent details to client
        res.send({
            clientSecret: paymentIntent.client_secret,
            customerName: customer.name,
            customerEmail: customer.email,
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

// Endpoint to fetch all transactions
router.get('/transactions', async (req, res) => {
    try {
        // Use the Stripe API to retrieve a list of payments or transactions
        const payments = await stripe.paymentIntents.list({ limit: 100 }); // Adjust parameters as needed

        // Return the list of payments as a response
        res.status(200).json({ payments: payments.data });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'An error occurred while fetching transactions.' });
    }
});

router.get('/balanceAdmin', async (req, res) => {
    try {
        const balance = await stripe.balance.retrieve();
        console.log("balance", balance);
        // Return the list of payments as a response
        res.status(200).json({ balance: balance});
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'An error occurred while fetching transactions.' });
    }
});


module.exports = router;