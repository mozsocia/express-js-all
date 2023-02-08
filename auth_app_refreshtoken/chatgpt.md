> give me a express api with mongoose, - with user model with name, email, password field - give login , register route - use jwt for authentication ,use different file for jwt token generation and decode - give authcheck middleware in different file - give folder and file structure, with route and controller file

---

Here is a sample express API with Mongoose, with the requested features:

java

```java
project
├── controllers
│   ├── authController.js
│   └── userController.js
├── middlewares
│   └── authCheck.js
├── models
│   └── User.js
├── routes
│   ├── auth.js
│   └── index.js
├── utils
│   └── jwt.js
├── .env
├── .gitignore
├── app.js
└── package.json
```

`models/User.js`:

php

```php
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

UserSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
  next();
});


const User = mongoose.model('User', UserSchema);

module.exports = User;
```

`controllers/userController.js`:

javascript

```javascript
const User = require('../models/User');
const jwt = require('../utils/jwt');

exports.register = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = jwt.generateToken(user);
    res.status(201).json({ message: 'User created', token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email or password is incorrect' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email or password is incorrect' });
    }
    const token = jwt.generateToken(user);
    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
```

`middlewares/authCheck.js`:

javascript

```javascript
const jwt = require('../utils/jwt');

exports.check = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.decodeToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};
```

`utils/jwt.js`:

javascript



```javascript
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

exports.generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: '1d' });
};

exports.decodeToken = (token) => {
  return jwt.verify(token, secret);
};
```

`routes/auth.js`:

javascript

```javascript
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.register);
router.post('/login', userController.login);

module.exports = router;
```

`routes/index.js`:

javascript


```javascript
const express = require('express');
const router = express.Router();
const authCheck = require('../middlewares/authCheck');

router.use('/auth', require('./auth'));

router.get('/protected', authCheck.check, (req, res) => {
  res.json({ message: 'Protected route' });
});

module.exports = router;
```

`app.js`:

javascript

```javascript
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.log(error));

app.use(express.json());

app.use('/api', require('./routes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
```

`package.json`:

json

```json
{
  "name": "express-mongoose-api",
  "version": "1.0.0",
  "description": "Express API with Mongoose",
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  },
  "dependencies": {
    "dotenv": "^8.2.0",
    "express": "^4.17.1",
    "jsonwebtoken": "^8.5.1",
    "mongoose": "^5.10.0"
  }
}
```

This is just a sample code to get you started. You can add more features and improve this API as per your requirements.

---

> how to implement refresh token in this project

---

To implement refresh tokens in this project, you need to do the following steps:

1.  Add refresh token field in the User model
2.  Generate refresh token and access token on successful login
3.  Store refresh token securely in the client-side, such as in a cookie with httpOnly flag
4.  On the server-side, store the refresh token in the database, associate it with the user, and set a short expiration time
5.  When the access token expires, the client can send a request to the server with the refresh token to get a new access token
6.  On the server-side, verify the refresh token, and if it's valid, generate a new access token and return it to the client
7.  Revoke the refresh token when it's no longer needed or when the user logs out

Here's how the code can look like for some of the steps:

1.  Add refresh token field in the User model:

php

```php
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String,
    default: null
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
```

2.  Generate refresh token and access token on successful login in `userController.js`:

vbnet

```vbnet
const User = require('../models/user');
const jwt = require('../services/jwt');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });
    if (!user.comparePassword(password)) return res.status(400).json({ error: 'Invalid password' });
    const accessToken = jwt.generateToken(user);
    const refreshToken = jwt.generateToken(user, '7d');
    user.refreshToken = refreshToken;
    await user.save();
    return res.json({ accessToken, refreshToken });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
```

3.  Store refresh token securely in the client-side

Here is an example of storing the refresh token in an HTTP-only cookie:

javascript

```javascript
document.cookie = `refreshToken=${refreshToken}; expires=${cookieExpiration}; path=/; httpOnly`;
```

4.  On the server-side, verify the refresh token and generate a new access token in a new route, for example `/refresh`:

javascript

```javascript
const express = require('express');
const router = express.Router();
const jwt = require('../services/jwt');
const User = require('../models/user');

router.post('/refresh', async (req, res) => {
  try {

      const refreshToken = req.body.refreshToken;
      const user = await User.findOne({ refreshToken });
      if (!user) return res.status(400).json({ error: 'Invalid refresh token' });
      const accessToken = jwt.generateToken(user);
      return res.json({ accessToken });
    } catch (error) {
       return res.status(500).json({ error: error.message });
    }
});

module.exports = router;
```

5.  Revoke the refresh token when it's no longer needed or when the user logs out, in `userController.js`:

javascript

```javascript
exports.logout = async (req, res) => {
  try {
    req.user.refreshToken = null;
    await req.user.save();
    return res.json({ message: 'Logout successful' });
  } catch (error) {

    return res.status(500).json({ error: error.message });
  }
};
```

This is just one way of implementing refresh tokens in an Express API with Mongoose. You can adjust the implementation to fit your needs and requirements.

---

> where is user.comparePassword ??

---

The `comparePassword` method is not shown in the code examples I provided. This method is usually used to compare the hashed password stored in the database with the plaintext password sent in the request, to check if they match. Here's how you can implement it in the `userModel.js` file:

vbnet

```js
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};
```

And then you can call it in the `userController.js` file when logging in a user:

vbnet

```js
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });
    // generate access and refresh tokens and return them to the client
    // ...
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
```

---