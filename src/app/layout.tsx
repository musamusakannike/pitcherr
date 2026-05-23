import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pitcherr | Tailored Freelancer Proposal Engine",
  description:
    "Upload your resume once, paste a client job description, and generate highly tailored, non-generic proposals and step-by-step project approach outlines in seconds.",
  keywords: "freelancer, proposals, client pitches, proposal builder, deepseek ai, paystack billing",
  authors: [{ name: "Pitcherr AI" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth antialiased">
      <body className="min-h-full flex flex-col paper-texture text-ink selection:bg-secondary/20 selection:text-ink">
        {children}
      </body>
    </html>
  );
}
