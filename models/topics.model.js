const db = require("../db/connection.js")

exports.fetchTopics = () => {
    return db.query(`SELECT slug, description FROM topics;`)
    .then((result) => {
        return result.rows
    })
}