var express = require("express");
require("dotenv").config();
const cors = require("cors");
var jwt = require("express-jwt");
var jwks = require("jwks-rsa");
var path = require("path");
var cookieParser = require("cookie-parser");
var expressWinston = require("express-winston");
require("./connection");

var app = express();

var indexRouter = require("./routes/index");
var topicsRouter = require("./routes/topics");
var quizzesRouter = require("./routes/quizzes");
var logsRouter = require("./routes/logs");
const logger = require("./logger");

// enabling CORS for all requests
app.use(cors());

// view engine setup
app.set("view engine", "jade");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

if (process.env.NODE_ENV !== "test") {
  var jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: process.env.JWT_URI,
    }),
    audience: process.env.JWT_AUDIENCE,
    issuer: process.env.JWT_ISSUER,
    algorithms: ["RS256"],
  });

  app.use(jwtCheck);
}

app.use(
  expressWinston.logger({
    winstonInstance: logger,
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    ignoreRoute: function (req, res) {
      return false;
    }, // optional: allows to skip some log messages based on request and/or response
  })
);

app.use("/", indexRouter);
app.use("/topics", topicsRouter);
app.use("/quizzes", quizzesRouter);
app.use("/logs", logsRouter);

module.exports = app;
