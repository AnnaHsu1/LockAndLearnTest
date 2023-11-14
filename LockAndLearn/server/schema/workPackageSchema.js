const mongoose = require('mongoose');
const collectionName = 'WorkPackages';

const workPackageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  workPackageId: {
    type: String,
    required: false,
  },
  materials: {
    type: [String],
    default: [],
    required: false,
  },
  quizzes: {
    type: [String],
    default: [],
    required: false,
  },
  tags: {
    type: [String],
    default: [],
    required: false,
  },
  grade: {
    type: String,
    required: false,
  },
  subcategory: {
    type: String,
    required: false,
  },
  instructorID: {
    type: String,
    required: true,
  },
});

const WorkPackage = mongoose.model('WorkPackage', workPackageSchema, collectionName);
module.exports = WorkPackage;
