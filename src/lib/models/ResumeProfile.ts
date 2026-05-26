import mongoose, { Schema, Document, Model } from "mongoose";

export interface IResumeProfile extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;          // e.g. "React Developer", "UI/UX Designer"
  resumeText: string;
  resumeFileName?: string;
  resumeUrl?: string;
  portfolioUrl?: string; // Optional portfolio link
  isActive: boolean;     // The currently selected profile
  createdAt: Date;
  updatedAt: Date;
}

const ResumeProfileSchema: Schema<IResumeProfile> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    resumeText: { type: String, required: true },
    resumeFileName: { type: String },
    resumeUrl: { type: String },
    portfolioUrl: { type: String },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Prevent compiling model multiple times in Next.js development
export const ResumeProfile: Model<IResumeProfile> =
  mongoose.models.ResumeProfile || mongoose.model<IResumeProfile>("ResumeProfile", ResumeProfileSchema);
export default ResumeProfile;
