import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Task from "../models/Task.js";
import validateObjectId from "../utils/validateObjectId.js";

// Get current user profile
export async function getMe(req, res) {
  try {
    const user = await User.findById(req.user.id).select("_id name email role");
    if (!user) return res.status(401).json({ message: "User not found" });
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// List members (admin only)
export async function getMembers(req, res) {
  try {
    const members = await User.find({
      role: "member",
      managedBy: req.user.id,
    }).select("_id name email");
    res.status(200).json({ success: true, data: members });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Delete Member (admin only, scoped)
export async function deleteMember(req, res) {
  try {
    const { memberId } = req.params;

    if (!validateObjectId(memberId)) {
      return res.status(400).json({ message: "Invalid member ID" });
    }

    const member = await User.findOne({
      _id: memberId,
      role: "member",
      managedBy: req.user.id,
    });

    if (!member) {
      return res.status(404).json({
        message: "Member not found under your account",
      });
    }

    await Task.deleteMany({ assignedTo: member._id });
    await User.findByIdAndDelete(member._id);

    return res.status(200).json({
      success: true,
      message: "Member and associated tasks deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Register Initial Admin
export async function registerAdmin(req, res) {
  try {
    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const { name, email, password } = req.body;

    const user = await User.create({
      name,
      email,
      password,
      role: "admin",
    });

    res.status(201).json({
      message: "Admin registered successfully",
      token: generateToken(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Create Member
export async function createMember(req, res) {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const member = await User.create({
      name,
      email,
      password,
      role: "member",
      managedBy: req.user.id,
    });

    res.status(201).json({
      message: "Member created successfully",
      member: {
        id: member._id,
        name: member.name,
        email: member.email,
        role: member.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Login
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      message: "Login successful",
      token: generateToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
