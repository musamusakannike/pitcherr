import jwt from "jsonwebtoken";
import { firebaseAdmin } from "./firebaseAdmin";

const JWT_SECRET = process.env.JWT_SECRET || "pitcherr-fallback-jwt-secret-key-32-chars-long";

export interface SessionUser {
  userId: string;
  email: string;
  name: string;
}

/**
 * Sign a local session JWT
 */
export function signSessionToken(payload: SessionUser): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

/**
 * Verify a local session JWT
 */
export function verifySessionToken(token: string): SessionUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionUser;
  } catch (error) {
    return null;
  }
}

/**
 * Verifies a Firebase ID token using the Firebase Admin SDK.
 * Falls back to mock/offline decoding when using mock credentials.
 */
export async function verifyFirebaseIdToken(
  idToken: string
): Promise<{ email: string; name: string; uid: string }> {
  const isMock = process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "mock_api_key" || idToken.startsWith("mock-token-");

  if (isMock) {
    // Return decoded token directly or mock fields
    try {
      const decoded = jwt.decode(idToken) as any;
      return {
        email: decoded?.email || "freelancer@test.com",
        name: decoded?.name || "Freelancer Test",
        uid: decoded?.uid || decoded?.sub || "mock-firebase-uid-12345",
      };
    } catch {
      return {
        email: "freelancer@test.com",
        name: "Freelancer Test",
        uid: "mock-firebase-uid-12345",
      };
    }
  }

  // Real Firebase ID Token Verification via Admin SDK
  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    return {
      email: decodedToken.email || "",
      name: decodedToken.name || decodedToken.email?.split("@")[0] || "",
      uid: decodedToken.uid,
    };
  } catch (error: any) {
    console.error("Firebase ID Token verification error:", error.message);
    throw new Error(`Authentication failed: ${error.message}`);
  }
}
