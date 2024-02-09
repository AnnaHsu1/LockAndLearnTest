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


// Endpoint to transfer work packages from CartWorkPackage to purchasedWorkPackage
router.post("/transferWorkPackages/:userId/:stripeId/:stripeSale", async (req, res) => {
    try {
        const userId = req.params.userId;
        const stripeId = req.params.stripeId;
        const stripeSaleInCents = parseFloat(req.params.stripeSale);
        const stripeSale = stripeSaleInCents / 100;

        console.log('userID received:', userId);
        console.log('stripeID received:', stripeId);
        console.log('stripeSale received:', stripeSale);
        // Assuming you have a User model and CartWorkPackage and purchasedWorkPackage fields
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Track revenue for each seller
        const sellersRevenue = {};

        // Iterate through the CartWorkPackages and update the stripePurchaseId field
        for (const workPackageId of user.CartWorkPackages) {
            const workPackage = await WorkPackage.findById(workPackageId);
            console.log("work Package:", workPackageId);
            if (workPackage) {
                const sellerId = workPackage.instructorID;

                // Calculate revenue for the seller based on the material price
                const materialPrice = workPackage.price;
                sellersRevenue[sellerId] = (sellersRevenue[sellerId] || 0) + materialPrice;
                console.log("total revenue", sellersRevenue[sellerId]);
                // Add stripeId to the stripePurchaseId array
                workPackage.stripePurchaseId = [...(workPackage.stripePurchaseId || []), stripeId.toString()];
                // Increment the profit by the price of the work package
                workPackage.profit = (workPackage.profit || 0) + parseFloat(workPackage.price);
                console.log("profit", workPackage.profit);
                await workPackage.save();
            }
        }

        // Update revenue for each seller
        for (const sellerId of Object.keys(sellersRevenue)) {
            await User.findByIdAndUpdate(sellerId, { $inc: { revenue: sellersRevenue[sellerId] } })
            const seller = await User.findById(sellerId);
            console.log("revenue", seller.revenue);
        };
        console.log("success");
        // Save the updated user's payment stripe info and the bought WPs
        user.purchasedWorkPackages.push({
          stripePurchaseId: stripeId.toString(),
          totalSale: stripeSale,
          workPackageIds: [...user.CartWorkPackages],
        });

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

// Endpoint to transfer work packages from CartWorkPackage to purchasedWorkPackage
router.post("/transferWorkPackages/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;


        console.log('userID received:', userId);

        // Assuming you have a User model and CartWorkPackage and purchasedWorkPackage fields
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate a random string for stripePurchaseId
        const stripeId = generateRandomString(20); // Adjust the length as needed
 
        // Iterate through the CartWorkPackages and update the stripePurchaseId field
        for (const workPackageId of user.CartWorkPackages) {
            const workPackage = await WorkPackage.findById(workPackageId);
            console.log("work Package:", workPackageId);
            if (workPackage) {
                // Add stripeId to the stripePurchaseId array
                workPackage.stripePurchaseId = [...(workPackage.stripePurchaseId || []), stripeId];
                // Increment the profit by the price of the work package
                workPackage.profit = (workPackage.profit || 0) + parseFloat(workPackage.price);
                console.log("profit", workPackage.profit);
                await workPackage.save();
            }
        }
        console.log("success");

        // Save the updated user's payment stripe info and the bought WPs
        user.purchasedWorkPackages.push({
            stripePurchaseId: stripeId,
            totalSale: 0,
            workPackageIds: [...user.CartWorkPackages],
        });

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

// Function to generate a random string
function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
}

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
        const { totalPrice, workPackagesInCart } = req.body;
        const userId = req.params.userId;
        const user = await User.findById(userId);
        console.log("server total price: ", totalPrice);
        console.log('work packages involved: ', workPackagesInCart);
        console.log("user", user);

        if (!totalPrice) {
            throw new Error("Total price is missing or invalid.");
        }
        
        // Convert the string to a floating-point number
        const priceInDollars = parseFloat(totalPrice);

        // Convert the price to an integer representing cents (assuming it's in dollars)
        const amountInCents = Math.round(priceInDollars * 100); // Rounding to the nearest cent
        console.log('amount in cents', amountInCents);

        // Reduce workPackagesInCart to only contain price and instructorID (for transfer splits)
        const reducedWorkPackages = await setPayingSplitsPerSeller(workPackagesInCart);

        console.log('processable paying splits on Stripe: ', reducedWorkPackages);

        // Create a new customer in Stripe
        const userFullName = user.firstName + ' ' + user.lastName;
        console.log('full name', userFullName);
        const customer = await stripe.customers.create({
            name: userFullName,
            email: user.email,
        });
        console.log(customer.id);

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'cad',
            customer: customer.id
        });

        console.log("Sending client secret...");
        // Send publishable key and PaymentIntent details to client
        res.send({
            clientSecret: paymentIntent.client_secret,
            customerName: customer.name,
            customerEmail: customer.email,
            stripePayingSplits: reducedWorkPackages,
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

// Function to fetch StripeBusinessId for each instructorID and sum the total amount to be paid to each seller (only valid sellers with StripeBusinessIds are in the array)
const setPayingSplitsPerSeller = async (workPackagesInCart) => {
  try {
      const mergedMap = new Map();

      const promises = workPackagesInCart.map(async (workPackage) => {
          try {

              // Convert the string to a floating-point number
              const priceInDollars = parseFloat(workPackage.price);

              // Fetch the user from the database based on instructorID (_id in MongoDB)
              const user = await User.findById(workPackage.instructorID);

              // If the user is found, add StripeBusinessId to the workPackage object
              if (user && user.StripeBusinessId) {
                  const key = `${workPackage.instructorID}-${user.StripeBusinessId}`;

                  if (mergedMap.has(key)) {
                      // If the key already exists, sum the prices
                      mergedMap.get(key).price += priceInDollars;
                  } else {
                      // If the key doesn't exist, create a new entry
                      mergedMap.set(key, {
                          price: priceInDollars,
                          instructorID: workPackage.instructorID,
                          StripeBusinessId: user.StripeBusinessId,
                      });
                  }
              } else {
                  // Handle the case where the user or StripeBusinessId is not found
                  console.error(`User not found or StripeBusinessId missing for instructorID: ${workPackage.instructorID}`);
              }
          } catch (error) {
              // Handle database query errors
              console.error(`Error fetching user for instructorID: ${workPackage.instructorID}`, error);
          }
      });

      // Wait for all promises to resolve
      await Promise.all(promises);

      // Convert the Map values to an array and filter out null entries
      const mergedWorkPackages = Array.from(mergedMap.values()).filter((entry) => entry !== null);

      return mergedWorkPackages;
  } catch (error) {
      console.error('Error fetching and merging StripeBusinessIds:', error);
      return [];
  }
};

// Endpoint to fetch all transactions
router.get('/transactions', async (req, res) => {
    try {
        // Use the Stripe API to retrieve a list of payments or transactions
        const payments = await stripe.paymentIntents.list({ limit: 10 }); // Adjust parameters as needed

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
        // Return the list of payments as a response
        res.status(200).json({ balance: balance});
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'An error occurred while fetching transactions.' });
    }
});

router.get('/getParentUserName/:stripePurchaseId', async (req, res) => {
  const stripePurchaseId = req.params.stripePurchaseId;

  try {
    const user = await User.findOne(
      { 'purchasedWorkPackages.stripePurchaseId': stripePurchaseId },
      { firstName: 1, lastName: 1, _id: 0 }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found for the given stripePurchaseId, most likely a legacy account where the purchasedWorkPackage array is not in the right format in the DB.' });
    }

    const parentName = `${user.firstName} ${user.lastName}`;

    res.status(200).json({ parentName });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/balanceInstructor/:instructorId', async (req, res) => {
    try {
        const instructorID = req.params.instructorId;
        const user = await User.findById(instructorID);
        const revenue = user.revenue;
        // Return the  revenue as a response
        res.status(200).json({ revenue: revenue });
    } catch (error) {
        console.error('Error fetching balance:', error);
        res.status(500).json({ error: 'An error occurred while fetching balance.' });
    }
});

router.get('/initiateStripeBusinessAccount/:instructorId', async (req, res) => {
  try {
    const instructorID = req.params.instructorId;
    const user = await User.findById(instructorID); // Find the instructor by ID

    // Create a Stripe account for the instructor
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'CA',
      email: user.email,
      requested_capabilities: ['card_payments', 'transfers'],
    });

    console.log('stripe account created: ', account);

    // Save StripeBusinessId to the instructor's collection
    user.StripeBusinessId = account.id; // This replaces it if it already exists
    await user.save();

    //Creating a link for the instructor to complete the onboarding process
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: 'https://localhost:19006/',
      return_url: 'https://localhost:19006/',
      type: 'account_onboarding',
    });

    console.log('account link created: ', accountLink);
    
    res.status(200).json({ url: accountLink.url, linkExpiry: accountLink.expires_at});

  } catch (error) {
    console.error('Error initiating Stripe account for the instructor:', error);
    res.status(500).json({ error: 'An error occurred while initiating Stripe business.' });
  }
});

