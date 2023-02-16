const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config');

function authCheck(req, res, next) {
  const token = req.headers.authorization;
  if (!token || !token.startsWith('Bearer ')) return res.status(401).json({ message: 'Authentication required' });

  try {
    const decoded = jwt.verify(token.slice(7), config.jwt.secret);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
}

router.get('/', authCheck, (req, res) => {
  res.json({ message: `Welcome ${req.user.email}!` });
});

module.exports = router;
