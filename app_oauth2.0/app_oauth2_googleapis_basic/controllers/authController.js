const { google } = require('googleapis');
require('dotenv').config()

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000/auth/google/callback';



const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

exports.getGoogleAuthUrl = () => {
  const scopes = ['https://www.googleapis.com/auth/userinfo.email'];

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes
  });

  return url;
};

exports.getGoogleUser = async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  console.log(tokens)
  oauth2Client.setCredentials(tokens);

  const oauth2 = google.oauth2({
    auth: oauth2Client,
    version: 'v2'
  });

  const { data } = await oauth2.userinfo.get();
  return data;
};