//Check if the instructor has successfully completed the Stripe onboarding process (necessary to start receiving payments)
router.get('/checkStripeCapabilities/:instructorId', async (req, res) => {
  try {
    const instructorID = req.params.instructorId;
    const user = await User.findById(instructorID); // Find the instructor by ID

    if (!user || !user.StripeBusinessId) {
      return res.status(400).json({ error: 'User or Stripe Business ID not found.' });
    }

    // Retrieve the Stripe account information
    const account = await stripe.accounts.retrieve(user.StripeBusinessId);

    // Check if the account has card_payments and transfers capabilities
    const hasCardPaymentsCapability = account.capabilities && account.capabilities.card_payments === 'active';
    const hasTransfersCapability = account.capabilities && account.capabilities.transfers === 'active';

    res.status(200).json({
      hasCardPaymentsCapability,
      hasTransfersCapability,
    });

  } catch (error) {
    console.error('Error checking Stripe capabilities:', error);
    res.status(500).json({ error: 'An error occurred while checking Stripe capabilities.' });
  }
});

//  route to get the last purchase time for a work package
router.get('/lastPurchaseTime/:workPackageId', async (req, res) => {
    const { workPackageId } = req.params;

    try {
        const lastPurchaseTime = await getLastPurchaseTime(workPackageId);
        res.status(200).json({ lastPurchaseTime });
    } catch (error) {
        console.error('Error fetching last purchase time:', error);
        res.status(500).json({ error: 'An error occurred while fetching last purchase time.' });
    }
});

