const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

exports.generateToken = (user, exp = "1d") => {
  return jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: exp });
};

exports.decodeToken = (token) => {
  return jwt.verify(token, secret);
};