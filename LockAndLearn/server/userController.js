const express = require('express');
const { parseISO, isBefore } = require('date-fns');
const bcrypt = require('bcrypt');
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
            return res.status(400).json({ msg: "All fields must be filled." });
        }

/*        const user = await User.findOne({ email: email });
        if (!user) {
            return res
                .status(400)
                .json({ msg: "No account with this email has been registered" });
        }
*/
        //checking password entered and comparing with hashed password in database
/*        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "invalid credentials" });
        }*/

        // Call the getUserByEmail function, and return the user object if found
        const user = await getUserByEmail(email);

        // If the email doesn't exit, return a 400 error
        if (!user) {
            res.status(400).send(null);
        }

        // Password check with the input
        else if (user.password !== password) {
            res.status(400).send(null);
        }

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
    const { FirstName, LastName, Email, Password, CPassword, DOB} = req.body;

    // Input validations
    if(!FirstName, !LastName, !Email, !Password, !CPassword, !DOB){
        return res.status(400).json({ msg: "All fields must be filled." });
    };

    if (Password.length < 6) {
        return res.status(400).json({ msg: "Password must be at least 6 characters long." });
    };

    if (Password !== CPassword) {
        return res.status(400).json({ msg: "Passwords must match." });
    };

    // Parse the date of birth and the current date
    const dob = parseISO(DOB);
    const currentDate = new Date();
    const isValid = isBefore(dob, currentDate);

    if(!isValid){
        return res.status(400).json({ msg: "Invalid date of birth. Date cannot be ahead of today." });
    };

    if (!(Email.includes('@') || Email.includes('.'))) {
        return res.status(400).json({ msg: "Invalid email format." });
    };

    const emailCheck = await getUserByEmail(Email);
    if(emailCheck){
        return res.status(400).json({ msg: "Email is already in use." });
    }

    //Encrypt the input password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(Password, salt);

    console.log(passwordHash);

    // Call the createUser function to create a new user
    const user = await createUser({ FirstName, LastName, Email, passwordHash, DOB});

    // Respond with the newly created user
    res.status(201).json(user);

  } catch (error) {

    // Handle errors if createUser function fails
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Unable to create user' });
  }
});

module.exports = router;
