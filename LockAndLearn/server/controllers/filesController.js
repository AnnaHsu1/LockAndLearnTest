var express = require("express");
var router = express.Router();
var multer = require("multer");
const Grid = require('gridfs-stream');
const { GridFsStorage } = require('multer-gridfs-storage');
const methodOverride = require('method-override');
const mongoose = require('../db');
const bodyParser = require('body-parser');
const app = express();
const { GridFSBucket } = require('mongodb');
const conn = mongoose.createConnection(process.env.DB_STRING);

app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

let gfs;

conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('UploadFiles'); //collection name in db  
});

const uploadFiles = multer(); 

// overwrite file(s) with userId
router.put('/overwriteFiles', uploadFiles.array('files', 'userId'), async (req, res) => {
  const files = req.files;
  const userId = req.body.userId;
  const descriptions = req.body.description;
  const conn = mongoose.connection;
  const bucket = new GridFSBucket(conn.db, { bucketName: 'UploadFiles' }); //bucketName = collection name in db
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const description = descriptions[i];
    const existingFile = await bucket.find({ "metadata.userId": userId, "filename": file.originalname }).toArray();
    if (existingFile.length > 0) {
      bucket.delete(existingFile[0]._id, (err, data) => {
        if (err) {
          console.log('Error deleting file:', err);
        }
      });
    }
    const uploadStream = bucket.openUploadStream(file.originalname, { metadata: { userId, description } });
    uploadStream.on('error', (error) => {
      console.log('Error uploading file:', error);
    });
    uploadStream.on('finish', () => {
      if (i === files.length - 1) {
        res.status(201).json({ message: "File(s) replaced successfully" });
      }
    });
    uploadStream.end(file.buffer);
  }
});

// store uploaded file(s) with userId
router.post('/uploadFiles', uploadFiles.array('files', 'userId'), async (req, res) => {
  const files = req.files;
  const userId = req.body.userId;
  let descriptions = req.body.description;
  // correct format of descriptions for one file: change description from string to array
  if (typeof descriptions === 'string') {
    descriptions = [descriptions];
  }
  const conn = mongoose.connection;
  const bucket = new GridFSBucket(conn.db, { bucketName: 'UploadFiles' }); //bucketName = collection name in db
  const duplicatedFiles = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const uploadedFiles = await bucket.find({ "metadata.userId": userId, "filename": file.originalname }).toArray();
    if (uploadedFiles.length > 0) {
      duplicatedFiles.push(file.originalname);
    }
  }
  if (duplicatedFiles.length > 0) {
    return res.status(201).json({ message: "File(s) already exists", duplicatedFiles });
  }
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const description = descriptions[i];
    const uploadStream = bucket.openUploadStream(file.originalname, { metadata: { userId, description } });
    uploadStream.on('error', (error) => {
      console.log('Error uploading file:', error);
    });
    uploadStream.on('finish', () => {
      if (i === files.length - 1) {
        res.status(201).json({ message: "File(s) uploaded successfully" });
      }
    });
    uploadStream.end(file.buffer);
  }
});

// get all uploaded files
router.get("/uploadFiles", async (req, res) => {
  const conn = mongoose.connection;
  const bucket = new GridFSBucket(conn.db, { bucketName: 'UploadFiles' }); //bucketName = collection name in db
  const uploadedFiles = await bucket.find().toArray();
  res.status(201).json({ uploadedFiles });
});

// delete uploaded file by fileId
router.delete('/deleteUploadFiles/:id', (req, res) => {
  const bucket = new GridFSBucket(conn.db, { bucketName: 'UploadFiles' }); //bucketName = collection name in db
  bucket.delete(new mongoose.Types.ObjectId(req.params.id), (err, data) => {
    if (err) return res.status(404).json({ err: err.message });
  });
  res.json({ success: true });
});

// get uploaded file to download by fileName
router.get('/uploadFiles/:filename', async (req, res) => {
  const requestFileName = req.params.filename;
  const conn = mongoose.connection;
  const bucket = new GridFSBucket(conn.db, { bucketName: 'UploadFiles' }); //bucketName = collection name in db
  const downloadStream = bucket.openDownloadStreamByName(requestFileName);
  downloadStream.pipe(res);
});

// get uploaded file to download by fileId
router.get('/uploadFilesById/:id', async (req, res) => {
  const requestFileId = req.params.id;
  const conn = mongoose.connection;
  const bucket = new GridFSBucket(conn.db, { bucketName: 'UploadFiles' }); //bucketName = collection name in db
  const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(requestFileId));
  downloadStream.pipe(res);
});

// get uploaded file by userId
router.get('/specificUploadFiles/:userId', async (req, res) => {
  const requestUserId = req.params.userId;
  const conn = mongoose.connection;
  const bucket = new GridFSBucket(conn.db, { bucketName: 'UploadFiles' }); //bucketName = collection name in db
  const uploadedFiles = await bucket.find({ "metadata.userId": requestUserId }).toArray();
  res.status(201).json({ uploadedFiles });
});

// get fileName by fileId
router.get('/filesName/:id', async (req, res) => {
  const requestFileId = req.params.id;
  const conn = mongoose.connection;
  const bucket = new GridFSBucket(conn.db, { bucketName: 'UploadFiles' }); //bucketName = collection name in db
  const file = await bucket.find({ "_id": new mongoose.Types.ObjectId(requestFileId) }).toArray();
  if (file.length === 0) {
    return res.status(201).json({ message: "File not found" });
  }
  const fileName = file[0].filename;
  const fileDescription = file[0].metadata.description;
  res.status(201).json({ fileName, fileDescription });
})

// get all uploaded files
router.get("/allFiles", async (req, res) => {
  try {
    const conn = mongoose.connection;
    const bucket = new GridFSBucket(conn.db, { bucketName: 'UploadFiles' });
    const allFiles = await bucket.find().toArray();
    res.status(200).json({ allFiles });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get file by its ID
router.get("/file/:id", async (req, res) => {
  try {
    const fileId = req.params.id;
    const conn = mongoose.connection;
    const bucket = new GridFSBucket(conn.db, { bucketName: 'UploadFiles' });
    const file = await bucket.find({ "_id": new mongoose.Types.ObjectId(fileId) }).toArray();

    if (file.length === 0) {
      return res.status(404).json({ message: "File not found" });
    }

    const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));
    downloadStream.pipe(res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;