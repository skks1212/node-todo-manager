const express = require("express");
const csrf = require("tiny-csrf");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("shh"));
app.use(csrf("this_should_be_32_character_long", ["POST", "PUT", "DELETE"]));

app.set("view engine", "ejs");

app.get("/", async (request, response) => {
  const allTodos = await Todo.getTodos();
  const overdueTodos = await allTodos.filter(
    (todo) => todo.dueDate < new Date().toISOString()
  );
  const dueTodayTodos = await allTodos.filter(
    (todo) => todo.dueDate === new Date().toISOString()
  );
  const dueLaterTodos = await allTodos.filter(
    (todo) => todo.dueDate > new Date().toISOString()
  );
  if (request.accepts("html")) {
    response.render("index", {
      overdueTodos,
      dueTodayTodos,
      dueLaterTodos,
      csrfToken: request.csrfToken(),
    });
  } else {
    response.json({
      overdueTodos,
      dueTodayTodos,
      dueLaterTodos,
    });
  }
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/todos", async function (request, response) {
  console.log("Processing list of all Todos ...");
  try {
    const todos = await Todo.findAll({
      order: [["id", "ASC"]],
    });
    return response.json(todos);
  } catch (error) {
    console.log(error);
    return response.status(500).send(error);
  }
});

app.get("/todos/:id", async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post("/todos", async function (request, response) {
  try {
    await Todo.addTodo(request.body);
    return response.redirect("/");
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async function (request, response) {
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = todo.completed
      ? await todo.markAsIncomplete()
      : await todo.markAsCompleted();
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async function (request, response) {
  console.log("We have to delete a Todo with ID: ", request.params.id);
  try {
    const todo = await Todo.findByPk(request.params.id);
    await todo.destroy();
    return response.json({ success: true });
  } catch (error) {
    console.log(error);
    return response.json({ success: false });
  }
});

module.exports = app;
