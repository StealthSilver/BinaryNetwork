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
exports.getMyPosts = exports.getAllPosts = exports.createPost = void 0;
const posts_model_1 = require("../models/posts.model");
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
