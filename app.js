const express = require("express")
const app = express()
const { getTopics } = require("./controllers/topics.controller")
const { getApi } = require("./controllers/endpoints.controller")

app.get("/api", getApi)

app.get('/api/topics', getTopics)


module.exports = app;