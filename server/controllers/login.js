import jwt from "jsonwebtoken";
import User from "../models/user.js";
import LoginLog from "../models/loginLog.js";

export const register = async (req, res) => {
  try {

    console.log("REGISTER BODY:", req.body);
    const { email, password, username } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({ email, password, username });
    await user.save();

    const token = jwt.sign(
      { id: user._id, 
        email: user.email,
        role: user.role 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: "24h" }
    );

    res.status(201).json({ 
      token, 
      user: { id: user._id, email: user.email, username: user.username, role: user.role },
      message: "User registered successfully" 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      user.failedAttempts = (user.failedAttempts || 0) + 1;
      if (user.failedAttempts >= 5) {
        user.status = "disabled";
      }
      await user.save();
      await LoginLog.create({
        email: email,
        ip: req.ip,
        device: req.headers["user-agent"],
        status: "failed"
      });
      if (user.failedAttempts >= 5) {
        return res.status(403).json({
          message: "Account locked after multiple failed login attempts. Contact admin."
        });
      }
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.status === "disabled") {
      return res.status(403).json({
      message: "Account is disabled. Contact Admin."
      });
    }
    user.failedAttempts = 0;
    user.ip = req.ip;
    user.lastLogin = new Date();
    user.device = req.headers["user-agent"];
    let location = "Unknown";

    try {
      const geo = await fetch(`http://ip-api.com/json/${req.ip}`);
      const geoData = await geo.json();
      location = `${geoData.city}, ${geoData.country}`;
    } catch (error) {
      console.log("Location lookup failed");
    }

    await user.save();
    await LoginLog.create({
      userId: user._id,
      email: user.email,
      ip: user.ip,
      device: user.device,
      location: user.location,
      status: "success"
    });

    const token = jwt.sign(
      { id: user._id, 
        email: user.email,
        role: user.role
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: "24h" }
    );

    res.json({ 
      token, 
      user: { id: user._id, email: user.email, username: user.username, role: user.role, lastLogin: user.lastLogin},
      message: "Login successful" 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(userId);

    res.json({ message: "Account deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {

    const users = await User.find().select("-password");

    res.json(users);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const disableUser = async (req, res) => {
  try {

    const { id } = req.params;
    if (req.user.id === id) {
      return res.status(400).json({
        message: "You cannot disable your own account."
      });
    }
    const user = await User.findByIdAndUpdate(
      id,
      { status: "disabled" },
      { new: true }
    );
    res.json({
      message: "User disabled successfully",
      user
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const enableUser = async (req, res) => {
  try {

    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { 
        status: "active",
        failedAttempts: 0
      },
      { new: true }
    );

    res.json({
      message: "User enabled successfully",
      user
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

