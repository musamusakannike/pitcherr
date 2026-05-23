interface ProposalResponse {
  proposal: string;
  outline: string;
}

/**
 * Cross-references freelancer resume and client job description using DeepSeek API
 * to generate a highly tailored, non-generic proposal and project approach.
 */
export async function generateProposal(
  resumeText: string,
  jobDescription: string
): Promise<ProposalResponse> {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  const isMock = !apiKey || apiKey === "mock";

  if (isMock) {
    return generateMockProposal(resumeText, jobDescription);
  }

  try {
    const systemPrompt = `You are Pitcherr AI, an expert freelance consultant. Your task is to cross-reference the freelancer's resume/portfolio with a client's job description.
Create a highly tailored, non-generic proposal and a step-by-step project approach outline.

Do NOT use generic placeholders (e.g. [My Name], [Company], [X years]). If details are missing, write naturally and represent the freelancer's skills confidently based on their provided resume.

You MUST respond with a valid JSON object containing exactly two keys:
1. "proposal": A markdown formatted proposal/cover letter matching the freelancer's past work directly to the client's needs.
2. "outline": A markdown formatted project outline showing a step-by-step approach, milestones, and technical recommendations.

Include the word "json" in your formatting and ensure your output matches this structure:
{
  "proposal": "markdown cover letter...",
  "outline": "markdown project approach..."
}`;

    const userPrompt = `Freelancer Resume/Portfolio:
${resumeText}

Client Job Description:
${jobDescription}`;

    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-v4-pro",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        thinking: { type: "enabled" },
        reasoning_effort: "high",
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`DeepSeek API returned error: ${response.status} ${errText}`);
    }

    const result = await response.json();
    const content = result.choices[0].message.content;
    const parsed: ProposalResponse = JSON.parse(content);
    
    return parsed;
  } catch (error: any) {
    console.error("Deepseek API generation failed, falling back to mock:", error.message);
    return generateMockProposal(resumeText, jobDescription);
  }
}

/**
 * Generates a high-quality context-aware mock proposal for local testing
 */
function generateMockProposal(resumeText: string, jobDescription: string): ProposalResponse {
  // Simple keyword detection to make the mock response context-aware
  const clientKeywords = ["react", "next.js", "nextjs", "node", "mongodb", "python", "design", "ui", "mobile", "ai", "ecommerce"];
  const detected: string[] = [];
  
  const textToSearch = (jobDescription + " " + resumeText).toLowerCase();
  clientKeywords.forEach(kw => {
    if (textToSearch.includes(kw)) {
      detected.push(kw === "nextjs" ? "Next.js" : kw.charAt(0).toUpperCase() + kw.slice(1));
    }
  });

  const techMentioned = detected.length > 0 ? detected.join(", ") : "modern web technologies";

  const proposal = `### Tailored Proposal for your Project

Hi there,

I read your job description and noticed that you are looking for an expert to execute this project. Based on my past experience working with **${techMentioned}**, I am confident that I can deliver a high-quality solution that meets your exact needs.

Unlike generalist pitches, I want to highlight that I have specifically built similar architectures where performance and scalability were critical. For example, my past portfolio demonstrates:
1. **Interactive Client Portals** - Delivering responsive, modular frontends built on React/Next.js.
2. **Reliable Integrations** - Creating custom backend logic, third-party payment integrations, and database schemas that keep data clean and synchronized.
3. **Optimized Performance** - Ensuring fast page loads (lowering LCP/INP) and writing maintainable code that scales.

I would love to schedule a quick 10-minute call to discuss your goals in detail and align on how we can implement this efficiently.

Best regards,
*Your Pitcherr AI Freelancer*`;

  const outline = `### Proposed Project Approach & Timeline

Here is how I would approach your project, broken down into clear milestones:

#### 🛠 Phase 1: Discovery & Architecture (Days 1-3)
*   **Requirements Alignment**: Define core specifications, API interfaces, and state management needs.
*   **Database Design**: Establish a high-performance MongoDB schema layout.
*   **UI/UX Prototyping**: Map out user flows to ensure an intuitive design.

#### 💻 Phase 2: Core Development & Integration (Days 4-10)
*   **Frontend Layout**: Develop modern, fully responsive Next.js views with smooth interactive states.
*   **Payment Gateway**: Integrate Paystack checkout and configure webhook endpoint for instant transaction updates.
*   **Feature Verification**: Hook up core functionalities and perform end-to-end user tests.

#### 🚀 Phase 3: Launch & Handoff (Days 11-14)
*   **Deploy & Speed Audit**: Host on Firebase App Hosting or Vercel, performing LCP and accessibility audits.
*   **Handover Documentation**: Provide clear repository guides and a training walkthrough for your team.

*Let me know if this timeline and breakdown align with your schedule!*`;

  return { proposal, outline };
}
