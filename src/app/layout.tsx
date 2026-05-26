import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Pitcherr | Tailored Freelancer Proposal Engine",
    template: "%s | Pitcherr",
  },
  description:
    "Upload your resume once, paste a client job description, and generate highly tailored, non-generic proposals and step-by-step project approach outlines in seconds.",
  keywords: [
    "freelancer",
    "proposals",
    "client pitches",
    "proposal builder",
    "deepseek ai",
    "paystack billing",
    "proposal generator",
    "upwork proposal",
    "fiverr bid",
    "freelance pitch",
    "proposal tailoring",
    "developer resume mapping"
  ],
  authors: [{ name: "Pitcherr AI", url: "https://pitcherr.codiac.online" }],
  creator: "Pitcherr AI Team",
  publisher: "Pitcherr Inc.",
  applicationName: "Pitcherr",
  metadataBase: new URL("https://pitcherr.codiac.online"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Pitcherr | Tailored Freelancer Proposal Engine",
    description:
      "Upload your resume once, paste a client job description, and generate highly tailored, non-generic proposals and step-by-step project approach outlines in seconds.",
    url: "https://pitcherr.codiac.online",
    siteName: "Pitcherr",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Pitcherr - Tailored Freelancer Proposal Engine",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pitcherr | Tailored Freelancer Proposal Engine",
    description:
      "Upload your resume once, paste a client job description, and generate highly tailored, non-generic proposals and step-by-step project approach outlines in seconds.",
    images: ["/opengraph-image.png"],
    creator: "@PitcherrAI",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
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

