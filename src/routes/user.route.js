const express = require('express');
const router = express.Router();
const { register, login, refreshToken } = require('../controllers/authController');
// const { verifyJWT, verifyAdmin } = require('../middlewares');
// const { verifyJWT } = require('../middlewares/verifyJWT');
const { verifyAdmin } = require('../middlewares/authMiddleware');



// Registration route
router.post('/register', register); // Added registration route

// Login route
router.post('/login', login);

// Dashboard route (protected route)
router.get('/dashboard', verifyAdmin, (req, res) => {
  res.json({ message: 'Welcome to the admin dashboard!' });
});

// Refresh token route
router.post('/refresh-token', refreshToken);

module.exports = router;
