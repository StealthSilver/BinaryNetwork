"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const posts_controller_1 = require("../controllers/posts.controller");
const router = (0, express_1.Router)();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    },
});
const upload = (0, multer_1.default)({ storage: storage });
router.post("/create", auth_middleware_1.authMiddleware, upload.single("media"), posts_controller_1.createPost);
router.get("/all", auth_middleware_1.authMiddleware, posts_controller_1.getAllPosts);
router.get("/my_posts", auth_middleware_1.authMiddleware, posts_controller_1.getMyPosts);
router.delete("/delete", auth_middleware_1.authMiddleware, posts_controller_1.deletePost);
router.post("/comment", auth_middleware_1.authMiddleware, posts_controller_1.commentPost);
router.get("/:postId/comments", auth_middleware_1.authMiddleware, posts_controller_1.getCommentsByPost);
router.delete("/delete_comment", auth_middleware_1.authMiddleware, posts_controller_1.deleteCommentOfUser);
router.post("/like_post", auth_middleware_1.authMiddleware, posts_controller_1.incrementLikes);
exports.default = router;
