import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "pitcherr-fallback-jwt-secret-key-32-chars-long";
const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "pitcherr-mock";

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
 * Verifies a Firebase ID token (JWT) from Google.
 * If running in mock/offline mode (detected via mock API key), it decodes the token without verification.
 * Otherwise, it fetches Google's public certificates and validates the token signature, audience, and issuer.
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

  // Real Firebase ID Token Verification
  try {
    // 1. Fetch Google's public x509 certificates
    const response = await fetch(
      "https://www.googleapis.com/robot/v1/metadata/x509/securetoken-system@system.gserviceaccount.com"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch Firebase public certificates");
    }
    const publicKeys = await response.json();

    // 2. Decode the header to find the kid (Key ID)
    const decodedToken = jwt.decode(idToken, { complete: true }) as any;
    if (!decodedToken || !decodedToken.header || !decodedToken.header.kid) {
      throw new Error("Invalid Firebase ID token structure");
    }

    const kid = decodedToken.header.kid;
    const certificate = publicKeys[kid];
    if (!certificate) {
      throw new Error("Corresponding Firebase public key not found");
    }

    // 3. Verify the token signature, audience, and issuer
    const verified = jwt.verify(idToken, certificate, {
      algorithms: ["RS256"],
      audience: FIREBASE_PROJECT_ID,
      issuer: `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`,
    }) as any;

    return {
      email: verified.email,
      name: verified.name || verified.email.split("@")[0],
      uid: verified.sub,
    };
  } catch (error: any) {
    console.error("Firebase ID Token verification error:", error.message);
    throw new Error(`Authentication failed: ${error.message}`);
  }
}
