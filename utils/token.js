const jwt = require("jsonwebtoken");

const generateToken = user => {
  const payload = {
    id: user._id,
    email: user.email
  };

  const options = {
    expiresIn: "2d"
  };

  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

const decodeToken = token => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, decodeToken };
