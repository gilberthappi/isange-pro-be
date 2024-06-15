import { USER } from '../models/userModel.js';

export const isAgent = async (req, res, next) => {
    try {
      const { userId } = req;
  
      const User = await USER.findById(userId);
      console.log(User, 'user');
      if (User?.role !== 'agent') {
        return res(403).json({
          message: 'You are not authorized to perform this action',
        });
      }
      next();
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };