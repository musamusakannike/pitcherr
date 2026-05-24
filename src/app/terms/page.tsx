"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-secondary">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21L8.188 15.904L3 15L8.188 14.096L9 9L9.813 14.096L15 15L9.813 15.904Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.071 4.929a10 10 0 00-14.142 0M1.5 9h4.5m12 0h4.5M12 1.5v4.5m0 12v4.5" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 mr-2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
);

export default function TermsOfService() {
  const [currentYear, setCurrentYear] = useState(2026);
  const [activeSection, setActiveSection] = useState("acceptance");

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const sections = [
    { id: "acceptance", label: "1. Acceptance of Terms" },
    { id: "accounts", label: "2. Account Registration" },
    { id: "billing", label: "3. Subscription & Billing" },
    { id: "ai-generations", label: "4. AI Generations & Scope" },
    { id: "fair-use", label: "5. Fair Use & Prohibitions" },
    { id: "intellectual-property", label: "6. Intellectual Property" },
    { id: "liability", label: "7. Limitation of Liability" },
    { id: "termination", label: "8. Termination & Contact" },
  ];

  const handleScrollTo = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100; // sticky header offset
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Premium Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-zinc-200/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-1.5 group">
            <span className="text-xl font-bold font-display tracking-tight text-primary">
              Pitcherr<span className="text-secondary">.</span>
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-xs font-semibold text-zinc-600 hover:text-primary flex items-center transition-colors"
            >
              <ArrowLeftIcon /> Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-6xl w-full mx-auto px-6 py-12 md:py-16">
        {/* Banner Card */}
        <div className="paper-card bg-white p-8 md:p-12 rounded-2xl mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-radial-gradient from-secondary/5 to-transparent pointer-events-none" />
          <div className="z-10">
            <span className="text-[10px] font-mono tracking-widest text-secondary font-bold uppercase bg-secondary/10 px-2.5 py-1 rounded-full">
              Legal Documents
            </span>
            <h1 className="text-3xl md:text-4xl font-black font-display tracking-tight text-primary mt-3">
              Terms of Service
            </h1>
            <p className="mt-2 text-zinc-500 text-sm font-mono">
              Last Updated: May 24, 2026
            </p>
          </div>
          <div className="p-4 bg-secondary/5 rounded-xl border border-secondary/10 shadow-paper">
            <SparklesIcon />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
          {/* Quick-Nav Sticky Sidebar */}
          <aside className="lg:sticky lg:top-24 hidden lg:block space-y-4">
            <div className="paper-card bg-white p-6 rounded-xl border border-zinc-200/50">
              <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-widest font-bold mb-4">
                Table of Contents
              </h4>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => handleScrollTo(section.id)}
                    className={`w-full text-left py-2 px-3 rounded-md text-xs font-medium transition-all ${
                      activeSection === section.id
                        ? "bg-primary text-white font-semibold"
                        : "text-zinc-600 hover:bg-zinc-100 hover:text-primary"
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>
            <div className="p-6 bg-zinc-50 rounded-xl border border-zinc-200/40 text-center">
              <p className="text-xs text-zinc-500 font-medium">Agreement inquiries?</p>
              <a
                href="mailto:legal@pitcherr.co"
                className="mt-2 block text-xs font-semibold text-secondary hover:underline"
              >
                legal@pitcherr.co
              </a>
            </div>
          </aside>

          {/* Core Legal Content */}
          <div className="lg:col-span-3 space-y-12 bg-white p-8 md:p-12 rounded-2xl border border-zinc-200/50 shadow-paper text-zinc-700">
            {/* Section: Acceptance of Terms */}
            <section id="acceptance" className="space-y-4 scroll-mt-28">
              <h2 className="text-xl font-bold font-display text-primary border-b border-zinc-100 pb-2">
                1. Acceptance of Terms
              </h2>
              <p className="text-sm leading-relaxed">
                By creating a Pitcherr account, signing in via Google Auth, uploading resumes, or generating proposals (the "Service"), you agree to be bound by these Terms of Service (the "Terms"). These Terms govern your access to and use of Pitcherr, a service owned and operated by Pitcherr Inc.
              </p>
              <p className="text-sm leading-relaxed">
                If you are entering into these terms on behalf of a freelance entity or company, you represent that you have authority to bind that entity. If you do not agree to these Terms, please do not use Pitcherr.
              </p>
            </section>

            {/* Section: Account Registration */}
            <section id="accounts" className="space-y-4 scroll-mt-28">
              <h2 className="text-xl font-bold font-display text-primary border-b border-zinc-100 pb-2">
                2. Account Registration & Security
              </h2>
              <p className="text-sm leading-relaxed">
                To access proposal generation, you must authorize a secure account using Firebase Authentication via Google sign-in.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li><strong>Account Integrity:</strong> You represent that any profile credentials, email identities, and resumes provided are accurate, represent your actual professional background, and belong to you.</li>
                <li><strong>Credential Security:</strong> You are responsible for keeping your login credentials safe. Pitcherr is not liable for unauthorized access resulting from compromised account keys or shared access.</li>
                <li><strong>Profile Audits:</strong> We reserve the right to audit and suspend account routes that utilize fake email profiles or represent malicious activities.</li>
              </ul>
            </section>

            {/* Section: Billing & Paystack */}
            <section id="billing" className="space-y-4 scroll-mt-28">
              <h2 className="text-xl font-bold font-display text-primary border-b border-zinc-100 pb-2">
                3. Subscription Plans & Paystack Billing
              </h2>
              <p className="text-sm leading-relaxed">
                Pitcherr operates under a Freemium model with subscription terms:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>
                  <strong>Free Tier:</strong> Free accounts receive 3 tailored proposal generations. Upgrading is required once free units are exhausted.
                </li>
                <li>
                  <strong>Premium Plan:</strong> Premium membership costs <strong>₦5,000 per month</strong> (or regional equivalent), which unlocks unlimited proposal matches, deeper reasoning modes, and dedicated virtual payment deposits.
                </li>
                <li>
                  <strong>Payment Processor:</strong> All transactions are securely routed through Paystack. You authorize us to initiate recurring charges for subscription renewals. Subscription fees are charged at the beginning of each billing cycle.
                </li>
                <li>
                  <strong>Refunds:</strong> Since AI credits and computing resources are consumed instantly upon proposal generation, payments are non-refundable unless specified under local operational consumer rights.
                </li>
              </ul>
            </section>

            {/* Section: AI Generations */}
            <section id="ai-generations" className="space-y-4 scroll-mt-28">
              <h2 className="text-xl font-bold font-display text-primary border-b border-zinc-100 pb-2">
                4. AI-Generated Proposals & Milestone Scope
              </h2>
              <p className="text-sm leading-relaxed">
                Our service is driven by LLMs, specifically via the DeepSeek API, to synthesize resume structures against job descriptions.
              </p>
              <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-200/50 space-y-2 text-xs">
                <p className="font-semibold text-primary">Disclaimers on AI-Generated Proposals:</p>
                <ul className="list-disc pl-5 space-y-1 text-zinc-600">
                  <li>AI generations are drafts meant to serve as templates. You must proofread, confirm technical accuracy, and manually inspect the outputs before submitting pitches to clients.</li>
                  <li>Pitcherr does not guarantee that using our generated proposals will result in successful hires or contract awards.</li>
                  <li>We are not responsible for erroneous milestone projections or technical inaccuracies drafted by the AI engine.</li>
                </ul>
              </div>
            </section>

            {/* Section: Fair Use */}
            <section id="fair-use" className="space-y-4 scroll-mt-28">
              <h2 className="text-xl font-bold font-display text-primary border-b border-zinc-100 pb-2">
                5. Fair Use & Prohibited Conduct
              </h2>
              <p className="text-sm leading-relaxed">
                By using the Service, you agree not to engage in the following prohibited behaviors:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li><strong>System Abuse:</strong> Programmatic automation, script scraping, or "hacking" of our DeepSeek generation endpoint to bypass usage counts or security filters.</li>
                <li><strong>Content Integrity:</strong> Uploading malware-infected PDFs, intellectual property belonging to other operators, or offensive, illegal material.</li>
                <li><strong>Impersonation:</strong> Creating accounts designed to spoof specific agencies or representing yourself under credential paths you do not own.</li>
              </ul>
            </section>

            {/* Section: Intellectual Property */}
            <section id="intellectual-property" className="space-y-4 scroll-mt-28">
              <h2 className="text-xl font-bold font-display text-primary border-b border-zinc-100 pb-2">
                6. Intellectual Property
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li><strong>Your Content:</strong> You retain complete ownership of all resumes, accomplishments, and job descriptions you feed into the platform. Pitcherr does not claim ownership over any text extracted from your portfolio.</li>
                <li><strong>AI Outputs:</strong> Pitcherr assigns all rights, titles, and interest in generated proposals to the user who initiated the generation. You are free to copy, modify, distribute, and commercialize those proposal drafts.</li>
                <li><strong>Pitcherr Assets:</strong> All proprietary software, styles, UI patterns, branding elements, typography configurations, and layouts are the exclusive property of Pitcherr Inc.</li>
              </ul>
            </section>

            {/* Section: Liability */}
            <section id="liability" className="space-y-4 scroll-mt-28">
              <h2 className="text-xl font-bold font-display text-primary border-b border-zinc-100 pb-2">
                7. Limitation of Liability
              </h2>
              <p className="text-sm leading-relaxed font-semibold text-primary">
                PITCHERR IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED.
              </p>
              <p className="text-sm leading-relaxed">
                In no event shall Pitcherr Inc., its directors, employees, or API partners (including DeepSeek) be liable for any direct, indirect, incidental, or consequential damages (including lost profits, client rejections, or business interruptions) resulting from the use or inability to use the Service.
              </p>
            </section>

            {/* Section: Termination */}
            <section id="termination" className="space-y-4 scroll-mt-28">
              <h2 className="text-xl font-bold font-display text-primary border-b border-zinc-100 pb-2">
                8. Termination, Governing Law & Contact
              </h2>
              <p className="text-sm leading-relaxed">
                We reserve the right to suspend your access to Pitcherr at our sole discretion, without notice, if we believe you are in breach of these Terms, or if billing failures cannot be resolved after Paystack renewal attempts.
              </p>
              <p className="text-sm leading-relaxed">
                These Terms shall be governed and construed in accordance with the laws applicable in your jurisdiction, without regard to conflict of law provisions.
              </p>
              <p className="text-sm leading-relaxed">
                For questions regarding these Terms, please contact:
              </p>
              <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-200/50 space-y-1 max-w-sm">
                <p className="text-sm font-semibold text-primary">Pitcherr Inc. Operations</p>
                <p className="text-xs text-zinc-500">Email: <a href="mailto:legal@pitcherr.co" className="text-secondary hover:underline">legal@pitcherr.co</a></p>
                <p className="text-xs text-zinc-500">Address: Lagos, Nigeria / Delaware, USA</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white/90 pt-16 pb-12 mt-auto border-t border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2 space-y-4">
            <span className="text-xl font-bold font-display tracking-tight text-white">
              Pitcherr<span className="text-secondary">.</span>
            </span>
            <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
              Tailoring freelancer proposals and project outlines to client needs instantly with Deepseek AI.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-widest font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-zinc-300">
              <li><Link href="/#features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-widest font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-zinc-300">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 mt-16 pt-8 border-t border-zinc-800 text-xs text-zinc-500 flex justify-between">
          <span>&copy; {currentYear} Pitcherr Inc. All rights reserved.</span>
          <span>Designed for premium freelance operators.</span>
        </div>
      </footer>
    </div>
  );
}
