const express = require('express');
const { parseISO, isBefore, differenceInYears, startOfDay } = require('date-fns');
const bcrypt = require('bcrypt');
const User = require('../schema/userSchema.js');
const { createUser, getUserByEmail } = require('../manager/userManager.js');
const router = express.Router();

//Handle user sign in
router.post('/login', async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;

    //validate

    if ((!email, !password)) {
      return res.status(400).json({ msg: 'All fields must be filled.' });
    }

    // Call the getUserByEmail function, and return the user object if found
    const user = await getUserByEmail(email);

    // If the email doesn't exist
    if (!user) {
      return res.status(400).json({ msg: 'Account with that email does not exist.' });
    }

    // Password check with the input using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials.' });
    }

    const sessionUser = {
      id: user._id,
      email: user.email,
    };

    req.session.user = sessionUser;
    req.session.sessionID = user._id.toString();

    res.cookie('userSession', req.session.sessionID, { httpOnly: true });
    res.status(201).json({ msg: 'Login successful.', user: user });
  } catch (error) {
    console.error('Error logging user:', error);
    res.status(500).json({ msg: 'Unexpected error.' });
  }
});

// Handle user registration
router.post('/signup', async (req, res) => {
  try {
    // Extract user data from the request body
    console.log(req.body);
    const { FirstName, LastName, Email, isParent, Password, CPassword, DOB } = req.body;

    // Input validations
    if (!FirstName || !LastName || !Email || !Password || !CPassword || !DOB || !isParent) {
      return res.status(400).json({ msg: 'All fields must be filled.' });
      }

    // Validate FirstName and LastName with regular expressions
    const nameRegex = /^[a-zA-Z]+$/;
    if (!nameRegex.test(FirstName) || !nameRegex.test(LastName)) {
        return res.status(400).json({ msg: 'First and Last names can only contain letters.' });
    }
    if (!(Email.includes('@') && Email.includes('.'))) {
      return res.status(400).json({ msg: 'Invalid email format.' });
    }

    const emailCheck = await getUserByEmail(Email);
    if (emailCheck) {
      return res.status(400).json({ msg: 'Email is already in use.' });
    }

    if (Password.length < 6) {
      return res.status(400).json({ msg: 'Password must be at least 6 characters long.' });
    }

    if (Password !== CPassword) {
      return res.status(400).json({ msg: 'Passwords must match.' });
      }
      const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!DOB || !dobRegex.test(DOB)) {
          return res.status(400).json({ msg: 'Invalid date format. Please use YYYY-MM-DD.' });
      }


      // Attempt to parse the date of birth
      let dob;
      try {
          dob = parseISO(DOB);
      } catch (error) {
          return res.status(400).json({ msg: 'Invalid date. Please provide a valid date in the format YYYY-MM-DD.' });
      }

      // Parse the current date
      const currentDate = new Date();

      // Check if the date of birth is a day before the current day
      const isBeforeCurrentDay = isBefore(dob, startOfDay(currentDate));

      if (!isBeforeCurrentDay) {
          return res.status(400).json({ msg: 'Invalid date of birth. It should be a day before the current day.' });
      }

      // Check if the user is older than 18
      const isOlderThan18 = differenceInYears(currentDate, dob) >= 18;

      if (!isOlderThan18) {
          return res.status(400).json({ msg: 'You must be at least 18 years old to register.' });
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
      isParent,
      passwordHash,
      DOB,
    });

    res.status(201).json({ message: 'Successfully created user', user: user });
  } catch (error) {
    // Handle errors if createUser function fails
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Unable to create user' });
  }
});

// Handle user logout
router.post('/logout', async (req, res) => {
  try {
    // Delete session from the DB // DOESN'T WORK
    req.session.destroy();

    // Clear the user's cookie
    res.clearCookie('userSession', { httpOnly: true });

    res.status(201).json({ msg: 'Logout successful.' });
  } catch (error) {
    console.error('Error logging out user:', error);
    res.status(500).json({ error: 'Unable to logout' });
  }
});

// Fetch all users
router.get('/allUsers', async (req, res) => {
  try {
    // Retrieve all users from the database
    const allUsers = await User.find();

    // Send a success response with the array of users
    res.status(200).json(allUsers);
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ error: 'An error occurred while fetching all users.' });
  }
});

router.post('/adminCheckPassword', async (req, res) => {
  try {
    const { password } = req.body;

    // Validate
    if (!password) {
      return res.status(400).json({ msg: 'Password is required.' });
    }

    // Call the getUserByEmail function for the admin user
    const adminUser = await getUserByEmail('admin@lockandlearn.ca');

    // If the admin user doesn't exist
    if (!adminUser) {
      return res.status(400).json({ msg: 'Admin account does not exist.' });
    }

    // Password check with the input using bcrypt
    const isMatch = await bcrypt.compare(password, adminUser.password);
    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid credentials.' });
    }

    const sessionUser = {
      id: adminUser._id,
      email: adminUser.email,
    };

    req.session.user = sessionUser;
    req.session.sessionID = adminUser._id.toString();

    res.cookie('userSession', req.session.sessionID, { httpOnly: true });
    res.status(201).json({ msg: 'Admin login successful.', user: adminUser });
  } catch (error) {
    console.error('Error logging admin:', error);
    res.status(500).json({ msg: 'Unexpected error.' });
  }
});

// Fetch user by ID
router.get('/getUser/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    // Retrieve user by ID from the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send a success response with the user data
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ error: 'An error occurred while fetching the user by ID.' });
  }
});

// Delete user by ID
router.delete('/deleteUser/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    // Retrieve and delete the user by ID from the database
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send a success response with the deleted user data
    res.status(200).json({ message: 'User deleted successfully', user: deletedUser });
  } catch (error) {
    console.error('Error deleting user by ID:', error);
    res.status(500).json({ error: 'An error occurred while deleting the user by ID.' });
  }
});



module.exports = router;
