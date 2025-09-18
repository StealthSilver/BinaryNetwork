import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const user = await User.findOne({
      "tokens.token": token,
      "tokens.expiresAt": { $gt: new Date() },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    (req as any).user = user;
    next();
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
