const mongoose = require('mongoose');
const collectionName = 'User';
const Child = require('./childSchema.js')

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
  isParent: {
        type: Boolean,
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
  },
}, {
    discriminatorKey: 'role',
});


const parentSchema = new mongoose.Schema({
    // Fields for parent information
    // ...
    children: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Child', // Reference to the Child model
    }],
});

const teacherSchema = new mongoose.Schema({
    // Fields for teacher information
    // ...
});

// Create models for parent and teacher using discriminators
const Parent = mongoose.model('Parent', parentSchema, collectionName);
const Teacher = mongoose.model('Teacher', teacherSchema, collectionName);

const User = mongoose.model('User', UserSchema, collectionName); // Where the item will be stored in the database
 // Export the User model
module.exports = User, Parent, Teacher;