import chai from "chai";
import chaiHttp from "chai-http";
import {token} from "./userRoute.test.js";

import {app as server} from "../index.js";

let articleId;
chai.should();
chai.use(chaiHttp);

describe("POST /api/article", () => {
  it("It should not create a new article because The title is missing", (done) => {
    const article = {
      
    
      picture: "",
      articleDetail: "Go lang is a new and simple language",
      tag: "Golang",
    };
   chai
      .request(server)
      .post("/api/article")
      .set({ "Authorization": `Bearer ${token}` })
      .send(article)
      .end((err, response) => {
        response.should.have.status(400);      
        done();
      });
  });
  it("It should not create a new article because it does not have credentials ", (done) => {
    const article = {
      title: "Introduction to Golang",
      picture: "",
      articleDetail: "Go lang is a new and simple language",
      tag: "Golang",
    };
   chai
      .request(server)
      .post("/api/article")
      .send(article)
      .end((err, response) => {
        response.should.have.status(401);
        
      
        done();
      });
  });
  it("It should create a new article", (done) => {
    const article = {
      title: "Introduction to Golang",
      picture: "",
      articleDetail: "Go lang is a new and simple language",
      tag: "Golang",
    };
   chai
      .request(server)
      .post("/api/article")
      .set({ "Authorization": `Bearer ${token}` })
      .send(article)
      .end((err, response) => {
        response.should.have.status(200);
        response.body.should.be.a("object");
        response.body.should.have.property("_id");
        response.body.should.have.property("title").eq("Introduction to Golang");
       
        response.body.should.have.property("articleDetail").eq("Go lang is a new and simple language");
        response.body.should.have.property("tag").eq("Golang");
        
        response.body.should.have.property("__v").eq(0);
        response.body.should.have.property("created");
        response.body.should.have.property("updated");
      
        done();
      });
  });
  
});

describe("Article API", () => {
  // GET (all article) route test
  describe("GET /api/article", () => {
    it("It should get all articles", (done) => {
      chai
        .request(server)
        .get("/api/article")
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("array");
          articleId = response.body[0]._id;
        //   response.body.length.should.eq(5);
          done();
        });
    });
  });
    it("It should not get articles", (done) => {
      chai
        .request(server)
        .get("/api/articles")
        .end((err, response) => {
          response.should.have.status(404);
          done();
        });
    });
  });

  // GET (single article) route test
  describe("GET /api/article/:id", () => {
    it("It should get a single article", (done) => {
      
      chai
        .request(server)
        .get("/api/article/" + articleId)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("object");
          response.body.should.have.property("_id");
          response.body.should.have.property("title");
          response.body.should.have.property("author");
          response.body.should.have.property("picture");
          response.body.should.have.property("articleDetail");
          response.body.should.have.property("tag");
         
          response.body.should.have.property("__v");
          response.body.should.have.property("created");
          response.body.should.have.property("updated");
          response.body.should.have.property("_id").eq(articleId);
          done();
        });
    });
    it("It should not get a single article", (done) => {
      const articleId = "1234454";
      chai
        .request(server)
        .get("/api/article/" + articleId)
        .end((err, response) => {
          response.should.have.status(404);
          done();
        });
    });
  });
  
  // PATCH route test
  describe("PATCH /api/article/:id", () => {
    it("It should not update an article because there is no security token", (done) => {
      const article = {
        title: "Introduction to Heroku",

        picture: "",
        articleDetail: "Updated article",
        tag: "Heroku",
       
      };
     chai
        .request(server)
        .patch("/api/article/"+ articleId)
        .send(article)
        .end((err, response) => {
          response.should.have.status(401);
          done();
        });
    });
    it("It should not update an article because there is no article", (done) => {
      const article = {
        title: "",
  
        picture: "Nice pic",
        articleDetail: "Updated article",
        tag: "Heroku",
       
      };
     chai
        .request(server)
        .patch("/api/article/"+ articleId)
        .send(article)
        .end((err, response) => {
          response.should.have.status(401);
          done();
        });
    });
    it("It should update an article", (done) => {
      const article = {
        title: "Introduction to Heroku",
        
        picture: "Nice pic",
        articleDetail: "Updated article",
        tag: "Heroku",
       
      };
     chai
        .request(server)
        .patch("/api/article/"+ articleId)
        .set({ "Authorization": `Bearer ${token}` })
        .send(article)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("object");
          response.body.should.have.property("_id");
          response.body.should.have.property("title").eq("Introduction to Heroku");
         
          response.body.should.have.property("picture").eq("https://www.kindpng.com/imgv/iThJmoo_white-gray-circle-avatar-png-transparent-png/");
          response.body.should.have.property("articleDetail").eq("Updated article");
          response.body.should.have.property("tag").eq("Heroku");
         
          response.body.should.have.property("__v").eq(0);
          response.body.should.have.property("created");
          response.body.should.have.property("updated");
          done();
        });
    });
    
  });

  // DELETE route test
  describe("DELETE /api/article/:id", () => { 
    it("It should delete a single article", (done) => {
      const deleteId = articleId;
      chai
        .request(server)
        .delete("/api/article/" + articleId)
        .end((err, response) => {
          response.should.have.status(401);  
          done();
        });
      });
      
    it("It should delete a single article", (done) => {
      const deleteId = articleId;
      chai
        .request(server)
        .delete("/api/article/" + articleId)
        .set({ "Authorization": `Bearer ${token}` })
        .end((err, response) => {
          response.should.have.status(204);     
          done();
        });
      });
   
    });