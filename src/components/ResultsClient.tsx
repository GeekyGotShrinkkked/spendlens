"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// ---- TYPES ----
interface Recommendation {
  tool: string;
  currentPlan: string;
  currentSpend: number;
  recommendedAction: string;
  recommendedPlan: string | null;
  estimatedSpend: number;
  monthlySavings: number;
  reason: string;
}

interface Audit {
  id: string;
  form_data: {
    teamSize: number;
    useCase: string;
  };
  recommendations: Recommendation[];
  total_monthly_savings: number;
  total_annual_savings: number;
  ai_summary: string;
  created_at: string;
}

interface Props {
  audit: Audit;
}

// Tool display names
const TOOL_NAMES: Record<string, string> = {
  cursor: "Cursor",
  github_copilot: "GitHub Copilot",
  claude: "Claude",
  chatgpt: "ChatGPT",
  anthropic_api: "Anthropic API",
  openai_api: "OpenAI API",
  gemini: "Gemini",
  windsurf: "Windsurf",
};

export default function ResultsClient({ audit }: Props) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const isHighSavings = audit.total_monthly_savings > 500;
  const isOptimal = audit.total_monthly_savings < 100;

  // Copy shareable URL to clipboard
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle email capture form submit
  const handleLeadSubmit = async () => {
    if (!email) return;
    setSubmitting(true);

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          companyName,
          role,
          auditId: audit.id,
        }),
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white">

      {/* Header */}
      <div className="border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <h1
          onClick={() => router.push("/")}
          className="text-xl font-bold text-emerald-400 cursor-pointer"
        >
          SpendLens
        </h1>
        <button
          onClick={copyLink}
          className="text-sm text-gray-400 hover:text-white border border-gray-700 rounded-lg px-3 py-1.5 transition-colors"
        >
          {copied ? "✓ Copied!" : "Share this audit"}
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12 space-y-8">

        {/* Hero — Total Savings */}
        <div className="text-center bg-gray-900 border border-gray-800 rounded-2xl p-8">
          {isOptimal ? (
            <>
              <div className="text-5xl mb-3">✅</div>
              <h2 className="text-2xl font-bold text-emerald-400 mb-2">
                You're spending well
              </h2>
              <p className="text-gray-400">
                Your AI tool stack is already optimized.
                Less than $100/month in potential savings identified.
              </p>
            </>
          ) : (
            <>
              <p className="text-gray-400 mb-2 text-sm uppercase tracking-wider">
                Potential savings identified
              </p>
              <div className="text-6xl font-black text-emerald-400 mb-1">
                ${audit.total_monthly_savings.toFixed(0)}
                <span className="text-2xl text-gray-400">/mo</span>
              </div>
              <div className="text-xl text-gray-300 mb-4">
                ${audit.total_annual_savings.toFixed(0)} per year
              </div>
              <p className="text-gray-400 text-sm">
                Based on your current tool stack and team size
              </p>
            </>
          )}
        </div>

        {/* AI Summary */}
        <div className="bg-gray-900 border border-emerald-900 rounded-2xl p-6">
          <p className="text-xs text-emerald-400 uppercase tracking-wider mb-3">
            AI Analysis
          </p>
          <p className="text-gray-300 leading-relaxed">
            {audit.ai_summary}
          </p>
        </div>

        {/* Per Tool Breakdown */}
        <div>
          <h3 className="text-lg font-bold mb-4">
            Tool by tool breakdown
          </h3>
          <div className="space-y-4">
            {audit.recommendations.map((rec, index) => (
              <div
                key={index}
                className="bg-gray-900 border border-gray-800 rounded-xl p-5"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-white">
                      {TOOL_NAMES[rec.tool] || rec.tool}
                    </h4>
                    <p className="text-sm text-gray-400">
                      Current: {rec.currentPlan} — ${rec.currentSpend}/mo
                    </p>
                  </div>
                  {rec.monthlySavings > 0 ? (
                    <span className="bg-emerald-900 text-emerald-400 text-sm font-bold px-3 py-1 rounded-full">
                      Save ${rec.monthlySavings.toFixed(0)}/mo
                    </span>
                  ) : (
                    <span className="bg-gray-800 text-gray-400 text-sm px-3 py-1 rounded-full">
                      Optimal
                    </span>
                  )}
                </div>

                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-sm font-medium text-white mb-1">
                    {rec.recommendedAction}
                    {rec.recommendedPlan && ` → ${rec.recommendedPlan}`}
                  </p>
                  <p className="text-sm text-gray-400">
                    {rec.reason}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Credex CTA — only for high savings */}
        {isHighSavings && (
          <div className="bg-emerald-950 border border-emerald-700 rounded-2xl p-6 text-center">
            <h3 className="text-xl font-bold text-emerald-400 mb-2">
              You could save even more with Credex
            </h3>
            <p className="text-gray-300 mb-4 text-sm">
              Credex sells discounted AI credits — Cursor, Claude, ChatGPT
              Enterprise and more — at 25-35% below retail. Book a free
              consultation to see what's available for your stack.
            </p>
            <a
              href="https://credex.rocks"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-6 py-3 rounded-xl transition-colors"
            >
              Book a free Credex consultation →
            </a>
          </div>
        )}

        {/* Email Capture */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          {submitted ? (
            <div className="text-center">
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="text-lg font-bold text-emerald-400 mb-2">
                Report sent!
              </h3>
              <p className="text-gray-400 text-sm">
                Check your inbox for your full audit report.
              </p>
            </div>
          ) : (
            <>
              <h3 className="text-lg font-bold mb-1">
                {isOptimal
                  ? "Get notified when new optimizations apply to your stack"
                  : "Get the full report in your inbox"}
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Free. No spam. Unsubscribe anytime.
              </p>

              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500"
                />
                <input
                  type="text"
                  placeholder="Company name (optional)"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500"
                />
                <input
                  type="text"
                  placeholder="Your role (optional)"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500"
                />
                <button
                  onClick={handleLeadSubmit}
                  disabled={submitting || !email}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-gray-700 disabled:text-gray-500 text-black font-bold rounded-xl py-3 transition-colors"
                >
                  {submitting ? "Sending..." : "Send me the report →"}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Share button at bottom */}
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-3">
            Know someone overpaying for AI tools?
          </p>
          <button
            onClick={copyLink}
            className="border border-gray-700 hover:border-emerald-500 text-gray-300 hover:text-emerald-400 rounded-xl px-6 py-3 transition-colors"
          >
            {copied ? "✓ Link copied!" : "Share SpendLens →"}
          </button>
        </div>

      </div>
    </main>
  );
}