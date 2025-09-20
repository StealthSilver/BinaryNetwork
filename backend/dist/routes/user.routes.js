"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const multer_1 = __importDefault(require("multer"));
const auth_middleware_1 = require("../middleware/auth.middleware");
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
const upload = (0, multer_1.default)({ storage });
router.post("/register", user_controller_1.register);
router.post("/login", user_controller_1.login);
router.post("/update_profile_picture", auth_middleware_1.authMiddleware, upload.single("profile_picture"), user_controller_1.uploadProfilePicture);
router.put("/user_update", auth_middleware_1.authMiddleware, user_controller_1.updateUserProfile);
router.get("/get_user_and_profile", auth_middleware_1.authMiddleware, user_controller_1.getUserAndProfile);
router.put("/update_profile", auth_middleware_1.authMiddleware, user_controller_1.updateProfileData);
router.get("/all_profiles", auth_middleware_1.authMiddleware, user_controller_1.getAllUserProfile);
router.get("/download_profile", auth_middleware_1.authMiddleware, user_controller_1.downloadProfile);
router.post("/connect", auth_middleware_1.authMiddleware, user_controller_1.sendConnectionRequest);
router.get("/my_sent_connections", auth_middleware_1.authMiddleware, user_controller_1.getMyConnectionRequests);
router.get("/my_received_connections", auth_middleware_1.authMiddleware, user_controller_1.myConnections);
router.post("/accept_connection_request", auth_middleware_1.authMiddleware, user_controller_1.acceptConnectionRequest);
exports.default = router;
