// import nodemailer from "nodemailer";
//  import mailgen from "mailgen";
//  import dotenv from "dotenv";
//  dotenv.config();
 

// export const sendEmailFeedback= async (from,sub,textContent){

    
//     console.log("from",from)
//     // console.log("sub",sub,textContent,htlmlContent)
    
// try{let transporter=nodemailer.createTransport({
//     service:"gmail",
//     auth:{
//         user:process.env.EMAIL,
//         pass:process.env.PASS
//     }
// });
// // console.log(process.env.EMAIL,process.env.PASSWORD)
//  let mailoptions={
//     from: from ,
//     to:process.env.EMAIL,
//     subject:sub,
//     text:textContent,
//  };
//  await transporter.sendMail(mailoptions);

// }catch(error){console.log("send emailcatch block",error)}


// }
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const sendEmailFeedback = async (from,sub,content) => {
  try {
    console.log("from",from)
    
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
      }
    });

    let mailOptions = {
      from: from, // Using client's email as "from" address
      to: process.env.EMAIL, // Your company's email from .env file
      subject: sub,
      text: content
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Feedback sent successfully!' };
  } catch (error) {
    console.error('Error sending feedback:', error);
    return { success: false, message: 'Failed to send feedback.' };
  }
};
