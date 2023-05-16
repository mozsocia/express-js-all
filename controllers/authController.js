const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { generateToken, decodeToken } = require("../utils/token");

exports.register = async (req, res) => {
  console.log(req.body);
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({ error: true, message: "Passwords do not match" });
    }
    const user = new User({ name, email, password });
    await user.save();
    const token = generateToken(user);
    // res.json({ name:user.name, email: user.email, token });
    res.json({message :"Registration Successfull, Please Login "})

  } catch (error) {

    console.log(error);
    res.status(500).json({
      error: true,
      message: error.message,
      stack: error.stack
    });
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
    res.json({ token });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: true,
      message: error.message,
      stack: error.stack
    });
  }
};

exports.getUser = async (req, res) => {
  console.log(req.user);
  res.json({user:req.user})
}
