const mongoose = require('mongoose');
const collectionName = 'Timeframes';

const timeframeSchema = new mongoose.Schema({
    childId: {
        type: String,
        required: true,
    },
    day: {
        type: String,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
});

const Timeframes = mongoose.model('Timeframes', timeframeSchema, collectionName); // Where the item will be stored in the database
// Export the User model
module.exports = Timeframes;
