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

export default function PrivacyPolicy() {
  const [currentYear, setCurrentYear] = useState(2026);
  const [activeSection, setActiveSection] = useState("introduction");

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const sections = [
    { id: "introduction", label: "1. Introduction" },
    { id: "data-collection", label: "2. Information We Collect" },
    { id: "data-use", label: "3. How We Use Data" },
    { id: "ai-processing", label: "4. AI & Third Party APIs" },
    { id: "data-sharing", label: "5. Data Sharing" },
    { id: "security", label: "6. Security & Storage" },
    { id: "user-rights", label: "7. Your Rights & Choices" },
    { id: "contact", label: "8. Contact Us" },
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
              Privacy Policy
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
                    className={`w-full text-left py-2 px-3 rounded-md text-xs font-medium transition-all ${activeSection === section.id
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
              <p className="text-xs text-zinc-500 font-medium">Have questions?</p>
              <a
                href="mailto:musamusakannike@gmail.com"
                className="mt-2 block text-xs font-semibold text-secondary hover:underline"
              >
                musamusakannike@gmail.com
              </a>
            </div>
          </aside>

          {/* Core Legal Content */}
          <div className="lg:col-span-3 space-y-12 bg-white p-8 md:p-12 rounded-2xl border border-zinc-200/50 shadow-paper text-zinc-700">
            {/* Section: Introduction */}
            <section id="introduction" className="space-y-4 scroll-mt-28">
              <h2 className="text-xl font-bold font-display text-primary border-b border-zinc-100 pb-2">
                1. Introduction
              </h2>
              <p className="text-sm leading-relaxed">
                Welcome to <strong>Pitcherr</strong> ("we," "our," "us"). We value your privacy and are committed to protecting your personal data. This Privacy Policy describes how we collect, use, and process your information when you use our website, application, services, and tools (collectively, the "Service").
              </p>
              <p className="text-sm leading-relaxed">
                By accessing or using Pitcherr, you agree to the collection and use of information in accordance with this policy. If you do not agree with any terms of this policy, please do not use our services.
              </p>
            </section>

            {/* Section: Data Collection */}
            <section id="data-collection" className="space-y-4 scroll-mt-28">
              <h2 className="text-xl font-bold font-display text-primary border-b border-zinc-100 pb-2">
                2. Information We Collect
              </h2>
              <p className="text-sm leading-relaxed">
                We collect several categories of information from and about our users to provide a premium tailored proposal generation experience:
              </p>
              <ul className="list-disc pl-5 space-y-2.5 text-sm">
                <li>
                  <strong>Account Information:</strong> When you register via Google Auth (using Firebase), we receive your basic profile data (name, email address, profile picture).
                </li>
                <li>
                  <strong>Freelancer Assets (Resume & Portfolio):</strong> To generate tailored pitches, you upload your resume (typically in PDF format). This document is securely parsed for text extraction and stored in our secure Cloudflare R2 cloud storage.
                </li>
                <li>
                  <strong>Project Job Descriptions:</strong> We collect and process the text of any job descriptions you paste into our AI engine to match your profile metrics and past work.
                </li>
                <li>
                  <strong>Billing & Transaction Details:</strong> For premium service upgrades, payments are securely processed by Paystack. We do not store credit card numbers directly; we only store transaction IDs, billing status, and customer identifiers to maintain your plan.
                </li>
                <li>
                  <strong>Device and Usage Data:</strong> We automatically collect analytical data, including IP addresses, browser types, operating systems, and page usage logs to ensure performance and debug error paths.
                </li>
              </ul>
            </section>

            {/* Section: Data Use */}
            <section id="data-use" className="space-y-4 scroll-mt-28">
              <h2 className="text-xl font-bold font-display text-primary border-b border-zinc-100 pb-2">
                3. How We Use Your Data
              </h2>
              <p className="text-sm leading-relaxed">
                We process your information under the following purposes and legal bases:
              </p>
              <ul className="list-disc pl-5 space-y-2.5 text-sm">
                <li>
                  <strong>AI Matching & Pitch Generation:</strong> To feed extracted resume text and pasted client requirements into the DeepSeek AI model to formulate tailored proposals.
                </li>
                <li>
                  <strong>Service Delivery:</strong> To authenticate your login sessions, manage your subscription plan, handle dedicated virtual payment accounts, and save your generated history.
                </li>
                <li>
                  <strong>Improvements & Analytics:</strong> To measure core web vitals, optimize our pdf parsing pipelines, fix layout and rendering bugs, and tailor user experience.
                </li>
                <li>
                  <strong>Communication:</strong> To send account notifications, billing reminders via Paystack hooks, and security updates.
                </li>
              </ul>
            </section>

            {/* Section: AI Processing */}
            <section id="ai-processing" className="space-y-4 scroll-mt-28">
              <h2 className="text-xl font-bold font-display text-primary border-b border-zinc-100 pb-2">
                4. AI & Third Party APIs
              </h2>
              <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-200/50 space-y-3">
                <h4 className="text-xs font-mono text-zinc-900 font-bold uppercase">
                  Important Note on DeepSeek API Usage
                </h4>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Pitcherr passes extracted resume text and your client job descriptions to DeepSeek API to run advanced semantic mapping. Under our commercial agreements with DeepSeek, data sent via our API keys is **strictly used for inference** and is **not** used to train the baseline AI models.
                </p>
              </div>
              <p className="text-sm leading-relaxed">
                We partner with highly secure vendors for core services:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li><strong>Firebase (Google):</strong> Secures authentication and authenticates client-side state.</li>
                <li><strong>Cloudflare R2:</strong> Stores uploaded resumes using standard enterprise-grade S3 security boundaries.</li>
                <li><strong>Paystack:</strong> Handles subscription billing, card authorizations, and dedicated virtual payment routing.</li>
              </ul>
            </section>

            {/* Section: Data Sharing */}
            <section id="data-sharing" className="space-y-4 scroll-mt-28">
              <h2 className="text-xl font-bold font-display text-primary border-b border-zinc-100 pb-2">
                5. Data Sharing
              </h2>
              <p className="text-sm leading-relaxed">
                We **do not sell, rent, or trade** your personal details, resumes, or client descriptions. Your data is only shared with partners specifically required to serve your proposals (e.g., DeepSeek, Firebase, Cloudflare, Paystack) or if required by law to comply with valid judicial processes.
              </p>
            </section>

            {/* Section: Security */}
            <section id="security" className="space-y-4 scroll-mt-28">
              <h2 className="text-xl font-bold font-display text-primary border-b border-zinc-100 pb-2">
                6. Security & Storage
              </h2>
              <p className="text-sm leading-relaxed">
                We implement robust technical mechanisms to secure your portfolios and credentials. Communication with our database (MongoDB) is fully encrypted, and standard TLS protocols protect browser communication. Your resumes are assigned unique hashed paths in Cloudflare R2 to prevent unauthorized access.
              </p>
              <p className="text-sm leading-relaxed">
                However, please remember that no transmission method over the Internet is 100% secure. While we follow industry standards, we cannot guarantee absolute absolute security.
              </p>
            </section>

            {/* Section: User Rights */}
            <section id="user-rights" className="space-y-4 scroll-mt-28">
              <h2 className="text-xl font-bold font-display text-primary border-b border-zinc-100 pb-2">
                7. Your Rights & Choices
              </h2>
              <p className="text-sm leading-relaxed">
                You have control over how your information is handled:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li><strong>Profile Deletion:</strong> You can choose to delete your uploaded resume at any time from your Pitcherr Profile page, which removes the file permanently from Cloudflare R2 and deletes the extracted index text.</li>
                <li><strong>Account Closure:</strong> You can contact us to delete your entire account and billing history.</li>
                <li><strong>Marketing:</strong> You can opt out of any future marketing emails by clicking unsubscribe.</li>
              </ul>
            </section>

            {/* Section: Contact */}
            <section id="contact" className="space-y-4 scroll-mt-28">
              <h2 className="text-xl font-bold font-display text-primary border-b border-zinc-100 pb-2">
                8. Contact Us
              </h2>
              <p className="text-sm leading-relaxed">
                If you have questions, feedback, or compliance concerns regarding this Privacy Policy, please reach out to our team at:
              </p>
              <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-200/50 space-y-1.5 max-w-sm">
                <p className="text-sm font-semibold text-primary">Pitcherr Inc. Legal Office</p>
                <p className="text-xs text-zinc-500">Email: <a href="mailto:musamusakannike@gmail.com" className="text-secondary hover:underline">musamusakannike@gmail.com</a></p>
                <p className="text-xs text-zinc-500">Support: <a href="mailto:musamusakannike@gmail.com" className="text-secondary hover:underline">musamusakannike@gmail.com</a></p>
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
