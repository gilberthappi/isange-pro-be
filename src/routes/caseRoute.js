
import express  from "express";
import { isAdmin,uploaded,verifyToken} from "../middleware";
import {
    createCase,adminUpdateCase,deleteCaseById,
    getbyId,getAll,getCaseCounts
} from "../controllers/case/cases.js";

const caseRouter = express.Router();


/**
 * @swagger
 * tags:
 *   name: Case
 *   description: The Case managing API
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
 *     Case:
 *       type: object
 *       required:
 *         - caseTitle
 *       properties:
 *         caseTitle:
 *           type: string
 *           description: Title of the case
 *         description:
 *           type: string
 *           description: Details on the case
 *         typeOfCase:
 *           type: string
 *           enum: ['sexual abuse', 'domestic violence', 'child abuse', 'other']
 *           description: Type of the case
 *         dateOfCase:
 *           type: string
 *           description: Date of the case
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
 *           description: documents for explaining the case
 */

/**
 * @swagger
 * /case/create:
 *   post:
 *     summary: Create a new case
 *     tags: [Case]
 *     description: Register a new Case
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               caseTitle:
 *                 type: string
 *               description:
 *                 type: string
 *               typeOfCase:
 *                 type: string
 *                 enum: ['sexual abuse', 'domestic violence', 'child abuse', 'other']
 *               dateOfCase:
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
 *               - caseTitle
 *     responses:
 *       201:
 *         description: case registered successfully
 *       400:
 *         description: Bad Request - Invalid data
 */

/**
 * @swagger
 * /case/getAllCase:
 *   get:
 *     summary: Get all case
 *     tags: [Case]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all case
 *     responses:
 *       200:
 *         description: List of cases
 */


/**
 * @swagger
 * /case/getCaseById/{id}:
 *   get:
 *     summary: Get a case by ID
 *     tags: [Case]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The case ID
 *     responses:
 *       200:
 *         description: The case details by ID
 *       404:
 *         description: case not found
 */

/**
 * @swagger
 * /case/adminUpdateCase/{id}:
 *   put:
 *     summary: An admin may update a case by ID to assign it to the lawyer
 *     tags: [Case]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The case ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                type: string
 *               typeOfCase:
 *                type: string
 *                enum: ['sexual abuse', 'domestic violence', 'child abuse', 'other']
 *               dateOfCase:  
 *                type: string
 *     responses:
 *       200:
 *         description: The case was updated
 *       404:
 *         description: case not found
 *       500:
 *         description: Some error occurred
 */


/**
 * @swagger
 * /case/deleteCase/{id}:
 *   delete:
 *     summary: Delete a case by ID
 *     tags: [Case]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The case ID
 *     responses:
 *       200:
 *         description: case deleted successfully
 *       404:
 *         description: Case not found
 */


/**
 * @swagger
 * /case/getCaseCounts:
 *   get:
 *     summary: Get counts of different case categories
 *     tags: [Case]
 *     security:
 *       - bearerAuth: []
 *     description: Count Cases  by a specified period (e.g., "year" ).
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

  caseRouter.get('/getCaseCounts',uploaded,verifyToken, getCaseCounts);
  caseRouter.get("/getAllCase",uploaded,getAll);
  caseRouter.post("/create",verifyToken,uploaded, createCase);
  caseRouter.delete("/deleteCase/:id",uploaded,verifyToken,deleteCaseById);
  caseRouter.get("/getCaseById/:id",uploaded,verifyToken, getbyId);
  caseRouter.put("/adminUpdateCase/:id",uploaded,verifyToken,adminUpdateCase);


export default caseRouter;
              