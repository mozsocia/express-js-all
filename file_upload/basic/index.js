const express = require("express");
const app = express();
const uploadRouter = require("./routes/upload");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({"msg": "hello world"})
})

app.use("/uploads", express.static("public/uploads"));
app.use("/upload", uploadRouter);

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
