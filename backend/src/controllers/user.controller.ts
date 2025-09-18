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
