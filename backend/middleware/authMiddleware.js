/**
 * middleware/authMiddleware.js
 * Verifies the JWT from the Authorization header.
 * Attaches the decoded user payload to req.user.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided. Please log in.' });
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key');
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
      }
      return res.status(401).json({ success: false, message: 'Invalid token. Please log in again.' });
    }

    // Check if the id is a valid MongoDB ObjectId
    if (!decoded.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(401).json({ success: false, message: 'Your session has expired because we upgraded the database. Please log out and register again!' });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists.' });
    }

    req.user = {
      id: user._id,
      email: user.email,
      fullName: user.name,
    };

    next();
  } catch (err) {
    console.error('authMiddleware error:', err);
    res.status(500).json({ success: false, message: 'Server error during authentication.' });
  }
};
