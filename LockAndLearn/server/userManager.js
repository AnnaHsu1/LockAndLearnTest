const User = require('./userSchema.js'); // Import the User model from UserSchema.js

// Function to create a user within DB
exports.createUser = async function createUser(fdata) {
  try {
    // Extract the relevant data from fdata
    const { FirstName, LastName, Email, Password, DOB } = fdata;

    // Create a new User instance with the extracted user data
    const newUser = new User({
      firstName: FirstName,
      lastName: LastName,
      email: Email,
      password: Password,
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
