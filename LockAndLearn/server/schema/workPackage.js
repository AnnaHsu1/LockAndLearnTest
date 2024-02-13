// RENAME TO WORK PACKAGE SCHEMA
const mongoose = require('mongoose');
const collectionName = 'WorkPackage';

const ratingsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    stars: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: false
    },
});

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
    ratings : {
        type: [ratingsSchema],
        default: [],
    },
    deletedByTutor: {
        type: Boolean,
    },
    stripePurchaseId: {
        type: [String],
        default: [],
        required: true,
    }, //Unique purchase ID from Stripe
    isPublished: {
        type: Boolean,
        default: false,
        required: false,
    },
    profit: {
        type: Number,
        default: 0,
    },

}), collectionName);

module.exports = WorkPackage;