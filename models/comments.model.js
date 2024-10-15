const db = require("../db/connection");

exports.getComments = (articleId, sort_by="created_at", order_by="ASC") => {

    const validSortBy = ["created_at", "body", "author", "votes", "article_id"]
    const validOrderBy = ["DESC", "ASC"]

    if(!validSortBy.includes(sort_by) || !validOrderBy.includes(order_by)){
        return Promise.reject({status: 400, msg: "Bad request"})
    }

    return db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY ${sort_by} ${order_by};`, [articleId])
    .then(({rows}) => { 
        if(rows.length === 0) {
            return Promise.reject({status: 404, msg: 'article does not exist'})
          };
        return rows;
    })
}