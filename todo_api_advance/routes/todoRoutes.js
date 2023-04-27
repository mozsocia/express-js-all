const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');

// GET /todos
router.get('/', todoController.getAllTodos);

// GET /todos/:id
router.get('/:id', todoController.getTodoById);

// POST /todos
router.post('/', todoController.createTodo);

// PUT /todos/:id
router.put('/:id', todoController.updateTodo);

// DELETE /todos/:id
router.delete('/:id', todoController.deleteTodo);

module.exports = router;
