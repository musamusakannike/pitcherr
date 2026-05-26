import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/models/User";
import { Proposal } from "@/lib/models/Proposal";
import { ResumeProfile } from "@/lib/models/ResumeProfile";
import { verifySessionToken } from "@/lib/auth";
import { generateProposal } from "@/lib/deepseek";

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    // 1. Authenticate user
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifySessionToken(sessionToken);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    // 2. Fetch fresh user details to check limits
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check freemium limits
    const isFree = user.plan !== "premium";
    if (isFree && user.proposalsCount >= 3) {
      return NextResponse.json(
        {
          error: "limit_reached",
          message: "You have used your 3 free proposal generations. Upgrade to Premium for unlimited generations and deep analysis.",
        },
        { status: 403 }
      );
    }

    // 3. Parse input
    const { jobDescription, profileId } = await request.json();
    if (!jobDescription || jobDescription.trim().length === 0) {
      return NextResponse.json({ error: "Job description is required" }, { status: 400 });
    }

    // 4. Resolve the selected or active resume profile
    let profile;
    if (profileId && profileId !== "undefined" && profileId !== "null") {
      profile = await ResumeProfile.findOne({ _id: profileId, userId: user._id });
    }

    if (!profile) {
      // Find the active profile
      profile = await ResumeProfile.findOne({ userId: user._id, isActive: true });
    }

    if (!profile) {
      // Backwards compatibility fallback: Check if user has legacy resume data
      if (user.resumeText && user.resumeText.trim().length > 0) {
        console.log(`[Generate Fallback] Creating default profile from legacy data for user: ${user._id}`);
        profile = await ResumeProfile.create({
          userId: user._id,
          title: "Default Profile",
          resumeText: user.resumeText,
          resumeFileName: user.resumeFileName || "resume.pdf",
          resumeUrl: user.resumeUrl || "",
          portfolioUrl: "",
          isActive: true,
        });
      }
    }

    if (!profile || !profile.resumeText || profile.resumeText.trim().length === 0) {
      return NextResponse.json(
        { error: "Please upload or paste your resume details in the profile tab first." },
        { status: 400 }
      );
    }

    // 5. Generate proposal using DeepSeek AI, passing the profile's text and portfolio URL
    const result = await generateProposal(profile.resumeText, jobDescription, profile.portfolioUrl);

    // 5. Save proposal to MongoDB
    const proposal = await Proposal.create({
      userId: user._id,
      jobDescription,
      tailoredProposal: result.proposal,
      projectOutline: result.outline,
    });

    // 6. Update user's proposal counter
    user.proposalsCount += 1;
    await user.save();

    return NextResponse.json({
      success: true,
      proposal,
      proposalsCount: user.proposalsCount,
    });
  } catch (error: any) {
    console.error("Proposal generation route error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate proposal" }, { status: 500 });
  }
}
