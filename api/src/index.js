// importing the dependencies
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
var jwt = require("express-jwt");
var jwks = require("jwks-rsa");
require("dotenv").config();
const mountRoutes = require("./routes");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("../swagger-output.json");

// defining the Express app
const app = express();

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan("combined"));

app.use(
  "/swagger",
  swaggerUi.serve,
  swaggerUi.setup(swaggerFile, {
    swaggerOptions: {
      oauth2RedirectUrl: process.env.ROOT + "/swagger/oauth2-redirect.html",
    },
  })
);

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
app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(err.status).send({ message: err.message });
    console.error(err);
    return;
  }
  next();
});

mountRoutes(app);

// starting the server
app.listen(process.env.PORT, () => {
  console.log(`listening on ${process.env.ROOT}`);
});
