const Child = require('./schema/childSchema.js'); // Import the User model from UserSchema.js

// Function to create a user within DB
exports.createChild = async function createChild(fdata) {
    try {
      // Extract the relevant data from fdata
      const { FirstName, LastName, Grade } = fdata;
  
      // Create a new User instance with the extracted user data
      const newChild = new Child({
        firstName: FirstName,
        lastName: LastName,
        grade: Grade,
      });
  
      // Save the user to the database
      await newChild.save();

  
      return newChild;
    } catch (error) {
        
      // Log the error and throw an exception
      console.error("Error creating user:", error);

      throw error;
    }
};