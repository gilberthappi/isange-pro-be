import nodemailer from "nodemailer";
//  import mailgen from "mailgen";
 import dotenv from "dotenv";
 dotenv.config();
 

export const sendEmail= async (to,sub,textContent,htlmlContent)=>{

    
    console.log("to",to)
    // console.log("sub",sub,textContent,htlmlContent)
    
try{let transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL,
        pass:process.env.PASS
    }
});
// console.log(process.env.EMAIL,process.env.PASSWORD)
 let mailoptions={
    from:process.env.EMAIL,
    to:to,
    subject:sub,
    text:textContent,
    html:htlmlContent
 };
 await transporter.sendMail(mailoptions);

}catch(error){console.log("send emailcatch block",error)}


}