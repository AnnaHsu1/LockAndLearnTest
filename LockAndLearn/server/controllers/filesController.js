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

var storage = new GridFsStorage({
  url: process.env.DB_STRING,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const fileInfo = {
        filename: file.originalname,
        bucketName: 'UploadFiles', //collection name in db
        metadata: {
          userId: req.body.userId,
        },
        id: new mongoose.Types.ObjectId(),
      };
      resolve(fileInfo);
    });
  }
});

const uploadFiles = multer({ storage })

// store uploaded file(s) with userId
router.post('/uploadFiles', uploadFiles.array('files', 'userId'), async (req, res) => {
  res.status(200).json({ message: "Successfully uploaded files" });
});

// get all uploaded files
router.get("/uploadFiles", async (req, res) => {
  const conn = mongoose.connection;
  const bucket = new GridFSBucket(conn.db, { bucketName: 'UploadFiles' }); //bucketName = collection name in db
  const uploadedFiles = await bucket.find().toArray();
  res.status(201).json({ uploadedFiles });
});

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
  res.status(201).json({ fileName });
})

module.exports = router;