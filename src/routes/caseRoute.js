
import express  from "express";
import { isAdmin,isAgent,isDoctor,isHospital,isRIB,uploaded,verifyToken} from "../middleware";
import {createCase,getbyId, getAll,updateCase,deleteCaseById, getbyUserId,
  getCaseCounts, deleteAll,
  adminUpdateCaseToRIB,
  adminUpdateCaseToHospital,
  RIBAcceptRejectCase,
  hospitalAcceptRejectCase,
  RIBUpdateCaseProgress,
  hospitalUpdateCaseProgress,
  getCasesAssignedToRIB,
  getCasesByRiskLevel, 
  getCasesAssignedToHospital,
  getEmergencyCases,
  updateCaseToEmergency,
} from "../controllers/case";

const caseRouter = express.Router();


/**
 * @swagger
 * tags:
 *   name: User vs case
 *   description: The User manage case managing API
 */
/**
 * @swagger
 * tags:
 *   name: Admin vs case
 *   description: The Admin manage case managing API
 */
/**
 * @swagger
 * tags:
 *   name: RIB vs case
 *   description: The Admin manage case managing API
 */
/**
 * @swagger
 * tags:
 *   name: Hospital vs case
 *   description: The Hospital manage case managing API
 */

/**
 * @swagger
 * tags:
 *   name: Global vs case
 *   description: The Hospital manage case managing API
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
 *           enum: ['family', 'criminal', 'educational', 'financial', 'other']
 *           description: Type of the case
 *         dateOfIncident:
 *           type: string
 *           description: Date of the incident
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
 * /Case/create:
 *   post:
 *     summary: Create a new case
 *     tags: [User vs case]
 *     description: Register a new case
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
 *                 enum: ['family', 'criminal', 'educational', 'financial', 'other']
 *               dateOfIncident:
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
 *         description: Case registered successfully
 *       400:
 *         description: Bad Request - Invalid data
 */

/**
 * @swagger
 * /Case/getAllCases:
 *   get:
 *     summary: Get all cases
 *     tags: [Admin vs case]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all cases
 *     responses:
 *       200:
 *         description: List of cases
 */

/**
 * @swagger
 * /Case/deleteAll:
 *   delete:
 *     summary: Delete all cases
 *     tags: [Admin vs case]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all cases
 *     responses:
 *       200:
 *         description: List of cases
 */

/**
 * @swagger
 * /Case/getCaseById/{id}:
 *   get:
 *     summary: Get a case by ID
 *     tags: [Global vs case]
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
 *         description: Case not found
 */

/**
 * @swagger
 * /Case/userUpdateCase/{id}:
 *   put:
 *     summary: A user may update a case by ID
 *     tags: [User vs case]
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
 *                 enum: ['family', 'criminal', 'educational', 'financial', 'other']
 *               dateOfIncident:
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
 *         description: Case Updated successfully
 *       400:
 *         description: Bad Request - Invalid data
 */
/**
 * @swagger
 * /Case/adminUpdateCaseToRib/{id}:
 *   put:
 *     summary: An admin may update a case by ID to assign it to the RIB
 *     tags: [Admin vs case]
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
 *               ribId:
 *                 type: string
 *                 description: The ID of the RIB to assign the case to
 *     responses:
 *       200:
 *         description: The case was updated
 *       404:
 *         description: Case not found
 *       500:
 *         description: Some error occurred
 */

/**
 * @swagger
 * /Case/adminUpdatesCaseToHospital/{id}:
 *   put:
 *     summary: An admin may update a case by ID to assign it to the Hospital
 *     tags: [Admin vs case]
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
 *               hospitalId:
 *                 type: string
 *                 description: The ID of the Hospital to assign the case to
 *     responses:
 *       200:
 *         description: The case was updated
 *       404:
 *         description: Case not found
 *       500:
 *         description: Some error occurred
 */

/**
 * @swagger
 * /Case/RIBAcceptReject/{id}:
 *   put:
 *     summary: A RIB may accept or reject a case by ID
 *     tags: [RIB vs case]
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
 *               isRIBAccepted:
 *                 type: boolean
 *                 description: Whether the RIB accepts the case
 *     responses:
 *       200:
 *         description: The case status was updated
 *       404:
 *         description: Case not found
 *       500:
 *         description: Some error occurred
 */


/**
 * @swagger
 * /Case/hospitalAcceptReject/{id}:
 *   put:
 *     summary: A hospital may accept or reject a case by ID
 *     tags: [Hospital vs case]
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
 *               isHospitalAccepted:
 *                 type: boolean
 *                 description: Whether the Hospital accepts the case
 *     responses:
 *       200:
 *         description: The case status was updated
 *       404:
 *         description: Case not found
 *       500:
 *         description: Some error occurred
 */

