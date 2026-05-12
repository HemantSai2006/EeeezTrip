/**
 * controllers/authController.js
 * Handles: register, login, me, logout
 */

const jwt  = require('jsonwebtoken');
const User = require('../models/User');

function signToken(userId) {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    // Password is hashed by pre('save') hook in User.js — do NOT hash here
    const user = await User.create({
      name: fullName,   // your model uses 'name', not 'fullName'
      email,
      password,
    });

    const token = signToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: { id: user._id, fullName: user.name, email: user.email },
    });
  } catch (error) {
    console.error('Register Error:', error);
    return res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Uses matchPassword() method from your User.js
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = signToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: { id: user._id, fullName: user.name, email: user.email },
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

// GET /api/auth/me
exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    return res.status(200).json({
      success: true,
      user: { id: user._id, fullName: user.name, email: user.email },
    });
  } catch (error) {
    console.error('Me Error:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching user.' });
  }
};

// POST /api/auth/logout
exports.logout = (_req, res) => {
  return res.status(200).json({ success: true, message: 'Logged out successfully.' });
};