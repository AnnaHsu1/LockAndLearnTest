const mongoose = require('mongoose');
const collectionName = 'Reports';

// Define the schema for the subcategory document
const reportsSchema = new mongoose.Schema({
  idOfWp: {
    type: String,
    required: true
  },
  timeOfReport: {
    type: String,
    required: true
  },
  idOfReporter: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true
  }
});

// Create the "Reports" model using the schema
const Reports = mongoose.model('Reports', reportsSchema, collectionName);

module.exports = Reports;
