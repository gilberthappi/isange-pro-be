
import express  from "express";
import { isAdmin,uploaded,verifyToken} from "../middleware";
import {
    createBlog,adminUpdateBlog,deleteBlogById,
    getbyId,getAll,getBlogCounts
} from "../controllers/blog";

const blogRoute = express.Router();


/**
 * @swagger
 * tags:
 *   name: Blog
 *   description: The Blog managing API
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *      bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Blog:
 *       type: object
 *       required:
 *         - blogTitle
 *       properties:
 *         blogTitle:
 *           type: string
 *           description: Title of the Blog
 *         description:
 *           type: string
 *           description: Details on the Blog
 *         typeOfBlog:
 *           type: string
 *           description: Type of the Blog
 *         photo:
 *           type: array
 *           items:
 *             type: string
 *             format: binary
 *           description: images for showing evidences
 *         documents:
 *           type: array
 *           items:
 *             type: string
 *             format: binary
 *           description: documents for explaining the Blog
 */

/**
 * @swagger
 * /blog/create:
 *   post:
 *     summary: Create a new Blog
 *     tags: [Blog]
 *     description: Register a new Blog
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               blogTitle:
 *                 type: string
 *               description:
 *                 type: string
 *               typeOfBlog:
 *                 type: string
 *               photo:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               documents:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 * 
 *             required:
 *               -blogTitle
 *     responses:
 *       201:
 *         description: Blog registered successfully
 *       400:
 *         description: Bad Request - Invalid data
 */

/**
 * @swagger
 * /blog/getAllBlog:
 *   get:
 *     summary: Get all Blog
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all Blog
 *     responses:
 *       200:
 *         description: List of Blog
 */


/**
 * @swagger
 * /blog/getBlogById/{id}:
 *   get:
 *     summary: Get a Blog by ID
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Blog ID
 *     responses:
 *       200:
 *         description: The Blog details by ID
 *       404:
 *         description: Blog not found
 */

/**
 * @swagger
 * /blog/adminUpdateBlog/{id}:
 *   put:
 *     summary: An admin may update a Blog by ID
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Blog ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                type: string
 *               typeOfBlog:
 *                type: string
 *     responses:
 *       200:
 *         description: The Blog was updated
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Some error occurred
 */


/**
 * @swagger
 * /blog/deleteBlog/{id}:
 *   delete:
 *     summary: Delete a Blog by ID
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Blog ID
 *     responses:
 *       200:
 *         description: Blog deleted successfully
 *       404:
 *         description: Blog not found
 */


/**
 * @swagger
 * /blog/getBlogCounts:
 *   get:
 *     summary: Get counts of different Blog categories
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     description: Count Blog  by a specified period (e.g., "year" ).
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: string
 *         required: true
 *         description: The field name to search for (e.g., "2023").
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal Server Error
 */

  blogRoute.get('/getBlogCounts',verifyToken, getBlogCounts);
  blogRoute.get("/getAllBlog",getAll);
  blogRoute.post("/create",verifyToken,isAdmin,createBlog);
  blogRoute.delete("/deleteBlog/:id",verifyToken,isAdmin,deleteBlogById);
  blogRoute.get("/getBlogById/:id", getbyId);
  blogRoute.put("/adminUpdateBlog/:id",verifyToken,isAdmin,adminUpdateBlog);


export default blogRoute;
              