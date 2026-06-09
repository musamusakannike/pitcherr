import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/db";
import { User, checkSubscriptionExpiry } from "@/lib/models/User";
import { ResumeProfile } from "@/lib/models/ResumeProfile";
import { verifySessionToken } from "@/lib/auth";
import { generateFormResponses } from "@/lib/deepseek";

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifySessionToken(sessionToken);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await checkSubscriptionExpiry(user);

    const isFree = user.plan !== "premium";
    if (isFree && user.proposalsCount >= 3) {
      return NextResponse.json(
        {
          error: "limit_reached",
          message: "You have used your 3 free generations. Upgrade to Premium for unlimited access.",
        },
        { status: 403 }
      );
    }

    const { formFields, profileId } = await request.json();
    if (!formFields || formFields.trim().length === 0) {
      return NextResponse.json({ error: "Form fields are required" }, { status: 400 });
    }

    // Resolve the selected or active resume profile
    let profile;
    if (profileId && profileId !== "undefined" && profileId !== "null") {
      profile = await ResumeProfile.findOne({ _id: profileId, userId: user._id });
    }

    if (!profile) {
      profile = await ResumeProfile.findOne({ userId: user._id, isActive: true });
    }

    if (!profile || !profile.resumeText || profile.resumeText.trim().length === 0) {
      return NextResponse.json(
        { error: "Please upload or paste your resume details in the profile tab first." },
        { status: 400 }
      );
    }

    const result = await generateFormResponses(
      formFields,
      profile.resumeText,
      profile.portfolioUrl,
      profile.additionalDetails
    );

    // Count toward the user's generation limit
    user.proposalsCount += 1;
    await user.save();

    return NextResponse.json({
      success: true,
      responses: result.responses,
      proposalsCount: user.proposalsCount,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to generate form responses";
    console.error("Form filler route error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
