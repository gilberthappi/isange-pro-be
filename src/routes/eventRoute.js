
import express  from "express";
import { isAdmin,uploaded,verifyToken} from "../middleware";
import {
    createEvent,adminUpdateEvent,deleteEventById,
    getbyId,getAll,getEventCounts
} from "../controllers/event";

const eventRouter = express.Router();


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
 *         - eventTitle
 *       properties:
 *         eventTitle:
 *           type: string
 *           description: Title of the event
 *         description:
 *           type: string
 *           description: Details on the event
 *         typeOfEvent:
 *           type: string
 *           enum: ['baptism',  'other']
 *           description: Type of the event
 *         dateOfEvent:
 *           type: string
 *           description: Date of the event
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
 *           description: documents for explaining the event
 */

/**
 * @swagger
 * /event/create:
 *   post:
 *     summary: Create a new event
 *     tags: [Event]
 *     description: Register a new Event
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               eventTitle:
 *                 type: string
 *               description:
 *                 type: string
 *               typeOfEvent:
 *                 type: string
 *                 enum: ['baptism', 'other']
 *               dateOfEvent:
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
 *               - eventTitle
 *     responses:
 *       201:
 *         description: event registered successfully
 *       400:
 *         description: Bad Request - Invalid data
 */

/**
 * @swagger
 * /event/getAllEvent:
 *   get:
 *     summary: Get all event
 *     tags: [Event]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all event
 *     responses:
 *       200:
 *         description: List of events
 */


/**
 * @swagger
 * /event/getEventById/{id}:
 *   get:
 *     summary: Get a event by ID
 *     tags: [Event]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The event ID
 *     responses:
 *       200:
 *         description: The event details by ID
 *       404:
 *         description: event not found
 */

/**
 * @swagger
 * /event/adminUpdateEvent/{id}:
 *   put:
 *     summary: An admin may update a event by ID to assign it to the lawyer
 *     tags: [Event]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                type: string
 *               typeOfEvent:
 *                type: string
 *                enum: ['baptism', 'other']
 *               dateOfEvent:  
 *                type: string
 *     responses:
 *       200:
 *         description: The event was updated
 *       404:
 *         description: Event not found
 *       500:
 *         description: Some error occurred
 */


/**
 * @swagger
 * /event/deleteEvent/{id}:
 *   delete:
 *     summary: Delete a event by ID
 *     tags: [Event]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The event ID
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       404:
 *         description: Event not found
 */


/**
 * @swagger
 * /event/getEventCounts:
 *   get:
 *     summary: Get counts of different event categories
 *     tags: [Event]
 *     security:
 *       - bearerAuth: []
 *     description: Count Events  by a specified period (e.g., "year" ).
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

  eventRouter.get('/getEventCounts',verifyToken, getEventCounts);
  eventRouter.get("/getAllEvent",getAll);
  eventRouter.post("/create",verifyToken,isAdmin,createEvent);
  eventRouter.delete("/deleteEvent/:id",verifyToken,isAdmin,deleteEventById);
  eventRouter.get("/getEventById/:id", getbyId);
  eventRouter.put("/adminUpdateEvent/:id",verifyToken,isAdmin,adminUpdateEvent);


export default eventRouter;
              