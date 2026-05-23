import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/models/User";
import { verifyFirebaseIdToken, signSessionToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: "Missing Firebase ID Token" }, { status: 400 });
    }

    // 1. Verify token with Firebase or fallback mock
    const firebaseUser = await verifyFirebaseIdToken(idToken);

    // 2. Fetch or create the user in MongoDB
    let user = await User.findOne({ email: firebaseUser.email });

    if (!user) {
      user = await User.create({
        name: firebaseUser.name,
        email: firebaseUser.email,
        firebaseUid: firebaseUser.uid,
        plan: "free",
        proposalsCount: 0,
      });
    } else if (user.firebaseUid !== firebaseUser.uid) {
      // Sync UID if needed
      user.firebaseUid = firebaseUser.uid;
      await user.save();
    }

    // 3. Issue our own JWT session token
    const sessionToken = signSessionToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
    });

    // 4. Save to secure HttpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
      sameSite: "lax",
    });

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
    console.error("Login route error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
