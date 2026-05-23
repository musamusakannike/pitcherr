import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/models/User";
import { verifySessionToken } from "@/lib/auth";
import { createDedicatedVirtualAccount } from "@/lib/paystack";

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

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Parse phone number (required for DVA as documented)
    const { phone } = await request.json();
    if (!phone || phone.trim().length === 0) {
      return NextResponse.json({ error: "Phone number is required to assign a Dedicated Virtual Account" }, { status: 400 });
    }

    // Split name for Paystack first/last name fields
    const nameParts = user.name.trim().split(/\s+/);
    const firstName = nameParts[0] || "Freelancer";
    const lastName = nameParts.slice(1).join(" ") || "User";

    // 3. Create Dedicated Virtual Account on Paystack
    const dvaData = await createDedicatedVirtualAccount(
      user.email,
      firstName,
      lastName,
      phone
    );

    // 4. Save DVA details to user in database
    user.dva = {
      accountNumber: dvaData.accountNumber,
      bankName: dvaData.bankName,
      accountName: dvaData.accountName,
      customerCode: dvaData.customerCode,
    };
    await user.save();

    return NextResponse.json({
      success: true,
      dva: user.dva,
    });
  } catch (error: any) {
    console.error("DVA creation error:", error);
    return NextResponse.json({ error: error.message || "Failed to create Dedicated Virtual Account" }, { status: 500 });
  }
}
