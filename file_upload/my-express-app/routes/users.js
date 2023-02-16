const express = require("express");
const router = express.Router();
const multer = require("multer");
const User = require("../models/User");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post("/", upload.single("profilePicture"), async (req, res, next) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    profilePicturePath: req.file.path,
    profilePictureName: req.file.originalname
  });
  try {
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
