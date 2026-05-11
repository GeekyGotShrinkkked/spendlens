"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

const TOOL_ICONS: Record<string, string> = {
  cursor: "⌨️",
  github_copilot: "🐙",
  claude: "🤖",
  chatgpt: "💬",
  anthropic_api: "🔌",
  openai_api: "🔌",
  gemini: "✨",
  windsurf: "🏄",
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

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-all";

  return (
    <main className="min-h-screen bg-[#080810] text-white relative overflow-hidden">

      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute top-[30%] right-[-10%] w-[400px] h-[400px] rounded-full bg-teal-500/8 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[30%] w-[500px] h-[500px] rounded-full bg-emerald-600/8 blur-[120px]" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Header */}
      <div className="relative z-10 px-8 py-5 flex items-center justify-between border-b border-white/5">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-black font-black text-sm">
            S
          </div>
          <span className="font-bold text-white tracking-tight text-lg">
            SpendLens
          </span>
        </div>
        <button
          onClick={copyLink}
          className="text-xs text-white/40 hover:text-emerald-400 border border-white/10 hover:border-emerald-500/40 rounded-full px-4 py-1.5 transition-all"
        >
          {copied ? "✓ Copied!" : "Share this audit →"}
        </button>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-12 space-y-6">

        {/* Hero savings card */}
        <div
          className="rounded-3xl p-8 text-center relative overflow-hidden"
          style={{
            background: isOptimal
              ? "linear-gradient(135deg, rgba(16,185,129,0.1), rgba(5,150,105,0.05))"
              : "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.08))",
            border: "1px solid rgba(16,185,129,0.2)",
          }}
        >
          {/* Glow behind number */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-48 rounded-full bg-emerald-500/10 blur-[60px]" />
          </div>

          {isOptimal ? (
            <div className="relative z-10">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-2xl font-black text-emerald-400 mb-2">
                You&apos;re spending well
              </h2>
              <p className="text-white/40 text-sm">
                Your AI tool stack is already optimized.
                Less than $100/month in potential savings identified.
              </p>
            </div>
          ) : (
            <div className="relative z-10">
              <p className="text-white/40 text-xs uppercase tracking-widest mb-3 font-medium">
                Potential monthly savings
              </p>
              <div
                className="text-7xl font-black mb-1 text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #34d399, #10b981, #059669)",
                }}
              >
                ${audit.total_monthly_savings.toFixed(0)}
              </div>
              <p className="text-white/40 text-sm mb-1">per month</p>
              <div className="inline-block bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mt-2">
                <span className="text-emerald-400 font-bold text-sm">
                  ${audit.total_annual_savings.toFixed(0)} saved per year
                </span>
              </div>
            </div>
          )}
        </div>

        {/* AI Summary */}
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-xs text-emerald-400 uppercase tracking-widest font-medium">
              AI Analysis
            </p>
          </div>
          <p className="text-white/60 leading-relaxed text-sm">
            {audit.ai_summary}
          </p>
        </div>

        {/* Per tool breakdown */}
        <div>
          <h3 className="text-sm font-medium text-white/40 uppercase tracking-widest mb-4">
            Tool by tool breakdown
          </h3>
          <div className="space-y-3">
            {audit.recommendations.map((rec, index) => (
              <div
                key={index}
                className="bg-white/[0.03] border border-white/8 rounded-2xl p-5 backdrop-blur-sm"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {TOOL_ICONS[rec.tool] || "🔧"}
                    </span>
                    <div>
                      <h4 className="font-bold text-white text-sm">
                        {TOOL_NAMES[rec.tool] || rec.tool}
                      </h4>
                      <p className="text-xs text-white/30">
                        {rec.currentPlan} · ${rec.currentSpend}/mo
                      </p>
                    </div>
                  </div>
                  {rec.monthlySavings > 0 ? (
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full"
                      style={{
                        background: "rgba(16,185,129,0.15)",
                        border: "1px solid rgba(16,185,129,0.3)",
                        color: "#34d399",
                      }}
                    >
                      Save ${rec.monthlySavings.toFixed(0)}/mo
                    </span>
                  ) : (
                    <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/30">
                      Optimal ✓
                    </span>
                  )}
                </div>

                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
                  <p className="text-xs font-medium text-white/80 mb-1">
                    {rec.recommendedAction}
                    {rec.recommendedPlan && (
                      <span className="text-emerald-400">
                        {" "}→ {rec.recommendedPlan}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-white/30 leading-relaxed">
                    {rec.reason}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Credex CTA */}
        {isHighSavings && (
          <div
            className="rounded-2xl p-6 text-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(5,150,105,0.06))",
              border: "1px solid rgba(16,185,129,0.25)",
            }}
          >
            <div className="text-2xl mb-3">💰</div>
            <h3 className="text-lg font-black text-emerald-400 mb-2">
              Capture even more savings with Credex
            </h3>
            <p className="text-white/40 text-sm mb-5 leading-relaxed">
              Credex sells discounted AI credits — Cursor, Claude, ChatGPT
              Enterprise and more — at 25–35% below retail price.
            </p>
            <a
              href="https://credex.rocks"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-bold px-6 py-3 rounded-xl text-sm transition-all"
              style={{
                background: "linear-gradient(135deg, #10b981, #059669)",
                color: "#000",
              }}
            >
              Book a free Credex consultation →
            </a>
          </div>
        )}

        {/* Email capture */}
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 backdrop-blur-sm">
          {submitted ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="text-lg font-black text-emerald-400 mb-2">
                Report sent!
              </h3>
              <p className="text-white/30 text-sm">
                Check your inbox for your full audit report.
              </p>
            </div>
          ) : (
            <>
              <h3 className="font-black text-base mb-1">
                {isOptimal
                  ? "Get notified when optimizations apply to your stack"
                  : "Get the full report in your inbox"}
              </h3>
              <p className="text-white/30 text-xs mb-5">
                Free. No spam. Unsubscribe anytime.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="Company name (optional)"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="Your role (optional)"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={inputClass}
                />
                <button
                  onClick={handleLeadSubmit}
                  disabled={submitting || !email}
                  className="w-full font-bold rounded-xl py-3 text-sm transition-all disabled:opacity-40"
                  style={{
                    background:
                      submitting || !email
                        ? "rgba(255,255,255,0.05)"
                        : "linear-gradient(135deg, #10b981, #059669)",
                    color: submitting || !email ? "rgba(255,255,255,0.3)" : "#000",
                  }}
                >
                  {submitting ? "Sending..." : "Send me the report →"}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Share */}
        <div className="text-center">
          <p className="text-white/20 text-xs mb-3">
            Know someone overpaying for AI tools?
          </p>
          <button
            onClick={copyLink}
            className="text-sm text-white/30 hover:text-emerald-400 border border-white/8 hover:border-emerald-500/30 rounded-xl px-6 py-2.5 transition-all"
          >
            {copied ? "✓ Link copied!" : "Share SpendLens →"}
          </button>
        </div>

        {/* New audit */}
        <div className="text-center">
          <button
            onClick={() => router.push("/")}
            className="text-xs text-white/20 hover:text-white/40 transition-colors"
          >
            ← Run another audit
          </button>
        </div>

      </div>
    </main>
  );
}