const { getComments, addComments, deleteComments } = require('../models/comments.model');

exports.getCommentsByArticleId = (req, res, next) => {
    const articleId = req.params.article_id
    const {sort_by, order_by} = req.query

    getComments(articleId, sort_by, order_by).then((comments) => {
       res.status(200).send({comments});
    }).catch((err) => {
        next(err);
    });
}
exports.addCommentsByArticleId = (req, res, next) => {
  console.log("POST /api/articles/:article_id/comments called");
    const articleId = req.params.article_id;
    const { body, username } = req.body;

    return getComments(articleId)
        .then(() => {

            return addComments(body, username, articleId);
        })
        .then((newComment) => {
            res.status(201).send({ comment: newComment });
        })
        .catch((err) => {
            next(err);
        });
};
exports.deleteCommentById = (req, res, next) => {
    const commentId = req.params.comment_id;

    return deleteComments(commentId)
      .then((deleteResult) => {
        if (deleteResult.rowCount === 0) {
          return Promise.reject({ status: 404, msg: "Comment not found" });
        } else {
          res.status(204).send(); 
        }
      })
      .catch((err) => {
        next(err);
      });
  };
