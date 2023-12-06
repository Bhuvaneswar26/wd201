const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
const path = require("path");

app.use(bodyParser.json());

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async function (request, response) {
  try {
    const todos = await Todo.allTodos();
    response.render("index", { todos });
  } catch (err) {
    console.log(err);
    response.status(422).send(err);
  }
});

app.get("/todos", async function (request, response) {
  console.log("Processing list of all Todos ...");
  // FILL IN YOUR CODE HERE

  try {
    const alltodos = await Todo.allTodos();
    return response.json(alltodos);
  } catch (err) {
    console.log(err);
    return response.status(422).json(err);
  }

  // First, we have to query our PostgerSQL database using Sequelize to get list of all Todos.
  // Then, we have to respond with all Todos, like:
  // response.send(todos)
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
    const todo = await Todo.addTodo(request.body);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async function (request, response) {
  const todo = await Todo.findByPk(request.params.id);
  console.log(todo);
  try {
    const updatedTodo = await todo.markAsCompleted();
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async function (request, response) {
  console.log("We have to delete a Todo with ID: ", request.params.id);

  try {
    const deleteTodo = await Todo.deleteTodo(request.params.id);
    response.send(deleteTodo ? true : false);
  } catch (err) {
    console.log(err);
    return response.status(422).json(err);
  }
});

module.exports = app;
