import multer from "multer";
import { Case, USER } from "../../models";
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
    // uploaded(req, res, async function (err) {
    //   // if (err instanceof multer.MulterError) {
    //   //   return res.status(400).json({ error: "File upload error" });
    //   // } else if (err) {
    //   //   return res.status(500).json({ error: "Internal serttver error" });
    //   // }

      const userId = req.userId;
      const user = await USER.findById(userId);
      const User = await USER.find();
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      req.body.createdBy = userId;

      // Update Case with the subscription details
      let CASE = req.body;

      console.log('send data:',CASE)
            // Check for file upload
            
            //  if(req.files && req.files['documents'] && req.files['documents'][0] || req.files && req.files['photo'] && req.files['photo'][0]) {
            //    if(req.files && req.files['documents'] && req.files['documents'][0] && req.files && req.files['photo'] && req.files['photo'][0]) {
            //     const result = await cloudinary.uploader.upload(req.files['documents'][0].path);
            //     CASE.documents = result.secure_url;
            //     const result2 = await cloudinary.uploader.upload(req.files['photo'][0].path);
            //     CASE.photo = result2.secure_url;
            //     }
            //    else if(req.files && req.files['photo'] && req.files['photo'][0]) {
            //       const result = await cloudinary.uploader.upload(req.files['photo'][0].path);
            //       CASE.photo = result.secure_url;
            //       }
            //     else if(req.files && req.files['documents'] && req.files['documents'][0]) {
            //       const result = await cloudinary.uploader.upload(req.files['documents'][0].path);
            //       CASE.documents = result.secure_url;
            //     }
            // }
            // else {
            //   CASE.documents = null;
            //   CASE.photo = null;
            // }

      let newCase = await Case.create(CASE);

      //send email to all admins
      const adminEmails = User
      .filter((User) => User.role === 'admin')
      .map((admin) => admin.email);
      for (const adminEmail of adminEmails) {
        try {
          await sendEmail(
            adminEmail,
            `New Case ${newCase.caseTitle}`,
            `New Case has been created.`,
          );
          console.log(`Email sent to ${adminEmail}`);
        }
        catch (emailError) {
          console.error('Error sending email:', emailError);
        }
      }
      res.status(201).json(newCase);
    }
    // );
  // }
  catch (error) {
    console.error("Error creating case:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


    const { ObjectId } = require('mongoose').Types;

//UPDATE A CASE
    export const adminUpdateCase = async (req, res) => {
      try {
        const caseId = req.params.id;
        const updatedCase = await Case.findByIdAndUpdate(
      // update Case, like title, description, typeOfCase, dateOfCase, photo, documents
             caseId,
            {  caseTitle: req.body.caseTitle,
                caseDescription: req.body.CaseDescription,
                typeOfCase: req.body.typeOfCase,
                dateOfCase: req.body.dateOfCase,
                photo: req.body.photo,
                documents: req.body.documents,
                duration: req.body.duration,
                location: req.body.location,
                status: req.body.status,
                category: req.body.category,
                riskLevel: req.body.riskLevel,
                createdBy: req.body.createdBy,
                description: req.body.description,
                updatedAt: Date.now(),

            },

            { new: true }   

        );
    
      if (!updatedCase) {
          return res.status(404).json({ error: 'Case not found' });
        }
        //send email to all users and admins
        const user = await USER.find();
        const userEmails = user
          .filter((user) => user.role === 'user')
          .map((user) => user.email);
        for (const userEmail of userEmails) {
            try {
                await sendEmail(
                userEmail,
                `Case ${updatedCase.caseTitle}`,
                `Case has been updated.`
                );
                console.log(`Email sent to ${userEmail}`);
            } catch (emailError) {
                console.error('Error sending email:', emailError);
            }
            }

        return res.status(200).json(updatedCase);
      } catch (error) {
        console.error('Error updating Case:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    };

//DELETET A CASE
export const deleteCaseById = async (req, res) => {
const caseId = req.params.id; // Assuming the ID is passed as a URL parameter

try {
  const deleteCase = await Case.findByIdAndDelete(caseId);

  if (!deleteCase) {
    return res.status(404).json({ error: "Case not found" });
  }

  res.status(200).json({ message: "Case deleted successfully", deleteCase });
} catch (error) {
  res.status(500).json({ error: "Internal server error" });
}
};



export const getAll = async (req, res) => {
  try {
    const cases = await Case.find().sort({ createdAt: -1 }); // Sort from latest to oldest
    res.status(200).json({
      message: 'All Case (sorted from latest to oldest)',
      cases,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};



//GET BY ID
export const getbyId = async (req, res) => {
  const caseId = req.params.id; // Assuming the ID is passed as a URL parameter

  try {
    const CASE = await Case.findById(caseId);

    if (!CASE) {
      return res.status(404).json({ error: "Case is not found" });
    }

    res.status(200).json(CASE);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCaseCounts = async (req, res) => {
  const { year } = req.query;

  try {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    // Aggregation count within the specified year range
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

    // Convert _id values to month names
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
      const matchingMonth = caseCountsByMonth.find(
        (entry) => entry._id === index + 1
      );
      return {
        label: monthName,
        count: matchingMonth ? matchingMonth.count : 0,
      };
    });
    res.status(200).json(response);
  } catch (error) {
    console.error('Error getting Case counts by month:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
