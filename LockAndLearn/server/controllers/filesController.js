var express = require("express");
var router = express.Router();
var path = require("path");
var fs = require("fs");
var multer = require("multer");
const { 
  createUploadedFiles, 
  getUploadedFiles, 
  deleteUploadedFiles 
} = require("../uploadedFilesManager");

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

router.post("/uploadFiles", upload.array("files"), async (req, res) => {
  const uploadedFiles = await createUploadedFiles(req.files);
  res.status(201).json({ message: "Successfully uploaded files" });
});

router.get("/uploadFiles", async (req, res) => {
  const uploadedFiles = await getUploadedFiles();
  // console.log("2"+uploadedFiles);
  
  res.status(201).json({ uploadedFiles });
});

router.post("/uploadFiles/:id", async (req, res) => {
  // console.log(req.params.id)
  const uploadedFiles = await deleteUploadedFiles(req.params.id);
  // console.log("2"+uploadedFiles);
  
  res.status(201).json({ uploadedFiles });
});

router.get('/uploadFiles/:filename', async (req, res) => {
  const requestFileName = req.params.filename;
  const uploadedFiles = await getUploadedFiles();
  
  uploadedFiles.forEach((file) => {
      if(file.file.originalname === requestFileName) {
        // console.log("find file: ",file.file.originalname)
        const filePath = path.join(__dirname, '../uploads/', file.file.filename); //find file from uploads folder (to be changed to find file from db)
        res.sendFile(filePath);
        // res.status(201).json({ message: 'Successfully downloaded file' });
      }
    
  })
})

module.exports = router;