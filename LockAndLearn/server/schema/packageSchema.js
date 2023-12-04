const mongoose = require('mongoose');
const collectionName = 'Packages';

const packageSchema = new mongoose.Schema({
  workPackageID: {
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
  description: {
    type: String,
    required: false
  },
  materials: {
    type: Array,
    required: false
  },
  quizzes: {
    type: Array,
    required: false
  },
});

const Package = mongoose.model('Package', packageSchema, collectionName);
module.exports = Package;