/**
 * @swagger
 * /Case/RIBUpdateCase/{id}:
 *   put:
 *     summary: A RIB may update the progress of a case by ID
 *     tags: [RIB vs case]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               progress:
 *                 type: string
 *                 enum: ['in progress', 'completed', 'closed', 'other']
 *                 description: The updated progress of the case
 *               responseText:
 *                 type: string
 *               current_risk_level:
 *                 type: string
 *               interventions:
 *                 type: string
 *     responses:
 *       200:
 *         description: Case progress updated successfully
 *       404:
 *         description: Case not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /Case/hospitalUpdateCase/{id}:
 *   put:
 *     summary: A Hospital may update the progress of a case by ID
 *     tags: [Hospital vs case]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               progress:
 *                 type: string
 *                 enum: ['in progress', 'completed', 'closed', 'other']
 *                 description: The updated progress of the case
 *               responseText:
 *                 type: string
 *               current_risk_level:
 *                 type: string
 *               interventions:
 *                 type: string
 *     responses:
 *       200:
 *         description: Case progress updated successfully
 *       404:
 *         description: Case not found
 *       500:
 *         description: Internal server error
 */



/**
 * @swagger
 * /Case/deleteCase/{id}:
 *   delete:
 *     summary: Delete a case by ID
 *     tags: [Global vs case]
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
 *         description: Case deleted successfully
 *       404:
 *         description: Case not found
 */


/**
 * @swagger
 * /Case/getAllCasesUser:
 *   get:
 *     summary: Get all cases
 *     tags: [User vs case]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all cases
 *     responses:
 *       200:
 *         description: List of cases
 */


/**
 * @swagger
 * /Case/getCasesAssignedToRIB:
 *   get:
 *     summary: Get all cases
 *     tags: [RIB vs case]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all cases
 *     responses:
 *       200:
 *         description: List of cases
 */


/**
 * @swagger
 * /Case/getCasesAssignedToHospital:
 *   get:
 *     summary: Get all cases
 *     tags: [Hospital vs case]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all cases
 *     responses:
 *       200:
 *         description: List of cases
 */

/**
 * @swagger
 * /Case/getCaseCounts:
 *   get:
 *     summary: Get counts of different case categories
 *     tags: [Admin vs case]
 *     security:
 *       - bearerAuth: []
 *     description: Count cases  by a specified period (e.g., "year" ).
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

/**
 * @swagger
 * /Case/getCasesByRiskLevel:
 *   get:
 *     summary: Get cases filtered by risk level
 *     tags: [Admin vs case]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: riskLevel
 *         required: true
 *         schema:
 *           type: string
 *         description: The risk level to filter cases by
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 cases:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Case'
 *       400:
 *         description: Bad request - Invalid data provided
 *       401:
 *         description: Unauthorized - Invalid token
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /Case/getEmergencyCases:
 *   get:
 *     summary: Get all emergency cases
 *     tags: [Admin vs case]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all cases marked as emergency
 *     responses:
 *       200:
 *         description: List of emergency cases
 */


/**
 * @swagger
 * /Case/emergency/{id}:
 *   put:
 *     summary: A Emergency a case by ID
 *     tags: [Admin vs case]
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
 *               isEmergency:
 *                 type: boolean
 *                 description: set emergency 
 *     responses:
 *       200:
 *         description: The case status was updated
 *       404:
 *         description: Case not found
 *       500:
 *         description: Some error occurred
 */


  caseRouter.get('/getCaseCounts', verifyToken, isAdmin, getCaseCounts);
  caseRouter.delete('/deleteAll',verifyToken, isAdmin, deleteAll);
  caseRouter.get("/getAllCasesUser",verifyToken,getbyUserId);
  caseRouter.get("/getAllCases",verifyToken,getAll);
  caseRouter.post("/create",verifyToken,createCase);
  caseRouter.delete("/deleteCase/:id",verifyToken,isAdmin,deleteCaseById);
  caseRouter.get("/getCaseById/:id", getbyId);
  caseRouter.put("/userUpdateCase/:id",uploaded,verifyToken,updateCase);
  caseRouter.put("/adminUpdateCaseToRib/:id",uploaded,verifyToken, isAdmin,adminUpdateCaseToRIB);
  caseRouter.put("/adminUpdatesCaseToHospital/:id",uploaded,verifyToken, isAdmin,adminUpdateCaseToHospital);
  caseRouter.put("/RIBAcceptReject/:id",uploaded,verifyToken,isRIB,RIBAcceptRejectCase);
  caseRouter.put("/hospitalAcceptReject/:id",uploaded,verifyToken,isHospital,hospitalAcceptRejectCase);
  caseRouter.put("/RIBUpdateCase/:id",uploaded,verifyToken,isAgent,RIBUpdateCaseProgress);
  caseRouter.put("/hospitalUpdateCase/:id",uploaded,verifyToken,isDoctor,hospitalUpdateCaseProgress);
  caseRouter.get("/getCasesAssignedToRIB",verifyToken,isRIB,getCasesAssignedToRIB);
  caseRouter.get("/getCasesAssignedToHospital",verifyToken,isHospital,getCasesAssignedToHospital);
  caseRouter.get("/getCasesByRiskLevel", verifyToken, isAdmin, getCasesByRiskLevel);
  caseRouter.get("/getEmergencyCases", verifyToken, isAdmin, getEmergencyCases);
  caseRouter.put("/emergency/:id",verifyToken,isAdmin,updateCaseToEmergency);
export default caseRouter;
              