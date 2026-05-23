"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider, hasValidConfig } from "@/lib/firebase";

export default function AuthPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.user) {
          router.push("/dashboard");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setAuthChecked(true);
      }
    }
    checkAuth();
  }, [router]);

  const handleExchangeTokenAndRedirect = async (idToken: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Login server exchange failed");
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to establish session on server");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!hasValidConfig || !auth) {
      // Fallback: Trigger mock developer authentication
      handleMockSignIn("Google User");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      await handleExchangeTokenAndRedirect(idToken);
    } catch (err: any) {
      setError(err.message || "Google authentication failed");
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password || (isSignUp && !name)) {
      setError("Please fill out all fields.");
      return;
    }

    if (!hasValidConfig || !auth) {
      // Fallback: Trigger mock developer authentication
      handleMockSignIn(name || email.split("@")[0]);
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        // Sign Up Flow
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        const idToken = await userCredential.user.getIdToken();
        await handleExchangeTokenAndRedirect(idToken);
      } else {
        // Sign In Flow
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await userCredential.user.getIdToken();
        await handleExchangeTokenAndRedirect(idToken);
      }
    } catch (err: any) {
      setError(err.message || "Email authentication failed");
      setLoading(false);
    }
  };

  const handleMockSignIn = async (displayName: string) => {
    setError("");
    setLoading(true);
    
    // Create a mock JWT payload encoded as a string that looks like a token
    // Our server decodes this direct mock value easily
    const mockPayload = {
      email: email || "freelancer@test.com",
      name: displayName || "Freelancer Test",
      uid: "mock-uid-" + Math.random().toString(36).substring(2, 9),
    };
    
    // Simulate a simple base64 encoded JWT structure for the mock token
    const mockToken = "mock-token-" + btoa(JSON.stringify(mockPayload));
    
    await handleExchangeTokenAndRedirect(mockToken);
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper paper-texture">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-mono text-zinc-500">Checking credentials...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-paper paper-texture">
      {/* Left side panel (Desktop Only): Branding Statement */}
      <div className="hidden md:flex md:w-1/2 bg-primary text-white p-16 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-secondary/15 to-transparent pointer-events-none" />
        <Link href="/" className="z-10 text-xl font-bold font-display text-white">
          Pitcherr<span className="text-secondary">.</span>
        </Link>
        <div className="z-10 space-y-6">
          <h2 className="text-4xl font-extrabold font-display leading-tight max-w-md">
            Unlock tailored pitches that win client confidence.
          </h2>
          <p className="text-zinc-400 text-sm max-w-sm leading-relaxed">
            Stop writing generic templates. Give our AI engine your profile, paste client goals, and let Deepseek write custom, highly aligned cover letters in seconds.
          </p>
        </div>
        <div className="z-10 text-xs text-zinc-500">
          &copy; {new Date().getFullYear()} Pitcherr Inc. All rights reserved.
        </div>
      </div>

      {/* Right side panel: Auth Card Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white border border-zinc-200/60 p-8 md:p-10 rounded-xl shadow-paper">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold font-display text-primary">
              {isSignUp ? "Create your Pitcherr Workspace" : "Welcome back"}
            </h1>
            <p className="text-xs text-zinc-500 mt-2 font-mono">
              {!hasValidConfig && "⚠️ Development Mode: Auth credentials simulated"}
              {hasValidConfig && "Sign in to access your customized proposals"}
            </p>
          </div>

          {error && (
            <div className="p-3 bg-danger/10 border border-danger/25 text-danger text-xs rounded-md mb-6 font-mono">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailAuth} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-mono text-zinc-500 uppercase font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 text-sm rounded focus:bg-white focus:outline-secondary text-primary font-sans"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-mono text-zinc-500 uppercase font-semibold mb-1">Email Address</label>
              <input
                type="email"
                placeholder="freelancer@test.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 text-sm rounded focus:bg-white focus:outline-secondary text-primary font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-500 uppercase font-semibold mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 text-sm rounded focus:bg-white focus:outline-secondary text-primary font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-white text-xs font-semibold rounded hover:bg-neutral-800 disabled:opacity-50 transition-all shadow-paper font-mono uppercase tracking-widest mt-2"
            >
              {loading ? "Authenticating..." : isSignUp ? "Create Account" : "Sign In"}
            </button>
          </form>

          {/* Social Sign In Options */}
          <div className="relative my-8 text-center">
            <hr className="border-zinc-200" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-[10px] font-mono text-zinc-400 uppercase">
              Or connection options
            </span>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3 bg-white border border-zinc-200 text-zinc-700 text-xs font-semibold rounded hover:bg-zinc-50 transition-all flex items-center justify-center space-x-2 shadow-paper cursor-pointer"
            >
              {/* Google Colored Icon */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.1.8-2.07 3.12v2.59h3.36c1.96-1.8 3.09-4.47 3.09-7.56z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.83-2.97c-1.08.72-2.43 1.15-4.1 1.15-3.15 0-5.81-2.13-6.76-5l-3.95 3.06C3.26 21.3 7.31 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.24 14.27a7.22 7.22 0 010-4.54l-3.95-3.06A11.96 11.96 0 000 12c0 2.01.5 3.93 1.29 5.33l3.95-3.06z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.63l3.95 3.06c.95-2.87 3.61-5 6.76-5z"
                />
              </svg>
              <span>{isSignUp ? "Sign up with Google" : "Sign in with Google"}</span>
            </button>

            {!hasValidConfig && (
              <button
                type="button"
                onClick={() => handleMockSignIn("Developer User")}
                className="w-full py-3 bg-secondary/10 border border-secondary/20 text-secondary text-xs font-semibold rounded hover:bg-secondary/25 transition-all text-center font-mono"
              >
                ⚡ Simulated Instant Developer Log In
              </button>
            )}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs text-zinc-500 hover:text-primary transition-colors font-semibold"
            >
              {isSignUp
                ? "Already have an account? Sign In"
                : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
