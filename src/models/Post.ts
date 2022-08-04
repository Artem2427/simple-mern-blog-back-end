import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPost {
  title: string;
  text: string;
  tags?: string[];
  imageUrl?: string;
}

export interface IPostModel extends IPost, Document {}

const PostSchema: Schema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
    tags: { type: Array, default: [] },
    viewsCount: { type: Number, default: 0 },
    imageUrl: String,
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { versionKey: false, timestamps: true }
);

export default mongoose.model<IPostModel>("Post", PostSchema);
