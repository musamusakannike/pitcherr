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

    // 2. Direct database plan simulation (upgrade or downgrade)
    const url = new URL(request.url);
    const action = url.searchParams.get("action");
    const plan = action === "downgrade" ? "free" : "premium";

    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { plan },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log(`[SIMULATOR] Upgraded user ${user.email} to PREMIUM plan`);

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        proposalsCount: user.proposalsCount,
        dva: user.dva,
      },
    });
  } catch (error: any) {
    console.error("Simulation upgrade error:", error);
    return NextResponse.json({ error: "Simulator failed" }, { status: 500 });
  }
}
