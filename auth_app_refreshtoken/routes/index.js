const express = require('express');
const router = express.Router();
const authCheck = require('../middlewares/authCheck');

router.use('/auth', require('./auth'));

router.get('/protected', authCheck.check, (req, res) => {
  res.json({ message: 'Protected route' });
});

module.exports = router;