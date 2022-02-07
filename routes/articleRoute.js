import express from "express";
import { Article } from "../models/articles.js";
import { authenticateToken, isAuthor, isAdmin } from "./userRoute.js";
const router = express.Router();
export { router as articleRoutes };

/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: Article API for my portfolio project
 */
// get all articles
/**
 * @swagger
 *   components:
 *    schemas:
 *       Article:
 *          type:  object
 *          required:
 *             - title
 *             - author
 *             - articleDetail
 *             - picture
 *             - created
 *             - updated
 *             - tags
 *             - comments
 *             - likes
 *             - dislikes
 *          properties:
 *                  id:
 *                     type: string
 *                     description: auto generated by mongoose
 *                  title:
 *                     type: string
 *                     description: title of the article
 *                  author:
 *                     type: string
 *                     description: author of the article
 *                  articleDetail:
 *                     type: string
 *                     description: Detail of the article of the article
 *                  picture:
 *                     type: string
 *                     description: picture of the article
 *                  created:
 *                     type: Date
 *                     description: creation date of the article
 *                  updated:
 *                     type: Date
 *                     description: last updated of the article
 *                  tags:
 *                     type: string
 *                     description: tag of the article
 *                  comments:
 *                     type: object
 *                     description: comments of the article
 *                     required:
 *                          - commentor
 *                          - comment
 *                     properties:
 *                          commentor:
 *                            type: string
 *                            description: user id of the user who have commented on the article
 *                          comment:
 *                            type: string
 *                            description: what user have comment on the article
 *                  likes:
 *                     type: string
 *                     description: likes of the article
 *                  dislikes:
 *                     type: string
 *                     description: dislikes of the article
 *
 */

/**
 * @swagger
 * /api/article:
 *    get:
 *      tags: [Article]
 *      summary: Returns all the articles
 *      responses:
 *         200:
 *            description: The list of all articles
 *            content:
 *               application/json:
 *                   schemas:
 *                      type: array
 *                      items:
 *                         $ref: '#/components/schemas/Article'
 *
 */

router.get("/article", async (req, res) => {
  const articles = await Article.find();
  res.send(articles);
});
//  getting individual article route

/**
 * @swagger
 * /api/article/{id}:
 *  get:
 *   summary: get the article by id
 *   tags: [Article]
 *   parameters:
 *      - in: path
 *        name: id
 *        schema:
 *           type: string
 *        required: true
 *        description: article Id
 *   responses:
 *       200:
 *         description: The article was successfully retrieved
 *         contents:
 *            application/json:
 *                schema:
 *                   $ref: '#/components/schemas/Article'
 *       404:
 *         description: The article with that id was not found
 */
router.get("/article/:id", async (req, res) => {
  try {
    const article = await Article.findOne({ _id: req.params.id });

    res.send(article);
  } catch {
    res.status(404).send({ error: "this article id does not exist" });
  }
});
// create an article
/**
 * @swagger
 * /api/article:
 *    post:
 *      summary: create a new article
 *      tags: [Article]
 *      parameters:
 *        - name: auth
 *          in: header
 *          description: an authorization header
 *          required: true
 *          type: string
 *      requestBody:
 *         type: object
 *         required: true
 *         content:
 *            application/json:
 *                  schema:
 *                     $ref: '#/components/schemas/Article'
 *      responses:
 *         200:
 *            description: The article was successfully created
 *            content:
 *               application/json:
 *                    schemas:
 *                        $ref: '#/components/schemas/Article'
 *         500:
 *            description: Server Error
 *              
 *        
 */

router.post("/article", authenticateToken, isAuthor, async (req, res) => {
  const article = new Article({
    title: req.body.title,
    author: req.body.author,
    picture: req.body.picture,
    articleDetail: req.body.articleDetail,
    tag: req.body.tag,
    comments: [],
    likes: 0,
    disLikes: 0,
  });
  try {
    await article.save();
    res.send(article);
  } catch (error) {
    res.status(400);
    res.send(error.message);
  }
});
// updating an article route

/**
 * @swagger
 * /api/article/{id}:
 *  patch:
 *   summary: Update the article by id
 *   tags: [Article]
 *   parameters:
 *      - in: path
 *        name: id
 *        schema:
 *           type: string
 *        required: true
 *        description: article Id
 *   requestBody:
 *         type: object
 *         required: true
 *         content:
 *            application/json:
 *                  schema:
 *                     $ref: '#/components/schemas/Article'
 *   responses:
 *       200:
 *         description: The article was successfully update
 *         contents:
 *            application/json:
 *                schema:
 *                   $ref: '#/components/schemas/Article'
 *       404:
 *         description: The article with that id was not found
 *       500:
 *         description: Server Error
 */
router.patch("/article/:id", authenticateToken, isAuthor, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (req.body.title) {
      article.title = req.body.title;
    }
    if (req.body.picture) {
      article.picture = req.body.picture;
    }
    if (req.body.author) {
      article.author = req.body.author;
    }
    if (req.body.articleDetail) {
      article.articleDetail = req.body.articleDetail;
    }
    if (req.body.tag) {
      article.tag = req.body.tag;
    }
    article.updated = Date.now();
    await article.save();
    res.json(article);
  } catch (error) {
    res.status(400);
    res.send(error.message);
  }
});
// Deleting an article route

/**
 * @swagger
 * /api/article/{id}:
 *  delete:
 *   summary: delete the article by id
 *   tags: [Article]
 *   parameters:
 *      - in: path
 *        name: id
 *        schema:
 *           type: string
 *        required: true
 *        description: article Id
 *   responses:
 *       204:
 *         description: The article was successfully deleted
 *         contents:
 *            application/json:
 *                schema:
 *                   $ref: '#/components/schemas/Article'
 *       404:
 *         description: The article with that id was not found
 */
router.delete("/article/:id", authenticateToken, isAuthor, async (req, res) => {
  try {
    await Article.deleteOne({ _id: req.params.id });
    res.status(204).send();
  } catch {
    res.status(404).send({ error: "That post is not available " });
  }
});
