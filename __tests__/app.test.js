const app = require("../app.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");
const endpoints = require("../endpoints.json");
const request = require("supertest");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("/api", () => {
  test("GET: 200 - responds with an object detailing all available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(endpoints);
      });
  });
});

describe("/api/topics", () => {
  test("GET: 200 - responds with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body.topics).toHaveLength(3);
        response.body.topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET: 200 - returns the correct article object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        expect(response.body.article.article_id).toBe(1);
        expect(response.body.article.author).toBe("butter_bridge");
        expect(response.body.article.title).toBe(
          "Living in the shadow of a great man"
        );
        expect(response.body.article.body).toBe(
          "I find this existence challenging"
        );
        expect(response.body.article.topic).toBe("mitch");
        expect(response.body.article.created_at).toBe(
          "2020-07-09T20:11:00.000Z"
        );
        expect(response.body.article.votes).toBe(100);
        expect(response.body.article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("GET:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article not found");
      });
  });
  test("GET:400 sends an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/not-an-article")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});
describe("/api/articles", () => {
  test("GET: 200 - an array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body.articles)).toBe(true);
        expect(response.body.articles).toHaveLength(13);
        response.body.articles.forEach((article) => {
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count");
        });
        expect(response.body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  describe("GET /api/articles/:article_id/comments", () => {
    test("GET: 200 - responds with an array of comments for the given article_id", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(Array.isArray(comments)).toBe(true);
          expect(comments).toHaveLength(11);
          comments.forEach((comment) => {
            expect(comment).toHaveProperty("comment_id", expect.any(Number));
            expect(comment).toHaveProperty("author", expect.any(String));
            expect(comment).toHaveProperty("article_id", 1);
            expect(comment).toHaveProperty("body", expect.any(String));
            expect(comment).toHaveProperty("created_at", expect.any(String));
            expect(comment).toHaveProperty("votes", expect.any(Number));
          });
        });
    });
  });
  test("GET:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
  test("GET:400 sends an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/not-an-id/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("GET: 200 - valid article id but has no comments responds with an empty array", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(Array.isArray(comments)).toBe(true);
        expect(comments).toHaveLength(0);
      });
  });
  describe("POST /api/articles/:article_id/comments", () => {
    test("POST: 201 - responds with a new comment added to the given article_id", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "butter_bridge",
          body: "body-test-123",
        })
        .set("Accept", "application/json")
        .expect(201)
        .then(({ body }) => {
          const { comment } = body;
          expect(comment).toHaveProperty("comment_id", expect.any(Number));
          expect(comment).toHaveProperty("body", "body-test-123");
          expect(comment).toHaveProperty("author", "butter_bridge");
          expect(comment).toHaveProperty("article_id", 1);
          expect(comment).toHaveProperty("created_at", expect.any(String));
          expect(comment).toHaveProperty("votes", 0);
        });
    });
  });
  test("POST: 404 - sends an appropriate status and error message when posting to a valid but non-existent article_id", () => {
    return request(app)
      .post("/api/articles/9999/comments")
      .send({
        username: "butter_bridge",
        body: "body-test-123",
      })
      .set("Accept", "application/json")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
  test("POST: 400 - sends an appropriate status and error message when posting to an invalid article_id", () => {
    return request(app)
      .post("/api/articles/not_an_article_id/comments")
      .send({
        username: "butter_bridge",
        body: "body-test-123",
      })
      .set("Accept", "application/json")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("POST: 400 - sends an appropriate status and error message when posting without all properties of comment request body", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "butter_bridge",
      })
      .set("Accept", "application/json")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("POST: 400 - sends an appropriate status and error message when posting with an invalid username", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "not-a-username",
        body: "body-test-123",
      })
      .set("Accept", "application/json")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});
