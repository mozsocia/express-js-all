const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config()

const { checkAuth } = require("./middlewares/auth");
const authRoutes = require("./routes/auth");

mongoose.set('strictQuery', false)
const app = express();

app.use(express.json());

app.get('/helo', (req, res) => {
  res.send("hello")
})

app.use("/api/auth", authRoutes);

app.get("/api/secret", checkAuth, (req, res) => {
  res.json({ message: "Success! You can not see this without a token" });
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
