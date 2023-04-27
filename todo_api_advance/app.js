const express = require('express');
const dotenv = require('dotenv')
const routes = require('./routes');

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middlewares/errorHandler');


dotenv.config()

const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB()


app.use('/api', routes);


// Error handling middleware
app.use(notFound)
app.use(errorHandler)

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
