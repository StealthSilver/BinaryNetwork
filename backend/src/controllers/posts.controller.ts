import { RequestHandler } from "express";
import { Post } from "../models/posts.model";

export const createPost: RequestHandler = async (req, res) => {
  try {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { body } = req.body;

    if (!body) {
      return res.status(400).json({ message: "Post body is required" });
    }

    const media = req.file ? req.file.filename : "";
    const fileType = req.file ? req.file.mimetype : "";

    const newPost = new Post({
      userId: user._id,
      body,
      media,
      fileType,
    });

    await newPost.save();

    return res.status(201).json({
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllPosts: RequestHandler = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("userId", "name username profilePicture")
      .sort({ createdAt: -1 });

    return res.json({ posts });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMyPosts: RequestHandler = async (req, res) => {
  try {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const posts = await Post.find({ userId: user._id }).sort({ createdAt: -1 });

    return res.json({ posts });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
