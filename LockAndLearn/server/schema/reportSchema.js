const mongoose = require('mongoose');
const collectionName = 'Reports';

// Define the schema for the subcategory document
const reportsSchema = new mongoose.Schema({
  idOfWp: {
    type: String,
    required: false
  },
  timeOfReport: {
    type: String,
    required: false
  },
  reporterId: {
    type: String,
    required: false
  },
  reason: {
    type: String,
    required: false
  }
});

// Create the "Reports" model using the schema
const Reports = mongoose.model('Reports', reportsSchema, collectionName);

module.exports = Reports;
