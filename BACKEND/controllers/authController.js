import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


// ====================== SIGNUP CONTROLLER ======================
export const signup = async (req, res) => {
  console.log("🚀 Signup controller called");
  console.log("Received body:", req.body);
  try {
    const { name, email, password, mobile, empId } = req.body;

    // Prevent signup as admin
    if (req.body.role && req.body.role === "admin") {
      return res.status(403).json({ message: "Cannot sign up as admin" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user (role always "user" by default)
    const user = new User({
      name,
      email,
      password: hashedPassword,
      mobile,
      empId,
      role: "user",
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server error during signup" });
  }
};

// ====================== LOGIN CONTROLLER ======================
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Check if all fields exist
    if (!email || !password || !role) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Role validation
    if (user.role !== role) {
      return res.status(403).json({ message: `You are not authorized as ${role}` });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ====================== GET PROFILE CONTROLLER ======================
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ message: "Server error while fetching profile" });
  }
};
