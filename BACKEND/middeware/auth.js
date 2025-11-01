const jwt = require('jsonwebtoken');
const User = require('./models/User');

const auth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ msg: 'No token, auth denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (e) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

const adminAuth = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ msg: 'Admin access only' });
  next();
};

module.exports = { auth, adminAuth };
