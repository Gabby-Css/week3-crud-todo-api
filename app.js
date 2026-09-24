require('dotenv').config();//loading environment variables from .env file 
const express = require('express');
const app = express();
app.use(express.json({ type: ['application/json', 'text/plain'] })); // Parse JSON bodies, even when Postman sends them as Text

let todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build CRUD API', completed: false },
];
let nextId = 3;

// GET All – Read
app.get('/todos', (req, res) => {
  res.status(200).json(todos); // Send array as JSON
});

// GET Active – todos that are not completed (must be above /todos/:id)
app.get('/todos/active', (req, res) => {
  const active = todos.filter((t) => !t.completed);
  res.json(active);
});

// GET Completed (must be above /todos/:id)
app.get('/todos/completed', (req, res) => {
  const completed = todos.filter((t) => t.completed);
  res.json(completed);
});

// GET One – single read
app.get('/todos/:id', (req, res) => {
  const todo = todos.find((t) => t.id === Number(req.params.id));
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  res.json(todo);
});

// POST New – Create
app.post('/todos', (req, res) => {
  const { task, completed = false } = req.body || {};
  if (!task || typeof task !== 'string' || task.trim() === '') {
    return res
      .status(400)
      .json({ message: 'Send JSON with a "task" field (Postman: Body > raw > JSON)' });
  }
  const newTodo = { id: nextId++, task: task.trim(), completed };
  todos.push(newTodo);
  res.status(201).json(newTodo); 
});

// PATCH Update – Partial
app.patch('/todos/:id', (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id)); // Array.find()
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  Object.assign(todo, req.body); 
  res.status(200).json(todo);
});

// DELETE Remove
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = todos.length;
  todos = todos.filter((t) => t.id !== id); // Array.filter
  if (todos.length === initialLength)
    return res.status(404).json({ error: 'Not found' });
  res.status(204).send(); //silently return 204 No Content
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Server error' });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
