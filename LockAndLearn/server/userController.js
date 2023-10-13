const express = require('express');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./UserSchema');
const { createUser, getUserByEmail } = require('./userManager');
const router = express.Router();


//Handle user sign in
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        //validate

        if (!email || !password) {
            return res.status(400).json({ msg: "not all fields have been entered" });
        }

        const user = await User.findOne({ email: email });
        if (!user) {
            return res
                .status(400)
                .json({ msg: "No account with this email has been registered" });
        }

        //checking password entered and comparing with hashed password in database
/*        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "invalid credentials" });
        }*/
        const token = jwt.sign({ id: user._id }, process.env.DB_STRING);
        res.json({
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            }
        });
    } catch (error) {
        res.status(500).json({err:error.message})
    }
    

    const user = await getUserByEmail(email);

    if (!user) {
        res.status(400).send(null);
    }

    else if (user.password !== password) {
        res.status(400).send(null);
    }

 /*   else if (user.password === password) {

        const token = jwt.sign(
            { email: email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );

        res.status(200).send({
            ...user,
            token: token
        })
    }*/
})

// Handle user registration
router.post('/signup', async (req, res) => {
  try {

    // Extract user data from the request body
    console.log(req.body);
    const { FirstName, LastName, Email, Password, DOB} = req.body;

    /* // Generate a JWT token
    const token = jwt.sign(
      { email: email },
      process.env.TOKEN_KEY, // Your secret key
      {
        expiresIn: '2h',
      }
    ); */

    // Call the createUser function to create a new user
    const user = await createUser({ FirstName, LastName, Email, Password, DOB});

    // Respond with the newly created user
    res.status(201).json(user);

  } catch (error) {
    // Handle errors if createUser function fails
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Unable to create user' });
  }
});

module.exports = router;
