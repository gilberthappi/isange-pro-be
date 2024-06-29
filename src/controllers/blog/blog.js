import multer from "multer";
import { Blog, USER } from "../../models";
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

export const createBlog = async (req, res) => {
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

      // Update Blog with the subscription details
      let BLOG = req.body;
            // Check for file upload
            
             if(req.files && req.files['documents'] && req.files['documents'][0] || req.files && req.files['photo'] && req.files['photo'][0]) {
               if(req.files && req.files['documents'] && req.files['documents'][0] && req.files && req.files['photo'] && req.files['photo'][0]) {
                const result = await cloudinary.uploader.upload(req.files['documents'][0].path);
                BLOG.documents = result.secure_url;
                const result2 = await cloudinary.uploader.upload(req.files['photo'][0].path);
                BLOG.photo = result2.secure_url;
                }
               else if(req.files && req.files['photo'] && req.files['photo'][0]) {
                  const result = await cloudinary.uploader.upload(req.files['photo'][0].path);
                  BLOG.photo = result.secure_url;
                  }
                else if(req.files && req.files['documents'] && req.files['documents'][0]) {
                  const result = await cloudinary.uploader.upload(req.files['documents'][0].path);
                  BLOG.documents = result.secure_url;
                }
            }
            else {
                BLOG.documents = null;
                BLOG.photo = null;
            }
            

      let newBlog = await Blog.create(BLOG);
      // Send email to all users emails
        const userEmails = User
        .filter((User) => User.role === 'user')
        .map((user) => user.email);
        for (const userEmail of userEmails) {
            try {
                await sendEmail(
                    userEmail,
                    `New Blog ${newBlog.blogTitle}`,
                    `New Blog has been created.`,
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
            `New Blog ${newBlog.blogTitle}`,
            `New Blog has been created.`,
          );
          console.log(`Email sent to ${adminEmail}`);
        }
        catch (emailError) {
          console.error('Error sending email:', emailError);
        }
      }
      res.status(201).json(newBlog);
    }
    );
  }
  catch (error) {
    console.error("Error creating new Blog:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


    const { ObjectId } = require('mongoose').Types;

//UPDATE A BLOG
    export const adminUpdateBlog = async (req, res) => {
      try {
        const blogId = req.params.id;
        const updatedBlog = await Blog.findByIdAndUpdate(
      // update blog, like title, description,  photo, documents
                 blogId,
            {   blogTitle: req.body.blogTitle,
                typeOfBlog: req.body.typeOfBlog,
                description: req.body.description,
                photo: req.body.photo,
                documents: req.body.documents,
                duration: req.body.duration,
                location: req.body.location,
               
            },

            { new: true }   

        );
    
        if (!updatedBlog) {
          return res.status(404).json({ error: 'Blog not found' });
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
                `Blog ${updatedBlog.blogTitle}`,
                `Blog has been updated.`
                );
                console.log(`Email sent to ${userEmail}`);
            } catch (emailError) {
                console.error('Error sending email:', emailError);
            }
            }

        return res.status(200).json(updatedBlog);
      } catch (error) {
        console.error('Error updating Blog:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    };

//DELETET A BLOG
export const deleteBlogById = async (req, res) => {
const blogId = req.params.id; // Assuming the ID is passed as a URL parameter

try {
  const deleteBlog = await Blog.findByIdAndDelete(blogId);

  if (!deleteBlog) {
    return res.status(404).json({ error: "Blog not found" });
  }

  res.status(200).json({ message: "Blog deleted successfully", deleteBlog });
} catch (error) {
  res.status(500).json({ error: "Internal server error" });
}
};



export const getAll = async (req, res) => {
  try {
    const blog = await Blog.find().sort({ createdAt: -1 }); // Sort from latest to oldest
    res.status(200).json({
      message: 'All Blog (sorted from latest to oldest)',
      blog,
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
  const blogId = req.params.id; // Assuming the ID is passed as a URL parameter

  try {
    const BLOG = await Blog.findById(blogId);

    if (!BLOG) {
      return res.status(404).json({ error: "Blog is not found" });
    }

    res.status(200).json(BLOG);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getBlogCounts = async (req, res) => {
  const { year } = req.query;

  try {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    // Aggregation count within the specified year range
    const blogCountsByMonth = await Blog.aggregate([
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
      const matchingMonth = blogCountsByMonth.find(
        (entry) => entry._id === index + 1
      );
      return {
        label: monthName,
        count: matchingMonth ? matchingMonth.count : 0,
      };
    });
    res.status(200).json(response);
  } catch (error) {
    console.error('Error getting blog counts by month:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
