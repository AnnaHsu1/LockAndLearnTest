var express = require('express');
var router = express.Router();
var multer = require('multer');
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
  gfs.collection('UploadCertificates'); //collection name in db
});

// Create storage engine, needed for bucket creation
// const storage = new GridFsStorage({
//   url: 'mongodb+srv://LockAdmin1:8B9oXdKh2MrdFZIs@lockdb.ivi3cnu.mongodb.net/LockNLearn?retryWrites=true&w=majority', // Specify your MongoDB connection string and database name
//   options: { useNewUrlParser: true, useUnifiedTopology: true },
//   file: (req, file) => {
//     return {
//       filename: file.originalname,
//       bucketName: 'UploadCertificates', // Specify the bucket/collection name
//       metadata: {
//         userId: req.body.userId,
//         fullName: req.body.fullName,
//         highestDegree: req.body.highestDegree
//       },
//     };
//   },
// });

// Needed for bucket creation
// const uploadCertificates = multer({ storage });

const uploadCertificates = multer();

//overwrites existing certificate in db
router.put(
  '/overwriteCertificates',
  uploadCertificates.array('certificates', 'userId'),
  async (req, res) => {
    const certificates = req.files;
    const userId = req.body.userId;
    const fullName = req.body.fullName;
    const highestDegree = req.body.highestDegree;
    const conn = mongoose.connection;
    const bucket = new GridFSBucket(conn.db, { bucketName: 'UploadCertificates' });
    for (let i = 0; i < certificates.length; i++) {
      const certificate = certificates[i];
      const existingCertificate = await bucket
        .find({ 'metadata.userId': userId, 'metadata.filename': certificate.originalname })
        .toArray();
      if (existingCertificate.length > 0) {
        bucket.delete(existingCertificate[0]._id, (err, data) => {
          if (err) {
            console.log('Error deleting certificate:', err);
          }
        });
      }
      const uploadStream = bucket.openUploadStream(certificate.originalname, {
        metadata: { userId, filename: certificate.originalname, fullName, highestDegree },
      });
      uploadStream.on('error', (error) => {
        console.log('Error uploading certificate:', error);
      });
      uploadStream.on('finish', () => {
        if (i === certificates.length - 1) {
          res.status(201).json({ message: 'Certificate replaced successfully' });
        }
      });
      uploadStream.end(certificate.buffer);
    }
  }
);

// store uploaded certificate with userId
router.post(
  '/uploadCertificates',
  uploadCertificates.array('certificates', 'userId'),
  async (req, res) => {
    const certificates = req.files;
    const userId = req.body.userId;
    const fullName = req.body.fullName;
    const highestDegree = req.body.highestDegree;
    const conn = mongoose.connection;
    const bucket = new GridFSBucket(conn.db, { bucketName: 'UploadCertificates' });
    const duplicatedCertificates = [];
    for (let i = 0; i < certificates.length; i++) {
      const certificate = certificates[i];
      const uploadCertificates = await bucket
        .find({ 'metadata.userId': userId, 'metadata.filename': certificate.originalname })
        .toArray();
      if (uploadCertificates.length > 0) {
        duplicatedCertificates.push(certificate.originalname);
      }
    }
    if (duplicatedCertificates.length > 0) {
      return res
        .status(201)
        .json({ message: 'Certificate already exists', duplicatedCertificates });
    }
    for (let i = 0; i < certificates.length; i++) {
      const certificate = certificates[i];
      const uploadStream = bucket.openUploadStream(certificate.originalname, {
        metadata: { userId, filename: certificate.originalname, fullName, highestDegree  },
      });
      uploadStream.on('error', (error) => {
        console.log('Error uploading certificate:', error);
      });
      uploadStream.on('finish', () => {
        if (i === certificates.length - 1) {
          res.status(201).json({ message: 'Certificate uploaded successfully' });
        }
      });
      uploadStream.end(certificate.buffer);
    }
  }
);

// get all uploaded certificates
router.get('/uploadCertificates', async (req, res) => {
  const conn = mongoose.connection;
  const bucket = new GridFSBucket(conn.db, { bucketName: 'UploadCertificates' });
  const uploadedCertificates = await bucket.find().toArray();
  res.status(201).json({ uploadedCertificates });
});

module.exports = router;
