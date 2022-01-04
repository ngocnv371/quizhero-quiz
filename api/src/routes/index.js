const quizzes = require("./quizzes");
const statuses = require("./statuses");

module.exports = (app) => {
  app.use("/statuses", statuses);
  app.use("/", quizzes);
};
