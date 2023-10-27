const express = require("express");
const { parseISO, isBefore } = require("date-fns");
const bcrypt = require("bcrypt");
const User = require("../schema/childSchema.js");
const { createUser, getUserByEmail } = require("../userManager.js");
const router = express.Router();

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
    console.log("authenticating");
    if (req.session.sessionID) {
        // User is authenticated, proceed to the next middleware or route handler
        return next();
    } else {
        // User is not authenticated, redirect to the sign-in page
        return res.redirect('/signin');
    }
};

// Check user's authentication status
router.get('/authCheck', (req, res) => {
    if (req.cookies.userSession) {
      // User is authenticated, respond with an authentication status
      res.json({ isAuthenticated: true });
      console.log('Cookie ID:' + req.cookies.userSession);
    } else {
      // User is not authenticated, respond with an authentication status
      res.json({ isAuthenticated: false });
      console.log("No req.session.sessionID to be found.");
    }
  });

// Protected route for landing page
router.get('/UserLandingPage', isAuthenticated, (req, res) => {
    console.log("came here");
    // Render your landing page template or send any response you need
    res.send('Welcome to the landing page!');
});

//Handle user sign in
router.post('/login', async (req, res) => {
    try {
      console.log(req.body);
      const { email, password } = req.body;
  
      //validate
  
      if ((!email, !password)) {
        return res.status(400).json({ msg: "All fields must be filled." });
      }
  
      // Call the getUserByEmail function, and return the user object if found
      const user = await getUserByEmail(email);
  
      // If the email doesn't exist
      if (!user) {
        return res
          .status(400)
          .json({ msg: "Account with that email does not exist." });
      }
  
      // Password check with the input using bcrypt
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials." });
      }
  
    const sessionUser = {
      id: user._id,
      email: user.email,
    };
  
     req.session.user = sessionUser;
     req.session.sessionID = user._id.toString();
  
     res.cookie('userSession', req.session.sessionID, { httpOnly: true });
     res.status(201).json({ msg: "Login successful.", user: user });
  
  
    } catch (error) {
      console.error("Error logging user:", error);
      res.status(500).json({ msg: "Unexpected error." });
    }
  });

// Handle user registration
router.post('/signup', async (req, res) => {
    try {
      // Extract user data from the request body
      console.log(req.body);
      const { FirstName, LastName, Email, Password, CPassword, DOB } = req.body;
  
      // Input validations
      if ((!FirstName || !LastName ||!Email || !Password || !CPassword || !DOB)) {
        return res.status(400).json({ msg: "All fields must be filled." });
      }
      if (!(Email.includes("@") && Email.includes("."))) {
        return res.status(400).json({ msg: "Invalid email format." });
      }
  
      const emailCheck = await getUserByEmail(Email);
      if (emailCheck) {
        return res.status(400).json({ msg: "Email is already in use." });
      }
  
      if (Password.length < 6) {
        return res
          .status(400)
          .json({ msg: "Password must be at least 6 characters long." });
      }
  
      if (Password !== CPassword) {
        return res.status(400).json({ msg: "Passwords must match." });
      }
  
      // Parse the date of birth and the current date
      const dob = parseISO(DOB);
      const currentDate = new Date();
      const isValid = isBefore(dob, currentDate);
  
      if (!isValid) {
        return res
          .status(400)
          .json({ msg: "Invalid date of birth." });
      }
  
      //Encrypt the input password
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(Password, salt);
  
      console.log(passwordHash);
  
      // Call the createUser function to create a new user
      const user = await createUser({
        FirstName,
        LastName,
        Email,
        passwordHash,
        DOB,
      });
  
      // TO FIX // A session can't be created upon signup  as of right now
      if (user) {
  
          req.session.userId = user._id.toString();
  
          console.log("User created now we create session:" + user.firstName);
  
          const sessionUser = {
            id: user._id,
            email: user.email,
          };
        
           req.session.user = sessionUser;
           req.session.sessionID = user._id.toString();
  
           console.log("Session ID:" + req.session.sessionID);
        
      }
  
      // Respond with a cookie containing the sessionID and the user.
      res.cookie('userSession', "yes", { httpOnly: true });
      res.status(201).json({ msg: "Signup successful.", user: user });
  
    } catch (error) {
      // Handle errors if createUser function fails
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Unable to create user' });
    }
  });

// Handle user registration
router.post('/logout', async (req, res) => {
    try {
        console.log("logout");
        // delete session object
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                console.log("success");
            }
        });
    } catch (error) {
        console.error('Error logging out user:', error);
        res.status(500).json({ error: 'Unable to logout' });
    }
});  

module.exports = router;
