const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config()

const authMiddleware = require("./middlewares/authMiddleware");
const authRoutes = require("./routes/authRoutes");

mongoose.set('strictQuery', false)
const app = express();

app.use(express.json());

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5173');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   next();
// });


app.get('/helo', (req, res) => {
  res.send("hello")
})

app.use("/api/auth", authRoutes);

app.get("/api/secret", authMiddleware.checkAuth, (req, res) => {
  res.json({ message: "Success! You can not see this without a token", data : req.user });
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch(error => console.log(error));
