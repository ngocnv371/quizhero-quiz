
//const statuses = require("./statuses");
var express = require("express");
var router = express.Router();
require("./quizzes")(router);
require("./questions")(router);

module.exports = (app) => {
  //app.use("/questions", questions);
  //app.use("/statuses", statuses);
  app.use("/", router);
};
