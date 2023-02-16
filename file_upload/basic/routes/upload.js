const express = require("express");
const multer = require("multer");
const router = express.Router();

// const upload = multer({ dest: "public/uploads" })

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});


const upload = multer({ storage: storage });



router.post("/", upload.single("file"), (req, res) => {
  res.send(req.file);
});

router.post("/multi", upload.array("files"), (req, res, next) => {
  const files = req.files;
  if (!files) {
    const error = new Error("Please choose files");
    error.httpStatusCode = 400;
    return next(error);
  }

  res.send(files);
});

module.exports = router;
