import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/models/User";

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const rawBody = await request.text();
    const signature = request.headers.get("x-paystack-signature");

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey || secretKey === "mock") {
      console.error("Paystack webhook signature verification aborted: PAYSTACK_SECRET_KEY is not configured in production");
      return NextResponse.json({ error: "Webhook verification failed due to missing configuration" }, { status: 500 });
    }

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Verify Paystack HMAC SHA512 signature
    const hash = crypto
      .createHmac("sha512", secretKey)
      .update(rawBody)
      .digest("hex");

    if (hash !== signature) {
      console.warn("Invalid Paystack webhook signature detected");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    console.log("Paystack Webhook Received Event:", payload.event);

    // Handle successful charges (covers both card and DVA bank transfers)
    if (payload.event === "charge.success") {
      const email = payload.data.customer?.email;
      const status = payload.data.status;

      if (email && status === "success") {
        const user = await User.findOneAndUpdate(
          { email: email.toLowerCase() },
          { plan: "premium" },
          { new: true }
        );

        if (user) {
          console.log(`User ${user.email} successfully upgraded to PREMIUM via Paystack Webhook`);
        } else {
          console.warn(`Webhook upgrade failed: User with email ${email} not found in database`);
        }
      }
    }

    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
