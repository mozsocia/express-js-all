const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { generateToken, decodeToken } = require("../utils/token");

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = new User({ email, password });
    await user.save();
    const token = generateToken(user);
    res.send({ token });
  } catch (error) {
    res.status(400).send(error);
  }
};


exports.login = async (req, res) => {

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({ error: "Login failed! Check authentication credentials" });
    }
    const isPasswordMatch = await user.isValidPassword(password);
    if (!isPasswordMatch) {
      return res.status(401).send({ error: "Login failed! Check authentication credentials" });
    }
    const token = generateToken(user);
    res.send({ token });
  } catch (error) {
    res.status(400).send(error);
  }
};
