import { Router } from "express";
import multer from "multer";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  createPost,
  getAllPosts,
  getMyPosts,
  deletePost,
  commentPost,
} from "../controllers/posts.controller";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/create", authMiddleware, upload.single("media"), createPost);
router.get("/all", authMiddleware, getAllPosts);
router.get("/my_posts", authMiddleware, getMyPosts);
router.delete("/delete", authMiddleware, deletePost);
router.post("/comment", authMiddleware, commentPost);

export default router;
