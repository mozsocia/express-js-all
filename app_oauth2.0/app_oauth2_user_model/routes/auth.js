const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/user');

const oauth2Client = new google.auth.OAuth2(
  config.google.clientId,
  config.google.clientSecret,
  config.google.redirectUri
);

router.get('/google', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'email',
      'profile'
  ]
  });
  res.redirect(url);
});

router.get('/google/callback', async (req, res) => {
  const { tokens } = await oauth2Client.getToken(req.query.code);
  oauth2Client.setCredentials(tokens);

  const { data } = await google.oauth2('v2').userinfo.get({ auth: oauth2Client });
  const email = data.email;

  let user = await User.findOne({ email });
  if (!user) {
    user = new User({ email, name: data.name });
    await user.save();
  }

  const token = jwt.sign({ email: user.email },
     config.jwt.secret, 
     { expiresIn: config.jwt.expirationTime });
     
  res.json({ token });
});

module.exports = router;
