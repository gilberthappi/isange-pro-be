import { USER } from '../models/userModel.js';

export const isAdmin = async (req, res, next) => {
  try {
    const { userId } = req;

    const User = await USER.findById(userId);
   console.log(User.name,User.role)
    if (User?.role !== 'admin') {
      return res(403).json({
        message: 'You are not authorized to perform this action',
      });
    }
    next();
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: 'Something went wrong',
    });
  }
};