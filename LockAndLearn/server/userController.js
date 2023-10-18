const express = require('express');
const { createUser } = require('./userManager.js');
const router = express.Router();
// const jwt = require('jsonwebtoken');

// Handle user registration
router.post('/signup', async (req, res) => {
  try {
    // Extract user data from the request body
    console.log(req.body);
    const { FirstName, LastName, Email, Password, DOB } = req.body;

    /* // Generate a JWT token
    const token = jwt.sign(
      { email: email },
      process.env.TOKEN_KEY, // Your secret key
      {
        expiresIn: '2h',
      }
    ); */

    // Call the createUser function to create a new user
    const user = await createUser({
      FirstName,
      LastName,
      Email,
      Password,
      DOB,
    });

    // Respond with the newly created user
    res.status(201).json(user);
  } catch (error) {
    // Handle errors if createUser function fails
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Unable to create user' });
  }
});

module.exports = router;
