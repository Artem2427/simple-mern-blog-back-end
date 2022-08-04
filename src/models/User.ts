import mongoose, { Document, Schema } from "mongoose";

export interface IUser {
  fullName: string;
  email: string;
  passwordHash: string;
  avatarUrl: string;
}

export interface IUserModel extends IUser, Document {}

const UserSchema: Schema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    avatarUrl: String, // optional
  },
  { versionKey: false, timestamps: true }
);

export default mongoose.model<IUserModel>("User", UserSchema);
