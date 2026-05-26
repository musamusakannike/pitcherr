import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Pitcherr",
  description: "Read the Pitcherr privacy policy to understand how we secure your profile details, uploaded resumes, and payment details.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
