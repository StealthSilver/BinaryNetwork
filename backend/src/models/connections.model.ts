import mongoose, { Document, Schema } from "mongoose";

export interface IConnection extends Document {
  userId: mongoose.Types.ObjectId;
  connectionId: mongoose.Types.ObjectId;
  statusAccepted: boolean | null;
  createdAt: Date;
  updatedAt: Date;
}

const ConnectionSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    connectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    statusAccepted: {
      type: Boolean,
      default: null,
    },
  },
  { timestamps: true }
);

export const Connection = mongoose.model<IConnection>(
  "Connection",
  ConnectionSchema
);
