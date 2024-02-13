const mongoose = require('mongoose');
const collectionName = 'Child';

const childSchema = new mongoose.Schema({
  // Define the schema for child information
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  grade: {
    type: String,
    required: true,
  },
  passingGrade: {
    type: String,
    required: false,
  },
  subjectPassingGrades: {
    type: Array,
    default: [],
  },
  parentId: {
    type: String,
    required: true,
  },
  preferences: {
    type: Array,
    default: [],
  },
  assignedMaterials: {
    type: Array,
    default: [],
  },
  revealAnswers: {
    type: Boolean,
    default: false,
  },
  revealAnswersPassing: {
    type: Boolean,
    default: false,
  },
  revealExplanation: {
    type: Boolean,
    default: false,
  },
  revealExplanationPassing: {
    type: Boolean,
    default: false,
  },
});

const Child = mongoose.model('Child', childSchema, collectionName); // Where the item will be stored in the database
// Export the User model
module.exports = Child;
