const mongoose = require("mongoose");
const collectionName = "UploadFiles";

//Basic User Schema for a user
const uploadedFilesSchema = new mongoose.Schema({
  files: {
    type: Array
  }
});

const UploadFiles = mongoose.model("UploadFiles", uploadedFilesSchema, collectionName); // Where the item will be stored in the database
module.exports = UploadFiles; // Export the UploadFiles model
