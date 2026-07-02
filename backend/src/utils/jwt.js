const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
  const secret = process.env.JWT_SECRET || 'fallback-secret-key';
  const expiresIn = process.env.JWT_EXPIRE || '7d';
  
  return jwt.sign(payload, secret, { expiresIn });
};

const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET || 'fallback-secret-key';
  return jwt.verify(token, secret);
};

module.exports = {
  generateToken,
  verifyToken
};