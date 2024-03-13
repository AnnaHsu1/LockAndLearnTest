const mongoose = require('mongoose');
const collectionName = 'ContactUs';

// Define the schema for the subcategory document
const reportsSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    userID: {
        type: String,
        required: true
    },
});

// Create the "Reports" model using the schema
const Reports = mongoose.model('ContactUs', reportsSchema, collectionName);

module.exports = Reports;