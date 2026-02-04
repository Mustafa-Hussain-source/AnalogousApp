import jwt from "jsonwebtoken";
import User from "../models/user.js";

// REGISTER - Create new user
export const register = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = new User({ email, password, username });
    await user.save();

    // Create token
    const token = jwt.sign(
      { id: user._id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: "24h" }
    );

    res.status(201).json({ 
      token, 
      user: { id: user._id, email: user.email, username: user.username },
      message: "User registered successfully" 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN - Authenticate user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: "24h" }
    );

    res.json({ 
      token, 
      user: { id: user._id, email: user.email, username: user.username },
      message: "Login successful" 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};