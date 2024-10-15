const express = require("express")
const app = express()
const { getTopics } = require("./controllers/topics.controller")
const { getApi } = require("./controllers/endpoints.controller")
const { getArticleById } = require("./controllers/articles.controller")

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);



app.use((err, request, response, next) => {
  if (err.code === "23502" || err.code === "22P02") {
    response.status(400).send({ msg: "Bad request" });
  }
  next(err);
});

app.use((err, request, response, next) => {
  if (err.status && err.msg) {
    return response.status(err.status).send({ msg: err.msg });
  }
  next(err);
});

app.use((err, request, response, next) => {
  response.status(500).send({ msg:"Internal server error"})
});

module.exports = app;
