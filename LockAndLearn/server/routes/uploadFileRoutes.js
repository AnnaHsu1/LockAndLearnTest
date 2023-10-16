const express = require('express');
const router = express.Router();
const filesController = require("../controllers/filesController")

router.post('/uploadFiles', function(req,res){
  filesController.uploadFiles
});

// router.post('/uploadFiles', filesController.uploadFiles
  
// );

module.exports = router;