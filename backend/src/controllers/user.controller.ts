import { RequestHandler } from "express";
import User from "../models/user.model";
import { Profile } from "../models/profile.model";
import bcrypt from "bcrypt";
import crypto from "crypto";

export const register: RequestHandler = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    if (!name || !email || !password || !username) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      username,
    });

    await newUser.save();

    const profile = new Profile({ userId: newUser._id });
    await profile.save();

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    newUser.tokens.push({ token, createdAt: new Date(), expiresAt });
    await newUser.save();

    const { password: _, tokens, ...userData } = newUser.toObject();

    return res.status(201).json({
      message: "User created successfully",
      token,
      user: userData,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const login: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    user.tokens.push({ token, createdAt: new Date(), expiresAt });
    await user.save();

    const { password: _, tokens, ...userData } = user.toObject();

    return res.status(200).json({
      message: "Login successful",
      token,
      user: userData,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const uploadProfilePicture: RequestHandler = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    user.profilePicture = req.file.filename;
    await user.save();

    return res.json({
      message: "Profile picture updated",
      profilePicture: user.profilePicture,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateUserProfile: RequestHandler = async (req, res) => {
  try {
    const { token, ...newUserData } = req.body;
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { username, email } = newUserData;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      if (existingUser || String(existingUser._id) !== String(user._id)) {
        return res.status(400).json({ message: "user already exists" });
      }
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
