const axios = require('axios');
const qs = require('querystring');
require('dotenv').config()

exports.getGoogleAuthUrl = () => {
  const params = {
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: 'http://localhost:3000/auth/google/callback',
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/userinfo.email'
  };

  const url = `https://accounts.google.com/o/oauth2/v2/auth?${qs.stringify(params)}`;

  return url;
};

exports.getGoogleAccessToken = async (code) => {
  const params = {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: 'http://localhost:3000/auth/google/callback',
    grant_type: 'authorization_code'
  };

  const url = `https://oauth2.googleapis.com/token`;

  const response = await axios.post(url, qs.stringify(params), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  return response.data.access_token;
};

exports.getGoogleUser = async (accessToken) => {
  const url = `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`;

  const response = await axios.get(url);

  return response.data;
};
