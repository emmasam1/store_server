const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');  // Add bcrypt for hashing
const User = require('../models/userSchema');

// Function to generate access token
const generateAccessToken = (user) => {
  return jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
};

// Function to generate refresh token
const generateRefreshToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: '7d' });
};

// Refresh token function to renew the access token
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

// Register function to create a new user
const register = async (req, res) => {
  const { username, email, password } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ username });
  if (userExists) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  // Check if email already exists
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    return res.status(400).json({ message: 'Email is already registered' });
  }

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds: 10

  // Create the new user
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error while registering user', error: err.message });
  }
};

// Login function to authenticate and issue tokens
const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Compare hashed password with the input password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Generate tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Store refresh token as an HTTP-only cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // only set cookie in https in production
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // Send access token in response body
  res.json({ accessToken });
};

module.exports = { refreshToken, login, register };
