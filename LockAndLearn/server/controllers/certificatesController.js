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
    const status = req.body.status;
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
        metadata: { userId, filename: certificate.originalname, status, fullName, highestDegree },
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

// get all pending uploaded certificates
router.get('/uploadCertificates/pending', async (req, res) => {
  const conn = mongoose.connection;
  const bucket = new GridFSBucket(conn.db, { bucketName: 'UploadCertificates' });
  const uploadedPendingCertificates = await bucket.find({ 'metadata.status': 'pending' }).toArray();
  res.status(201).json({ uploadedPendingCertificates });
});

// get uploaded certificate to download by fileName
router.get('/uploadCertificates/:filename', async (req, res) => {
  const requestFileName = req.params.filename;
  const conn = mongoose.connection;
  const bucket = new GridFSBucket(conn.db, { bucketName: 'UploadCertificates' });
  const downloadStream = bucket.openDownloadStreamByName(requestFileName);
  downloadStream.pipe(res);
});

// accept all user certificates
router.put('/acceptUserCertificates/:userId', async (req, res) => {
  const requestUserId = req.params.userId;
  const conn = mongoose.connection;
  //const bucket = new GridFSBucket(conn.db, { bucketName: 'UploadCertificates' });
  const updateStatus = await conn.db
    .collection('UploadCertificates.files')
    .updateMany({ 'metadata.userId': requestUserId }, { $set: { 'metadata.status': 'accepted' } });
  res.status(200).json({ message: 'STATUS UPDATED' });
});

// reject certificate by its ID
router.put('/rejectCertificate/:id', async (req, res) => {
  const requestFileId = req.params.id;
  console.log('BE ' + requestFileId);
  const conn = mongoose.connection;
  const bucket = new GridFSBucket(conn.db, { bucketName: 'UploadCertificates' });
  const file = await bucket.find({ _id: new mongoose.Types.ObjectId(requestFileId) }).toArray();
  if (file.length === 0) {
    return res.status(201).json({ message: 'File not found' });
  }
  const updateStatus = await conn.db
    .collection('UploadCertificates.files')
    .updateOne(
      { _id: new mongoose.Types.ObjectId(requestFileId) },
      { $set: { 'metadata.status': 'rejected' } }
    );
  res.status(200).json({ message: 'REJECTED STATUS UPDATED' });
});

// delete certificate from database
router.delete('/deleteCertificate/:id', (req, res) => {
  console.log('CERTIFICATE BE: ' + req.params.id);
  const bucket = new GridFSBucket(conn.db, { bucketName: 'UploadCertificates' });
  bucket.delete(new mongoose.Types.ObjectId(req.params.id), (err, data) => {
    if (err) return res.status(404).json({ err: err.message });
  });
});

// get at least one accepted status of user
router.get('/getCertificatesStatus/:userId', async (req, res) => {
  const requestUserId = req.params.userId;
  const conn = mongoose.connection;
  const bucket = new GridFSBucket(conn.db, { bucketName: 'UploadCertificates' });
  const uploadedCertificates = await bucket
    .find({ 'metadata.userId': requestUserId, 'metadata.status': 'accepted' })
    .toArray();
  const firstCertificate = uploadedCertificates[0];
  res.status(201).json({ firstCertificate });
});

module.exports = router;
