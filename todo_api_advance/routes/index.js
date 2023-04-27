const express = require('express');
const router = express.Router();
const todoRoutes = require('./todoRoutes')

// Routes
router.use('/todos', todoRoutes);


module.exports = router;