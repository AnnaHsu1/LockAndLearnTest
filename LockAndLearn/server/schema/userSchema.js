const mongoose = require('mongoose');
const collectionName = 'User';

const baseOptions = {
  discriminatorKey: 'role', // our discriminator key
  collection: collectionName,
};

//Basic User Schema for a user
const User = mongoose.model(
  'User',
  new mongoose.Schema(
    {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      isParent: {
        type: Boolean,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      birthDate: {
        type: String,
        required: true,
      },
      purchasedWorkPackages: {
        type: [mongoose.Schema.Types.ObjectId], // Array of WorkPackage IDs
        default: [], // Initialize as an empty array by default
      },
      CartWorkPackages: {
        type: [mongoose.Schema.Types.ObjectId], // Array of WorkPackage IDs
        default: [], // Initialize as an empty array by default
      },
      parentalAccessPIN: {
        type: String,
        required: false,
      },
    },
    baseOptions
  )
);

// Export the User model
module.exports = User;
