// RENAME TO WORK PACKAGE SCHEMA
const mongoose = require('mongoose');
const collectionName = 'WorkPackage';

const WorkPackage = mongoose.model('WorkPackage', new mongoose.Schema({
    name: {
        type: String,
        required: false,
    },
    grade: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false
    },
    price: {
        type: String,
        required: false
    },
    packageCount: {
        type: Number,
        required: false
    },
    instructorID: {
        type: String,
        required: true,
    },
}), collectionName);

module.exports = WorkPackage;