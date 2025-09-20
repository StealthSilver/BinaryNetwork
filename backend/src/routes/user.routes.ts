import { Router } from "express";
import {
  register,
  login,
  uploadProfilePicture,
  updateUserProfile,
  getUserAndProfile,
  updateProfileData,
  getAllUserProfile,
  downloadProfile,
  sendConnectionRequest,
  getMyConnectionRequests,
  myConnections,
  acceptConnectionRequest,
} from "../controllers/user.controller";
import multer from "multer";
import { authMiddleware } from "../middleware/auth.middleware";

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
const upload = multer({ storage });

router.post("/register", register);
router.post("/login", login);

router.post(
  "/update_profile_picture",
  authMiddleware,
  upload.single("profile_picture"),
  uploadProfilePicture
);

router.put("/user_update", authMiddleware, updateUserProfile);
router.get("/get_user_and_profile", authMiddleware, getUserAndProfile);
router.put("/update_profile", authMiddleware, updateProfileData);
router.get("/all_profiles", authMiddleware, getAllUserProfile);
router.get("/download_profile", authMiddleware, downloadProfile);
router.post("/connect", authMiddleware, sendConnectionRequest);
router.get("/my_sent_connections", authMiddleware, getMyConnectionRequests);
router.get("/my_received_connections", authMiddleware, myConnections);
router.post(
  "/accept_connection_request",
  authMiddleware,
  acceptConnectionRequest
);

export default router;