describe("PATCH /api/articles/:article_id", () => {
  test("PATCH: 200 - responds with the article updated when voted are added", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({
        inc_votes: 100,
      })
      .set("Accept", "application/json")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toHaveProperty("article_id", 1);
        expect(article).toHaveProperty("author", expect.any(String));
        expect(article).toHaveProperty("title", expect.any(String));
        expect(article).toHaveProperty("topic", expect.any(String));
        expect(article).toHaveProperty("created_at", expect.any(String));
        expect(article).toHaveProperty("body", expect.any(String));
        expect(article).toHaveProperty("votes", 200);
        expect(article).toHaveProperty("article_img_url", expect.any(String));
      });
  });
});
test("PATCH: 200 - responds with the article updated when voted are removed", () => {
  return request(app)
    .patch("/api/articles/1")
    .send({
      inc_votes: -100,
    })
    .set("Accept", "application/json")
    .expect(200)
    .then(({ body }) => {
      const { article } = body;
      expect(article).toHaveProperty("article_id", 1);
      expect(article).toHaveProperty("author", expect.any(String));
      expect(article).toHaveProperty("title", expect.any(String));
      expect(article).toHaveProperty("topic", expect.any(String));
      expect(article).toHaveProperty("created_at", expect.any(String));
      expect(article).toHaveProperty("body", expect.any(String));
      expect(article).toHaveProperty("votes", 0);
      expect(article).toHaveProperty("article_img_url", expect.any(String));
    });
});
test("PATCH: 404 - sends an appropriate status and error message when patching a valid but non-existent article_id", () => {
  return request(app)
    .patch("/api/articles/999")
    .send({
      inc_votes: -100,
    })
    .set("Accept", "application/json")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Article not found");
    });
});
test("PATCH: 400 - sends an appropriate status and error message when patching an invalid article_id", () => {
  return request(app)
    .patch("/api/articles/not-an-article-id")
    .send({
      inc_votes: -100,
    })
    .set("Accept", "application/json")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad request");
    });
});
test("PATCH: 400 - sends an appropriate status and error message when patching with incorrect data type", () => {
  return request(app)
    .patch("/api/articles/1")
    .send({
      inc_votes: "not-a-number",
    })
    .set("Accept", "application/json")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad request");
    });
});
test("PATCH: 400 - sends an appropriate status and error message when inc_votes is missing from the request body", () => {
  return request(app)
    .patch("/api/articles/1")
    .send({})
    .set("Accept", "application/json")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad request");
    });
});
describe("DELETE /api/comments/:comment_id", () => {
  test("DELETE: 204 - deletes the comment associated with the given id", () => {
    return request(app).delete("/api/comments/2").expect(204);
  });
});
test("DELETE: 404 - sends an appropriate status and error message when deleting a valid but non-existent comment_id", () => {
  return request(app)
    .delete("/api/comments/999")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Comment not found");
    });
});
test("DELETE: 400 - sends an appropriate status and error message when deleting an invalid comment_id", () => {
  return request(app)
    .delete("/api/comments/not-a-comment")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad request");
    });
});
describe("GET /api/users", () => {
  test("GET: 200 - responds with an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toHaveProperty("username", expect.any(String));
          expect(user).toHaveProperty("name", expect.any(String));
          expect(user).toHaveProperty("avatar_url", expect.any(String));
        });
      });
  });
});
describe("GET /api/articles?sort_by&order", () => {
  test("GET: 200 - articles should be sorted by the valid column specified in the query (default created_at)", () => {
    return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toBeSortedBy("votes", { descending: true });
      });
  });
});
test("GET: 200 - articles should be sorted by created_at in ascending order when order is set to 'asc'", () => {
  return request(app)
    .get("/api/articles?sort_by=created_at&order=asc")
    .expect(200)
    .then(({ body }) => {
      const { articles } = body;
      expect(articles).toBeInstanceOf(Array);
      expect(articles).toBeSortedBy("created_at", { descending: false });
    });
});
test("GET: 400 - responds with an error when sort_by column is invalid", () => {
  return request(app)
    .get("/api/articles?sort_by=invalid_column")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad request");
    });
});
describe("GET /api/articles?topic", () => {
  test("GET: 200 - articles should be filtered by the topic value specified in the query", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toHaveLength(12);
        articles.forEach((article) => {
          expect(article).toHaveProperty("article_id", expect.any(Number));
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("topic", "mitch");
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
          expect(article).toHaveProperty("comment_count", expect.any(Number));
        });
      });
  });
});
test("GET: 200 - if topic query is valid but has no articles relating to it, return an empty array", () => {
  return request(app)
    .get("/api/articles?topic=paper")
    .expect(200)
    .then(({ body }) => {
      const { articles } = body;
      expect(articles).toEqual([]);
    });
});
test("GET: 404 - sends an appropriate status and error message when querying a topic that does not exist", () => {
  return request(app)
    .get("/api/articles?topic=notatopic")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Topic not found");
    });
});
describe("GET /api/articles/:article_id comment_count", () => {
  test("GET: 200 - responds with the total count of all the comments from the specified article id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toHaveProperty("article_id", 1);
        expect(article).toHaveProperty("author", expect.any(String));
        expect(article).toHaveProperty("title", expect.any(String));
        expect(article).toHaveProperty("topic", expect.any(String));
        expect(article).toHaveProperty("created_at", expect.any(String));
        expect(article).toHaveProperty("votes", expect.any(Number));
        expect(article).toHaveProperty("article_img_url", expect.any(String));
        expect(article).toHaveProperty("comment_count", 11);
      });
  });
});