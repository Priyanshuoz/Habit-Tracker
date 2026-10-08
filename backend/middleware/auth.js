const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Support Demo mode token
      if (token === 'demo-token-12345') {
        req.user = {
          _id: '60c72b2f9b1d8b2badbee555',
          name: 'Alex Rivera',
          email: 'alex.rivera@example.com',
        };
        return next();
      }

      // Verify JWT
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'supersecretjwtkey_habit_tracker_2026'
      );

      // Try fetching user from DB if connected
      try {
        req.user = await User.findById(decoded.id).select('-password');
      } catch {
        // Fallback if DB is disconnected
        req.user = { _id: decoded.id, name: decoded.name, email: decoded.email };
      }

      if (!req.user) {
        req.user = { _id: decoded.id, name: decoded.name, email: decoded.email };
      }

      return next();
    } catch (error) {
      console.error('[Auth Middleware] Invalid token:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
