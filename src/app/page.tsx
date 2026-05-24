"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Raw SVG Icons for zero-dependency reliability
const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-secondary">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21L8.188 15.904L3 15L8.188 14.096L9 9L9.813 14.096L15 15L9.813 15.904Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.071 4.929a10 10 0 00-14.142 0M1.5 9h4.5m12 0h4.5M12 1.5v4.5m0 12v4.5" />
  </svg>
);

const PenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-secondary">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
  </svg>
);

const BoltIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-secondary">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-success">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-1">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

export default function LandingPage() {
  const router = useRouter();
  const [demoStep, setDemoStep] = useState(0); // 0: Idle, 1: Pasting job, 2: AI Generating, 3: Completed proposal
  const [demoInput, setDemoInput] = useState("");
  const [demoOutput, setDemoOutput] = useState("");
  const [currentYear, setCurrentYear] = useState(2026);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const sampleJob = "Looking for a React developer to build an interactive dashboard with chart integrations and secure payments.";
  const sampleProposal = `Hi ! I can build this React dashboard using Next.js and Chart.js, integrating Paystack securely. In my previous work, I deployed a high-traffic client dashboard that decreased load times by 40% (improving Core Web Vitals) and processed 5,000+ monthly payments successfully. I can start immediately.`;

  // Animate the interactive typewriter simulator
  useEffect(() => {
    if (demoStep === 1) {
      let i = 0;
      const interval = setInterval(() => {
        setDemoInput((prev) => prev + sampleJob.charAt(i));
        i++;
        if (i >= sampleJob.length) {
          clearInterval(interval);
          setTimeout(() => setDemoStep(2), 1000);
        }
      }, 30);
      return () => clearInterval(interval);
    } else if (demoStep === 2) {
      // Simulate AI loading state for 2 seconds
      const timeout = setTimeout(() => {
        setDemoStep(3);
      }, 2000);
      return () => clearTimeout(timeout);
    } else if (demoStep === 3) {
      let i = 0;
      setDemoOutput("");
      const interval = setInterval(() => {
        setDemoOutput((prev) => prev + sampleProposal.charAt(i));
        i++;
        if (i >= sampleProposal.length) {
          clearInterval(interval);
        }
      }, 15);
      return () => clearInterval(interval);
    }
  }, [demoStep]);

  const handleStartDemo = () => {
    setDemoInput("");
    setDemoOutput("");
    setDemoStep(1);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-zinc-200/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-1.5 group">
            <span className="text-xl font-bold font-display tracking-tight text-primary">
              Pitcherr<span className="text-secondary">.</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-zinc-600">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#demo" className="hover:text-primary transition-colors">How it Works</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/auth" className="text-sm font-medium text-zinc-600 hover:text-primary transition-colors">
              Log in
            </Link>
            <Link href="/auth" className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-md hover:bg-neutral-800 transition-all shadow-paper">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 max-w-5xl mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-black font-display tracking-tight text-primary leading-tight md:leading-none max-w-4xl mx-auto">
          An incredible tailored proposal engine for freelancers
        </h1>
        <p className="mt-6 text-base md:text-xl text-zinc-600 max-w-2xl mx-auto leading-relaxed">
          Upload your resume and portfolio once. Paste any client job description. Deepseek maps your skills and writes unique, non-generic bids that win.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/auth"
            className="w-full sm:w-auto px-8 py-3.5 bg-primary text-white font-medium rounded-md hover:bg-neutral-800 transition-all shadow-paper flex items-center justify-center"
          >
            Start For Free <ArrowRightIcon />
          </Link>
          <a
            href="#demo"
            className="w-full sm:w-auto px-8 py-3.5 bg-white border border-zinc-200 text-zinc-700 font-medium rounded-md hover:bg-zinc-50 transition-all"
          >
            See It Action
          </a>
        </div>

        {/* Concentric Ellipse Canvas Graphic (Interactive CSS/Art) */}
        <div className="relative mt-16 max-w-4xl mx-auto flex items-center justify-center p-6 border border-zinc-200/50 bg-white/50 rounded-2xl shadow-paper overflow-hidden h-[260px] md:h-[380px]">
          <div className="absolute inset-0 bg-radial-gradient from-secondary/5 to-transparent pointer-events-none" />
          
          {/* Animated concentric rings */}
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="absolute border border-dashed border-secondary/15 rounded-full w-[160px] h-[160px] md:w-[240px] md:h-[240px] animate-[spin_50s_linear_infinite]" />
            <div className="absolute border border-secondary/10 rounded-full w-[240px] h-[240px] md:w-[360px] md:h-[360px] animate-[spin_80s_linear_infinite]" />
            <div className="absolute border border-dashed border-zinc-200 rounded-full w-[320px] h-[320px] md:w-[480px] md:h-[480px] animate-[spin_120s_linear_infinite]" />
            
            {/* Pulsing glow core */}
            <div className="z-10 w-24 h-24 md:w-36 md:h-36 rounded-full bg-radial-gradient from-secondary/30 via-secondary/5 to-transparent flex items-center justify-center glow-loader">
              <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-white shadow-paper border border-zinc-200/30 flex items-center justify-center">
                <SparklesIcon />
              </div>
            </div>

            {/* Float labels */}
            <div className="absolute top-10 left-10 md:top-20 md:left-24 bg-white px-3 py-1.5 rounded-full shadow-paper border border-zinc-200/50 text-[11px] font-mono text-zinc-500 animate-[bounce_6s_infinite]">
              📝 Upload Resume
            </div>
            <div className="absolute bottom-12 right-12 md:bottom-20 md:right-28 bg-white px-3 py-1.5 rounded-full shadow-paper border border-zinc-200/50 text-[11px] font-mono text-zinc-500 animate-[bounce_8s_infinite]">
              ⚡ Paste Client Needs
            </div>
            <div className="absolute top-28 right-8 md:top-36 md:right-16 bg-white px-3 py-1.5 rounded-full shadow-paper border border-zinc-200/50 text-[11px] font-mono text-zinc-500 animate-[bounce_5s_infinite]">
              🤖 Deepseek Matching
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-zinc-50 border-t border-b border-zinc-200/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-[11px] font-mono tracking-widest text-secondary font-bold uppercase">Features</span>
            <h2 className="text-3xl md:text-4xl font-extrabold font-display tracking-tight text-primary mt-2">
              Finally, a connected workspace from profile to client
            </h2>
            <p className="mt-4 text-zinc-600">
              Stop writing generic pitches. Pitcherr helps you create high-impact proposals tailored specifically to what the client wants.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="paper-card p-8 rounded-xl bg-white flex flex-col items-start">
              <div className="p-3 bg-secondary/10 rounded-lg mb-6">
                <PenIcon />
              </div>
              <h3 className="text-lg font-bold font-display text-primary">Fluid Resume Mapping</h3>
              <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
                Upload your resume once. Our parsing engine indexes your past roles, technologies, accomplishments, and metrics for contextual recall.
              </p>
            </div>

            <div className="paper-card p-8 rounded-xl bg-white flex flex-col items-start">
              <div className="p-3 bg-secondary/10 rounded-lg mb-6">
                <SparklesIcon />
              </div>
              <h3 className="text-lg font-bold font-display text-primary">Deepseek Tailored Proposals</h3>
              <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
                Deepseek cross-references your qualifications directly with the client's problem to write unique proposals that demonstrate actual fit.
              </p>
            </div>

            <div className="paper-card p-8 rounded-xl bg-white flex flex-col items-start">
              <div className="p-3 bg-secondary/10 rounded-lg mb-6">
                <BoltIcon />
              </div>
              <h3 className="text-lg font-bold font-display text-primary">Structured Project Approaches</h3>
              <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
                Goes beyond cover letters. The generator details a step-by-step approach and clear milestones to show the client you already know how to build it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Simulator Section */}
      <section id="demo" className="py-20 max-w-5xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-mono tracking-widest text-secondary font-bold uppercase">Simulator</span>
          <h2 className="text-3xl md:text-4xl font-extrabold font-display tracking-tight text-primary mt-2">
            Watch Pitcherr do the work
          </h2>
          <p className="mt-4 text-zinc-600">
            See how our AI mapping works by running the simulated terminal workspace below.
          </p>
        </div>

        <div className="border border-zinc-200 rounded-xl bg-white shadow-paper overflow-hidden grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-200 min-h-[350px]">
          {/* Left panel: Inputs */}
          <div className="p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                <span className="text-[11px] font-mono text-zinc-500 font-bold uppercase">Client Job Description</span>
              </div>
              <div className="min-h-[140px] p-4 bg-zinc-50 rounded-lg border border-zinc-200 text-sm font-mono text-zinc-800 placeholder-zinc-400 select-none">
                {demoStep === 0 ? (
                  <span className="text-zinc-400">Click the button below to paste a sample job...</span>
                ) : (
                  <span>{demoInput}</span>
                )}
                {demoStep === 1 && <span className="animate-ping">|</span>}
              </div>
            </div>

            <button
              onClick={handleStartDemo}
              disabled={demoStep > 0 && demoStep < 3}
              className="w-full py-2.5 bg-primary text-white text-xs font-semibold rounded-md hover:bg-neutral-800 disabled:opacity-50 transition-all flex items-center justify-center shadow-paper"
            >
              {demoStep === 0 && "Run Generation Simulation"}
              {demoStep === 1 && "Pasting job description..."}
              {demoStep === 2 && "Analyzing with DeepSeek..."}
              {demoStep === 3 && "Reset Simulation"}
            </button>
          </div>

          {/* Right panel: Output */}
          <div className="p-6 bg-zinc-50/50 flex flex-col justify-between space-y-6">
            <div className="space-y-4 flex-1 flex flex-col">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${demoStep === 2 ? "bg-secondary animate-pulse" : "bg-zinc-300"}`} />
                  <span className="text-[11px] font-mono text-zinc-500 font-bold uppercase">Tailored Output</span>
                </div>
                {demoStep === 2 && (
                  <span className="text-[11px] font-mono text-secondary animate-pulse">Thinking Mode enabled...</span>
                )}
              </div>
              
              <div className="flex-1 min-h-[140px] p-4 bg-white rounded-lg border border-zinc-200 text-xs font-mono text-zinc-700 overflow-y-auto select-none">
                {demoStep === 0 && <span className="text-zinc-400 italic">Simulated proposal output will render here...</span>}
                {demoStep === 1 && <span className="text-zinc-400 italic">Waiting for client job input...</span>}
                {demoStep === 2 && (
                  <div className="flex flex-col items-center justify-center h-full space-y-3 py-6">
                    <div className="w-8 h-8 rounded-full border-2 border-secondary border-t-transparent animate-spin" />
                    <span className="text-[11px] text-zinc-500">Cross-referencing resume with project needs...</span>
                  </div>
                )}
                {demoStep === 3 && (
                  <div className="whitespace-pre-line">
                    {demoOutput}
                    {demoOutput.length < sampleProposal.length && <span className="animate-ping">|</span>}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Tiers Section */}
      <section id="pricing" className="py-20 bg-zinc-50 border-t border-zinc-200/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] font-mono tracking-widest text-secondary font-bold uppercase">Pricing</span>
            <h2 className="text-3xl md:text-4xl font-extrabold font-display tracking-tight text-primary mt-2">
              Saves hours. Upgrade when you need more.
            </h2>
            <p className="mt-4 text-zinc-600">
              Pitcherr is free to start. Upgrade to Premium for unlimited client matching and dedicated virtual account upgrades.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free plan */}
            <div className="paper-card bg-white p-8 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-zinc-400 uppercase font-semibold">Free Starter</span>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-black font-display text-primary">₦0</span>
                  <span className="ml-1 text-zinc-500 text-sm">/ forever</span>
                </div>
                <p className="mt-4 text-sm text-zinc-600">
                  Perfect for testing Pitcherr AI and seeing how it structures proposal drafts.
                </p>
                <ul className="mt-6 space-y-3.5">
                  <li className="flex items-center text-xs text-zinc-600">
                    <span className="mr-2"><CheckIcon /></span> 3 Tailored Proposal Generations
                  </li>
                  <li className="flex items-center text-xs text-zinc-600">
                    <span className="mr-2"><CheckIcon /></span> Standard Deepseek AI mapping
                  </li>
                  <li className="flex items-center text-xs text-zinc-600">
                    <span className="mr-2"><CheckIcon /></span> Markdown formatting & quick copy
                  </li>
                  <li className="flex items-center text-xs text-zinc-400 line-through">
                    <span className="mr-2">✕</span> Dedicated Paystack deposit account
                  </li>
                </ul>
              </div>
              <Link
                href="/auth"
                className="mt-8 w-full py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-md text-center transition-all"
              >
                Sign Up Free
              </Link>
            </div>

            {/* Premium plan */}
            <div className="paper-card bg-white p-8 rounded-xl border-secondary/50 ring-2 ring-secondary/10 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-3 right-3 bg-secondary/10 text-secondary text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase">
                Most Popular
              </div>
              <div>
                <span className="text-xs font-mono text-secondary uppercase font-semibold">Premium Freelancer</span>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-black font-display text-primary">₦5,000</span>
                  <span className="ml-1 text-zinc-500 text-sm">/ month</span>
                </div>
                <p className="mt-4 text-sm text-zinc-600">
                  For active freelancers bidding on platforms who need unlimited tailored pitches.
                </p>
                <ul className="mt-6 space-y-3.5">
                  <li className="flex items-center text-xs text-zinc-600">
                    <span className="mr-2"><CheckIcon /></span> <strong>Unlimited</strong> Proposal Generations
                  </li>
                  <li className="flex items-center text-xs text-zinc-600">
                    <span className="mr-2"><CheckIcon /></span> Deep reasoning AI mode
                  </li>
                  <li className="flex items-center text-xs text-zinc-600">
                    <span className="mr-2"><CheckIcon /></span> Tailored milestone outlines & approach
                  </li>
                  <li className="flex items-center text-xs text-zinc-600">
                    <span className="mr-2"><CheckIcon /></span> Dedicated bank transfer deposit account (Nigeria)
                  </li>
                </ul>
              </div>
              <Link
                href="/auth"
                className="mt-8 w-full py-3 bg-primary text-white hover:bg-neutral-800 text-xs font-semibold rounded-md text-center transition-all shadow-paper"
              >
                Upgrade to Premium
              </Link>
            </div>
          </div>
        </div>
      </section>

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
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
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
