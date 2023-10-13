const mongoose = require("mongoose");
const collectionName = "User";

//Basic User Schema for a user
const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
      required: true,
    unique:true
  },
  password: {
    type: String,
    required: true,
  },
  birthDate: {
    type: String,
    required: true,
  }
});

const User = mongoose.model('User', UserSchema, collectionName); // Where the item will be stored in the database
module.exports = User; // Export the User model


