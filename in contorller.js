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
