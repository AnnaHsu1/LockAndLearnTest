const mongoose = require('mongoose');
const collectionName = 'WorkPackages';

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
      required: true
  },
});

// use the commented out code below if want to add subcategories/tags to the work package
const workPackageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  workPackageId: {
    type: String,
    required: false,
  },
  // materials: {
  //   type: [String],
  //   default: [],
  //   required: false,
  // },
  // quizzes: {
  //   type: [String],
  //   default: [],
  //   required: false,
  // },
  // tags: {
  //   type: [String],
  //   default: [],
  //   required: false,
  // },
  grade: {
    type: String,
    required: false,
  },
  // subcategory: {
  //   type: String,
  //   required: false,
  // },
  instructorID: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false
  },
  price: {
    type: Number,
    required: false
  }
});

const WorkPackage = mongoose.model('WorkPackages', workPackageSchema, collectionName);
module.exports = WorkPackage;
