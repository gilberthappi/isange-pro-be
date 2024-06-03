const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
export const sendSMS = async (phone, otp) => {
  client.messages
    .create({
      body: otp,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      console.error(`Error sending SMS to ${phone}:`, error);
      return { success: false, message: "Error sending SMS" };
    });
};

