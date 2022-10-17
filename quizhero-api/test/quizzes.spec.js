const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");
const should = chai.should();
const BlueBird = require("bluebird");
const db = require("../models");
const { suiteSetup, suiteTeardown } = require("mocha");
const Quiz = db.Quiz;

chai.use(chaiHttp);

const setup = (...quizzes) => {
  return BlueBird.mapSeries(quizzes, (quiz) => {
    return chai
      .request(server)
      .post("/quizzes")
      .send(quiz)
      .then((response) => {
        return response.body;
      });
  });
};

describe("quizzes_api", () => {
  const topic_1_1 = {
    name: "coff",
    description: "Drink Coffee",
    imageUrl: "tinyurl.com/abc",
  };

  const topic_2_1 = {
    name: "Bex",
    description: "Workout",
    imageUrl: "tinyurl.com/a32bc",
  };

  const quiz_1_1 = {
    topicId: 1,
    name: "Drink Coffee",
    statusId: 2,
  };

  const quiz_2_1 = {
    topicId: 2,
    name: "Workout",
    statusId: 3,
  };

  const quiz_2_2 = {
    topicId: 2,
    name: "Eat Breakfast",
    statusId: 4,
  };

  const quiz_1_2 = {
    topicId: 1,
    name: "Eat Lunch",
    statusId: 1,
  };

  suiteSetup(async () => {
    await db.Topic.drop();
    await db.Topic.sync();
    return BlueBird.mapSeries([topic_1_1, topic_2_1], async (topic) => {
      return chai
        .request(server)
        .post("/topics")
        .send(topic)
        .then((response) => {
          return response.body;
        });
    });
  });

  suiteTeardown(async () => {
    await db.Topic.drop();
    await db.Topic.sync();
  });

  beforeEach(async () => {
    await Quiz.sync();
  });

  afterEach(async () => {
    await Quiz.drop();
    await Quiz.sync();
  });

  it("should create a new quiz", async () => {
    const response = await chai.request(server).post("/quizzes").send(quiz_1_1);
    response.should.have.status(201);
    delete response.body.id;
    delete response.body.createdAt;
    delete response.body.updatedAt;
    response.body.should.eql(quiz_1_1);
  });

  it("should fetch all the quizzes", async () => {
    const results = await setup(quiz_1_1, quiz_1_2, quiz_2_1, quiz_2_2);
    const response = await chai.request(server).get("/quizzes");
    response.should.have.status(200);
    response.body.should.eql(results);
  });

  it("should fetch no quizzes if no matching results are present for topicId", async () => {
    const results = await setup(quiz_1_1, quiz_1_2, quiz_2_1, quiz_2_2);
    const response = await chai.request(server).get("/quizzes?topicId=13");
    response.should.have.status(200);
    response.body.should.eql([]);
  });

  it("should fetch no quizzes if no matching results are present after the date", async () => {
    const results = await setup(quiz_1_1, quiz_1_2, quiz_2_1, quiz_2_2);
    const response = await chai
      .request(server)
      .get("/quizzes?after=1998448504000");
    response.should.have.status(200);
    response.body.should.eql([]);
  });

  it("should fetch all the quizzes for a topicId", async () => {
    const results = await setup(quiz_1_1, quiz_1_2, quiz_2_1, quiz_2_2);
    const response = await chai.request(server).get("/quizzes?topicId=2");
    response.should.have.status(200);
    response.body.should.eql([results[2], results[3]]);
  });

  it("should fetch all the quizzes after the date", async () => {
    const results1 = await setup(quiz_1_1, quiz_1_2);
    const then = new Date();
    const results2 = await setup(quiz_2_1, quiz_2_2);
    const response = await chai
      .request(server)
      .get("/quizzes?after=" + then.getTime());
    response.should.have.status(200);
    response.body.should.eql([results2]);
  });

  it("should fetch all the quizzes for a topic after the date", async () => {
    const results1 = await setup(quiz_1_1, quiz_1_2);
    const then = new Date();
    const results2 = await setup(quiz_2_1, quiz_2_2);
    const response = await chai
      .request(server)
      .get("/quizzes?topicId=2&after=" + then.getTime());
    response.should.have.status(200);
    response.body.should.eql([results2]);
  });

  it("should fetch a single quiz", async () => {
    const [quiz] = await setup(quiz_2_2);
    const response = await chai.request(server).get(`/quizzes/${quiz.id}`);
    response.should.have.status(200);
    response.body.should.eql(quiz);
  });

  it("should get 404 if the quiz ID does not exist", async () => {
    const response = await chai.request(server).get(`/quizzes/32323`);
    response.should.have.status(404);
    response.text.should.eql("ID not found");
  });

  it("should get 405 for a put request to /quizzes/:id", async () => {
    const [quiz] = await setup(quiz_2_2);
    const response = await chai
      .request(server)
      .put(`/quizzes/${quiz.id}`)
      .send(quiz);
    response.should.have.status(405);
  });

  it("should get 405 for a patch request to /quizzes/:id", async () => {
    const [quiz] = await setup(quiz_2_2);
    const response = await chai
      .request(server)
      .patch(`/quizzes/${quiz.id}`)
      .send(quiz);
    response.should.have.status(405);
  });

  it("should get 405 for a delete request to /quizzes/:id", async () => {
    const [quiz] = await setup(quiz_2_2);
    const response = await chai.request(server).delete(`/quizzes/${quiz.id}`);
    response.should.have.status(405);
  });
});
