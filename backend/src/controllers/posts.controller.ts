import { RequestHandler } from "express";

export const activeCheck: RequestHandler = async (req, res) => {
  return res.status(200).json({ message: "RUNNING" });
};
