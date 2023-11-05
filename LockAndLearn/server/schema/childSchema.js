const mongoose = require('mongoose');
const collectionName = 'Child';

const childSchema = new mongoose.Schema({
  // Define the schema for child information
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  grade: {
    type: String,
    required: true,
  },
  parentId: {
    type: String,
    required: true,
  },
});

const Child = mongoose.model('Child', childSchema, collectionName); // Where the item will be stored in the database
// Export the User model
module.exports = Child;