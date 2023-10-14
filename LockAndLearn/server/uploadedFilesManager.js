const UploadFiles = require("./uploadedFilesSchema"); // Import the uploadFile model from uploadedFilesSchema.js

// Function to create a uploadedFiles within DB
exports.createUploadedFiles = async function createUploadedFiles(fdata) {
  try {
    // Extract the relevant data from fdata
    const filesData = fdata;
    console.log("fdata: ", filesData);
    // Create a new UploadedFiles instance with the extracted files data
    const newUploadedFiles = new UploadFiles({
      files: filesData
    });

    // Save the UploadedFiles to the database
    await newUploadedFiles.save();

    console.log("Send to db:", newUploadedFiles);
    return newUploadedFiles;
  } catch (error) {
    // Log the error and throw an exception
    console.error("Error adding files:", error);

    throw error;
  }
};
