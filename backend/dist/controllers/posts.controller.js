"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.incrementLikes = exports.deleteCommentOfUser = exports.getCommentsByPost = exports.commentPost = exports.deletePost = exports.getMyPosts = exports.getAllPosts = exports.createPost = void 0;
const posts_model_1 = require("../models/posts.model");
const comments_model_1 = require("../models/comments.model");
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { body } = req.body;
        if (!body) {
            return res.status(400).json({ message: "Post body is required" });
        }
        const media = req.file ? req.file.filename : "";
        const fileType = req.file ? req.file.mimetype : "";
        const newPost = new posts_model_1.Post({
            userId: user._id,
            body,
            media,
            fileType,
        });
        yield newPost.save();
        return res.status(201).json({
            message: "Post created successfully",
            post: newPost,
        });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.createPost = createPost;
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield posts_model_1.Post.find()
            .populate("userId", "name username profilePicture")
            .sort({ createdAt: -1 });
        return res.json({ posts });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.getAllPosts = getAllPosts;
const getMyPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const posts = yield posts_model_1.Post.find({ userId: user._id }).sort({ createdAt: -1 });
        return res.json({ posts });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.getMyPosts = getMyPosts;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { post_id } = req.body;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!post_id) {
            return res.status(400).json({ message: "Post ID is required" });
        }
        const post = yield posts_model_1.Post.findById(post_id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        if (String(post.userId) !== String(user._id)) {
            return res.status(403).json({ message: "You cannot delete this post" });
        }
        yield posts_model_1.Post.findByIdAndDelete(post_id);
        return res.json({ message: "Post deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.deletePost = deletePost;
const commentPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { postId, body } = req.body;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!postId || !body) {
            return res.status(400).json({ message: "postId and body are required" });
        }
        const post = yield posts_model_1.Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const newComment = new comments_model_1.Comment({
            userId: user._id,
            postId,
            body,
        });
        yield newComment.save();
        return res.status(201).json({
            message: "Comment added successfully",
            comment: newComment,
        });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.commentPost = commentPost;
const getCommentsByPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.params;
        if (!postId) {
            return res.status(400).json({ message: "postId is required" });
        }
        const post = yield posts_model_1.Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const comments = yield comments_model_1.Comment.find({ postId })
            .populate("userId", "name username profilePicture")
            .sort({ createdAt: -1 });
        return res.json({ comments });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.getCommentsByPost = getCommentsByPost;
const deleteCommentOfUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { commentId } = req.body;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!commentId) {
            return res.status(400).json({ message: "commentId is required" });
        }
        const comment = yield comments_model_1.Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        if (String(comment.userId) !== String(user._id)) {
            return res
                .status(403)
                .json({ message: "You are not allowed to delete this comment" });
        }
        yield comments_model_1.Comment.findByIdAndDelete(commentId);
        return res.json({ message: "Comment deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.deleteCommentOfUser = deleteCommentOfUser;
const incrementLikes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.body;
        if (!postId) {
            return res.status(400).json({ message: "postId is required" });
        }
        const post = yield posts_model_1.Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        post.likes = (post.likes || 0) + 1;
        yield post.save();
        return res.json({
            message: "Like added successfully",
            likes: post.likes,
            postId: post._id,
        });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.incrementLikes = incrementLikes;
