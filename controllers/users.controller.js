const { allUsers } = require("../models/users.model");

exports.getUsers = (req, res, next) => {
  const validQueries = [];
  const queryKeys = Object.keys(req.query);

  if (
    queryKeys.length > 0 &&
    !queryKeys.every((key) => validQueries.includes(key))
  ) {
    return res.status(400).send({ msg: "Bad request" });
  }
  allUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};
