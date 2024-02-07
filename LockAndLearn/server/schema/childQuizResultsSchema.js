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
  childAnswers: {
    type: Array,
    default: [],
  },
  score: { // Grade
    type: Array,
    default: [],
  },
  status: {
    type: String,
  },
  Date: {
    type: Date,
    default: Date.now
  },
  packageID: {
    type: String,
  },
});

const ChildQuizResults = mongoose.model('ChildQuizResults', childQuizResultsSchema, collectionName); // Where the item will be stored in the database
// Export the ChildQuizResults model
module.exports = ChildQuizResults;
