const db = require("../db/connection.js");

exports.fetchArticles = () => {
  return db.query(`SELECT * FROM articles;`).then((result) => {
    return result.rows;
  });
};
exports.selectArticleid = (article_id) => {
  return db
    .query(
      `
      SELECT articles.*, COUNT(comments.comment_id) AS comment_count
      FROM articles
      LEFT JOIN comments 
      ON comments.article_id = articles.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id;
      `,
      [article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      const article = result.rows[0];
      article.comment_count = Number(article.comment_count);
      return article;
    });
};
exports.selectAllArticles = ({
  topic,
  sort_by = "created_at",
  order = "desc",
}) => {
  const queryParams = [];
  let queryStr = `
    SELECT 
      articles.author, 
      articles.title, 
      articles.article_id, 
      articles.topic, 
      articles.created_at, 
      articles.votes, 
      articles.article_img_url, 
      COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments 
    ON comments.article_id = articles.article_id`;

  if (topic) {
    queryStr += ` WHERE articles.topic = $1`;
    queryParams.push(topic);
  }
  const validSortColumns = [
    "created_at",
    "votes",
    "title",
    "author",
    "article_id",
    "topic",
  ];
  const validOrderValues = ["asc", "desc"];
  if (!validSortColumns.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  if (!validOrderValues.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  queryStr += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`;

  return db.query(queryStr, queryParams).then((result) => {
    return result.rows.map((article) => {
      return { ...article, comment_count: Number(article.comment_count) };
    });
  });
};
exports.alterArticle = (incVotes, articleId) => {
  if (!incVotes) {
    return db
      .query(`SELECT * FROM articles WHERE article_id = $1;`, [articleId])
      .then(({ rows }) => {
        return rows[0];
      });
  }

  return db
    .query(
      `UPDATE articles
SET votes = votes + $1
WHERE article_id = $2
RETURNING *;`,
      [incVotes, articleId]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return rows[0];
    });
};
exports.checkTopicExists = (topic) => {
  return db
    .query(`SELECT * FROM topics WHERE slug = $1;`, [topic])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Topic not found" });
      }
    });
};
