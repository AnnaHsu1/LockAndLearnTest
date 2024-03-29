const mongoose = require('mongoose');
const collectionName = 'UploadCertificates';

const uploadedCertificatesSchema = new mongoose.Schema({
  certificates: {
    type: Object,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  status: {
    type: String,
  },
});

const UploadCertificates = mongoose.model(
  'UploadCertificates',
  uploadedCertificatesSchema,
  collectionName
);
module.exports = UploadCertificates;
