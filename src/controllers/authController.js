const jwt = require('jsonwebtoken');
const User = require('../models/userSchema'); 


const generateAccessToken = (user) => {
  return jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
};


const generateRefreshToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: '7d' });
};


const refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken; 

  if (!refreshToken) {
    return res.status(403).json({ message: 'No refresh token provided' });
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired refresh token' });
    }


    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newAccessToken = generateAccessToken(user);

    res.json({ accessToken: newAccessToken });
  });
};


const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user || user.password !== password) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production', 
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.json({ accessToken });
};

module.exports = { refreshToken, login };
