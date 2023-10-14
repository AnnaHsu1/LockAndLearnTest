// const express = require('express');
//import EditUploadScreen from '../uploads';
// const multer = require('multer');
// const fs = require('fs');
// const path = require('path');
// const router = express.Router();

// // Configure multer storage and file name
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'LockAndLearn/server/uploads');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });

// const upload = multer({ storage: storage });

// router.post('/uploadFiles', upload.single('files') ,function (req, res, next) {
//   console.log(req.files);
// });

// //router.post('/uploadFiles', upload.array("files"));

// // router.post('/uploadFiles', async (req, res) => {

// //   console.log("!!!!");
// //   try {
// //     // Use multer upload instance
// //     console.log("1111");
// //     upload.array('files');
// //     console.log("222");
// //     res.status(201).json({ message: "Successfully uploaded files" });
// //    } catch (error) {
// //       return res.status(400).json({ error: err.message });
// //     }

// //     // // Retrieve uploaded files
// //     // const files = req.files;
// //     // const errors = [];

// //     // // Validate file types and sizes
// //     // files.forEach((file) => {
// //     //   const allowedTypes = ['image/jpeg', 'image/png'];
// //     //   const maxSize = 5 * 1024 * 1024; // 5MB

// //     //   if (!allowedTypes.includes(file.mimetype)) {
// //     //     errors.push(`Invalid file type: ${file.originalname}`);
// //     //   }

// //     //   if (file.size > maxSize) {
// //     //     errors.push(`File too large: ${file.originalname}`);
// //     //   }
// //     // });

// //     // // Handle validation errors
// //     // if (errors.length > 0) {
// //     //   // Remove uploaded files
// //     //   files.forEach((file) => {
// //     //     fs.unlinkSync(file.path);
// //     //   });

// //     //   return res.status(400).json({ errors });
// //     // }

// //     // // Attach files to the request object
// //     // req.files = files;
// //   });

//   module.exports = router;

var express = require("express");
var router = express.Router();
var path = require("path");
var fs = require("fs");
var multer = require("multer");
const { createUploadedFiles } = require("../uploadedFilesManager");

//Configure multer storage and file name
const storage = multer.diskStorage({
  destination: "uploads/",
  // destination: (req, file, cb) => {
  //       cb(null, 'uploads/');
  //     },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage: storage });

router.post("/uploadFiles", upload.array("files"), async (req, res, next) => {
  const uploadedFiles = await createUploadedFiles(req.files);
  res.status(201).json({ message: "Successfully uploaded files" });
});

module.exports = router;
