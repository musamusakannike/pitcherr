import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Started | Pitcherr",
  description: "Sign in or create your Pitcherr account to start generating highly tailored freelancer proposals in seconds.",
  alternates: {
    canonical: "/auth",
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
