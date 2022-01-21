const supertest = require("supertest");
require("should");
require("dotenv").config();

const server = supertest.agent(`http://localhost:${process.env.PORT}`);

const FAKE_NAME = "fake name";
const FAKE_UPDATED_NAME = "fake updated name";

describe("topics", () => {
  let topicId = 0;
  it("should create a topic", (done) => {
    server
      .post("/topics")
      .send({
        name: FAKE_NAME,
      })
      .expect("Content-type", /json/)
      .expect(200)
      .end((err, res) => {
        res.status.should.equal(200);
        res.body.name.should.equal(FAKE_NAME);
        topicId = res.body.id;
        done();
      });
  });
  it("should fetch a topic", (done) => {
    server
      .get(`/topics/${topicId}`)
      .send()
      .expect("Content-type", /json/)
      .expect(200)
      .end((err, r2) => {
        r2.status.should.equal(200);
        r2.body.name.should.equal(FAKE_NAME);
        done();
      });
  });
  it("should update a topic", (done) => {
    server
      .put(`/topics/${topicId}`)
      .send({
        name: FAKE_UPDATED_NAME,
      })
      .expect("Content-type", /json/)
      .expect(200)
      .end((err, res) => {
        res.status.should.equal(200);
        res.body.name.should.equal(FAKE_UPDATED_NAME);
        done();
      });
  });
  it("should delete a topic", (done) => {
    server
      .delete(`/topics/${topicId}`)
      .send()
      .expect("Content-type", /json/)
      .expect(200)
      .end((err, r2) => {
        r2.status.should.equal(200);
        done();
      });
  });
});
