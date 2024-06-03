import bcrypt, { hash } from "bcrypt";
import crypto from 'crypto';

export const passHashing = async otp => {
  const saltRounds = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
  let hashedOtp = await bcrypt.hash(otp, saltRounds);
  return hashedOtp;
};
export const passComparer = async (otp, hashedOtp) => {
  let result = await bcrypt.compare(otp, hashedOtp);
  return result;
};
export const generateOTP = (expiryMinutes = 15) => {
  const otp = crypto.randomInt(100000, 999999);
  //expiryMinutes = 15
  const expiryTime = new Date();
  expiryTime.setMinutes(expiryTime.getMinutes() + expiryMinutes);

  return {
    code: otp.toString(),
    expiresAt: expiryTime,
  };
};

export const isOTPValid = (storedOTP, enteredOTP,expiresAt,res) => {
  // Check if the stored OTP and entered OTP match using bcrypt
  const isMatch = passComparer(enteredOTP, storedOTP);
  if (!isMatch) {
    res.status(401).json({message:"the provided otp is not valid please try again"})
    return false;
  }

  // Check if the OTP has expired
  const currentDateTime = new Date();
  const storedExpiresAt = expiresAt;
if(currentDateTime > storedExpiresAt){
  res.status(401).json({message:`the provided otp expired please try again as current date---${currentDateTime}-- and it is greater then  ${storedExpiresAt}`})
return false;
}
  return true;
};
