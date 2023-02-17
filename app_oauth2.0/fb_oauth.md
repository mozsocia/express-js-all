```js
// File name: server.js

// Import necessary packages
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const axios = require('axios');

// Create an instance of the Express app
const app = express();

// Configure middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Define Facebook OAuth2 endpoints
const clientId = '1400298394109179';
const clientSecret = '26d4c30c077fd37ddb090f1126bdf5f3';
const redirectUri = 'http://localhost:3000/auth/facebook/callback';

app.get('/', (req, res)=> {
  res.send('hello world')
})

// Redirect user to Facebook's authorization page
app.get('/auth/facebook', (req, res) => {
  const url = `https://www.facebook.com/v16.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}`;
  res.redirect(url);
});

// Handle callback after user authorizes app on Facebook
app.get('/auth/facebook/callback', async (req, res) => {
  const { code } = req.query;

  try {
    // Exchange code for access token
    const response = await axios.get('https://graph.facebook.com/v16.0/oauth/access_token', {
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code,
      },
    });

    const { access_token } = response.data;

    // Use access token to get user's public profile information
    const profileResponse = await axios.get('https://graph.facebook.com/v16.0/me', {
      params: {
        fields: 'id,name,email,relationship_status',
        access_token,
      },
    });

    console.log(profileResponse.data)

    const { id, name, email } = profileResponse.data;

    // Save user's information to database or session
    // ...

    res.json(profileResponse.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
```
