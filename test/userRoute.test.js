import chai from "chai";
import chaiHttp from "chai-http";
import {app as server}  from "../index.js";
export let token = "";
let userId;
chai.should();
chai.use(chaiHttp);

// POST route test
describe("POST /api/user", () => {
  it("It should create a new user", (done) => {
    const user = {
      name: "Tuyizere Alphonse",
      email: "tuyiste12@gmail.com",
      password: "hsgxs121d",
      userStatus: 2
    };
    chai.request(server)
      .post("/api/user")
      .send(user)
      .end((err, response) => {
        response.should.have.status(200);
        response.body.should.be.a("object");
        response.body.should.have.property("_id");
        response.body.should.have.property("name").eq("Tuyizere Alphonse");
        response.body.should.have.property("email").eq("tuyiste12@gmail.com");
        response.body.should.have.property("password");
        response.body.should.have.property("__v").eq(0);
        response.body.should.have.property("created");
        response.body.should.have.property("updated");
        done();
      });
  });
  it("It should not create a new user because the email already exist", (done) => {
    const user = {
      name: "Tuyizere Alphonse",
      email: "tuyiste12@gmail.com",
      password: "hsgxs121d",
      userStatus: 2
    };
    chai.request(server)
      .post("/api/user")
      .send(user)
      .end((err, response) => {
        response.should.have.status(400);
        done();
      });
  });
});
//  LOGIN post route
describe("POST /api/login", () => {
  it("It should not log into session a new user because the credetials are wrong", (done) => {
    const user = {
      
      email: "tuyiste12@gmail.com",
      password: "123Invalid password123",

    };
    chai.request(server)
      .post("/api/login")
      .send(user)
      .end((err, response) => {
        response.should.have.status(401);
        done();
      });
  });
  it("It should log into session a new user", (done) => {
    const user = {
      
      email: "tuyiste12@gmail.com",
      password: "hsgxs121d",

    };
    chai.request(server)
      .post("/api/login")
      .send(user)
      .end((err, response) => {
       
        response.should.have.status(200);
        response.body.should.be.a("object");
        response.body.should.have.property("accessToken");
        token = response.body.accessToken;
        done();
      });
  });
  
});


  // GET (all users) route test
  describe("GET /api/user", () => {
    it("It should not get users the path is not right", (done) => {
      chai
        .request(server)
        .get("/api/users")
        .set({ "Authorization": `Bearer ${token}` })
        .end((err, response) => {
          response.should.have.status(404);
          done();
        });
    });
    it("It should not get all users because there it is not allowed without security token", (done) => {
      chai
        .request(server)
        .get("/api/user")
        .end((err, response) => {
          response.should.have.status(401);
          done();
        });
    });
    it("It should get all users", (done) => {
      chai
        .request(server)
        .get("/api/user")
        .set({ "Authorization": `Bearer ${token}` })
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("array");
          userId = response.body[0]._id;
          // response.body.length.should.eq(1);
          done();
        });
    });
    
  });

  // GET (single user) route test
  describe("GET /api/user/:id", () => {
    it("It should get a single user", (done) => {
      chai
        .request(server)
        .get("/api/user/" + userId)
        .set({ "Authorization": `Bearer ${token}` })
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("object");
          response.body.should.have.property("_id");
          response.body.should.have.property("name");
          response.body.should.have.property("email");
          response.body.should.have.property("password");

          response.body.should.have.property("_id").eq(userId);
          done();
        });
    });
    it("It should not get user because there is no credential", (done) => {
      chai
        .request(server)
        .get("/api/user/" + userId)
        .end((err, response) => {
          response.should.have.status(401);
          done();
        });
    });
    it("It should not get a single user because of invalid user id", (done) => {
      const userId = "1234454";
      chai
        .request(server)
        .get("/api/user/" + userId)
        .set({ "Authorization": `Bearer ${token}` })
        .end((err, response) => {
          response.should.have.status(404);
          response.text.should.be.eq('{"error":"this user does not exist"}');
          done();
        });
    });
  });
  
  // PATCH route test
  describe("PATCH /api/user/:id", () => {
    it("It should update an user", (done) => {
      const user = {
        name: "Tuyizere Alpha",
        email: "tuyiste123@gmail.com",
        password: "hsgxs121d",
      };
      chai
        .request(server)
        .patch("/api/user/" + userId)
        .set({ "Authorization": `Bearer ${token}` })
        .send(user)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("object");
          response.body.should.have.property("_id");
          response.body.should.have.property("name").eq("Tuyizere Alpha");
          response.body.should.have.property("email").eq("tuyiste123@gmail.com");
          response.body.should.have.property("password");

          response.body.should.have.property("created");
          response.body.should.have.property("updated");
          done();
        });
    });
  });

  // DELETE route test
  describe("DELETE /api/user/:id", () => {
    it("It should not delete a user because of no credentials", (done) => {
      chai
        .request(server)
        .delete("/api/user/" + userId)
        .end((err, response) => {
          response.should.have.status(401);

          done();
        });
    });
    it("It should get a single user", (done) => {
      chai
        .request(server)
        .delete("/api/user/" + userId)
        .set({ "Authorization": `Bearer ${token}` })
        .end((err, response) => {
          response.should.have.status(204);

          done();
        });
    });
  });



