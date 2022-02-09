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
const PORT = process.env.PORT || 3000
// app.use(cors)
const options = {
  //Those are the specs of swagger
  apis : ["./routes/*.js"],
  definition: {
    
     openapi: '3.0.0',
    info: {
      title: 'Nestor brand portfolio project api',
      version: '1.0.0',
      description:
        "API for my project which include the Article API, Message API and User API it have all CRUD operations\
         authentication and its authorizations",
    },
    
    paths: {},
    security: [
      {
        bearerAuth: [],
      },
    ],
    components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'bearerAuth',
            in: 'header'
          }
        }}
        }
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


mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
  app.use(passport.initialize());
  app.use(express.json());

  // app.use(passport.session())

  app.use("/api", articleRoutes, userRoutes, messageRoutes);

 app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
  });
}).catch(error=>console.log(error))

