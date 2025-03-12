const express = require('express');
const router = express.Router();
const verifyJWT = require('../middlewares/authMiddleware');
const authController = require('../controllers/authController');


router.post('/login', authController.login);


router.get('/dashboard', verifyJWT, (req, res) => {
  res.json({ message: 'Welcome to the dashboard!', user: req.user });
});


router.post('/refresh-token', authController.refreshToken);

module.exports = router;
