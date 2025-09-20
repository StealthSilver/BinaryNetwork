import { RequestHandler } from "express";
import { Post } from "../models/posts.model";
import { Comment } from "../models/comments.model";

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

export const deletePost: RequestHandler = async (req, res) => {
  try {
    const user = (req as any).user;
    const { post_id } = req.body;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!post_id) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    const post = await Post.findById(post_id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (String(post.userId) !== String(user._id)) {
      return res.status(403).json({ message: "You cannot delete this post" });
    }

    await Post.findByIdAndDelete(post_id);

    return res.json({ message: "Post deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const commentPost: RequestHandler = async (req, res) => {
  try {
    const user = (req as any).user;
    const { postId, body } = req.body;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!postId || !body) {
      return res.status(400).json({ message: "postId and body are required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = new Comment({
      userId: user._id,
      postId,
      body,
    });

    await newComment.save();

    return res.status(201).json({
      message: "Comment added successfully",
      comment: newComment,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCommentsByPost: RequestHandler = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!postId) {
      return res.status(400).json({ message: "postId is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comments = await Comment.find({ postId })
      .populate("userId", "name username profilePicture")
      .sort({ createdAt: -1 });

    return res.json({ comments });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteCommentOfUser: RequestHandler = async (req, res) => {
  try {
    const user = (req as any).user;
    const { commentId } = req.body;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!commentId) {
      return res.status(400).json({ message: "commentId is required" });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (String(comment.userId) !== String(user._id)) {
      return res
        .status(403)
        .json({ message: "You are not allowed to delete this comment" });
    }

    await Comment.findByIdAndDelete(commentId);

    return res.json({ message: "Comment deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
