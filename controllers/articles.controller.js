const { selectAllArticles, selectArticleid } = require("../models/articles.model")
exports.getArticles = (req, res, next) => {
    selectAllArticles()

    .then((articles) => {
        res.status(200).send({articles})
    }).catch((err) => {
        next(err)
    })
}
exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleid(article_id).then((article) => {
      res.status(200).send({ article });
    }).catch((err) => {
      next(err)
    })
  };