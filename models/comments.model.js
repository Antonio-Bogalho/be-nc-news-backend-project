const db = require("../db/connection");

exports.getComments = (articleId) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [articleId])
    .then(({ rows: articles }) => {
      if (articles.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return db.query(
        `SELECT comment_id, author, article_id, body, created_at, votes
        FROM comments
        WHERE article_id = $1;`,
        [articleId]
      );
    })
    .then(({ rows: comments }) => {
      return comments;
    });
};
exports.addComments = (body, author, article_id) => {
  return db
    .query(
      `
    INSERT INTO comments (body, author, article_id) 
    VALUES ($1, $2, $3)
    RETURNING *;
    `,
      [body, author, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
