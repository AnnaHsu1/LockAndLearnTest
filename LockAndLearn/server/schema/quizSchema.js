const mongoose = require('mongoose');
const collectionName = 'Quizzes';

// Define the schema for the quiz document
const quizSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  workPackageId: {
    type: String, // You may choose the appropriate data type (e.g., ObjectId) depending on your setup
    required: false,
  },
  userId: {
    type: String, // You may choose the appropriate data type (e.g., ObjectId) for the user ID
    required: false,
  },
  questions: [
    {
      _id: {
        type: String, // You may choose the appropriate data type (e.g., ObjectId) for question _id
      },
      workPackageId: {
        type: String, // You may choose the appropriate data type (e.g., ObjectId) for workPackageId
      },
      questionType: {
        type: String, // Type of the question (e.g., MCQ, SA, FIB, TF)
        required: false,
      },
      questionText: {
        type: String, // The actual question text
        required: false,
      },
      answer: {
        type: String, // The answer to the question
      },
      options: {
        type: [String], // An array of options for multiple-choice questions
        required: false,
      },
      inputs:{
        type: [String],
        required: false,
      }
      // Other question-specific fields
    },
  ],
  // Other quiz-specific fields
});

// Create the "Quiz" model using the schema
const Quiz = mongoose.model('Quiz', quizSchema, collectionName);

module.exports = Quiz;
