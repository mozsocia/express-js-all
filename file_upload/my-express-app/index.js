const express = require("express");
const app = express();
const mongoose = require("mongoose");

const userRouter = require("./routes/users");
const uploadRouter = require("./routes/upload");

const mongouri = "mongodb+srv://<user>:<pass>@cluster0.5jasdfsdfbw.mongodb.net/myexpress_app?retryWrites=true&w=majority"

mongoose.connect(mongouri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({"msg": "hello world"})
})

app.use("/uploads", express.static("public/uploads"));
app.use("/upload", uploadRouter);
app.use("/users", userRouter);

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
