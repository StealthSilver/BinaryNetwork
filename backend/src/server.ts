import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const start = async () => {
  const connectDB = await mongoose.connect("mongodb://localhost:27017/");
};
