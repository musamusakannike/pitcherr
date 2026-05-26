import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Proposal Workspace | Pitcherr",
  description: "Your personalized freelancer proposal builder and Deepseek matching terminal.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
