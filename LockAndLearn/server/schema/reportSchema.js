const mongoose = require('mongoose');
const collectionName = 'Reports';

// Define the schema for the subcategory document
const reportsSchema = new mongoose.Schema({
    
  });
  
  // Create the "Subcategory" model using the schema
  const Reports = mongoose.model('Reports', reportsSchema, collectionName);
  
  module.exports = Reports;