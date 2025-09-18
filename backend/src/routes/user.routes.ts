import { Router } from "express";
import { register, login } from "../controllers/user.controller";
import multer from "multer";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

router.post("/register", register);
router.post("/login", login);

export default router;
