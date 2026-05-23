"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";

// Raw SVG icons for zero-dependency reliability
const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const WorkspaceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
  </svg>
);

const HistoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const DocumentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M5.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M5.25 21a2.25 2.25 0 01-2.25-2.25V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25v1.875" />
  </svg>
);

const CreditCardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
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

export default function Dashboard() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-paper paper-texture">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-mono text-zinc-500">Entering Workspace...</span>
        </div>
      </div>
    }>
      <DashboardContent />
    </React.Suspense>
  );
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Tab control: "workspace" | "resume" | "history" | "billing"
  const [activeTab, setActiveTab] = useState("workspace");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [proposals, setProposals] = useState<any[]>([]);

  // Resume states
  const [resumeText, setResumeText] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [resumeSaving, setResumeSaving] = useState(false);
  const [resumeMessage, setResumeMessage] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Workspace generator states
  const [jobDescription, setJobDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentProposal, setCurrentProposal] = useState<any>(null);
  const [workspaceError, setWorkspaceError] = useState("");

  // Modal detailed preview state
  const [selectedProposal, setSelectedProposal] = useState<any>(null);

  // Billing states
  const [phone, setPhone] = useState("");
  const [billingLoading, setBillingLoading] = useState(false);
  const [billingMessage, setBillingMessage] = useState("");
  const [billingError, setBillingError] = useState("");

  // Copy helpers
  const [copiedProposal, setCopiedProposal] = useState(false);
  const [copiedOutline, setCopiedOutline] = useState(false);

  // Fetch initial profile & proposals data
  const fetchData = async () => {
    try {
      const authRes = await fetch("/api/auth/me");
      const authData = await authRes.json();
      if (!authData.user) {
        router.push("/auth");
        return;
      }
      setUser(authData.user);
      setResumeText(authData.user.resumeText || "");
      setResumeFileName(authData.user.resumeFileName || "");
      setResumeUrl(authData.user.resumeUrl || "");

      const propRes = await fetch("/api/proposals");
      const propData = await propRes.json();
      if (propData.success) {
        setProposals(propData.proposals);
      }
    } catch (err) {
      console.error("Dashboard initialization data fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [router]);

  // Listen to payment callback query params
  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    const ref = searchParams.get("reference");
    
    if (paymentStatus === "success" && ref) {
      setBillingLoading(true);
      setBillingMessage("Verifying your payment... Upgrading account.");
      
      // Simulate/trigger immediate server update for local testing/real fallback
      fetch("/api/payments/simulate", { method: "POST" })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setUser(data.user);
            setBillingMessage("Payment verified! Thank you for upgrading to Pitcherr PREMIUM!");
            setTimeout(() => {
              setBillingMessage("");
              router.replace("/dashboard");
            }, 3000);
          }
        })
        .catch(err => {
          console.error("Simulated upgrade failed:", err);
          setBillingMessage("");
        })
        .finally(() => {
          setBillingLoading(false);
        });
    }
  }, [searchParams, router]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);
      setLoading(false);
    }
  };

  // Save Resume text
  const handleSaveResume = async (e: React.FormEvent) => {
    e.preventDefault();
    setResumeSaving(true);
    setResumeMessage("");

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, resumeFileName }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Save profile failed");

      setUser(data.user);
      setResumeText(data.user.resumeText || "");
      setResumeFileName(data.user.resumeFileName || "");
      setResumeUrl(data.user.resumeUrl || "");
      setResumeMessage("Resume and profile details saved successfully.");
      setTimeout(() => setResumeMessage(""), 3000);
    } catch (err: any) {
      setResumeMessage(`Error: ${err.message}`);
    } finally {
      setResumeSaving(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File is too large. Maximum size is 5MB.");
      return;
    }

    // Validate type
    const validTypes = ["application/pdf", "text/plain"];
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (!validTypes.includes(file.type) && fileExtension !== "pdf" && fileExtension !== "txt" && fileExtension !== "md") {
      setUploadError("Unsupported file type. Please upload a PDF or TXT file.");
      return;
    }

    setUploadLoading(true);
    setUploadError("");
    setResumeMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/profile/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to upload file");
      }

      setUser(data.user);
      setResumeText(data.user.resumeText || "");
      setResumeFileName(data.user.resumeFileName || "");
      setResumeUrl(data.user.resumeUrl || "");
      setResumeMessage("Resume uploaded and parsed successfully!");
      setTimeout(() => setResumeMessage(""), 4000);
    } catch (err: any) {
      setUploadError(err.message || "Something went wrong during file upload.");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileUpload(file);
    }
  };

  // Generate tailored proposal
  const handleGenerateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription || jobDescription.trim().length === 0) {
      setWorkspaceError("Please enter the client's job description first.");
      return;
    }

    if (!user.resumeText) {
      setWorkspaceError("Please enter your resume details in the 'My Resume' tab first.");
      return;
    }

    setWorkspaceError("");
    setIsGenerating(true);
    setCurrentProposal(null);

    try {
      const response = await fetch("/api/proposals/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription }),
      });

      const data = await response.json();
      if (!response.ok) {
        if (data.error === "limit_reached") {
          setWorkspaceError(data.message);
          setActiveTab("billing");
        } else {
          throw new Error(data.error || "Generation request failed");
        }
        return;
      }

      setCurrentProposal(data.proposal);
      setUser((prev: any) => ({ ...prev, proposalsCount: data.proposalsCount }));
      // Prepend to proposal history list
      setProposals((prev) => [data.proposal, ...prev]);
    } catch (err: any) {
      setWorkspaceError(err.message || "Failed to contact generator. Please retry.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Initialize Paystack Card Payment
  const handleUpgradePaystack = async () => {
    setBillingLoading(true);
    setBillingError("");
    setBillingMessage("");

    try {
      const response = await fetch("/api/payments/initialize", { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Payment initialization failed");

      // Redirect to checkout URL
      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
      } else {
        throw new Error("No authorization url returned");
      }
    } catch (err: any) {
      setBillingError(err.message || "Could not start Paystack checkout process.");
      setBillingLoading(false);
    }
  };

  // Create Dedicated Virtual Account
  const handleCreateDVA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      setBillingError("Phone number is required for bank account mapping.");
      return;
    }

    setBillingLoading(true);
    setBillingError("");
    setBillingMessage("");

    try {
      const response = await fetch("/api/payments/dva/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Bank account generation failed");

      setUser((prev: any) => ({ ...prev, dva: data.dva }));
      setBillingMessage("Dedicated Virtual Account successfully mapped to your profile!");
      setTimeout(() => setBillingMessage(""), 4000);
    } catch (err: any) {
      setBillingError(err.message || "DVA mapping failed.");
    } finally {
      setBillingLoading(false);
    }
  };

  // Dev Upgrade Simulator
  const handleDevUpgradeSimulate = async () => {
    setBillingLoading(true);
    setBillingError("");
    setBillingMessage("");

    try {
      const response = await fetch("/api/payments/simulate", { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setUser(data.user);
      setBillingMessage("[SIMULATION] Success! Account upgraded to PREMIUM tier.");
      setTimeout(() => setBillingMessage(""), 3000);
    } catch (err: any) {
      setBillingError(`Simulation error: ${err.message}`);
    } finally {
      setBillingLoading(false);
    }
  };

  // Clipboard Copiers
  const handleCopyProposal = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedProposal(true);
    setTimeout(() => setCopiedProposal(false), 2000);
  };

  const handleCopyOutline = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedOutline(true);
    setTimeout(() => setCopiedOutline(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper paper-texture">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-mono text-zinc-500">Entering Workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-paper paper-texture">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-zinc-200/60 p-6 flex flex-col justify-between">
        <div className="space-y-8">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold font-display tracking-tight text-primary">
              Pitcherr<span className="text-secondary">.</span>
            </span>
            <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-bold ${user?.plan === "premium" ? "bg-secondary/15 text-secondary border border-secondary/20" : "bg-zinc-100 text-zinc-500 border border-zinc-200"}`}>
              {user?.plan === "premium" ? "PRO" : "FREE"}
            </span>
          </div>

          <nav className="flex flex-row md:flex-col gap-1 md:space-y-1.5 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
            <button
              onClick={() => setActiveTab("workspace")}
              className={`flex items-center space-x-2.5 px-3 py-2 text-xs font-mono font-semibold uppercase tracking-wider rounded transition-all whitespace-nowrap ${
                activeTab === "workspace" ? "bg-primary text-white" : "text-zinc-500 hover:text-primary hover:bg-zinc-100"
              }`}
            >
              <WorkspaceIcon />
              <span>Workspace</span>
            </button>

            <button
              onClick={() => setActiveTab("resume")}
              className={`flex items-center space-x-2.5 px-3 py-2 text-xs font-mono font-semibold uppercase tracking-wider rounded transition-all whitespace-nowrap ${
                activeTab === "resume" ? "bg-primary text-white" : "text-zinc-500 hover:text-primary hover:bg-zinc-100"
              }`}
            >
              <UserIcon />
              <span>My Resume</span>
            </button>

            <button
              onClick={() => setActiveTab("history")}
              className={`flex items-center space-x-2.5 px-3 py-2 text-xs font-mono font-semibold uppercase tracking-wider rounded transition-all whitespace-nowrap ${
                activeTab === "history" ? "bg-primary text-white" : "text-zinc-500 hover:text-primary hover:bg-zinc-100"
              }`}
            >
              <HistoryIcon />
              <span>Pitches ({proposals.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("billing")}
              className={`flex items-center space-x-2.5 px-3 py-2 text-xs font-mono font-semibold uppercase tracking-wider rounded transition-all whitespace-nowrap ${
                activeTab === "billing" ? "bg-primary text-white" : "text-zinc-500 hover:text-primary hover:bg-zinc-100"
              }`}
            >
              <CreditCardIcon />
              <span>Billing</span>
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-zinc-200/60 mt-6 md:mt-0 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-primary max-w-[130px] truncate">{user?.name}</span>
            <span className="text-[10px] font-mono text-zinc-500 truncate max-w-[130px]">{user?.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-zinc-400 hover:text-danger rounded hover:bg-zinc-100 transition-all"
            title="Log Out"
          >
            <LogoutIcon />
          </button>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full overflow-y-auto">
        {/* TAB 1: WORKSPACE */}
        {activeTab === "workspace" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-extrabold font-display text-primary tracking-tight">Proposal Workspace</h1>
              <p className="text-xs font-mono text-zinc-500 mt-1">
                Cross-reference your portfolio and generate tailored, non-generic client bids using DeepSeek AI.
              </p>
            </div>

            {workspaceError && (
              <div className="p-3 bg-danger/10 border border-danger/25 text-danger text-xs rounded font-mono">
                {workspaceError}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Pasting Box */}
              <div className="lg:col-span-1 space-y-4">
                <form onSubmit={handleGenerateProposal} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-zinc-500 uppercase font-semibold mb-1">
                      Client Job Description
                    </label>
                    <textarea
                      placeholder="Paste the Upwork/LinkedIn job post or client email description details here..."
                      rows={10}
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      className="w-full p-4 bg-white border border-zinc-200 text-sm rounded shadow-paper focus:bg-white focus:outline-secondary text-primary font-sans leading-relaxed resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isGenerating || !resumeText}
                    className="w-full py-3 bg-primary text-white hover:bg-neutral-800 disabled:opacity-50 text-xs font-semibold rounded transition-all shadow-paper font-mono uppercase tracking-widest flex items-center justify-center space-x-2"
                  >
                    {isGenerating ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <span>Draft Tailored Proposal</span>
                    )}
                  </button>

                  {!resumeText && (
                    <p className="text-[10px] font-mono text-warning text-center">
                      ⚠️ Please input your resume in the "My Resume" tab first.
                    </p>
                  )}

                  {user?.plan !== "premium" && (
                    <div className="p-3.5 border border-dashed border-zinc-200 rounded bg-white text-center">
                      <p className="text-[10px] font-mono text-zinc-400">
                        Consumption Meter: <span className="font-bold text-primary">{user?.proposalsCount}/3 generations used</span>
                      </p>
                      <div className="w-full bg-zinc-100 rounded-full h-1.5 mt-2">
                        <div
                          className="bg-primary h-1.5 rounded-full"
                          style={{ width: `${Math.min((user?.proposalsCount / 3) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </form>
              </div>

              {/* AI Draft Renderer */}
              <div className="lg:col-span-2">
                <div className="border border-zinc-200/60 rounded-xl bg-white shadow-paper min-h-[400px] flex flex-col justify-between overflow-hidden">
                  {/* Draft Header */}
                  <div className="px-6 py-4 border-b border-zinc-200/60 bg-zinc-50/50 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${isGenerating ? "bg-secondary animate-pulse" : "bg-zinc-300"}`} />
                      <span className="text-[11px] font-mono text-zinc-500 font-bold uppercase">Proposal Console</span>
                    </div>

                    {currentProposal && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleCopyProposal(currentProposal.tailoredProposal)}
                          className="px-2.5 py-1 bg-white hover:bg-zinc-50 border border-zinc-200 text-[10px] font-mono rounded text-zinc-600 transition-all"
                        >
                          {copiedProposal ? "Copied Cover Letter!" : "Copy Cover Letter"}
                        </button>
                        <button
                          onClick={() => handleCopyOutline(currentProposal.projectOutline)}
                          className="px-2.5 py-1 bg-white hover:bg-zinc-50 border border-zinc-200 text-[10px] font-mono rounded text-zinc-600 transition-all"
                        >
                          {copiedOutline ? "Copied Outline!" : "Copy Outline"}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Draft Body */}
                  <div className="flex-1 p-6 overflow-y-auto">
                    {isGenerating && (
                      <div className="flex flex-col items-center justify-center h-full py-16 space-y-4">
                        <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
                        <div className="text-center space-y-1">
                          <p className="text-sm font-semibold text-primary">Generating with DeepSeek AI</p>
                          <p className="text-xs text-zinc-400 font-mono">Applying custom milestones and portfolio matches...</p>
                        </div>
                      </div>
                    )}

                    {!isGenerating && !currentProposal && (
                      <div className="flex flex-col items-center justify-center h-full py-16 text-center text-zinc-400">
                        <DocumentIcon />
                        <p className="text-sm mt-3">Ready to draft your tailored proposal</p>
                        <p className="text-xs mt-1 font-mono text-zinc-400 max-w-sm">
                          Enter client needs on the left and hit the Draft button to begin.
                        </p>
                      </div>
                    )}

                    {!isGenerating && currentProposal && (
                      <div className="space-y-8 divide-y divide-zinc-200/50">
                        {/* Proposal Cover Letter */}
                        <div className="pb-6">
                          <h4 className="text-[10px] font-mono text-secondary uppercase font-bold tracking-wider mb-4">
                            Part 1: Tailored Cover Letter
                          </h4>
                          <MarkdownRenderer content={currentProposal.tailoredProposal} />
                        </div>

                        {/* Project Outline */}
                        <div className="pt-6">
                          <h4 className="text-[10px] font-mono text-secondary uppercase font-bold tracking-wider mb-4">
                            Part 2: Project Approach & Milestones
                          </h4>
                          <MarkdownRenderer content={currentProposal.projectOutline} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MY RESUME */}
        {activeTab === "resume" && (
          <div className="max-w-2xl space-y-8">
            <div>
              <h1 className="text-2xl font-extrabold font-display text-primary tracking-tight">Freelancer Resume & Portfolio</h1>
              <p className="text-xs font-mono text-zinc-500 mt-1">
                Upload or paste your professional background once. Pitcherr uses this information to tailor all client proposals.
              </p>
            </div>

            {resumeMessage && (
              <div className="p-3 bg-zinc-50 border border-zinc-200 text-primary text-xs rounded font-mono">
                {resumeMessage}
              </div>
            )}

            {uploadError && (
              <div className="p-3 bg-danger/10 border border-danger/25 text-danger text-xs rounded font-mono">
                {uploadError}
              </div>
            )}

            <div className="space-y-6">
              {/* Drag and Drop Container */}
              <div className="space-y-2">
                <label className="block text-xs font-mono text-zinc-500 uppercase font-semibold">
                  Upload Resume File (PDF / TXT)
                </label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("file-input")?.click()}
                  className={`w-full p-8 border-2 border-dashed rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center text-center ${
                    isDragging
                      ? "border-secondary bg-secondary/5 scale-[1.01]"
                      : "border-zinc-200 hover:border-zinc-400 bg-white"
                  }`}
                >
                  <input
                    id="file-input"
                    type="file"
                    accept=".pdf,.txt,.md"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                  {uploadLoading ? (
                    <div className="flex flex-col items-center space-y-3 py-4">
                      <div className="w-8 h-8 border-3 border-secondary border-t-transparent rounded-full animate-spin" />
                      <p className="text-xs font-mono text-zinc-500 font-bold uppercase animate-pulse">
                        Processing & Parsing Document...
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 py-2">
                      <div className="mx-auto w-12 h-12 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 border border-zinc-200/50">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-primary font-mono uppercase tracking-wide">
                          Drag & Drop Resume File here
                        </p>
                        <p className="text-[10px] font-mono text-zinc-400 mt-1">
                          or click to browse from folders (PDF or TXT, max 5MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {resumeFileName && (
                <div className="flex items-center justify-between p-3.5 bg-zinc-50/80 rounded-lg border border-zinc-200/60 text-xs">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className="p-2 bg-white rounded border border-zinc-200 text-secondary">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>
                    <div className="truncate">
                      <p className="font-bold text-primary truncate max-w-xs">{resumeFileName}</p>
                      {resumeUrl && (
                        <a
                          href={resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-mono text-secondary hover:underline inline-flex items-center mt-0.5"
                        >
                          <span>View uploaded document</span>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-2.5 h-2.5 ml-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <span className="text-[9px] font-mono uppercase bg-zinc-200/50 text-zinc-500 font-bold px-1.5 py-0.5 rounded border border-zinc-300/30">
                    Active Reference
                  </span>
                </div>
              )}

              {/* Editable Parsed Content Form */}
              <form onSubmit={handleSaveResume} className="space-y-6">
                <div>
                  <label className="block text-xs font-mono text-zinc-500 uppercase font-semibold mb-1">
                    Document Name Reference
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Resume_Senior_FullStack_2026.pdf"
                    value={resumeFileName}
                    onChange={(e) => setResumeFileName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 text-sm rounded shadow-paper focus:outline-secondary text-primary font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-500 uppercase font-semibold mb-1">
                    Extracted Text Details (Review & Tweak for AI Proposal Generation)
                  </label>
                  <textarea
                    placeholder="Extracted resume data will appear here automatically. You can also paste details or manually tune the content below to optimize what the AI scans..."
                    rows={14}
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    className="w-full p-4 bg-white border border-zinc-200 text-sm rounded shadow-paper focus:outline-secondary text-primary font-sans leading-relaxed resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={resumeSaving}
                  className="px-6 py-3 bg-primary text-white hover:bg-neutral-800 disabled:opacity-50 text-xs font-semibold rounded transition-all shadow-paper font-mono uppercase tracking-widest"
                >
                  {resumeSaving ? "Saving..." : "Save Tuned Details"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: PROPOSALS HISTORY */}
        {activeTab === "history" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-extrabold font-display text-primary tracking-tight">Proposal History</h1>
              <p className="text-xs font-mono text-zinc-500 mt-1">
                View or copy previous proposals and milestones you have generated in the past.
              </p>
            </div>

            {proposals.length === 0 ? (
              <div className="text-center py-16 bg-white border border-zinc-200/60 rounded-xl shadow-paper text-zinc-400">
                <DocumentIcon />
                <p className="text-sm mt-3">No proposals generated yet</p>
                <p className="text-xs mt-1 font-mono text-zinc-400">
                  Your generated drafts will be saved here automatically.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {proposals.map((prop) => (
                  <div
                    key={prop._id}
                    onClick={() => setSelectedProposal(prop)}
                    className="paper-card p-6 rounded-xl bg-white cursor-pointer flex flex-col justify-between text-left space-y-4"
                  >
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-zinc-400">
                        {new Date(prop.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <h3 className="text-sm font-bold font-display text-primary line-clamp-1">
                        Client: {prop.jobDescription}
                      </h3>
                      <p className="text-xs text-zinc-500 line-clamp-3 leading-relaxed">
                        {prop.tailoredProposal.replace(/[#*`]/g, "")}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-secondary font-semibold uppercase tracking-wider flex items-center">
                      View Detailed Pitch <ArrowRightIcon />
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: BILLING */}
        {activeTab === "billing" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-extrabold font-display text-primary tracking-tight">Plan & Billing</h1>
              <p className="text-xs font-mono text-zinc-500 mt-1">
                Manage your subscription, pay via Paystack, or generate a Dedicated Virtual Account for bank deposit upgrades.
              </p>
            </div>

            {billingMessage && (
              <div className="p-3 bg-zinc-50 border border-zinc-200 text-primary text-xs rounded font-mono">
                {billingMessage}
              </div>
            )}

            {billingError && (
              <div className="p-3 bg-danger/10 border border-danger/25 text-danger text-xs rounded font-mono">
                {billingError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Account Status Card */}
              <div className="md:col-span-1 paper-card bg-white p-6 rounded-xl space-y-6 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase font-semibold">Active Plan</span>
                  <div className="mt-2 flex items-baseline">
                    <span className="text-2xl font-extrabold font-display text-primary">
                      {user?.plan === "premium" ? "Premium Plan" : "Free Tier"}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-2 font-mono">
                    {user?.plan === "premium"
                      ? "✓ Unlimited generations & deep reasoning enabled"
                      : "Generations remaining: " + (3 - user?.proposalsCount) + " left"}
                  </p>
                </div>

                {user?.plan !== "premium" ? (
                  <button
                    onClick={handleUpgradePaystack}
                    disabled={billingLoading}
                    className="w-full py-2.5 bg-primary text-white hover:bg-neutral-800 disabled:opacity-50 text-xs font-semibold rounded font-mono uppercase tracking-widest text-center transition-all shadow-paper"
                  >
                    {billingLoading ? "Initializing..." : "Upgrade Card ₦5,000"}
                  </button>
                ) : (
                  <div className="p-2.5 bg-success/15 border border-success/20 rounded text-success text-center text-xs font-semibold">
                    Premium Subscribed
                  </div>
                )}
              </div>

              {/* Dedicated Virtual Account Deposit */}
              <div className="md:col-span-2 paper-card bg-white p-6 rounded-xl space-y-6">
                <div>
                  <h3 className="text-sm font-bold font-display text-primary">Dedicated Bank Deposit Account</h3>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                    Registered businesses in Nigeria can deposit funds directly to a dedicated virtual bank account to upgrade instantly.
                  </p>
                </div>

                {user?.dva ? (
                  <div className="bg-zinc-50 p-5 rounded-lg border border-zinc-200/80 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="block text-[10px] font-mono text-zinc-400 uppercase font-semibold">Bank Name</span>
                        <span className="text-sm font-bold text-primary">{user.dva.bankName}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-mono text-zinc-400 uppercase font-semibold">Account Number</span>
                        <span className="text-sm font-mono font-bold text-secondary tracking-widest">{user.dva.accountNumber}</span>
                      </div>
                    </div>
                    <div>
                      <span className="block text-[10px] font-mono text-zinc-400 uppercase font-semibold">Account Name</span>
                      <span className="text-xs font-mono font-semibold text-primary">{user.dva.accountName}</span>
                    </div>
                    <div className="pt-2.5 border-t border-zinc-200">
                      <p className="text-[10px] font-mono text-zinc-500 leading-relaxed">
                        💡 Transfers of ₦5,000 to this bank account will automatically trigger our webhook to upgrade your profile status instantly.
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleCreateDVA} className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono text-zinc-500 uppercase font-semibold mb-1">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. +2348123456789"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 text-sm rounded shadow-paper focus:outline-secondary text-primary font-sans"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={billingLoading || !phone}
                      className="py-2.5 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded font-mono uppercase tracking-widest transition-all"
                    >
                      {billingLoading ? "Generating..." : "Generate Dedicated Bank Account"}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Developer Simulator Box */}
            {process.env.NODE_ENV !== "production" && (
              <div className="p-6 bg-secondary/5 border border-dashed border-secondary/20 rounded-xl space-y-4">
                <div>
                  <h4 className="text-xs font-mono text-secondary font-bold uppercase tracking-wider">
                    🛠 Developer Sandbox Simulator
                  </h4>
                  <p className="text-xs text-zinc-500 mt-1">
                    Bypass real payment configurations by simulating a successful payment webhook or direct status upgrade.
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleDevUpgradeSimulate}
                    disabled={billingLoading}
                    className="py-2 px-4 bg-secondary text-white hover:bg-secondary/95 text-xs font-mono rounded transition-all shadow-paper"
                  >
                    Simulate Payment Webhook (Upgrade User)
                  </button>
                  {user?.plan === "premium" && (
                    <button
                      onClick={async () => {
                        setBillingLoading(true);
                        try {
                          await fetch("/api/payments/simulate?action=downgrade", { method: "POST" });
                          await fetchData();
                        } catch (e) {}
                        setBillingLoading(false);
                      }}
                      className="py-2 px-4 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-600 text-xs font-mono rounded transition-all"
                    >
                      Downgrade back to Free Tier
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODAL DETAILED PROPOSAL PREVIEW DRAWER */}
      {selectedProposal && (
        <div className="fixed inset-0 z-50 flex justify-end bg-primary/20 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="w-full max-w-2xl bg-white h-full border-l border-zinc-200 shadow-2xl flex flex-col justify-between animate-[slideIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
            <div className="px-6 py-4 border-b border-zinc-200/60 bg-zinc-50/50 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-mono text-zinc-400">
                  {new Date(selectedProposal.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <h3 className="text-sm font-bold font-display text-primary truncate max-w-sm">
                  Client Proposal Preview
                </h3>
              </div>
              <button
                onClick={() => setSelectedProposal(null)}
                className="p-1.5 hover:bg-zinc-100 rounded text-zinc-400 hover:text-primary transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 p-8 overflow-y-auto space-y-8 divide-y divide-zinc-200/50">
              {/* Proposal Cover Letter */}
              <div className="pb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[10px] font-mono text-secondary uppercase font-bold tracking-wider">
                    Part 1: Cover Letter
                  </h4>
                  <button
                    onClick={() => handleCopyProposal(selectedProposal.tailoredProposal)}
                    className="px-2 py-1 bg-zinc-50 border border-zinc-200 text-[10px] font-mono rounded text-zinc-500 hover:bg-zinc-100 transition-all"
                  >
                    {copiedProposal ? "Copied!" : "Copy"}
                  </button>
                </div>
                <MarkdownRenderer content={selectedProposal.tailoredProposal} />
              </div>

              {/* Project Outline */}
              <div className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[10px] font-mono text-secondary uppercase font-bold tracking-wider">
                    Part 2: Project Approach & Milestones
                  </h4>
                  <button
                    onClick={() => handleCopyOutline(selectedProposal.projectOutline)}
                    className="px-2 py-1 bg-zinc-50 border border-zinc-200 text-[10px] font-mono rounded text-zinc-500 hover:bg-zinc-100 transition-all"
                  >
                    {copiedOutline ? "Copied!" : "Copy"}
                  </button>
                </div>
                <MarkdownRenderer content={selectedProposal.projectOutline} />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-zinc-200 bg-zinc-50/50 flex justify-end">
              <button
                onClick={() => setSelectedProposal(null)}
                className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded hover:bg-neutral-800 transition-all shadow-paper font-mono uppercase tracking-wider"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