// Function to get the last purchase time for a given work package ID
const getLastPurchaseTime = async (workPackageId) => {
  try {
      // Fetch transactions associated with the work package
      const transactions = await stripe.paymentIntents.list({
          limit: 10, // Adjust as needed
          // Add any additional filters if required, e.g., metadata: { workPackageId: workPackageId }
      });

      // Sort transactions by creation date in descending order
      transactions.data.sort((a, b) => new Date(b.created) - new Date(a.created));

      // Return the creation time of the first transaction (assuming it's the latest)
      return transactions.data.length > 0 ? transactions.data[0].created : null;
  } catch (error) {
      console.error('Error fetching last purchase time:', error);
      throw error;
  }
};
//  route to get the last purchase time for a work package
router.get('/lastPurchaseTime/:workPackageId', async (req, res) => {
  const { workPackageId } = req.params;

  try {
      const lastPurchaseTime = await getLastPurchaseTime(workPackageId);
      res.status(200).json({ lastPurchaseTime });
  } catch (error) {
      console.error('Error fetching last purchase time:', error);
      res.status(500).json({ error: 'An error occurred while fetching last purchase time.' });
  }
});

//For devs to test the account deletion and Stripe cleanup
router.get('/delete-account/:accountId', async (req, res) => {
  
  const { accountId } = req.params;

  try {
    const deleted = await stripe.accounts.del(accountId);
    res.status(200).json({ success: true, message: 'Account deleted successfully', data: deleted });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


module.exports = router;