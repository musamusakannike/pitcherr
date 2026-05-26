import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/db";
import { ResumeProfile } from "@/lib/models/ResumeProfile";
import { verifySessionToken } from "@/lib/auth";

// Update a specific resume profile (e.g. edit details or set as active)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const { title, resumeText, portfolioUrl, isActive } = await request.json();

    // Find and verify profile ownership
    const profile = await ResumeProfile.findOne({ _id: id, userId: decoded.userId });
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Update fields if provided
    if (title !== undefined) profile.title = title.trim();
    if (resumeText !== undefined) profile.resumeText = resumeText;
    if (portfolioUrl !== undefined) profile.portfolioUrl = portfolioUrl.trim();
    
    // Set as active if requested
    if (isActive === true) {
      profile.isActive = true;
      // Mark all other profiles of this user as inactive
      await ResumeProfile.updateMany(
        { userId: decoded.userId, _id: { $ne: id } },
        { isActive: false }
      );
    } else if (isActive === false) {
      // Cannot deactivate the only profile unless another is active
      const count = await ResumeProfile.countDocuments({ userId: decoded.userId, _id: { $ne: id } });
      if (count > 0 && profile.isActive) {
        profile.isActive = false;
        // Promote the most recent alternative to active
        const altProfile = await ResumeProfile.findOne({ userId: decoded.userId, _id: { $ne: id } }).sort({ updatedAt: -1 });
        if (altProfile) {
          altProfile.isActive = true;
          await altProfile.save();
        }
      }
    }

    await profile.save();

    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    console.error("Update profile API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Delete a specific resume profile
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // Verify ownership
    const profileToDelete = await ResumeProfile.findOne({ _id: id, userId: decoded.userId });
    if (!profileToDelete) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const wasActive = profileToDelete.isActive;

    // Delete the profile
    await ResumeProfile.deleteOne({ _id: id });

    // If the deleted profile was active, find another remaining profile and activate it
    if (wasActive) {
      const remainingProfile = await ResumeProfile.findOne({ userId: decoded.userId }).sort({ updatedAt: -1 });
      if (remainingProfile) {
        remainingProfile.isActive = true;
        await remainingProfile.save();
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete profile API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
