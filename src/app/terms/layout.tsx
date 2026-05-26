import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Pitcherr",
  description: "Review the terms and conditions for using the Pitcherr tailored freelancer proposal builder and Deepseek matching engine.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
