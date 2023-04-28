const Todo = require('../models/todo');
const { validationResult, body } = require('express-validator');

exports.getAllTodos = async (req, res) => {



  try {
    const todos = await Todo.find({});
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTodoById = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createTodo = async (req, res) => {


  const validationRules = [

    body('title')
      .notEmpty().withMessage('title is required'),
    body('description')
      .notEmpty().withMessage('description is required').bail()
      .isLength({ min: 20 }).withMessage('description must be at least 20 characters')
  ];

  // Run validation
  await Promise.all(validationRules.map((validationRule) => validationRule.run(req)));

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }



  try {
    const { title, description } = req.body;
    const todo = new Todo({
      title,
      description
    });
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

  res.json({ "msg": "success" })
};

exports.updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    const todo = await Todo.findByIdAndUpdate(
      id,
      { title, description, completed },
      { new: true }
    );
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findByIdAndDelete(id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
