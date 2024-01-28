const mongoose = require('mongoose');
const collectionName = 'UploadFiles';

//Basic uploadedFilesSchema for file
const uploadedFilesSchema = new mongoose.Schema({
  file: {
    type: Object,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
  },
});

const UploadFiles = mongoose.model('UploadFiles', uploadedFilesSchema, collectionName); // Where the item will be stored in the database
module.exports = UploadFiles; // Export the UploadFiles model