import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  firebaseUid: string;
  resumeText?: string;
  resumeFileName?: string;
  resumeUrl?: string;
  plan: "free" | "premium";
  premiumExpiresAt?: Date;
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
    resumeUrl: { type: String },
    plan: { type: String, enum: ["free", "premium"], default: "free" },
    premiumExpiresAt: { type: Date },
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

/**
 * Lazy subscription enforcer. Checks if a user's subscription has expired
 * and automatically resets their plan status back to free.
 */
export async function checkSubscriptionExpiry(user: any): Promise<any> {
  if (user && user.plan === "premium" && user.premiumExpiresAt) {
    if (new Date() > new Date(user.premiumExpiresAt)) {
      console.log(`[SUBSCRIPTION ENFORCER] User ${user.email} premium subscription expired on ${user.premiumExpiresAt}. Downgrading to FREE.`);
      user.plan = "free";
      await user.save();
    }
  }
  return user;
}

export default User;
