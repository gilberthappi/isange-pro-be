
require('dotenv').config();
const nodemailer = require('nodemailer');

  export const transporter = nodemailer.createTransport({
    service: 'gmail', // e.g., 'Gmail'
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
});