const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { generateToken, decodeToken } = require("../utils/token");

exports.checkAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = decodeToken(token);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).send({ error: "Not authorized to access this resource" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send({ error: "Invalid token" });
  }
};
