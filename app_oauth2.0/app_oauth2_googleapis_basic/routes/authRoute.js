const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/google', (req, res) => {
  const url = authController.getGoogleAuthUrl();
  console.log(url)
  res.redirect(url);
});

router.get('/google/callback', async (req, res) => {
  const { code } = req.query;
  const user = await authController.getGoogleUser(code);

  // save user to database or perform other actions with user data

  res.json({ success: true, data: user });
});

module.exports = router;
