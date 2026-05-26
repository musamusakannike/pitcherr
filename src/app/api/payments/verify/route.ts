import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/models/User";
import { verifySessionToken } from "@/lib/auth";
import { verifyTransaction } from "@/lib/paystack";
import { sendPremiumWelcomeEmail } from "@/lib/resend";

export async function GET(request: Request) {
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

    // 2. Parse reference
    const url = new URL(request.url);
    const reference = url.searchParams.get("reference");

    if (!reference || reference.trim().length === 0) {
      return NextResponse.json({ error: "Reference parameter is required" }, { status: 400 });
    }

    // 3. Verify transaction with Paystack API
    const isSuccess = await verifyTransaction(reference);

    if (!isSuccess) {
      return NextResponse.json({ error: "Payment verification failed or transaction not successful" }, { status: 400 });
    }

    // 4. Check user plan before upgrading to prevent duplicate emails
    const existingUser = await User.findById(decoded.userId);
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isUpgrading = existingUser.plan !== "premium";

    // 5. Upgrade user plan to premium in DB
    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { plan: "premium" },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log(`[VERIFY] Successfully verified transaction reference: ${reference} and upgraded user ${user.email} to PREMIUM`);

    // 6. Send premium onboarding welcome email if this is a fresh upgrade
    if (isUpgrading) {
      await sendPremiumWelcomeEmail(user.email, user.name);
    }

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
    console.error("Reference verification error:", error);
    return NextResponse.json({ error: error.message || "Failed to verify transaction reference" }, { status: 500 });
  }
}
