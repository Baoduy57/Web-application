import mongoose, { Schema, Types } from "mongoose";

export interface IPost {
  _id: Types.ObjectId | string;
  name: string;
  description: string;
  image?: string; // optional
  createdAt?: Date;
  updatedAt?: Date;
}

const PostSchema = new Schema<IPost>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Post =
  mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);
