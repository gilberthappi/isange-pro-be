import jwt from 'jsonwebtoken'; // import jwt

export const verifyToken = (req, res, next) => {
  try {
    const auth = req.headers.authorization; // get token from header
    const token = auth?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        message: 'No token provided',
      });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: 'Invalid token',
        });
      }
      req.role=decoded.role;
      req.userId = decoded.id;
      next();
    }); // verify token
  } catch (error) {
    console.log(error);
  }
};