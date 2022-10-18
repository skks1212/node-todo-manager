const express = require('express');
const app = express();
const { Todo } = require('./models');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/todos', async (req, res) => {
    try {
        const todo = await Todo.addTodo({
            title: req.body.title,
            dueDate: req.body.dueDate,
            completed: req.body.completed || false,
        });
        return res.json(todo);
    } catch (error) {
        console.log(error);
        return res.status(422).json(error);
    }
});

app.put('/todos/:id/complete', async (req, res) => {
    try {
        const todo = await Todo.findByPk(req.params.id);
        await todo.completeTodo();
        return res.json(todo);
    } catch (error) {
        console.log(error);
        return res.status(422).json(error);
    }
});

module.exports = app;