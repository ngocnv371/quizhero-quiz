const supertest = require("supertest");
require("should");
require("dotenv").config();

const server = supertest.agent(`http://localhost:${process.env.PORT}`);

const FAKE_TEXT = "fake text";
const FAKE_CHOICE0 = "fake choice0";
const FAKE_CHOICE1 = "fake choice1";
const FAKE_CHOICE2 = "fake choice2";
const FAKE_CHOICE3 = "fake choice3";
const FAKE_CORRECT0 = 1;
const FAKE_CORRECT1 = 0;
const FAKE_CORRECT2 = 0;
const FAKE_CORRECT3 = 0;

const FAKE_UPDATED_TEXT = "fake updated text";
const FAKE_UPDATED_CHOICE0 = "fake updated choice0";
const FAKE_UPDATED_CHOICE1 = "fake updated choice1";
const FAKE_UPDATED_CHOICE2 = "fake updated choice2";
const FAKE_UPDATED_CHOICE3 = "fake updated choice3";
const FAKE_UPDATED_CORRECT0 = 0;
const FAKE_UPDATED_CORRECT1 = 1;
const FAKE_UPDATED_CORRECT2 = 1;
const FAKE_UPDATED_CORRECT3 = 0;

describe("questions", () => {
  let quizId = 0;
  before((done) => {
    server
      .post("/quizzes")
      .send({
        name: "quiz",
        topicId: 1,
      })
      .end((err, res) => {
        quizId = res.body.id;
        done();
      });
  });
  let questionId = 0;
  it("should create a question", (done) => {
    server
      .post(`/quizzes/${quizId}/questions`)
      .send({
        text: FAKE_TEXT,
        choice0: FAKE_CHOICE0,
        choice1: FAKE_CHOICE1,
        choice2: FAKE_CHOICE2,
        choice3: FAKE_CHOICE3,
        correct0: FAKE_CORRECT0,
        correct1: FAKE_CORRECT1,
        correct2: FAKE_CORRECT2,
        correct3: FAKE_CORRECT3,
      })
      .end((err, res) => {
        res.body.text.should.equal(FAKE_TEXT);
        res.body.choice0.should.equal(FAKE_CHOICE0);
        res.body.choice1.should.equal(FAKE_CHOICE1);
        res.body.choice2.should.equal(FAKE_CHOICE2);
        res.body.choice3.should.equal(FAKE_CHOICE3);
        res.body.correct0.should.equal(FAKE_CORRECT0);
        res.body.correct1.should.equal(FAKE_CORRECT1);
        res.body.correct2.should.equal(FAKE_CORRECT2);
        res.body.correct3.should.equal(FAKE_CORRECT3);
        questionId = res.body.id;
        done();
      });
  });
  it("should update a question", (done) => {
    server
      .put(`/quizzes/${quizId}/questions/${questionId}`)
      .send({
        text: FAKE_UPDATED_TEXT,
        choice0: FAKE_UPDATED_CHOICE0,
        choice1: FAKE_UPDATED_CHOICE1,
        choice2: FAKE_UPDATED_CHOICE2,
        choice3: FAKE_UPDATED_CHOICE3,
        correct0: FAKE_UPDATED_CORRECT0,
        correct1: FAKE_UPDATED_CORRECT1,
        correct2: FAKE_UPDATED_CORRECT2,
        correct3: FAKE_UPDATED_CORRECT3,
      })
      .end((err, res) => {
        res.body.text.should.equal(FAKE_UPDATED_TEXT);
        res.body.choice0.should.equal(FAKE_UPDATED_CHOICE0);
        res.body.choice1.should.equal(FAKE_UPDATED_CHOICE1);
        res.body.choice2.should.equal(FAKE_UPDATED_CHOICE2);
        res.body.choice3.should.equal(FAKE_UPDATED_CHOICE3);
        res.body.correct0.should.equal(FAKE_UPDATED_CORRECT0);
        res.body.correct1.should.equal(FAKE_UPDATED_CORRECT1);
        res.body.correct2.should.equal(FAKE_UPDATED_CORRECT2);
        res.body.correct3.should.equal(FAKE_UPDATED_CORRECT3);
        done();
      });
  });
  it("should delete a question", (done) => {
    server
      .delete(`/quizzes/${quizId}/questions/${questionId}`)
      .send()
      .end((err, res) => {
        res.status.should.equal(200);
        done();
      });
  });
});
