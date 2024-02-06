const mongoose = require('mongoose');
const collectionName = 'ChildQuizResults';

const childQuizResultsSchema = new mongoose.Schema({
  // Define the schema for child's quiz results information
  childID: {
    type: String,
    required: true,
  },
  quizID: {
    type: String,
    required: true,
  },
  packageID: { // needed to get wpID (to get subject passing grade)
    type: String,
    default: [],
  },
  childAnswers: {
    type: Array,
    default: [],
  },
  score: { // Grade
    type: Array,
    default: [],
  },
  hasPassed: {
    type: Array,
    default: Boolean,
  },
  Date: {
    type: Date,
    default: Date.now
  },
});

const ChildQuizResults = mongoose.model('ChildQuizResults', childQuizResultsSchema, collectionName); // Where the item will be stored in the database
// Export the ChildQuizResults model
module.exports = ChildQuizResults;
