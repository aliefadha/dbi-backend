const jwt = require('jsonwebtoken');
require('dotenv').config();
const blacklist = require('./blacklist');
const checkBlacklist = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.',
    });
  }

  if (blacklist.isTokenBlacklisted(token)) {
    return res.status(403).json({
      success: false,
      message: 'Token has been invalidated.',
    });
  }

  next();
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded; // Attach the decoded user data to the request object
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Invalid token.',
    });
  }
};

module.exports = {checkBlacklist, authenticateToken};