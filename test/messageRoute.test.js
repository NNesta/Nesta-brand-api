import chai from "chai";
import chaiHttp from "chai-http";
import { app as server } from "../index.js";
import { token } from "./userRoute.test.js";
let messageId;
chai.should();
chai.use(chaiHttp);

// POST route test
describe("POST /api/message", () => {
  it("It should create a new message", (done) => {
    const message = {
      name: "Tuyizere Alphonse",
      email: "tuyiste@gmail.com",
      message: "Hello there",
    };
    chai
      .request(server)
      .post("/api/message")
      .send(message)
      .end((err, response) => {
        response.should.have.status(200);
        response.body.should.be.a("object");
        response.body.should.have.property("_id");
        response.body.should.have.property("name").eq("Tuyizere Alphonse");
        response.body.should.have.property("email").eq("tuyiste@gmail.com");
        response.body.should.have.property("message").eq("Hello there");
        response.body.should.have.property("__v").eq(0);
        response.body.should.have.property("created");
        response.body.should.have.property("updated");
        done();
      });
  });
});

// GET (all messages) route test
describe("GET all message route test", () => {
  it("It should not get messages because of invalid url", (done) => {
    chai
      .request(server)
      .get("/api/messages")
      .set({ Authorization: `Bearer ${token}` })
      .end((err, response) => {
        response.should.have.status(404);
        done();
      });
  });
  it("It should not get messages because of missing security token", (done) => {
    chai
      .request(server)
      .get("/api/message")
      .end((err, response) => {
        response.should.have.status(401);
        done();
      });
  });
  it("It should get all messages", (done) => {
    chai
      .request(server)
      .get("/api/message")
      .set({ Authorization: `Bearer ${token}` })
      .end((err, response) => {
        response.should.have.status(200);
        response.body.should.be.a("array");
        // response.body.length.should.eq(1);
        messageId = response.body[0]._id;
        //console.log(messageId);
        done();
      });
  });
});

// GET (single message) route test
describe("GET get single message", () => {
  it("It should not get a single message because of invalid message id", (done) => {
    const messageId = "1234454 invalid id";
    chai
      .request(server)
      .get("/api/message/" + messageId)
      .set({ Authorization: `Bearer ${token}` })
      .end((err, response) => {
        response.should.have.status(404);
        response.text.should.be.eq('{"error":"this message does not exist"}');
        done();
      });
  });
  it("It should not get a single message beacuse there is no security token", (done) => {
    const messageId = "1234454";
    chai
      .request(server)
      .get("/api/message/" + messageId)
      .end((err, response) => {
        response.should.have.status(401);
        response.text.should.be.eq("Unauthorized");
        done();
      });
  });
  it("It should get a single message", (done) => {
    chai
      .request(server)
      .get("/api/message/" + messageId)
      .set({ Authorization: `Bearer ${token}` })
      .end((err, response) => {
        response.should.have.status(200);
        response.body.should.be.a("object");
        response.body.should.have.property("_id");
        response.body.should.have.property("name");
        response.body.should.have.property("email");
        response.body.should.have.property("message");

        response.body.should.have.property("_id").eq(messageId);
        done();
      });
  });
});

// PATCH route test
describe("PATCH /api/message/:id", () => {
  it("It should update an message", (done) => {
    const message = {
      name: "Tuyizere Alpha",
      email: "tuyiste@gmail.com",
      message: "hsgxs121d",
    };
    chai
      .request(server)
      .patch("/api/message/" + messageId)
      .set({ Authorization: `Bearer ${token}` })
      .send(message)
      .end((err, response) => {
        response.should.have.status(200);
        response.body.should.be.a("object");
        response.body.should.have.property("_id");
        response.body.should.have.property("name").eq("Tuyizere Alpha");
        response.body.should.have.property("email").eq("tuyiste@gmail.com");
        response.body.should.have.property("message").eq("hsgxs121d");

        response.body.should.have.property("created");
        response.body.should.have.property("updated");
        done();
      });
  });
});

// DELETE route test
describe("DELETE /api/message/:id", () => {
  it("It should not delete a message because of invalid message Id", (done) => {
    const deleteId = "123jhdf123";
    chai
      .request(server)
      .delete("/api/message/" + deleteId)
      .set({ Authorization: `Bearer ${token}` })
      .end((err, response) => {
        response.should.have.status(404);
        done();
      });
  });
  it("It should not delete a message because of missing security token", (done) => {
    chai
      .request(server)
      .delete("/api/message/" + messageId)
      .end((err, response) => {
        response.should.have.status(401);
        done();
      });
  });
  it("It should get a single message", (done) => {
    chai
      .request(server)
      .delete("/api/message/" + messageId)
      .set({ Authorization: `Bearer ${token}` })
      .end((err, response) => {
        response.should.have.status(204);

        done();
      });
  });
});
