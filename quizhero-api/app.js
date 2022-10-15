var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");

require("./connection");

var app = express();

var indexRouter = require("./routes/index");
var topicsRouter = require("./routes/topics");
// view engine setup
app.set("view engine", "jade");

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/topics", topicsRouter);

module.exports = app;
