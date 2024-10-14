const express = require("express")
const app = express()
const endpoints = require("./endpoints.json") 
const { getTopics } = require("./controllers/topics.controller")

app.get("/api", (request, response) => { //I didn't realize I did 3 already
    response.status(200).send({endpoints: endpoints})
})
app.get('/api/topics', getTopics)


module.exports = app;