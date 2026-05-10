"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuditFormData, ToolEntry, AITool, UseCase } from "@/types";

const TOOL_OPTIONS: { value: AITool; label: string; icon: string }[] = [
  { value: "cursor", label: "Cursor", icon: "⌨️" },
  { value: "github_copilot", label: "GitHub Copilot", icon: "🐙" },
  { value: "claude", label: "Claude", icon: "🤖" },
  { value: "chatgpt", label: "ChatGPT", icon: "💬" },
  { value: "anthropic_api", label: "Anthropic API", icon: "🔌" },
  { value: "openai_api", label: "OpenAI API", icon: "🔌" },
  { value: "gemini", label: "Gemini", icon: "✨" },
  { value: "windsurf", label: "Windsurf", icon: "🏄" },
];

const PLAN_OPTIONS: Record<AITool, string[]> = {
  cursor: ["Hobby", "Pro", "Business"],
  github_copilot: ["Individual", "Business", "Enterprise"],
  claude: ["Free", "Pro", "Max", "Team", "Enterprise"],
  chatgpt: ["Plus", "Team", "Enterprise"],
  anthropic_api: ["Pay as you go"],
  openai_api: ["Pay as you go"],
  gemini: ["Free", "Advanced", "Business"],
  windsurf: ["Free", "Pro", "Teams"],
};

const USE_CASE_OPTIONS: { value: UseCase; label: string; icon: string }[] = [
  { value: "coding", label: "Coding", icon: "💻" },
  { value: "writing", label: "Writing", icon: "✍️" },
  { value: "data", label: "Data Analysis", icon: "📊" },
  { value: "research", label: "Research", icon: "🔬" },
  { value: "mixed", label: "Mixed / General", icon: "🔀" },
];

const emptyTool = (): ToolEntry => ({
  tool: "cursor",
  plan: "Pro",
  monthlySpend: 0,
  seats: 1,
});

const inputClass =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 focus:bg-white/8 transition-all";

const selectClass =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 transition-all appearance-none cursor-pointer";

export default function SpendForm() {
  const router = useRouter();
  const [tools, setTools] = useState<ToolEntry[]>([emptyTool()]);
  const [teamSize, setTeamSize] = useState<number>(1);
  const [useCase, setUseCase] = useState<UseCase>("coding");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("spendlens_form");
    if (saved) {
      const parsed = JSON.parse(saved) as AuditFormData;
      setTools(parsed.tools);
      setTeamSize(parsed.teamSize);
      setUseCase(parsed.useCase);
    }
  }, []);

  useEffect(() => {
    const formData: AuditFormData = { tools, teamSize, useCase };
    localStorage.setItem("spendlens_form", JSON.stringify(formData));
  }, [tools, teamSize, useCase]);

  const addTool = () => setTools([...tools, emptyTool()]);

  const removeTool = (index: number) =>
    setTools(tools.filter((_, i) => i !== index));

  const updateTool = (
    index: number,
    field: keyof ToolEntry,
    value: string | number
  ) => {
    const updated = [...tools];
    if (field === "tool") {
      updated[index] = {
        ...updated[index],
        tool: value as AITool,
        plan: PLAN_OPTIONS[value as AITool][0],
      };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setTools(updated);
  };

  const handleSubmit = async () => {
    if (tools.length === 0) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tools, teamSize, useCase }),
      });
      const data = await res.json();
      router.push(`/results/${data.id}`);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">

      {/* Tool rows */}
      {tools.map((entry, index) => {
        const toolInfo = TOOL_OPTIONS.find((t) => t.value === entry.tool);
        return (
          <div
            key={index}
            className="bg-white/[0.03] border border-white/8 rounded-2xl p-5 space-y-4 backdrop-blur-sm"
          >
            {/* Row header */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-lg">{toolInfo?.icon}</span>
                <span className="text-sm font-medium text-white/60">
                  Tool {index + 1}
                </span>
              </div>
              {tools.length > 1 && (
                <button
                  onClick={() => removeTool(index)}
                  className="text-xs text-red-400/60 hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-red-400/10"
                >
                  Remove
                </button>
              )}
            </div>

            {/* Tool + Plan side by side */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-white/40 mb-1.5 font-medium uppercase tracking-wider">
                  AI Tool
                </label>
                <select
                  value={entry.tool}
                  onChange={(e) => updateTool(index, "tool", e.target.value)}
                  className={selectClass}
                >
                  {TOOL_OPTIONS.map((opt) => (
                    <option
                      key={opt.value}
                      value={opt.value}
                      className="bg-gray-900"
                    >
                      {opt.icon} {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1.5 font-medium uppercase tracking-wider">
                  Plan
                </label>
                <select
                  value={entry.plan}
                  onChange={(e) => updateTool(index, "plan", e.target.value)}
                  className={selectClass}
                >
                  {PLAN_OPTIONS[entry.tool].map((plan) => (
                    <option key={plan} value={plan} className="bg-gray-900">
                      {plan}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Seats + Spend side by side */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-white/40 mb-1.5 font-medium uppercase tracking-wider">
                  Seats
                </label>
                <input
                  type="number"
                  min={1}
                  value={entry.seats}
                  onChange={(e) =>
                    updateTool(index, "seats", parseInt(e.target.value))
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1.5 font-medium uppercase tracking-wider">
                  Monthly Spend ($)
                </label>
                <input
                  type="number"
                  min={0}
                  value={entry.monthlySpend}
                  onChange={(e) =>
                    updateTool(
                      index,
                      "monthlySpend",
                      parseFloat(e.target.value)
                    )
                  }
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        );
      })}

      {/* Add Tool button */}
      <button
        onClick={addTool}
        className="w-full border border-dashed border-white/10 hover:border-emerald-500/40 rounded-2xl py-3.5 text-white/30 hover:text-emerald-400 transition-all text-sm font-medium hover:bg-emerald-500/5"
      >
        + Add Another Tool
      </button>

      {/* Team size + use case */}
      <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5 space-y-4 backdrop-blur-sm">
        <div>
          <label className="block text-xs text-white/40 mb-1.5 font-medium uppercase tracking-wider">
            Team Size
          </label>
          <input
            type="number"
            min={1}
            value={teamSize}
            onChange={(e) => setTeamSize(parseInt(e.target.value))}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs text-white/40 mb-1.5 font-medium uppercase tracking-wider">
            Primary Use Case
          </label>
          <select
            value={useCase}
            onChange={(e) => setUseCase(e.target.value as UseCase)}
            className={selectClass}
          >
            {USE_CASE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-gray-900">
                {opt.icon} {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full relative overflow-hidden rounded-2xl py-4 text-base font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
        style={{
          background: isLoading
            ? "#1f2937"
            : "linear-gradient(135deg, #10b981, #059669)",
          color: isLoading ? "#6b7280" : "#000000",
        }}
      >
        <span className="relative z-10">
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              Analyzing your stack...
            </span>
          ) : (
            "Get My Free Audit →"
          )}
        </span>
      </button>

      <p className="text-center text-xs text-white/20">
        No account needed · Results in seconds · 100% free
      </p>
    </div>
  );
}