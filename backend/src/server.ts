import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import postRoutes from "./routes/posts.route";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(postRoutes);

const start = async () => {
  const connectDB = await mongoose.connect("mongodb://localhost:27017/");

  app.listen(9090, () => {
    console.log("server is running on port 9090");
  });
};

start();
