const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.signup = async (req, res) => {
  const { name, mobile, empId, email, password } = req.body;
  if (email === process.env.ADMIN_EMAIL)
    return res.status(403).json({ msg: "Cannot sign up as admin" });
  let user = await User.findOne({ email });
  if (user) return res.status(400).json({ msg: "User already exists" });
  const hashed = await bcrypt.hash(password, 10);
  user = new User({ name, mobile, empId, email, password: hashed });
  await user.save();
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "8h" });
  res.json({ token });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email });
  if (!user && email === process.env.ADMIN_EMAIL) {
    user = new User({
      name: "Admin",
      mobile: "0000000000",
      empId: "ADMIN1",
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      isAdmin: true
    });
    await user.save();
  }
  if (!user) return res.status(400).json({ msg: "Invalid credentials" });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "8h" });
  res.json({ token, isAdmin: user.isAdmin });
};

exports.profile = (req, res) => {
  res.json(req.user);
};

exports.logout = (req, res) => {
  res.json({ msg: "Logged out" });
};
