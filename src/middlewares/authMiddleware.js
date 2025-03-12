// const jwt = require('jsonwebtoken');
// const User = require('../models/userSchema');

// const verifyJWT = (req, res, next) => {
//   const token = req.headers['authorization']?.split(' ')[1]; // Bearer token

//   if (!token) {
//     return res.status(403).json({ message: 'Access token is required' });
//   }

//   jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
//     if (err) {
//       return res.status(403).json({ message: 'Invalid or expired access token' });
//     }

//     // Attach the user to the request object for downstream routes
//     const user = await User.findById(decoded.userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     req.user = user;  // Attach the user info to the request object
//     next();
//   });
// };

// module.exports = verifyJWT;

const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');

// Middleware to verify JWT token
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

// Middleware to verify if the user is an admin
const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next(); // Proceed to the next middleware/route handler
  } else {
    return res.status(403).json({ message: 'Access restricted to admins only' });
  }
};

// Export both middlewares
module.exports = { verifyJWT, verifyAdmin };
