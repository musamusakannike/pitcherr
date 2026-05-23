import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProposal extends Document {
  userId: mongoose.Types.ObjectId;
  jobDescription: string;
  tailoredProposal: string;
  projectOutline: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProposalSchema: Schema<IProposal> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    jobDescription: { type: String, required: true },
    tailoredProposal: { type: String, required: true },
    projectOutline: { type: String, required: true },
  },
  { timestamps: true }
);

// Prevent compiling model multiple times in Next.js development
export const Proposal: Model<IProposal> =
  mongoose.models.Proposal || mongoose.model<IProposal>("Proposal", ProposalSchema);
export default Proposal;
