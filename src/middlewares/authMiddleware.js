const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');

const verifyJWT = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer token

  if (!token) {
    return res.status(403).json({ message: 'Access token is required' });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired access token' });
    }

    // Attach the user to the request object for downstream routes
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user;  // Attach the user info to the request object
    next();
  });
};

module.exports = verifyJWT;
