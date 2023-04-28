const Todo = require('../models/todo');
const { validationResult, body } = require('express-validator');
const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');

exports.getAllTodos = asyncHandler(async (req, res) => {
  const todos = await Todo.find({});
  res.status(StatusCodes.OK).json(todos);
});

exports.getTodoById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const todo = await Todo.findById(id);
  if (!todo) {
    return res.status(NOT_FOUND).json({ error: 'Todo not found' });
  }
  res.status(StatusCodes.OK).json(todo);
});

exports.createTodo = asyncHandler(async (req, res) => {
  const validationRules = [
    body('title').notEmpty().withMessage('title is required'),
    body('description')
      .notEmpty()
      .withMessage('description is required')
      .bail()
      .isLength({ min: 20 })
      .withMessage('description must be at least 20 characters'),
  ];

  // Run validation
  await Promise.all(validationRules.map((validationRule) => validationRule.run(req)));

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
  }

  const { title, description } = req.body;
  const todo = new Todo({
    title,
    description,
  });

  const newTodo = await todo.save();
  res.status(StatusCodes.CREATED).json(newTodo);
});

exports.updateTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;

  const todo = await Todo.findByIdAndUpdate(
    id,
    { title, description, completed },
    { new: true }
  );

  if (!todo) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: 'Todo not found' });
  }

  res.status(StatusCodes.OK).json(todo);
});

exports.deleteTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const todo = await Todo.findByIdAndDelete(id);

  if (!todo) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: 'Todo not found' });
  }

  res.status(StatusCodes.NO_CONTENT).send();
});


