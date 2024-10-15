const { getComments } = require('../models/comments.model');

exports.getCommentsByArticleId = (req, res, next) => {
    const articleId = req.params.article_id
    const {sort_by, order_by} = req.query

    getComments(articleId, sort_by, order_by).then((comments) => {
       res.status(200).send({comments});
    }).catch((err) => {
        next(err);
    });
}