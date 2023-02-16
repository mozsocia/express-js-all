const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/google', (req, res) => {
  const url = authController.getGoogleAuthUrl();
  res.redirect(url);
});

router.get('/google/callback', async (req, res) => {
  const { code } = req.query;
  const accessToken = await authController.getGoogleAccessToken(code);
  const user = await authController.getGoogleUser(accessToken);

  // save user to database or perform other actions with user data

  res.json({ success: true, data : user });
});

module.exports = router;
