import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/db";
import { User, checkSubscriptionExpiry } from "@/lib/models/User";
import { verifySessionToken } from "@/lib/auth";
import { initializeTransaction } from "@/lib/paystack";

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

    let user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await checkSubscriptionExpiry(user);

    // 2. Determine origin URL
    const originUrl = new URL(request.url).origin;

    // 3. Initialize Paystack Transaction (Premium Plan = 2000 NGN)
    const amountNGN = 2000;
    const paymentData = await initializeTransaction(user.email, amountNGN, user._id.toString(), originUrl);

    return NextResponse.json({
      success: true,
      authorizationUrl: paymentData.authorization_url,
      reference: paymentData.reference,
    });
  } catch (error: any) {
    console.error("Payment initialize error:", error);
    return NextResponse.json({ error: error.message || "Failed to initialize payment" }, { status: 500 });
  }
}
