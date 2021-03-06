import express from "express";
import { Article } from "../models/articles.js";
import { authenticateToken, isAuthor, isAdmin } from "./userRoute.js";
const router = express.Router();
export { router as articleRoutes };
import "dotenv/config";
import cloudinary from "./utils/cloudinary.js";
// const fileFilter = (req, file, cb) => {
//     if (file.mimetype.startsWith("image")) {
//         cb(null, true);
//     } else {
//         cb("invalid image file!", false);
//     }
// };
// const uploads = multer({ storage, fileFilter });
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
router.get("/article/search/:searchQuery", async (req, res) => {
  try {
    const article = await Article.find( { $text: { $search: req.params.searchQuery} }
  );
  
  console.log(article)

    res.send(article);
   
  } catch (error) {
    console.log(error);
     res.status(404).send(error.message);
  }
});
//  getting specificauthor article route

/**
 * @swagger
 * /api/article/{id_author}:
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
  } catch (error) {
    res.status(404).send(error.message);
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
  let image = "";

  if (req.body.picture) {
    try {
      image = await cloudinary.uploader.upload(req.body.picture, {
        upload_preset: "article_picture",
      });
      console.log(image);
    } catch (error) {
      console.log(error);
    }
  } else {
    image = {
      url: "https://www.kindpng.com/imgv/iThJmoo_white-gray-circle-avatar-png-transparent-png/",
      public_id: "",
    };
  }
  const article = new Article({
    title: req.body.title,
    author: req.user,
    picture: image.url,
    cloudinary_id: image.public_id,
    articleDetail: req.body.articleDetail,
    tag: req.body.tag,
  });
  console.log(article);
  try {
    let a = await article.save();
    console.log(a);
    res.send(article);
  } catch (error) {
    res.status(400);
    console.log(error);
    res.send(error);
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
  
  const article = await Article.findById(req.params.id);

  try {
    const article = await Article.findById(req.params.id);
    if (req.body.title) {
      article.title = req.body.title;
    }
    
    if (req.body.picture) {
      
     
        try {
           if(article.cloudinary_id){
          await cloudinary.uploader.destroy(article.cloudinary_id, (result) => { console.log(result)})
        }
          const image = await cloudinary.uploader.upload(req.body.picture, {
                upload_preset: "article_picture",
              }); 
              article.picture = image.url ;
              article.cloudinary_id = image.public_id
            }
            catch (error) {
          res.status(404).send(error.message);
        }
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
// commenting on an article route

/**
 * @swagger
 * /api/article/comment/{id}:
 *  patch:
 *   summary: Commenting on the article by id
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
 *                     type: object
 *                     required:
 *                        - comment
 *                     properties:
 *                         comment:
 *                            type: String
 *                            description: The comment on the article
 *
 *   responses:
 *       200:
 *         description: The article was successfully commented on
 *
 *       404:
 *         description: The article with that id was not found
 *       500:
 *         description: Server Error
 */
// router.patch("/article/comment/:id", authenticateToken, async (req, res) => {
//   if(!req.body.comment){
//     return res.send("Enter The comment");
//   }
//   const comment = {
//     "commentor":req.user,
//     "comments": req.body.comment,
//     "created": Date.now()
//   }
//   try {
//     const article = await Article.findById(req.params.id);
//     article.comments.push(comment);
//     article.save()
//     res.json(article);
//   } catch (error) {
//     res.status(400);
//     res.send(error.message);
//   }
// });
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
  const article = await Article.findOne({ _id: req.params.id });
  if(article.cloudinary_id){
  try {
    
    await cloudinary.uploader.destroy(article.cloudinary_id, (result) => {
      console.log(result);
    });
  } catch (error) {
    res.status(404).send(error.message);
  }}
  try {
    await Article.deleteOne({ _id: req.params.id });
    res.status(204).send();
  } catch (error) {
    res.status(404).send(error.message);
  }
});
