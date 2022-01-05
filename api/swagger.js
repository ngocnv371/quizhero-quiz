const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });
require("dotenv").config();

const doc = {
  info: {
    version: "0.0.1",
    title: "Quiz API",
    description: "Manage Quizzes",
  },
  host: `localhost:${process.env.PORT}`,
  basePath: "/",
  schemes: ["http"],
  consumes: ["application/json"],
  produces: ["application/json"],
  tags: [
    {
      name: "Quiz",
      description: "Handle quizzes",
    },
  ],
  securityDefinitions: {},
  definitions: {
    Status: {
      id: 1,
      name: "Status",
    },
    Quiz: {
      id: 1,
      name: "Quiz",
      topicId: 1,
      statusId: 1,
      createdById: 1,
      createdAt: "2020-03-31T00:00:00.000Z",
    },
    Question: {
      id: 1,
      text: "what?",
      choice0: "one",
      choice1: "two",
      choice2: "three",
      choice3: "four",
      correct0: 1,
      correct1: 0,
      correct2: 0,
      correct3: 0,
      createdBy: 1,
      createdAt: "2020-03-31T00:00:00.000Z",
    },
    QuizExtended: {
      id: 1,
      name: "Quiz",
      topicId: 1,
      statusId: 1,
      createdById: 1,
      createdAt: "2020-03-31T00:00:00.000Z",
      questions: [{ $ref: "#/definitions/Question" }],
    },
    AddQuiz: {
      name: "Quiz",
      topicId: 1,
      questions: [{ $ref: "#/definitions/Question" }],
    },
    UpdateQuizStatus: {
      statusId: 1,
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [{ bearerAuth: [] }],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./src/routes/index.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
