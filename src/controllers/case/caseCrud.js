import multer from "multer";
import { transporter } from '../../utils/mailTransport.js';
import { Case, USER, Subscription } from "../../models";
import { uploaded } from "../../middleware/photoStorage";
import { sendEmail } from "../../utils";

import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.APIKEY,
  api_secret: process.env.APISECRET,
});

export const createCase = async (req, res) => {
  try {
    uploaded(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: "File upload error" });
      } else if (err) {
        return res.status(500).json({ error: "Internal server error" });
      }

      const userId = req.userId;
      const user = await USER.findById(userId);
      const User = await USER.find();

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      req.body.createdBy = userId;

      // Update CASE with the subscription details
      let CASE = req.body;
      // Check for file upload
      if (req.files && req.files['documents'] && req.files['documents'][0] || req.files && req.files['photo'] && req.files['photo'][0]) {
        if (req.files && req.files['documents'] && req.files['documents'][0] && req.files && req.files['photo'] && req.files['photo'][0]) {
          const result = await cloudinary.uploader.upload(req.files['documents'][0].path);
          CASE.documents = result.secure_url;
          const result2 = await cloudinary.uploader.upload(req.files['photo'][0].path);
          CASE.photo = result2.secure_url;
        } else if (req.files && req.files['photo'] && req.files['photo'][0]) {
          const result = await cloudinary.uploader.upload(req.files['photo'][0].path);
          CASE.photo = result.secure_url;
        } else if (req.files && req.files['documents'] && req.files['documents'][0]) {
          const result = await cloudinary.uploader.upload(req.files['documents'][0].path);
          CASE.documents = result.secure_url;
        }
      } else {
        CASE.documents = null;
        CASE.photo = null;
      }

      let newCase = await Case.create(CASE);
      const adminEmails = User.filter((User) => User.role === 'admin').map((admin) => admin.email);

      for (const adminEmail of adminEmails) {
        try {
          const emailSubject = `New Case Created: ${newCase.caseTitle}`;
          const emailTextContent = `A new case titled "${newCase.caseTitle}" has been created. Please log in to review the details.`;
          const emailHtmlContent = `
          <div style="font-family: Arial, sans-serif; color: black;">
            <p><strong>Dear Admin,</strong></p>
            <p>We are pleased to inform you that a new case has been created in the system. Below are the details of the case:</p>
            <ul>
              <li><strong>Case Title:</strong> ${newCase.caseTitle}</li>
              <li><strong>Description:</strong> ${newCase.description}</li>
              <li><strong>Type of Case:</strong> ${newCase.typeOfCase}</li>
              <li><strong>Date of Incident:</strong> ${newCase.dateOfIncident || 'Not provided'}</li>
              <li><strong>Created By:</strong> ${user.name}</li>
            </ul>
            <p>Please log in to the system to review the case and take any necessary actions.</p>
            <p>Thank you for your attention to this matter.</p>
            <p>Best regards,</p>
            <p>Isange pro</p>
            </div>
          `;

          await sendEmail(adminEmail, emailSubject, emailTextContent, emailHtmlContent);
          console.log(`Email sent to ${adminEmail}`);
        } catch (emailError) {
          console.error('Error sending email:', emailError);
        }
      }

      res.status(201).json(newCase);
    });
  } catch (error) {
    console.error("Error creating case:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const { ObjectId } = require('mongoose').Types;

export const adminUpdateCase = async (req, res) => {
  try {
    const caseId = req.params.id;
    const userId = req.body.lawyerId;

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const lawyerName = await USER.findById(userId);

    const updatedCase = await Case.findByIdAndUpdate(
      caseId,
      { assignedTo: lawyerName.name },
      { new: true }
    );

    if (!updatedCase) {
      return res.status(404).json({ error: 'Case not found' });
    }

    await sendEmail(lawyerName.email, `Metre ${lawyerName.name}`, `You have been assigned a new case.`);

    return res.status(200).json(updatedCase);
  } catch (error) {
    console.error('Error updating case:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const lawyerAcceptRejectCase = async (req, res) => {
  try {
    const caseId = req.params.id;
    const isAccepted = req.body.isAccepted;

    const user = await USER.find();
    const adminEmails = user.filter((user) => user.role === 'admin').map((admin) => admin.email);

    const updatedCase = await Case.findByIdAndUpdate(caseId, { isAccepted: isAccepted }, { new: true });

    if (!updatedCase) {
      return res.status(404).json({ error: 'Case not found' });
    }

    for (const adminEmail of adminEmails) {
      try {
        await sendEmail(adminEmail, `Case ${updatedCase.caseTitle}`, `Lawyer ${updatedCase.assignedTo} has ${isAccepted ? 'accepted' : 'rejected'} the case.`);
        console.log(`Email sent to ${adminEmail}`);
      } catch (emailError) {
        console.error('Error sending email:', emailError);
      }
    }

    return res.status(200).json(updatedCase);
  } catch (error) {
    console.error('Error updating case status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateCase = async (req, res) => {
  try {
    const caseId = req.params.id;
    const updatedData = req.body;
    const userId = req.userId;

    const user = await USER.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const foundCase = await Case.findById(caseId);
    if (!foundCase) {
      return res.status(404).json({ error: "Case not found" });
    }

    // Update only the fields present in updatedData
    const updatedCase = await Case.findByIdAndUpdate(caseId, { $set: updatedData }, { new: true });

    const allUsers = await USER.find();
    const adminEmails = allUsers.filter((user) => user.role === 'admin').map((admin) => admin.email);

    for (const adminEmail of adminEmails) {
      try {
        const emailSubject = `Case Updated: ${updatedCase.caseTitle}`;
        const emailTextContent = `A case titled "${updatedCase.caseTitle}" has been updated. Please log in to review the details.`;
        const emailHtmlContent = `
        <div style="font-family: Arial, sans-serif; color: black;">
          <p><strong>Dear Admin,</strong></p>
          <p>We are pleased to inform you that a case has been updated in the system. Below are the details of the case:</p>
          <ul>
            <li><strong>Case Title:</strong> ${updatedCase.caseTitle}</li>
            <li><strong>Description:</strong> ${updatedCase.description}</li>
            <li><strong>Type of Case:</strong> ${updatedCase.typeOfCase}</li>
            <li><strong>Date of Incident:</strong> ${updatedCase.dateOfIncident || 'Not provided'}</li>
            <li><strong>Created By:</strong> ${user.name}</li>
          </ul>
          <p>Please log in to the system to review the case and take any necessary actions.</p>
          <p>Thank you for your attention to this matter.</p>
          <p>Best regards,</p>
          <p>Isange pro</p>
        </div>
        `;

        await sendEmail(adminEmail, emailSubject, emailTextContent, emailHtmlContent);
        console.log(`Email sent to ${adminEmail}`);
      } catch (emailError) {
        console.error('Error sending email:', emailError);
      }
    }

    res.status(200).json(updatedCase);
  } catch (error) {
    console.error("Error updating case:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const lawyerUpdateCaseProgress = async (req, res) => {
  try {
    const caseId = req.params.id;
    const { progress } = req.body;
    const user = await USER.find();
    const adminEmails = user.filter((user) => user.role === 'admin').map((admin) => admin.email);

    const foundCase = await Case.findById(caseId);

    if (!foundCase) {
      return res.status(404).json({ error: "Case not found" });
    }

    const loggedInUserId = req.user.id;

    if (foundCase.assignedTo !== loggedInUserId) {
      return res.status(403).json({ error: "Permission denied. You are not the assigned lawyer for this case." });
    }

    foundCase.progress = progress;

    const updatedCase = await foundCase.save();

    for (const adminEmail of adminEmails) {
      try {
        await sendEmail(adminEmail, `Case ${updatedCase.caseTitle}`, `Lawyer ${updatedCase.assignedTo} has updated the case progress.`);
        console.log(`Email sent to ${adminEmail}`);
      } catch (emailError) {
        console.error('Error sending email:', emailError);
      }
    }

    res.status(200).json(updatedCase);
  } catch (error) {
    console.error("Error updating case progress:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteCaseById = async (req, res) => {
  try {
    const caseId = req.params.id;
    const deletedCase = await Case.findByIdAndDelete(caseId);

    if (!deletedCase) {
      return res.status(404).json({ error: "Case not found" });
    }

    res.status(200).json({ message: "Case deleted successfully", deletedCase });
  } catch (error) {
    console.error("Error deleting case:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteAll = async (req, res) => {
  try {
    const deletedCases = await Case.deleteMany();
    res.status(200).json({
      message: 'All Cases deleted successfully',
      deletedCases,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const cases = await Case.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: 'All Cases (sorted from latest to oldest)',
      cases,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

export const getbyId = async (req, res) => {
  try {
    const caseId = req.params.id;
    const CASE = await Case.findById(caseId);

    if (!CASE) {
      return res.status(404).json({ error: "Case not found" });
    }

    res.status(200).json(CASE);
  } catch (error) {
    console.error("Error getting case by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getbyUserId = async (req, res) => {
  try {
    const userId = req.userId;
    const CASE = await Case.find({ createdBy: userId });

    if (!CASE) {
      return res.status(404).json({ error: "Case not found" });
    }

    res.status(200).json(CASE);
  } catch (error) {
    console.error("Error getting case by user ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCaseCounts = async (req, res) => {
  try {
    const { year } = req.query;
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    const caseCountsByMonth = await Case.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 },
        },
      },
    ]);

    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const response = months.map((monthName, index) => {
      const matchingMonth = caseCountsByMonth.find((entry) => entry._id === index + 1);
      return {
        label: monthName,
        count: matchingMonth ? matchingMonth.count : 0,
      };
    });

    res.status(200).json(response);
  } catch (error) {
    console.error('Error getting case counts by month:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
