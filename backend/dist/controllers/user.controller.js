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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendConnectionRequest = exports.convertUserDataToPDF = exports.downloadProfile = exports.getAllUserProfile = exports.updateProfileData = exports.getUserAndProfile = exports.updateUserProfile = exports.uploadProfilePicture = exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const connections_model_1 = require("../models/connections.model");
const profile_model_1 = require("../models/profile.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, username } = req.body;
        if (!name || !email || !password || !username) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = yield user_model_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = new user_model_1.default({
            name,
            email,
            password: hashedPassword,
            username,
        });
        yield newUser.save();
        const profile = new profile_model_1.Profile({ userId: newUser._id });
        yield profile.save();
        const token = crypto_1.default.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        newUser.tokens.push({ token, createdAt: new Date(), expiresAt });
        yield newUser.save();
        const _a = newUser.toObject(), { password: _, tokens } = _a, userData = __rest(_a, ["password", "tokens"]);
        return res.status(201).json({
            message: "User created successfully",
            token,
            user: userData,
        });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Email and password are required" });
        }
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = crypto_1.default.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        user.tokens.push({ token, createdAt: new Date(), expiresAt });
        yield user.save();
        const _a = user.toObject(), { password: _, tokens } = _a, userData = __rest(_a, ["password", "tokens"]);
        return res.status(200).json({
            message: "Login successful",
            token,
            user: userData,
        });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.login = login;
const uploadProfilePicture = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        user.profilePicture = req.file.filename;
        yield user.save();
        return res.json({
            message: "Profile picture updated",
            profilePicture: user.profilePicture,
        });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.uploadProfilePicture = uploadProfilePicture;
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const _a = req.body, { username, email } = _a, restData = __rest(_a, ["username", "email"]);
        if (username || email) {
            const existingUser = yield user_model_1.default.findOne({
                $or: [{ username }, { email }],
                _id: { $ne: user._id },
            });
            if (existingUser) {
                return res
                    .status(400)
                    .json({ message: "Username or email already exists" });
            }
        }
        Object.assign(user, Object.assign({ username, email }, restData));
        yield user.save();
        return res.json({ message: "User updated", user });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.updateUserProfile = updateUserProfile;
const getUserAndProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const userProfile = yield profile_model_1.Profile.findOne({ userId: user._id }).populate("userId", "name email username profilePicture");
        if (!userProfile) {
            return res.status(404).json({ message: "Profile not found" });
        }
        return res.json({ user, profile: userProfile });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.getUserAndProfile = getUserAndProfile;
const updateProfileData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const newProfileData = req.body;
        let profile = yield profile_model_1.Profile.findOne({ userId: user._id });
        if (!profile) {
            profile = new profile_model_1.Profile(Object.assign({ userId: user._id }, newProfileData));
        }
        else {
            Object.assign(profile, newProfileData);
        }
        yield profile.save();
        return res.json({
            message: "Profile updated successfully",
            profile,
        });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.updateProfileData = updateProfileData;
const getAllUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profiles = yield profile_model_1.Profile.find().populate("userId", "name username email profilePicture");
        if (!profiles || profiles.length === 0) {
            return res.status(404).json({ message: "No profiles found" });
        }
        return res.json({
            message: "Profiles fetched successfully",
            count: profiles.length,
            profiles,
        });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.getAllUserProfile = getAllUserProfile;
const downloadProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.query.id;
        if (!user_id) {
            return res.status(400).json({ message: "User ID is required" });
        }
        const userProfile = yield profile_model_1.Profile.findOne({ userId: user_id }).populate("userId", "name username email profilePicture");
        if (!userProfile) {
            return res.status(404).json({ message: "Profile not found" });
        }
        const filePath = yield (0, exports.convertUserDataToPDF)(userProfile);
        return res.download(filePath, (err) => {
            if (err) {
                console.error("File download error:", err);
                res.status(500).json({ message: "Could not download file" });
            }
            else {
                fs_1.default.unlink(filePath, () => { });
            }
        });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.downloadProfile = downloadProfile;
const convertUserDataToPDF = (userData) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new pdfkit_1.default({ margin: 50 });
            const outputPath = path_1.default.join("uploads", crypto_1.default.randomBytes(16).toString("hex") + ".pdf");
            const stream = fs_1.default.createWriteStream(outputPath);
            doc.pipe(stream);
            doc.fontSize(20).text("User Profile", { align: "center" }).moveDown(2);
            let profilePicPath = path_1.default.join("uploads", userData.userId.profilePicture || "default.jpg");
            if (!fs_1.default.existsSync(profilePicPath)) {
                profilePicPath = path_1.default.join("uploads", "default_user.png");
            }
            doc
                .image(profilePicPath, { fit: [100, 100], align: "center" })
                .moveDown(1);
            doc.fontSize(14).text(`Name: ${userData.userId.name}`);
            doc.text(`Username: ${userData.userId.username}`);
            doc.text(`Email: ${userData.userId.email}`);
            if (userData.bio)
                doc.text(`Bio: ${userData.bio}`);
            if (userData.currentPost)
                doc.text(`Current Post: ${userData.currentPost}`);
            if (userData.location)
                doc.text(`Location: ${userData.location}`);
            if (userData.website)
                doc.text(`Website: ${userData.website}`);
            doc.moveDown(1);
            if (userData.pastWork && userData.pastWork.length > 0) {
                doc.fontSize(16).text("Past Work", { underline: true }).moveDown(0.5);
                userData.pastWork.forEach((work, i) => {
                    doc
                        .fontSize(12)
                        .text(`${i + 1}. ${work.company} - ${work.position} (${work.years})`, { indent: 20 });
                });
                doc.moveDown(1);
            }
            if (userData.education && userData.education.length > 0) {
                doc.fontSize(16).text("Education", { underline: true }).moveDown(0.5);
                userData.education.forEach((edu, i) => {
                    doc
                        .fontSize(12)
                        .text(`${i + 1}. ${edu.school} - ${edu.degree} in ${edu.fieldOfStudy}`, { indent: 20 });
                });
                doc.moveDown(1);
            }
            doc.end();
            stream.on("finish", () => resolve(outputPath));
            stream.on("error", (err) => reject(err));
        }
        catch (err) {
            reject(err);
        }
    });
};
exports.convertUserDataToPDF = convertUserDataToPDF;
const sendConnectionRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { connectionId } = req.body;
        if (!connectionId) {
            return res
                .status(400)
                .json({ message: "Connection user ID is required" });
        }
        const connectionUser = yield user_model_1.default.findById(connectionId);
        if (!connectionUser) {
            return res.status(404).json({ message: "Connection user not found" });
        }
        if (String(user._id) === String(connectionId)) {
            return res
                .status(400)
                .json({ message: "You cannot connect with yourself" });
        }
        const existingRequest = yield connections_model_1.Connection.findOne({
            $or: [
                { userId: user._id, connectionId },
                { userId: connectionId, connectionId: user._id },
            ],
        });
        if (existingRequest) {
            return res
                .status(400)
                .json({ message: "Connection request already exists" });
        }
        const newConnection = new connections_model_1.Connection({
            userId: user._id,
            connectionId,
            statusAccepted: null,
        });
        yield newConnection.save();
        return res
            .status(201)
            .json({ message: "Connection request sent", connection: newConnection });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.sendConnectionRequest = sendConnectionRequest;
