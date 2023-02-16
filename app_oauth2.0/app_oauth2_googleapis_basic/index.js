const express = require('express');
const app = express();
const authRouter = require('./routes/authRoute');
require('dotenv').config()

// body parser middleware
app.use(express.json());

app.get('/', (req, res)=> {
  res.json({"msg": "hello world"})
})

// auth routes
app.use('/auth', authRouter);

// start server
app.listen(3000, () => console.log('Server started on port 3000'));
