/* eslint-disable no-undef */
import { USER } from '../../models/userModel.js';
import { transporter } from '../../utils/mailTransport.js';
import { generateToken, comparePassword, hashPassword, generateOTP, isOTPValid,
   passHashing, sendEmail } from '../../utils';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';


dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.APIKEY,
  api_secret: process.env.APISECRET,
});

// Signup for both individual and organization clients
export const signup = async (req, res) => {
  try {
    const User = await USER.findOne({ email: req.body.email });

    if (User) {
      return res.status(409).json({
        message: 'User with this email already exists',
      });
    }

    const hashedPassword = await hashPassword(req.body.password);

    req.body.password = hashedPassword;

    const newUser = await USER.create(req.body);
    if (!newUser) {
      res.status(404).json({ message: 'Failed to register' });
    }

    // Send a welcome email to the user
    const mailOptions = {
      from: 'isangepro@gmail.com',
      to: newUser.email,
      subject: 'Welcome to ISANGE PRO',
      html: `<h1>Welcome to ISANGE PRO</h1>
      <p>Thank you for signing up with us. We are excited to have you on board. </p>
      <p>Feel free to explore our platform and reach out to us in case of any questions or concerns.</p>
      <p>Best Regards,</p>
      <p>ISANGE PRO Team</p>`,

    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email sending failed:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    const token = generateToken({
      id: newUser.id,
      role:newUser.role,
      name:newUser.name,
      phone:newUser.phone,
      location:newUser.location,
      


    });

    res.status(201).json({
      message: 'User registered successfully',
      access_token: token,
      USER: {
        email: newUser.email,
        location: newUser.location,
        name: newUser.name,
        phone: newUser.phone,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.log(error);
  }
};
//##################################################################################
// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await USER.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const isPasswordCorrect = await comparePassword(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: 'Wrong password',
      });
    }

    const token = generateToken({
      id: user.id,
      role:user.role

    });

    res.status(200).json({
      message: 'User logged in successfully',
      access_token: token,
      USER: {
        email: user.email,
        name: user.name,
        role: user.role,
        // Add other relevant fields based on userType
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};
//#######################################################
// Forgot Password
export const forgotPassword = async (req, res) => {
  const otp = generateOTP().code
  const expiresAt=generateOTP().expiresAt;
  const userEmail = req.body.email
  const user = await USER.findOne({ email: userEmail })
  if (!user) {
    return res
      .status(404)
      .json({
        message: `No user with email ${userEmail} found. Please use a correct registered email if you have ever signed up.`
      })
  }
  const hashedOTP = await passHashing(otp);
  user.otp = hashedOTP;
  user.otpExpiresAt=expiresAt;
  await user.save()
  await sendEmail(
    user.email,
    'Password OTP Code Reset',
    'Password Resetting!',
    `Use this ${otp} to change your password.  it is valid for five minutes  it will expire at ${expiresAt}`
  )

  return res
    .status(200)
    .json({
      message:
        'OTP sent successfully!! you can go to your email and came back with it.'
    })
}

//############################################################################

// Reset Password

export const resetPassword = async (req, res) => {
  const userEmail = req.body.email
  const user = await USER.findOne({ email: userEmail })
  if (!user) {
    return res
      .status(404)
      .json({
        message: `No user with email ${userEmail} found. Please use a correct registered email if you have ever signed up.`
      })
  }

  const receivedOTP = req.body.otp
  const storedOTP = user.otp;
  let validotp = isOTPValid(storedOTP, receivedOTP,user.otpExpiresAt,res)
  if (validotp) {
    const newpassword = req.body.newPassword;
    const hashedPassword = await hashPassword(newpassword)

    user.password = hashedPassword
    user.otp = undefined;
    user.otpExpiresAt=undefined;
    await user.save()
    return res.status(200).json({ message: 'Password updated successfully.' })
  }
  
}


//##################################################
// Change Password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { userId } = req;
    const user = await USER.findById(userId);

    const isPasswordCorrect = await comparePassword(currentPassword, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: 'Wrong password',
      });
    }

    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};


// Get All Clients
export const getAllClients = async (req, res) => {
  try {
    const clients = await USER.find();
    // sort clients by latest
    clients.sort((a, b) => b.date - a.date);
      res.status(200).json({
      message: 'All clients',
      clients,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

//delete client by id 
export const deleteClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await USER.findByIdAndDelete(id);
    if (!client) {
      return res.status(404).json({
        message: 'Client not found',
      });
    }
    res.status(200).json({
      message: 'Client deleted successfully',
      client,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};


//  admin change user roles
export const changeUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const user = await USER.findByIdAndUpdate(id, { role
    }, { new: true });
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }
    res.status(200).json({
      message: 'User role changed successfully',
      user,
    });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
}

// company which have role=RIB create a new user make his/her role=agent
export const createAgent = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await USER.findOne({ email });
    
    if (user) {
      return res.status(409).json({
        message: 'User with this email already exists',
      });
    }
    const newUser = await USER.create(req.body);
    newUser.role = 'agent';
    await newUser.save();

    if (!newUser) {
      res.status(404).json({ message: 'Failed to register' });
    }
    const token = generateToken({
      id: newUser.id,
      role:newUser.role,
      name:newUser.name,
      phone:newUser.phone,
      location:newUser.location,
    });
    res.status(201).json({
      message: 'User registered successfully',
      access_token: token,
      USER: {
        email: newUser.email,
        location: newUser.location,
        name: newUser.name,
        phone: newUser.phone,
        role: newUser.role,
      },
    });
  }
  catch (error) {
    console.log(error);
  }
}


//  create user role=doctor
export const createDoctor = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await
      USER.findOne({ email });
    if (user) {
      return res.status(409).json({
        message: 'User with this email already exists',
      });
    }
    const newUser = await USER.create(req.body);
    newUser.role = 'doctor';
    await newUser.save();
    if (!newUser) {
      res.status(404).json({ message: 'Failed to register' });
    }
    const token = generateToken({
      id: newUser.id,
      role:newUser.role,
      name:newUser.name,
      phone:newUser.phone,
      location:newUser.location,
    });
    res.status(201).json({
      message: 'User registered successfully',
      access_token: token,
      USER: {
        email: newUser.email,
        location: newUser.location,
        name: newUser.name,
        phone: newUser.phone,
        role: newUser.role,
      },
    });
  }
  catch (error) {
    console.log(error);
  }
}

// person who have role of RIB can manage to delete user who have role=agent
export const deleteAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await USER.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }
    res.status(200).json({
      message: 'User deleted successfully',
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

// RIB can getall agents
export const getAllAgents = async (req, res) => {
  try {
    const agents = await USER.find({ role: 'agent' });
    // sort agents by latest
    agents.sort((a, b) => b.date - a.date);
    res.status(200).json({
      message: 'All agents',
      agents,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

// person who have role of hospital can manage to delete user who have role=doctor
export const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await USER.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }
    res.status(200).json({
      message: 'User deleted successfully',
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

// hospital can getall doctors
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await USER.find({ role: 'doctor' });
    // sort doctors by latest
    doctors.sort((a, b) => b.date - a.date);
    res.status(200).json({
      message: 'All doctors',
      doctors,
    });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
}