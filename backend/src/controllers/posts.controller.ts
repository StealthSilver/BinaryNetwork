import { RequestHandler } from "express";
import User from "../models/user.model";
import { Profile } from "../models/profile.model";
import bcrypt from "bcrypt";

export const activeCheck: RequestHandler = async (req, res) => {
  return res.status(200).json({ message: "RUNNING" });
};

const register = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    if (!name || !email || !password || !username)
      return res.status(400).json({ massage: "All fields are required" });

    const user = await User.findOne({
      email,
    });

    if (user) return res.status(400).json({ message: "user already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      username,
    });

    await newUser.save();
    const profile = new Profile({
      userId: newUser._id,
    });

    return res.json({ message: "User created" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
