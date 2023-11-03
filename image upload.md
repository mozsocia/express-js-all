```js
// app.js
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;
const imageRoutes = require('./routes/imageRoutes');

app.use(express.json());
app.use(fileUpload());
app.use('/uploads', express.static('uploads'));



// Configure API routes
app.use('/api', imageRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

```js

// routes/imageRoutes.js
const express = require('express');
const imageController = require('../controllers/imageController');

const router = express.Router();

// Route for uploading an image
router.post('/upload', imageController.uploadImage);

module.exports = router;
```


```js
// helpers/ImageUploadHelper.js

const fs = require('fs');
const path = require('path');

function uploadImage(req, fieldName) {
  return new Promise((resolve, reject) => {

    if (!req.files || !req.files[fieldName]) {
      return reject(`No file with field name '${fieldName}' was uploaded.`);
    }

    const imageFile = req.files[fieldName];
    const uploadPath = path.join(__dirname, '../uploads', `${Date.now()}_${imageFile.name}`);

    imageFile.mv(uploadPath, (err) => {
      if (err) {
        return reject('Failed to upload file.');
      }

      resolve(`/uploads/${path.basename(uploadPath)}`);
    });
  });
}

module.exports = {
  uploadImage,
};

```
```js
// controllers/imageController.js

const fs = require('fs');
const path = require('path');

const { uploadImage } = require('../helpers/ImageUploadHelper'); // Import the helper module

// Handle image upload
exports.uploadImage =async (req, res) => {
  try {
    const { name, description } = req.body;

    const uploadPath = await uploadImage(req, 'image');

    // Now, you can save the image details in your database (e.g., MongoDB)
    // Save the image details in your database here

    res.json({ name, description, uploadPath });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal server error' });
  }
};
```
