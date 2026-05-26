import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/db";
import { User, checkSubscriptionExpiry } from "@/lib/models/User";
import { verifySessionToken } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ user: null });
    }

    const decoded = verifySessionToken(sessionToken);
    if (!decoded) {
      return NextResponse.json({ user: null });
    }

    let user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ user: null });
    }

    await checkSubscriptionExpiry(user);

    return NextResponse.json({
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
    console.error("Auth me route error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
