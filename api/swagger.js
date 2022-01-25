const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });
require("dotenv").config();

const doc = {
  info: {
    version: "0.0.1",
    title: "Quiz API",
    description: "Manage Quizzes",
  },
  host: `localhost:${process.env.PORT}`,
  basePath: "/api",
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
    AddQuestion: {
      text: "what?",
      choice0: "one",
      choice1: "two",
      choice2: "three",
      choice3: "four",
      correct0: 1,
      correct1: 0,
      correct2: 0,
      correct3: 0,
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
    UpdateQuestion: {
      text: "what?",
      choice0: "one",
      choice1: "two",
      choice2: "three",
      choice3: "four",
      correct0: 1,
      correct1: 0,
      correct2: 0,
      correct3: 0,
    },
    QuizExtended: {
      id: 1,
      name: "Quiz",
      topicId: 1,
      statusId: 1,
      createdById: 1,
      createdAt: "2020-03-31T00:00:00.000Z",
      questions: { $ref: "#/definitions/QuestionArray" },
    },
    AddQuiz: {
      name: "Quiz",
      topicId: 1,
    },
    UpdateQuiz: {
      name: "Quiz",
      topicId: 1,
    },
    UpdateQuizStatus: {
      statusId: 1,
    },
    QuizArray: [{ $ref: "#/definitions/Quiz" }],
    QuizSearchResult: {
      search: "query string",
      topics: "1,2,3",
      statuses: "1,2,3",
      sort: "name",
      order: "asc",
      skip: 0,
      take: 10,
      total: 100,
      items: [{ $ref: "#/definitions/QuizArray" }],
    },
    QuestionArray: [{ $ref: "#/definitions/Question" }],
    QuestionSearchResult: {
      search: "query string",
      topics: "1,2,3",
      quizzes: "1,2,3",
      sort: "name",
      order: "asc",
      skip: 0,
      take: 10,
      total: 100,
      items: [{ $ref: "#/definitions/QuestionArray" }],
    },
    Topic: {
      id: 1,
      name: "Topic",
    },
    AddTopic: {
      name: "topic",
    },
    UpdateTopic: {
      name: "Updated topic",
    },
    TopicArray: [{ $ref: "#/definitions/Topic" }],
    TopicSearchResult: {
      search: "query string",
      sort: "name",
      order: "asc",
      skip: 0,
      take: 10,
      total: 100,
      items: [{ $ref: "#/definitions/TopicArray" }],
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
