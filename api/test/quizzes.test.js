const supertest = require("supertest");
require("should");
require("dotenv").config();

const server = supertest.agent(`http://localhost:${process.env.PORT}`);

const FAKE_NAME = "fake quiz";
const FAKE_UPDATED_NAME = "fake updated quiz";
const FAKE_TOPIC = 1;
const FAKE_UPDATED_TOPIC = 2;
const STATUS_DRAFT = 1;
const STATUS_PENDING = 2;
const STATUS_APPROVED = 3;
const STATUS_REJECTED = 4;
const STATUS_DELETED = 5;

describe("quizzes", () => {
  let quizId = 0;
  it("should create a quiz", (done) => {
    server
      .post("/quizzes")
      .send({
        name: FAKE_NAME,
        topicId: FAKE_TOPIC,
      })
      .expect("Content-type", /json/)
      .expect(200)
      .end((err, res) => {
        res.status.should.equal(200);
        res.body.name.should.equal(FAKE_NAME);
        res.body.topicId.should.equal(FAKE_TOPIC);
        res.body.statusId.should.equal(STATUS_DRAFT);
        quizId = res.body.id;
        done();
      });
  });
  it("should fetch a quiz", (done) => {
    server
      .get(`/quizzes/${quizId}`)
      .send()
      .expect("Content-type", /json/)
      .expect(200)
      .end((err, r2) => {
        r2.body.statusId.should.equal(STATUS_DRAFT);
        r2.status.should.equal(200);
        r2.body.name.should.equal(FAKE_NAME);
        r2.body.topicId.should.equal(FAKE_TOPIC);
        r2.body.statusId.should.equal(STATUS_DRAFT);
        done();
      });
  });
  it("should update a quiz", (done) => {
    server
      .put(`/quizzes/${quizId}`)
      .send({
        name: FAKE_UPDATED_NAME,
        topicId: FAKE_UPDATED_TOPIC,
      })
      .expect("Content-type", /json/)
      .expect(200)
      .end((err, res) => {
        res.status.should.equal(200);
        res.body.name.should.equal(FAKE_UPDATED_NAME);
        res.body.topicId.should.equal(FAKE_UPDATED_TOPIC);
        done();
      });
  });
  it("should delete a quiz", (done) => {
    server
      .delete(`/quizzes/${quizId}`)
      .send()
      .expect("Content-type", /json/)
      .expect(200)
      .end((err, r2) => {
        r2.status.should.equal(200);
        // retrive to check status
        server
          .get(`/quizzes/${quizId}`)
          .send()
          .expect("Content-type", /json/)
          .expect(200)
          .end((err, r3) => {
            r3.body.statusId.should.equal(STATUS_DELETED);
            done();
          });
      });
  });
  describe("update status", () => {
    it("should update a quiz status Pending", (done) => {
      server
        .put(`/quizzes/${quizId}/status`)
        .send({
          statusId: STATUS_PENDING,
        })
        .expect("Content-type", /json/)
        .expect(200)
        .end((err, res) => {
          res.status.should.equal(200);
          res.body.statusId.should.equal(STATUS_PENDING);
          done();
        });
    });
    it("should update a quiz status Approved", (done) => {
      server
        .put(`/quizzes/${quizId}/status`)
        .send({
          statusId: STATUS_APPROVED,
        })
        .expect("Content-type", /json/)
        .expect(200)
        .end((err, res) => {
          res.status.should.equal(200);
          res.body.statusId.should.equal(STATUS_APPROVED);
          done();
        });
    });
    it("should update a quiz status Rejected", (done) => {
      server
        .put(`/quizzes/${quizId}/status`)
        .send({
          statusId: STATUS_REJECTED,
        })
        .expect("Content-type", /json/)
        .expect(200)
        .end((err, res) => {
          res.status.should.equal(200);
          res.body.statusId.should.equal(STATUS_REJECTED);
          done();
        });
    });
    it("should update a quiz status Deleted", (done) => {
      server
        .put(`/quizzes/${quizId}/status`)
        .send({
          statusId: STATUS_DELETED,
        })
        .expect("Content-type", /json/)
        .expect(200)
        .end((err, res) => {
          res.status.should.equal(200);
          res.body.statusId.should.equal(STATUS_DELETED);
          done();
        });
    });
    it("should update a quiz status Draft", (done) => {
      server
        .put(`/quizzes/${quizId}/status`)
        .send({
          statusId: STATUS_DRAFT,
        })
        .expect("Content-type", /json/)
        .expect(200)
        .end((err, res) => {
          res.status.should.equal(200);
          res.body.statusId.should.equal(STATUS_DRAFT);
          done();
        });
    });
  });
});
