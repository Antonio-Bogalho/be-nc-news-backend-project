const db = require("../db/connection.js")

exports.fetchArticles = () => {
    return db.query(`SELECT * FROM articles;`)
    .then((result) => {
        return result.rows
    })
}
exports.selectArticleid = (article_id) => {
    return db
      .query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
      .then((result) => {
        if (result.rows.length === 0){
          return Promise.reject({ status: 404, msg:'article does not exist'})
        }
        return result.rows[0];
      });
  };