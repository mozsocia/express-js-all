const User = require('../models/User');
const jwt = require('../utils/jwt');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    const token = jwt.generateToken(user);
    res.status(201).json({ message: 'User created', token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: 'User not found' });

    if (!user.comparePassword(password)) return res.status(400).json({ error: 'Invalid password' });

    const accessToken = jwt.generateToken(user);
    const refreshToken = jwt.generateToken(user, '7d');
    user.refreshToken = refreshToken;
    await user.save();
    return res.json({ accessToken, refreshToken });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.refresh = async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken;

    const user = await User.findOne({ refreshToken });

    if (!user) return res.status(400).json({ error: 'Invalid refresh token' });

    const accessToken = jwt.generateToken(user);

    return res.json({ accessToken });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.logout = async (req, res) => {
  try {
    const { email } = req.user;

    const user = await User.findOne({ email });

    user.refreshToken = null;

    await user.save();
    return res.json({ message: 'Logout successful' });
  } catch (error) {

    return res.status(500).json({ error: error.message });
  }
};