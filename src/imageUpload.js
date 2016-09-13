const express = require('express');
const router = express.Router();

const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now() + '.png');
  }
})
const upload = multer({ storage: storage });
const imageUpload = upload.fields([{name: 'image', maxCount: 1}]);


router.post('/', imageUpload, function(req, res) {
  console.log(req.body);
  console.log(req.files);
})

module.exports = router;