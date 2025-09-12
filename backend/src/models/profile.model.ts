import mongoose, { Document, Schema } from "mongoose";

export interface IEducation {
  school: string;
  degree: string;
  fieldOfStudy: string;
}

export interface IWork {
  company: string;
  position: string;
  years: string;
}

export interface IProfile extends Document {
  userId: mongoose.Types.ObjectId;
  bio: string;
  currentPost: string;
  pastWork: IWork[];
  education: IEducation[];
  createdAt: Date;
  updatedAt: Date;
}

const educationSchema = new Schema<IEducation>(
  {
    school: { type: String, default: "" },
    degree: { type: String, default: "" },
    fieldOfStudy: { type: String, default: "" },
  },
  { _id: false }
);

const workSchema = new Schema<IWork>(
  {
    company: { type: String, default: "" },
    position: { type: String, default: "" },
    years: { type: String, default: "" },
  },
  { _id: false }
);

const ProfileSchema = new Schema<IProfile>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bio: {
      type: String,
      default: "",
      trim: true,
    },
    currentPost: {
      type: String,
      default: "",
    },
    pastWork: {
      type: [workSchema],
      default: [],
    },
    education: {
      type: [educationSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export const Profile = mongoose.model<IProfile>("Profile", ProfileSchema);
