import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  firebaseUid: string;
  resumeText?: string;
  resumeFileName?: string;
  plan: "free" | "premium";
  proposalsCount: number;
  dva?: {
    accountNumber: string;
    bankName: string;
    accountName: string;
    customerCode: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    firebaseUid: { type: String, required: true, unique: true },
    resumeText: { type: String },
    resumeFileName: { type: String },
    plan: { type: String, enum: ["free", "premium"], default: "free" },
    proposalsCount: { type: Number, default: 0 },
    dva: {
      accountNumber: { type: String },
      bankName: { type: String },
      accountName: { type: String },
      customerCode: { type: String },
    },
  },
  { timestamps: true }
);

// Prevent compiling model multiple times in Next.js development
export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
