import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/models/User";
import { ResumeProfile } from "@/lib/models/ResumeProfile";
import { verifySessionToken } from "@/lib/auth";

// Fetch all profiles for authenticated user (with legacy fallback migration)
export async function GET() {
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

    // 1. Fetch current profile list
    let profiles = await ResumeProfile.find({ userId: decoded.userId }).sort({ createdAt: -1 });

    // 2. Migration fallback: If 0 profiles exist, check if User has legacy resume data and migrate it
    if (profiles.length === 0) {
      const user = await User.findById(decoded.userId);
      if (user && user.resumeText) {
        console.log(`[Migration] Auto-migrating legacy resume for user: ${user._id}`);
        const defaultProfile = await ResumeProfile.create({
          userId: user._id,
          title: "Default Profile",
          resumeText: user.resumeText,
          resumeFileName: user.resumeFileName || "resume.pdf",
          resumeUrl: user.resumeUrl || "",
          portfolioUrl: "",
          isActive: true,
        });
        profiles = [defaultProfile];
      }
    }

    return NextResponse.json({ success: true, profiles });
  } catch (error: any) {
    console.error("Fetch profiles API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Create a new resume profile
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

    const { title, resumeText, portfolioUrl, additionalDetails } = await request.json();

    if (!title || title.trim().length === 0) {
      return NextResponse.json({ error: "Profile title is required" }, { status: 400 });
    }

    const cleanedText = resumeText || "Please upload or paste your resume/portfolio details.";

    // Check how many profiles the user already has
    const count = await ResumeProfile.countDocuments({ userId: decoded.userId });

    // If first profile, default to active. Otherwise false.
    const isActive = count === 0;

    // Create the new profile
    const profile = await ResumeProfile.create({
      userId: decoded.userId,
      title: title.trim(),
      resumeText: cleanedText,
      portfolioUrl: portfolioUrl ? portfolioUrl.trim() : "",
      additionalDetails: additionalDetails ? additionalDetails.trim() : "",
      isActive,
    });

    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    console.error("Create profile API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
