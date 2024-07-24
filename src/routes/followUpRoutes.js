import express from 'express';
import {
  createFollowUp,
  getFollowUps,
  getFollowUpById,
  updateFollowUp,
  deleteFollowUp
} from '../controllers/followUp/followUpController';
import { verifyToken, uploaded, isAdmin } from '../middleware/index.js';

const followUpRouter = express.Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     FollowUp:
 *       type: object
 *       required:
 *         - victim_name
 *         - gender
 *         - doctor_name
 *         - needed_aid
 *         - next_appointment
 *         - action
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the follow-up
 *         victim_name:
 *           type: string
 *           description: The name of the victim
 *         gender:
 *           type: string
 *           description: The gender of the victim
 *         doctor_name:
 *           type: string
 *           description: The name of the doctor
 *         needed_aid:
 *           type: string
 *           description: The needed aid
 *         next_appointment:
 *           type: string
 *           format: date-time
 *           description: The next appointment date and time
 *         action:
 *           type: string
 *           description: The action to be taken
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the follow-up was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the follow-up was updated
 *       example:
 *         victim_name: Bob Smith
 *         gender: Male
 *         doctor_name: Dr. Jane Roe
 *         needed_aid: Intensive Care
 *         next_appointment: 2024-06-05 14:30:00
 *         action: Monitor condition and prepare for possible surgery.
 */

/**
 * @swagger
 * /follow:
 *   post:
 *     summary: Create a new follow-up
 *     tags: [FollowUps]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FollowUp'
 *     responses:
 *       201:
 *         description: The follow-up was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FollowUp'
 *       500:
 *         description: Some server error
 */
followUpRouter.post('/', uploaded,createFollowUp);

/**
 * @swagger
 * /follow:
 *   get:
 *     summary: Returns the list of all follow-ups
 *     tags: [FollowUps]
 *     responses:
 *       200:
 *         description: The list of follow-ups
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FollowUp'
 *       500:
 *         description: Some server error
 */
followUpRouter.get('/', getFollowUps);

/**
 * @swagger
 * /follow/{id}:
 *   get:
 *     summary: Get a follow-up by ID
 *     tags: [FollowUps]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The follow-up ID
 *     responses:
 *       200:
 *         description: The follow-up description by ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FollowUp'
 *       404:
 *         description: The follow-up was not found
 *       500:
 *         description: Some server error
 */
followUpRouter.get('/:id', getFollowUpById);

/**
 * @swagger
 * /follow/{id}:
 *   put:
 *     summary: Update a follow-up
 *     tags: [FollowUps]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The follow-up ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FollowUp'
 *     responses:
 *       200:
 *         description: The follow-up was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FollowUp'
 *       404:
 *         description: The follow-up was not found
 *       500:
 *         description: Some server error
 */
followUpRouter.put('/:id',uploaded, updateFollowUp);

/**
 * @swagger
 * /follow/{id}:
 *   delete:
 *     summary: Delete a follow-up
 *     tags: [FollowUps]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The follow-up ID
 *     responses:
 *       204:
 *         description: The follow-up was deleted
 *       404:
 *         description: The follow-up was not found
 *       500:
 *         description: Some server error
 */
followUpRouter.delete('/:id',uploaded, verifyToken, isAdmin, deleteFollowUp);

export default followUpRouter;
