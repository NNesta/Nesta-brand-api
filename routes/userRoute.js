import jwt from "jsonwebtoken";
import express from "express";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import passport from "passport";
const router = express.Router();
export { router as userRoutes };

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User API for my portfolio project
 */
// get all users
/**
 * @swagger
 * components:
 *    schemas:
 *       User:
 *          type:  object
 *          required:
 *             - name
 *             - email
 *             - location
 *             - password
 *             - created
 *             - updated
 *
 *          properties:
 *                  id:
 *                     type: string
 *                     description: auto generated by mongoose
 *                  name:
 *                     type: string
 *                     description: name of the user
 *                  email:
 *                     type: string
 *                     description: email of the user
 *                  location:
 *                     type: object
 *                     description: Location of the user of the user*
 *                     required:
 *                          - latitude
 *                          - longitude
 *                     properties:
 *                          latitude:
 *                            type: number
 *                            description: The latitude of the user
 *                          longitude:
 *                            type: string
 *                            description: The longitude of the user
 *                  password:
 *                     type: string
 *                     description: password of the user
 *                  created:
 *                     type: Date
 *                     description: creation date of the user
 *                  updated:
 *                     type: Date
 *                     description: last updated of the user
 */

/**
 * @swagger
 * /api/user:
 *    get:
 *      tags: [User]
 *      summary: Returns all the users
 *      responses:
 *         200:
 *            description: The list of all users
 *            content:
 *               application/json:
 *                   schemas:
 *                      type: array
 *                      items:
 *                         $ref: '#/components/schemas/User'
 *
 */
// get all users
router.get("/user", authenticateToken, isAdmin, async (req, res) => {
  const users = await User.find();
  res.send(users);
});
//  getting individual user route

/**
 * @swagger
 * /api/user/{id}:
 *  get:
 *   summary: get the user by id
 *   tags: [User]
 *   parameters:
 *      - in: path
 *        name: id
 *        schema:
 *           type: string
 *        required: true
 *        description: user Id
 *   responses:
 *       200:
 *         description: The user was successfully retrieved
 *         contents:
 *            application/json:
 *                schema:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: The user with that id was not found
 */
router.get("/user/:id", authenticateToken, isOwnerOrAdmin, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    res.send(user);
  } catch {
    res.status(404).send({ error: "this user does not exist" });
  }
});

// create a new user
/**
 * @swagger
 * /api/user:
 *    post:
 *      summary: create a new user
 *      tags: [User]
 *      requestBody:
 *         type: object
 *         required: true
 *         content:
 *            application/json:
 *                  schema:
 *                     $ref: '#/components/schemas/User'
 *      responses:
 *         200:
 *            description: The user was successfully created
 *            content:
 *               application/json:
 *                    schemas:
 *                        $ref: '#/components/schemas/User'
 *         500:
 *            description: Server Error
 *
 *
 */
router.post("/user", async (req, res) => {
  console.log(req.body);
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = new User({
    firstName: req.body.firstName,
    secondName: req.body.secondName,
    email: req.body.email,
    userStatus: req.body.userStatus,
    location: { longitude: req.body.longitude, latitude: req.body.latitude },
    password: hashedPassword,
  });
  try {
    await user.save();
    //console.log(user);
    res.send(user);
  } catch (error) {
    res.status(400);
    res.send(error.message);
  }
});

// updating a User route

/**
 * @swagger
 * /api/user/{id}:
 *  patch:
 *   summary: Update the user by id
 *   tags: [User]
 *   parameters:
 *      - in: path
 *        name: id
 *        schema:
 *           type: string
 *        required: true
 *        description: user Id
 *   requestBody:
 *         type: object
 *         required: true
 *         content:
 *            application/json:
 *                  schema:
 *                     $ref: '#/components/schemas/User'
 *   responses:
 *       200:
 *         description: The User was successfully update
 *         contents:
 *            application/json:
 *                schema:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: The user with that id was not found
 *       500:
 *         description: Server Error
 */
router.patch(
  "/user/:id",
  authenticateToken,
  isOwnerOrAdmin,
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (req.body.firstName) {
        user.name = req.body.firstName;
      }
      if (req.body.secondName) {
        user.name = req.body.secondName;
      }
      if (req.body.email) {
        user.email = req.body.email;
      }
      if (req.body.password) {
        user.password = req.body.password;
      }

      await user.save();
      res.json(user);
    } catch (error) {
      res.status(400);
      res.send(error.message);
    }
  }
);

// Deleting a user route

/**
 * @swagger
 * /api/user/{id}:
 *  delete:
 *   summary: delete the user by id
 *   tags: [User]
 *   parameters:
 *      - in: path
 *        name: id
 *        schema:
 *           type: string
 *        required: true
 *        description: user Id
 *   responses:
 *       204:
 *         description: The user was successfully deleted
 *         contents:
 *            application/json:
 *                schema:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: The user with that id was not found
 */
router.delete(
  "/user/:id",
  authenticateToken,
  isOwnerOrAdmin,
  async (req, res) => {
    try {
      await User.deleteOne({ _id: req.params.id });
      res.status(204).send();
    } catch {
      res.status(404).send({ error: "That post is not available " });
    }
  }
);

// Log in
/**
 * @swagger
 * /api/login:
 *    post:
 *      summary: Log in
 *      tags: [User]
 *      requestBody:
 *         type: object
 *         required: true
 *         content:
 *            application/json:
 *                  schema:
 *                      required:
 *                         - email
 *                         - password
 *                      properties:
 *                          email:
 *                             type: string
 *                             description: email of the user
 *                          password:
 *                             type: string
 *                             description: password of the user
 *
 *      responses:
 *         200:
 *            description: The user has logged in
 *         500:
 *            description: Server Error
 *
 *
 */
router.post("/login", passport.authenticate("local"), (req, res) => {
  console.log(res.message);
  console.log("tried to login");
  let user = {
    id: req.user._id,
    name: `${req.user.firstName} ${req.user.secondName}`,
    email: req.user.email,
    userStatus: req.user.userStatus,
  };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.status(200).json({ accessToken: accessToken });
});

export function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == undefined) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    //console.log(user);
    next();
  });
}
export function isAuthor(req, res, next) {
  if (req.user.userStatus < 1) return res.status(403).send("Unauthorized");
  next();
}
export function isAdmin(req, res, next) {
  //console.log(req.user);
  if (req.user.userStatus < 2) return res.status(403).send("Unauthorized");
  next();
}
export function isOwnerOrAdmin(req, res, next) {
  if (req.user.userStatus >= 2 || req.user.id == req.params.id) next();
  else {
    return res.status(403).send("Unauthorized");
  }
}
