const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');

const app = express();

mongoose.set('strictQuery', false)
mongoose.connect('mongodb+srv://user_123_pass_321321Uuser:321321Uuser@cluster0.5j3hsbw.mongodb.net/oauth2_user_model?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use('/protected', protectedRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
