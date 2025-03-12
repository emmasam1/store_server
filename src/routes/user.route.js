const express = require('express');
const router = express.Router();
const verifyJWT = require('../middlewares/authMiddleware'); // Ensure this is correctly pointing to your middleware
const authController = require('../controllers/authController');

// Registration route
router.post('/register', authController.register); // Added registration route

// Login route
router.post('/login', authController.login);

// Dashboard route (protected route)
router.get('/dashboard', verifyJWT, (req, res) => {
  res.json({ message: 'Welcome to the dashboard!', user: req.user });
});

// Refresh token route
router.post('/refresh-token', authController.refreshToken);

module.exports = router;
