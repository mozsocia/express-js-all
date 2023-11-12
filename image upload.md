```js
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;
const imageRoutes = require('./routes/imageRoutes');

app.use(express.json());
app.use(fileUpload());
app.use('/uploads', express.static('uploads'));

mongoose
.connect("mongodb://0.0.0.0:27017/", {
  dbName: "imageupload",
})
.then(() => {
  console.log('mongodb connected.')
})
.catch((err) => console.log(err.message))

mongoose.connection.on('connected', () => {
console.log('Mongoose connected to db')
})


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
router.put('/upload/:id', imageController.updateUploadImage);
router.delete('/upload/:id', imageController.deleteUploadImage);



module.exports = router;

```


```js
// helpers/ImageUploadHelper.js

const fs = require('fs');
const path = require('path');

function ensureFolderExists(folderPath) {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
}

function uploadImage(req, fieldName, folderName = 'public') {
  return new Promise((resolve, reject) => {

    if (!req.files || !req.files[fieldName]) {
      return reject(`No file with field name '${fieldName}' was uploaded.`);
    }

    const imageFile = req.files[fieldName];
    const uploadFolderPath = path.join(__dirname, '../uploads', folderName);
    ensureFolderExists(uploadFolderPath);

    const uploadPath = path.join(uploadFolderPath, `${Date.now()}_${imageFile.name}`);

    imageFile.mv(uploadPath, (err) => {
      if (err) {
        return reject('Failed to upload file.');
      }

      resolve(`/uploads/${folderName}/${path.basename(uploadPath)}`);
    });
  });
}

function updateUploadImage(req, fieldName,  previousImagePath ,folderName = 'public') {
  return new Promise(async (resolve, reject) => {
    try {
      // Upload new image
      const newImagePath = await uploadImage(req, fieldName, folderName);

      // Delete previous image
      if (previousImagePath) {
        const previousImagePathFull = path.join(__dirname, '../', previousImagePath);
        if (fs.existsSync(previousImagePathFull)) {
          fs.unlinkSync(previousImagePathFull);
        }
      }

      resolve(newImagePath);
    } catch (error) {
      reject(error);
    }
  });
}

function deleteImage (imagePath) {
  let image_path = path.join(__dirname, '../', imagePath)
  if (fs.existsSync(image_path)) {
    fs.unlinkSync(image_path);
  }
}



module.exports = {
  uploadImage,
  updateUploadImage,
  deleteImage
};



```
```js
// models/imageModel.js

const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  uploadPath: {
    type: String,
    required: true,
  },
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;

```


```js
// controllers/imageController.js

const { uploadImage, updateUploadImage, deleteImage } = require('../helpers/ImageUploadHelper');
const Image = require('../models/imageModel'); // Import the Mongoose model

// Handle image upload
exports.uploadImage = async (req, res) => {
  try {
    const { name, description } = req.body;

    const uploadPath = await uploadImage(req, 'image');

    // Save the image details in your database
    const image = new Image({
      name,
      description,
      uploadPath,
    });

    const savedImage = await image.save();

    res.json(savedImage);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



// Handle image update with upload
exports.updateUploadImage = async (req, res) => {
  try {
    // Fetch the existing image details
    const existingImage = await Image.findById(req.params.id);
    if (!existingImage) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Get the previous image path
    const previousImagePath = existingImage.uploadPath;

    // Check if the 'image' field exists in req.files
    const uploadPath = req.files && req.files.image
      ? await updateUploadImage(req, 'image', previousImagePath)
      : previousImagePath;


    const updatedImage = await existingImage.set({
      ...req.body,
      uploadPath,
    }).save();

    res.json(updatedImage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



exports.deleteUploadImage = async (req, res) => {
  try {
    // Fetch the existing image details
    const existingImage = await Image.findByIdAndRemove(req.params.id);
    if (!existingImage) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Get the previous image path
    await deleteImage(existingImage.uploadPath);


    res.json({ message: 'Image deleted Successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

```
