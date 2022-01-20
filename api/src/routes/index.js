
var express = require("express");
var router = express.Router();
require("./statuses")(router);
require("./topics")(router);
require("./quizzes")(router);
require("./questions")(router);

module.exports = (app) => {
  app.use("/", router);
};
