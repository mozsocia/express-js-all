const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config()


mongoose.set('strictQuery', false)
const app = express();

app.use(express.json());


const { validationResult, check, body } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}



usercreate = [
    check("email").notEmpty()
    .withMessage('email is required')
    .bail()
    .isEmail()
    .withMessage("Invalid email provided"),
  check("password")
    .notEmpty()
    .withMessage('password is required')
    .bail()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 6 character long'),

    validate,

    async (req, res) => {
        // create user logic here
        res.status(201).json({ message: 'User created successfully' });
    },
];



app.get('/helo', (req, res) => {
    res.send("hello")
})







app.post('/users', usercreate);


















// mongoose
//     .connect(process.env.MONGO_URI, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     })
//     .then(() => {
//         console.log("MongoDB Connected");
//         app.listen(3000, () => {
//             console.log("Server is running on port 3000");
//         });
//     })
//     .catch(error => console.log(error));


    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });