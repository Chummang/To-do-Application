//Require modules
const express = require("express");
const cors = require("cors");
const knexFile = require("./knexfile").development;
const knex = require("knex")(knexFile);
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const jwtStrategy = require("./jwt-strategy")(knex);
require("dotenv").config();

const port = 8000;

//Setup modules
const app = express();
app.use(
  cors({
    origin: process.env.frontend_server,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
jwtStrategy.initialize();

//Route
app.post("/auth/signup", async (req, res) => {
  const { username, password } = req.body;
  let query = await knex("users").where({ username }).first();
  if (query === undefined) {
    const hashed = await bcrypt.hash(password, 10);
    await knex("users").insert({ username, password: hashed });
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

app.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;
  let query = await knex("users").where({ username }).first();

  if (query) {
    let result = await bcrypt.compare(password, query.password);

    if (result) {
      const payload = {
        id: query.id,
        username: query.username,
      };
      const token = jwt.sign(payload, process.env.jwt_secret);
      res.json({ token });
    } else {
      res.sendStatus(401);
    }
  }
});

app.post("/auth/facebook", async (req, res) => {
  const userInfo = req.body.userInfo;
  let query = await knex("users").where({ facebook_id: userInfo.id }).first();

  if (!query) {
    let id = await knex("users")
      .insert({
        facebook_id: userInfo.id,
        username: userInfo.name,
      })
      .returning("id");

    const payload = {
      id: id[0].id,
      username: userInfo.name,
    };

    const token = jwt.sign(payload, process.env.jwt_secret);
    res.json({ token });
  } else {
    const payload = {
      id: query.id,
      username: query.username,
    };
    const token = jwt.sign(payload, process.env.jwt_secret);
    res.json({ token });
  }
});

app.get("/api/todos", jwtStrategy.authenticate(), async (req, res) => {
  console.log("get user", req.user);
  let todoList = await knex("todos")
    .select("id", "todo")
    .where({ userId: req.user.id });
  console.log(todoList);
  res.json(todoList);
});

app.post("/api/todo", jwtStrategy.authenticate(), async (req, res) => {
  console.log("post user", req.user);
  let query = await knex("todos")
    .insert({
      userId: req.user.id,
      todo: req.body.todoItem,
    })
    .returning("id"); // [{id: 1}]
  res.json({ id: query[0].id });
});

app.delete("/api/todo/:id", jwtStrategy.authenticate(), async (req, res) => {
  const id = req.params.id;
  await knex("todos").del().where({ id });
  res.json("delete successful");
});

app.listen(port, () => console.log(`Listening to port ${port}`));
