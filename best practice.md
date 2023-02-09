```js
const express = require('express');
const { check, validationResult } = require('express-validator');

const app = express();

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/user', [
  check("email").notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage("Invalid email provided"),
  check("password")
    .notEmpty()
    .withMessage('password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 character long')
  ,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
], (req, res) => {
  console.log(req.body)
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ errors: errors.array() });
  // }

  // Proceed with creating the user
  res.send('User created');
});


app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
```


seperate file

```js
const { check, validationResult } = require("express-validator");

const validate = (validations) => {
  return [
    ...validations,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
  ];
};

const createUserValidations = validate([
  check("email").isEmail(),
  check("password").isLength({ min: 5 })
]);

const createProductValidations = [
  check("name").not().isEmpty(),
  check("price").isFloat({ gt: 0 })
];

// Controller
const createUser = (req, res) => {
  const { email, password } = req.body;
  // create user in database
  res.send("User created successfully.");
};

const createProduct = (req, res) => {
  const { name, price } = req.body;
  // create product in database
  res.send("Product created successfully.");
};

const app = express();
app.use(express.json());

app.post("/api/users", createUserValidations, createUser);

app.post("/api/products", validate(createProductValidations), createProduct);

const port = 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
```
