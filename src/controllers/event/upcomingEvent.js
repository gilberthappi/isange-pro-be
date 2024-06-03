import multer from "multer";
import { Event, USER } from "../../models";
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

export const createEvent = async (req, res) => {
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

      // Update EVENT with the subscription details
      let EVENT = req.body;
            // Check for file upload
            
             if(req.files && req.files['documents'] && req.files['documents'][0] || req.files && req.files['photo'] && req.files['photo'][0]) {
               if(req.files && req.files['documents'] && req.files['documents'][0] && req.files && req.files['photo'] && req.files['photo'][0]) {
                const result = await cloudinary.uploader.upload(req.files['documents'][0].path);
                EVENT.documents = result.secure_url;
                const result2 = await cloudinary.uploader.upload(req.files['photo'][0].path);
                EVENT.photo = result2.secure_url;
                }
               else if(req.files && req.files['photo'] && req.files['photo'][0]) {
                  const result = await cloudinary.uploader.upload(req.files['photo'][0].path);
                  EVENT.photo = result.secure_url;
                  }
                else if(req.files && req.files['documents'] && req.files['documents'][0]) {
                  const result = await cloudinary.uploader.upload(req.files['documents'][0].path);
                  EVENT.documents = result.secure_url;
                }
            }
            else {
                EVENT.documents = null;
                EVENT.photo = null;
            }
            

      let newEvent = await Event.create(EVENT);
      // Send email to all users emails
        const userEmails = User
        .filter((User) => User.role === 'user')
        .map((user) => user.email);
        for (const userEmail of userEmails) {
            try {
                await sendEmail(
                    userEmail,
                    `New Upcoming Event ${newEvent.eventTitle}`,
                    `New upcoming event has been created.`,
                );
                console.log(`Email sent to ${userEmail}`);
            } catch (emailError) {
                console.error('Error sending email:', emailError);
            }
        }

      const adminEmails = User
      .filter((User) => User.role === 'admin')
      .map((admin) => admin.email);
      for (const adminEmail of adminEmails) {
        try {
          await sendEmail(
            adminEmail,
            `New Upcoming Event ${newEvent.eventTitle}`,
            `New upcoming event has been created.`,
          );
          console.log(`Email sent to ${adminEmail}`);
        }
        catch (emailError) {
          console.error('Error sending email:', emailError);
        }
      }
      res.status(201).json(newEvent);
    }
    );
  }
  catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


    const { ObjectId } = require('mongoose').Types;

//UPDATE A EVENT
    export const adminUpdateEvent = async (req, res) => {
      try {
        const eventId = req.params.id;
        const updatedEvent = await Event.findByIdAndUpdate(
      // update event, like title, description, typeOfEvent, dateOfEvent, photo, documents
             eventId,
            {  eventTitle: req.body.eventTitle,
                eventDescription: req.body.eventDescription,
                typeOfEvent: req.body.typeOfEvent,
                dateOfEvent: req.body.dateOfEvent,
                photo: req.body.photo,
                documents: req.body.documents,
                duration: req.body.duration,
                location: req.body.location,
                mainGuest: req.body.mainGuest,
            },

            { new: true }   

        );
    
        if (!updatedEvent) {
          return res.status(404).json({ error: 'Event not found' });
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
                `Event ${updatedEvent.eventTitle}`,
                `Event has been updated.`
                );
                console.log(`Email sent to ${userEmail}`);
            } catch (emailError) {
                console.error('Error sending email:', emailError);
            }
            }

        return res.status(200).json(updatedEvent);
      } catch (error) {
        console.error('Error updating Event:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    };

//DELETET A EVENT
export const deleteEventById = async (req, res) => {
const eventId = req.params.id; // Assuming the ID is passed as a URL parameter

try {
  const deleteEvent = await Event.findByIdAndDelete(eventId);

  if (!deleteEvent) {
    return res.status(404).json({ error: "Event not found" });
  }

  res.status(200).json({ message: "Event deleted successfully", deleteEvent });
} catch (error) {
  res.status(500).json({ error: "Internal server error" });
}
};



export const getAll = async (req, res) => {
  try {
    const event = await Event.find().sort({ createdAt: -1 }); // Sort from latest to oldest
    res.status(200).json({
      message: 'All Event (sorted from latest to oldest)',
      event,
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
  const eventId = req.params.id; // Assuming the ID is passed as a URL parameter

  try {
    const EVENT = await Event.findById(eventId);

    if (!EVENT) {
      return res.status(404).json({ error: "Event is not found" });
    }

    res.status(200).json(EVENT);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getEventCounts = async (req, res) => {
  const { year } = req.query;

  try {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    // Aggregation count within the specified year range
    const eventCountsByMonth = await Event.aggregate([
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
      const matchingMonth = eventCountsByMonth.find(
        (entry) => entry._id === index + 1
      );
      return {
        label: monthName,
        count: matchingMonth ? matchingMonth.count : 0,
      };
    });
    res.status(200).json(response);
  } catch (error) {
    console.error('Error getting Event counts by month:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
