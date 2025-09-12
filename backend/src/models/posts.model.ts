import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  userId: mongoose.Types.ObjectId;
  body: string;
  likes: number;
  media: string;
  active: boolean;
  fileType: string;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    media: {
      type: String,
      default: "",
    },
    active: {
      type: Boolean,
      default: true,
    },
    fileType: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const Post = mongoose.model<IPost>("Post", PostSchema);
