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
