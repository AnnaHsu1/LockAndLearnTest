const mongoose = require('mongoose');
const collectionName = 'Subcategories';

// Define the schema for the subcategory document
const subcategoriesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  grades: {
    // Grade array
    1: {
      // Subarray for grade 1
      type: [String],
      default: [],
    },
    2: {
      // Subarray for grade 2
      type: [String],
      default: [],
    },
    3: {
      // Subarray for grade 3
      type: [String],
      default: [],
    },
    4: {
      // Subarray for grade 4
      type: [String],
      default: [],
    },
    5: {
      // Subarray for grade 5
      type: [String],
      default: [],
    },
    6: {
      // Subarray for grade 6
      type: [String],
      default: [],
    },
    7: {
      // Subarray for grade 7
      type: [String],
      default: [],
    },
    8: {
      // Subarray for grade 8
      type: [String],
      default: [],
    },
    9: {
      // Subarray for grade 9
      type: [String],
      default: [],
    },
    10: {
      // Subarray for grade 10
      type: [String],
      default: [],
    },
    11: {
      // Subarray for grade 11
      type: [String],
      default: [],
    },
    12: {
      // Subarray for grade 12
      type: [String],
      default: [],
    },
  },
});

// Create the "Subcategory" model using the schema
const Subcategories = mongoose.model('Subcategories', subcategoriesSchema, collectionName);

module.exports = Subcategories;
