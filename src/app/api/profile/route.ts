import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/models/User";
import { verifySessionToken } from "@/lib/auth";

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

    // 2. Parse payload
    const { resumeText, resumeFileName } = await request.json();

    if (!resumeText) {
      return NextResponse.json({ error: "Missing resume text" }, { status: 400 });
    }

    // 3. Update database
    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { resumeText, resumeFileName },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        proposalsCount: user.proposalsCount,
        resumeText: user.resumeText,
        resumeFileName: user.resumeFileName,
        dva: user.dva,
      },
    });
  } catch (error) {
    console.error("Profile route error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
