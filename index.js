import express from "express";
import mongoose from "mongoose";
import {articleRoutes} from "./routes/articleRoute.js";
import {userRoutes} from "./routes/userRoute.js";
import {messageRoutes} from "./routes/messageRoute.js";
import passport from "passport";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import "./passport-config.js";
import dotenv from 'dotenv';
dotenv.config();

export const app = express();

const options = {
  //Those are the specs of swagger
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Portifolio project API",
      version: "1.0.0",
      description:
        "API for my project which include the Article API, Message API and User API it have all CRUD operations, authentication and its authorizations",
    },
    servers: [{ url: "http://127.0.0.1:3000/" }]
  },
  apis: ["./routes/*.js"]
};
const specs = swaggerJsDoc(options); //passing specs to swagger jsdoc
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs)); //swagger middleware declaration


let dbURI;
if (process.env.NODE_ENV ==='development'){
  dbURI = process.env.DATABASE_DEV_URL
}
if (process.env.NODE_ENV ==='test'){
  dbURI = process.env.DATABASE_TEST_URL
}
if (process.env.NODE_ENV ==='production'){
  dbURI = process.env.DATABASE_PROD_URL
}


mongoose.connect(dbURI, { useNewUrlParser: true }).then(() => {
  app.use(passport.initialize());
  app.use(express.json());

  // app.use(passport.session())

  app.use("/api", articleRoutes, userRoutes, messageRoutes);

 app.listen(3000, () => {
    console.log("server started");
  });
});

