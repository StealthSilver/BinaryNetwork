import { RequestHandler } from "express";
import User from "../models/user.model";
import { Connection } from "../models/connections.model";
import { Profile } from "../models/profile.model";
import bcrypt from "bcrypt";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const register: RequestHandler = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    if (!name || !email || !password || !username) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      username,
    });

    await newUser.save();

    const profile = new Profile({ userId: newUser._id });
    await profile.save();

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    newUser.tokens.push({ token, createdAt: new Date(), expiresAt });
    await newUser.save();

    const { password: _, tokens, ...userData } = newUser.toObject();

    return res.status(201).json({
      message: "User created successfully",
      token,
      user: userData,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const login: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    user.tokens.push({ token, createdAt: new Date(), expiresAt });
    await user.save();

    const { password: _, tokens, ...userData } = user.toObject();

    return res.status(200).json({
      message: "Login successful",
      token,
      user: userData,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const uploadProfilePicture: RequestHandler = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    user.profilePicture = req.file.filename;
    await user.save();

    return res.json({
      message: "Profile picture updated",
      profilePicture: user.profilePicture,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateUserProfile: RequestHandler = async (req, res) => {
  try {
    const user = (req as any).user;
    const { username, email, ...restData } = req.body;

    if (username || email) {
      const existingUser = await User.findOne({
        $or: [{ username }, { email }],
        _id: { $ne: user._id },
      });

      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Username or email already exists" });
      }
    }

    Object.assign(user, { username, email, ...restData });
    await user.save();

    return res.json({ message: "User updated", user });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUserAndProfile: RequestHandler = async (req, res) => {
  try {
    const user = (req as any).user;

    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name email username profilePicture"
    );

    if (!userProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.json({ user, profile: userProfile });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateProfileData: RequestHandler = async (req, res) => {
  try {
    const user = (req as any).user;
    const newProfileData = req.body;

    let profile = await Profile.findOne({ userId: user._id });

    if (!profile) {
      profile = new Profile({
        userId: user._id,
        ...newProfileData,
      });
    } else {
      Object.assign(profile, newProfileData);
    }

    await profile.save();

    return res.json({
      message: "Profile updated successfully",
      profile,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllUserProfile: RequestHandler = async (req, res) => {
  try {
    const profiles = await Profile.find().populate(
      "userId",
      "name username email profilePicture"
    );

    if (!profiles || profiles.length === 0) {
      return res.status(404).json({ message: "No profiles found" });
    }

    return res.json({
      message: "Profiles fetched successfully",
      count: profiles.length,
      profiles,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const downloadProfile: RequestHandler = async (req, res) => {
  try {
    const user_id = req.query.id;

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const userProfile = await Profile.findOne({ userId: user_id }).populate(
      "userId",
      "name username email profilePicture"
    );

    if (!userProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const filePath = await convertUserDataToPDF(userProfile);

    return res.download(filePath, (err) => {
      if (err) {
        console.error("File download error:", err);
        res.status(500).json({ message: "Could not download file" });
      } else {
        fs.unlink(filePath, () => {});
      }
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const convertUserDataToPDF = (userData: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const outputPath = path.join(
        "uploads",
        crypto.randomBytes(16).toString("hex") + ".pdf"
      );

      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);

      doc.fontSize(20).text("User Profile", { align: "center" }).moveDown(2);

      let profilePicPath = path.join(
        "uploads",
        userData.userId.profilePicture || "default.jpg"
      );

      if (!fs.existsSync(profilePicPath)) {
        profilePicPath = path.join("uploads", "default_user.png");
      }

      doc
        .image(profilePicPath, { fit: [100, 100], align: "center" })
        .moveDown(1);

      doc.fontSize(14).text(`Name: ${userData.userId.name}`);
      doc.text(`Username: ${userData.userId.username}`);
      doc.text(`Email: ${userData.userId.email}`);
      if (userData.bio) doc.text(`Bio: ${userData.bio}`);
      if (userData.currentPost)
        doc.text(`Current Post: ${userData.currentPost}`);
      if (userData.location) doc.text(`Location: ${userData.location}`);
      if (userData.website) doc.text(`Website: ${userData.website}`);
      doc.moveDown(1);

      if (userData.pastWork && userData.pastWork.length > 0) {
        doc.fontSize(16).text("Past Work", { underline: true }).moveDown(0.5);
        userData.pastWork.forEach((work: any, i: number) => {
          doc
            .fontSize(12)
            .text(
              `${i + 1}. ${work.company} - ${work.position} (${work.years})`,
              { indent: 20 }
            );
        });
        doc.moveDown(1);
      }

      if (userData.education && userData.education.length > 0) {
        doc.fontSize(16).text("Education", { underline: true }).moveDown(0.5);
        userData.education.forEach((edu: any, i: number) => {
          doc
            .fontSize(12)
            .text(
              `${i + 1}. ${edu.school} - ${edu.degree} in ${edu.fieldOfStudy}`,
              { indent: 20 }
            );
        });
        doc.moveDown(1);
      }

      doc.end();

      stream.on("finish", () => resolve(outputPath));
      stream.on("error", (err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
};

export const sendConnectionRequest: RequestHandler = async (req, res) => {
  try {
    const user = (req as any).user;
    const { connectionId } = req.body;

    if (!connectionId) {
      return res
        .status(400)
        .json({ message: "Connection user ID is required" });
    }

    const connectionUser = await User.findById(connectionId);
    if (!connectionUser) {
      return res.status(404).json({ message: "Connection user not found" });
    }

    if (String(user._id) === String(connectionId)) {
      return res
        .status(400)
        .json({ message: "You cannot connect with yourself" });
    }

    const existingRequest = await Connection.findOne({
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

    const newConnection = new Connection({
      userId: user._id,
      connectionId,
      statusAccepted: null,
    });

    await newConnection.save();

    return res
      .status(201)
      .json({ message: "Connection request sent", connection: newConnection });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMyConnectionRequests: RequestHandler = async (req, res) => {
  try {
    const user = (req as any).user;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const sentConnections = await Connection.find({ userId: user._id })
      .populate("connectionId", "name username email profilePicture")
      .sort({ createdAt: -1 });

    return res.json({
      message: "Sent connection requests fetched successfully",
      count: sentConnections.length,
      sentConnections,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const myConnections: RequestHandler = async (req, res) => {
  try {
    const user = (req as any).user;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const receivedConnections = await Connection.find({
      connectionId: user._id,
    })
      .populate("userId", "name username email profilePicture")
      .sort({ createdAt: -1 });

    return res.json({
      message: "Received connection requests fetched successfully",
      count: receivedConnections.length,
      receivedConnections,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const acceptConnectionRequest: RequestHandler = async (req, res) => {
  const { token, requestId, action_type } = req.body;

  try {
    const user = await sendConnectionRequest.findOne({ _id: requestId });
    if (!user) {
      return res.status(404);
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
