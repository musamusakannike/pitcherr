import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/db";
import { Proposal } from "@/lib/models/Proposal";
import { verifySessionToken } from "@/lib/auth";

export async function GET() {
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

    // 2. Fetch user's proposals
    const proposals = await Proposal.find({ userId: decoded.userId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, proposals });
  } catch (error) {
    console.error("Proposals list route error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
