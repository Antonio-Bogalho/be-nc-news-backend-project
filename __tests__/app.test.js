const app = require("../app.js")
const db = require("../db/connection.js")
const seed = require("../db/seeds/seed.js")
const data = require("../db/data/test-data")
const endpoints = require ("../endpoints.json")
const request = require("supertest")

beforeEach(() => {
    return seed(data)
});

afterAll(() => {
    return db.end()
});

describe("/api", () => {
    test("GET: 200 - responds with an object detailing all available endpoints", () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
            expect(body.endpoints).toEqual(endpoints)
        }) //I didn't realize I did 3 already
    })
})

describe("/api/topics", () => {
    test("GET: 200 sends an array of all treasures to the client in correct formats", () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
            expect(Array.isArray(response.body.topics)).toBe(true)
            response.body.topics.forEach((topic) => {
                expect(topic).toHaveProperty("slug")
                expect(topic).toHaveProperty("description")
            })
        })
        })
    })
