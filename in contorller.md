```js
const { validationResult, body } = require('express-validator');

exports.createUser = async (req, res) => {


  const validationRules = [

    body('email')
      .notEmpty().withMessage('Email is required').bail()
      .isEmail().withMessage('Invalid email'),
    body('password')
      .notEmpty().withMessage('Password is required').bail()
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ];

  // Run validation
  await Promise.all(validationRules.map((validationRule) => validationRule.run(req)));

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }


// ....
// your data creation
// ...

  res.json({ "msg": "success" })
};
```

```js
  // Validate the incoming request body using express-validator
  await body('title').notEmpty().withMessage('Title is required').run(req);
  await body('amount').notEmpty().withMessage('Amount is required')
    .isNumeric().withMessage('Amount must be a number').run(req);
  await body('date').notEmpty().withMessage('Date is required')
    .isISO8601().withMessage('Date must be in ISO8601 format').run(req);
  await body('category').notEmpty().withMessage('Category is required').run(req);
  await body('description').notEmpty().withMessage('Description is required').run(req);
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
```

```js
// CREATE income
exports.createIncome = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 50 }).withMessage('Title cannot be longer than 50 characters'),
  body('amount')
    .notEmpty().withMessage('Amount is required')
    .isNumeric().withMessage('Amount must be a number')
    .isLength({ max: 20 }).withMessage('Amount cannot be longer than 20 digits'),
  body('date')
    .notEmpty().withMessage('Date is required'),
  body('category')
    .notEmpty().withMessage('Category is required')
    .isLength({ max: 20 }).withMessage('Category cannot be longer than 20 characters'),
  body('description')
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 20 }).withMessage('Description cannot be longer than 20 characters'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error('Invalid input data');
    }

    const { title, amount, type, date, category, description } = req.body;
    const income = new Income({ title, amount, type, date, category, description });
    await income.save();
    res.status(201).json(income);
  })
];

// UPDATE income
exports.updateIncome = [
  body('title')
    .optional().isLength({ max: 50 }).withMessage('Title cannot be longer than 50 characters'),
  body('amount')
    .optional().isNumeric().withMessage('Amount must be a number')
    .isLength({ max: 20 }).withMessage('Amount cannot be longer than 20 digits'),
  body('date')
    .optional(),
  body('category')
    .optional().isLength({ max: 20 }).withMessage('Category cannot be longer than 20 characters'),
  body('description')
    .optional().isLength({ max: 20 }).withMessage('Description cannot be longer than 20 characters'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error('Invalid input data');
    }

    const income = await Income.findById(req.params.id);
    if (!income) {
      res.status(404);
      throw new Error('Income not found');
    }

    const { title, amount, type, date, category, description } = req.body;
    if (title) income.title = title;
    if (amount) income.amount = amount;
    if (type) income.type = type;
    if (date) income.date = date;
    if (category) income.category = category;
    if (description) income.description = description;

    await income.save();
    res.json(income);
  })
];
```
