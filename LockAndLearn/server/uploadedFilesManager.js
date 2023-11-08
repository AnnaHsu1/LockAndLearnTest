const UploadFiles = require("./uploadedFilesSchema"); // Import the uploadFile model from uploadedFilesSchema.js
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// Function to create a uploadedFiles within DB
exports.createUploadedFiles = async function createUploadedFiles(filesData) {
  const savedFiles = [];
  if (!Array.isArray(filesData)) {
    filesData = [filesData];
  };
  for (const file of filesData) {
    const newUploadedFiles = new UploadFiles({
      file: file,
      userId: new ObjectId("6539daeb8a162cdc7490796f") //to be changed, once userId is available
    });
    try {
      // console.log("Send to db:", newUploadedFiles.file.buffer);
      const savedFile = await newUploadedFiles.save();
      // console.log("Saved to db:", savedFile);
      savedFiles.push(savedFile);
    } catch (err) {
      console.log(err);
    }
  };
  return savedFiles;
};

// Function to get uploaded files
exports.getUploadedFiles = async function getUploadedFiles() {
  try {
      // Find all the files in the db
      const uploadedFiles = await UploadFiles.find();

      // If the files are found, return the file objects; otherwise, return null
      // console.log("3"+JSON.stringify(uploadedFiles.files[0]));
      return uploadedFiles
  } catch (error) {
      // Log the error and throw an exception
      console.error("Error finding file:", error);
      throw error;
  }
};

// Function to get file object containing buffer
exports.getRequestedUploadedFile = async function getRequestedUploadedFile(fileName) {
  try {
    // Find the file in the db
    const file = await UploadFiles.findOne({"file.originalname": fileName});

    // If the file is found, return the file object; otherwise, return null
    if (file) {
      return file.file;
    } else {
      return null;
    }
  } catch (error) {
    // Log the error and throw an exception
    console.error("Error finding file:", error);
    throw error;
  }
};

// Function to delete uploaded file
exports.deleteUploadedFiles = async function deleteUploadedFiles(fileid) {
  try {
      // Find all the files in the db
      const fileId = fileid;
      await UploadFiles.findOneAndRemove({_id: fileId});
      

      // If the files are found, return the file objects; otherwise, return null
      // console.log("3"+JSON.stringify(uploadedFiles.files[0]));
      return
  } catch (error) {
      // Log the error and throw an exception
      console.error("Error finding file:", error);
      throw error;
  }
};