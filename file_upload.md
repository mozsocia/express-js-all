teach me file upload in express api using multer , give me full code with file and folder structure

Sure, here is a basic example of file upload using Express.js and Multer:

File and folder structure:

```js
my-express-app/
|-- package.json
|-- index.js
|-- routes/
|   |-- upload.js
|-- public/
|   |-- uploads/

```

`package.json`:

```js
{
  "dependencies": {
    "express": "^4.17.1",
    "multer": "^1.4.2"
  }
}

```

`index.js`:

```js
const express = require("express");
const app = express();
const uploadRouter = require("./routes/upload");

app.use("/upload", uploadRouter);

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});

```

`routes/upload.js`:

```js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post("/", upload.single("file"), (req, res, next) => {
  const file = req.file;
  if (!file) {
    const error = new Error("Please upload a file");
    error.httpStatusCode = 400;
    return next(error);
  }
  res.send(file);
});

module.exports = router;

```

This code creates an Express.js app with a single route `/upload` that accepts file uploads using Multer. The uploaded files will be stored in the `public/uploads/` directory. The `storage` configuration for Multer is set to use disk storage and the destination for uploaded files is `public/uploads/`. The file name for uploaded files will be the original name of the file.

You can run the Express app with `node index.js`. To test the file upload, you can use a tool like `curl` or a REST client like Postman to make a `POST` request to `http://localhost:3000/upload` with a file attached.



give me code for multiple file upload

Here is an example of how you can handle multiple file uploads in an Express.js app using Multer:

`routes/upload.js`:

```js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post("/", upload.array("files"), (req, res, next) => {
  const files = req.files;
  if (!files) {
    const error = new Error("Please choose files");
    error.httpStatusCode = 400;
    return next(error);
  }

  res.send(files);
});

module.exports = router;

```

This code is similar to the single file upload example, with a few differences. The `upload.array()` middleware is used instead of `upload.single()`. The argument to `array()` is the name of the field in the `multipart/form-data` request that holds the files to be uploaded. This allows you to handle multiple files uploaded in a single request. The `req.files` array will hold the uploaded files.

In this example, each uploaded file will be stored in the `public/uploads/` directory, with its original name as the file name.

You can test this code by making a `multipart/form-data` `POST` request to `http://localhost:3000/upload` with multiple files attached to the `files` field.



give me full code with file and folder structure , how to use a user Model to save profile picture in express api using multer

Here's a full example of using a user model to store profile picture information in an Express.js API using Multer:

File and folder structure:

```js
my-express-app/
|-- package.json
|-- index.js
|-- models/
|   |-- User.js
|-- routes/
|   |-- users.js
|-- public/
|   |-- uploads/

```

`package.json`:

```js
{
  "dependencies": {
    "express": "^4.17.1",
    "multer": "^1.4.2",
    "mongoose": "^5.10.8"
  }
}

```

`index.js`:

```js
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRouter = require("./routes/users");

mongoose.connect("mongodb://localhost:27017/my-express-app", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use("/users", userRouter);

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});

```

`models/User.js`:

```js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: String,
  profilePicture: String,
});

module.exports = mongoose.model("User", userSchema);

```

This code defines a user model with `name`, `email`, and `profilePicture` fields.

`routes/users.js`:

```js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const User = require("../models/User");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post("/", upload.single("profilePicture"), async (req, res, next) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    profilePicture: req.file.path,
  });
  try {
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;

```

This code creates an Express.js route `/users` that accepts file uploads using Multer. The uploaded profile picture will be stored in the `public/uploads/` directory, with its original name as the file name. The path of the uploaded profile picture will be stored in the `profilePicture` field of the user model.


should i use req.file.filename or req.file.path??

It depends on how you want to use the uploaded file.

`req.file.path` refers to the absolute path of the uploaded file on the server file system, while `req.file.filename` refers to the name of the uploaded file.

If you want to store the uploaded file's location on the server file system, you should use `req.file.path`. For example, you may use this path to serve the file as part of a REST API.

If you want to store the uploaded file's name, you should use `req.file.filename`. For example, you may use this name to display the file to the user, or as a reference to the file in a database.
