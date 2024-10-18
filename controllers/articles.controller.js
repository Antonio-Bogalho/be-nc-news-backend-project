const {
  selectAllArticles,
  selectArticleid,
  alterArticle,
  checkTopicExists,
} = require("../models/articles.model");

exports.getArticles = (req, res, next) => {
  const { topic, sort_by, order } = req.query;
  let checkTopicPromise;
  if (topic) {
    checkTopicPromise = checkTopicExists(topic);
  } else {
    checkTopicPromise = Promise.resolve();
  }
  checkTopicPromise
    .then(() => {
      return selectAllArticles({ topic, sort_by, order });
    })
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};
exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleid(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
exports.updateArticles = (req, res, next) => {
  const incVotes = req.body.inc_votes;
  const articleId = req.params.article_id;
  if (incVotes === undefined) {
    return res.status(400).send({ msg: "Bad request" });
  }
  alterArticle(incVotes, articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
