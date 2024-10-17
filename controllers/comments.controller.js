const { getComments, addComments, updateComments } = require('../models/comments.model');

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

