const express = require("express")
const cors = require("cors")
const app = express()
const { getTopics } = require("./controllers/topics.controller")
const { getApi } = require("./controllers/endpoints.controller")
const { getArticleById, getArticles, updateArticles } = require("./controllers/articles.controller")
const { getCommentsByArticleId, addCommentsByArticleId, deleteCommentById} = require("./controllers/comments.controller")
const { getUsers } = require("./controllers/users.controller")

app.use(cors());

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

app.get("/api/users", getUsers)

app.post("/api/articles/:article_id/comments", addCommentsByArticleId)

app.patch("/api/articles/:article_id", updateArticles)

app.delete("/api/comments/:comment_id", deleteCommentById)

app.use((err, request, response, next) => {
  if (err.code === "23502" || err.code === "22P02") {
   return response.status(400).send({ msg: "Bad request" });
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
  if (err.code === "23503") {
   return response.status(404).send({ msg: "Not found" });
  }
  next(err);
});

app.use((req, res, next) => {
  res.status(404).send({ msg: "Not found" });
});

app.use((err, request, response, next) => {
  console.log(err)
  response.status(500).send({ msg:"Internal server error"})
});

module.exports = app;
