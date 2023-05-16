const express = require("express");
const router = express.Router();
const authContorller = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", authContorller.register);
router.post("/login", authContorller.login);
router.post("/user", authMiddleware.checkAuth, authContorller.getUser);


module.exports = router;
