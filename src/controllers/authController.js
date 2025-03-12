const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userSchema');

// Function to generate access token
const generateAccessToken = (user) => {
  return jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
};

// Function to generate refresh token
const generateRefreshToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: '7d' });
};

// Register function to create a new user
const register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds: 10

    // Create the new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    console.log(newUser)

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    res.status(500).json({ message: 'Error while registering user', error: err.message });
  }
};

// Login function to authenticate and issue tokens
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if the user is an admin
    if (user.role !== 'admin') {
      console.log('User is not an admin');
      return res.status(403).json({ message: 'Access restricted to admins only' });
    }

    // Compare hashed password with the input password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch');
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
  } catch (err) {
    res.status(500).json({ message: 'Error while logging in', error: err.message });
  }
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

module.exports = { register, login, refreshToken };
