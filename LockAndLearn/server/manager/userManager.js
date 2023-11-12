const User = require('../schema/userSchema.js');

// Function to create a user within DB
exports.createUser = async function createUser(fdata) {
  try {
    // Extract the relevant data from fdata
    const { FirstName, LastName, isParent, Email, passwordHash, DOB } = fdata;

    const newUser = new User({
      firstName: FirstName,
      lastName: LastName,
      isParent: isParent,
      email: Email,
      password: passwordHash,
      birthDate: DOB, // Need to Convert DOB to a Date object
    });

    // Save the user to the database
    await newUser.save();

    return newUser;
  } catch (error) {
    // Log the error and throw an exception
    console.error('Error creating user:', error);

    throw error;
  }
};

// Function to find a user by email and password for login
exports.findUserByEmailAndPassword = async function findUserByEmailAndPassword(email, password) {
  try {
    // Find the user in the database by email and password
    const user = await User.findOne({ email: email, password: password });

    // If user is found, return the user object; otherwise, return null
    return user;
  } catch (error) {
    // Log the error and throw an exception
    console.error('Error finding user:', error);
    throw error;
  }
};

// Function to find a user by email and password for login
exports.getUserByEmail = async function getUserByEmail(email) {
  try {
    // Find the user in the database by email and password
    const user = await User.findOne({ email: email });

    // If user is found, return the user object; otherwise, return null
    return user;
  } catch (error) {
    // Log the error and throw an exception
    console.error('Error finding user:', error);
    throw error;
  }
};
