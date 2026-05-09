"use client"; // this tells Next.js this runs in the browser

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuditFormData, ToolEntry, AITool, UseCase } from "@/types";

// ---- DROPDOWN OPTIONS ----
// These are the options users see in the dropdowns

const TOOL_OPTIONS: { value: AITool; label: string }[] = [
  { value: "cursor", label: "Cursor" },
  { value: "github_copilot", label: "GitHub Copilot" },
  { value: "claude", label: "Claude" },
  { value: "chatgpt", label: "ChatGPT" },
  { value: "anthropic_api", label: "Anthropic API" },
  { value: "openai_api", label: "OpenAI API" },
  { value: "gemini", label: "Gemini" },
  { value: "windsurf", label: "Windsurf" },
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

const USE_CASE_OPTIONS: { value: UseCase; label: string }[] = [
  { value: "coding", label: "Coding" },
  { value: "writing", label: "Writing" },
  { value: "data", label: "Data Analysis" },
  { value: "research", label: "Research" },
  { value: "mixed", label: "Mixed / General" },
];

// ---- EMPTY TOOL TEMPLATE ----
// When user clicks "Add Tool" we add one of these
const emptyTool = (): ToolEntry => ({
  tool: "cursor",
  plan: "Pro",
  monthlySpend: 0,
  seats: 1,
});

// ---- MAIN COMPONENT ----
export default function SpendForm() {
  const router = useRouter();

  // tools = the list of tools user has added
  const [tools, setTools] = useState<ToolEntry[]>([emptyTool()]);

  // teamSize = how many people in their team
  const [teamSize, setTeamSize] = useState<number>(1);

  // useCase = what they mainly use AI for
  const [useCase, setUseCase] = useState<UseCase>("coding");

  // isLoading = show loading state when form is submitted
  const [isLoading, setIsLoading] = useState(false);

  // ---- LOAD FROM LOCALSTORAGE ----
  // When page loads, check if user has saved data
  // If yes, fill the form with their saved data
  useEffect(() => {
    const saved = localStorage.getItem("spendlens_form");
    if (saved) {
      const parsed = JSON.parse(saved) as AuditFormData;
      setTools(parsed.tools);
      setTeamSize(parsed.teamSize);
      setUseCase(parsed.useCase);
    }
  }, []); // empty [] means run only once when page loads

  // ---- SAVE TO LOCALSTORAGE ----
  // Every time tools, teamSize or useCase changes,
  // automatically save to localStorage
  useEffect(() => {
    const formData: AuditFormData = { tools, teamSize, useCase };
    localStorage.setItem("spendlens_form", JSON.stringify(formData));
  }, [tools, teamSize, useCase]); // run whenever these change

  // ---- TOOL HANDLERS ----
  // These functions handle adding, removing, updating tools

  // Add a new empty tool row
  const addTool = () => {
    setTools([...tools, emptyTool()]);
  };

  // Remove a tool row by its index
  const removeTool = (index: number) => {
    setTools(tools.filter((_, i) => i !== index));
  };

  // Update a specific field of a specific tool
  // index = which tool, field = which field, value = new value
  const updateTool = (
    index: number,
    field: keyof ToolEntry,
    value: string | number,
  ) => {
    const updated = [...tools];

    if (field === "tool") {
      // When tool changes, reset plan to first available plan
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

  // ---- FORM SUBMIT ----
  // When user clicks "Get My Audit"
  const handleSubmit = async () => {
    // Basic check — make sure at least one tool is added
    if (tools.length === 0) {
      alert("Please add at least one AI tool.");
      return;
    }

    setIsLoading(true);

    try {
      // Send form data to our API route
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tools, teamSize, useCase }),
      });

      const data = await res.json();

      // Go to results page with the audit ID
      router.push(`/results/${data.id}`);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  // ---- RENDER ----
  // This is what the user actually sees
  return (
    <div className="space-y-6">
      {/* Tool rows */}
      {tools.map((entry, index) => (
        <div
          key={index}
          className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4"
        >
          {/* Row header */}
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-400">
              Tool {index + 1}
            </span>
            {/* Only show remove button if more than 1 tool */}
            {tools.length > 1 && (
              <button
                onClick={() => removeTool(index)}
                className="text-red-400 text-sm hover:text-red-300"
              >
                Remove
              </button>
            )}
          </div>

          {/* Tool selector */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">AI Tool</label>
            <select
              value={entry.tool}
              onChange={(e) => updateTool(index, "tool", e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
            >
              {TOOL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Plan selector */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Current Plan
            </label>
            <select
              value={entry.plan}
              onChange={(e) => updateTool(index, "plan", e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
            >
              {PLAN_OPTIONS[entry.tool].map((plan) => (
                <option key={plan} value={plan}>
                  {plan}
                </option>
              ))}
            </select>
          </div>

          {/* Seats and Monthly Spend side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Number of Seats
              </label>
              <input
                type="number"
                min={1}
                value={entry.seats}
                onChange={(e) =>
                  updateTool(index, "seats", parseInt(e.target.value))
                }
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Monthly Spend ($)
              </label>
              <input
                type="number"
                min={0}
                value={entry.monthlySpend}
                onChange={(e) =>
                  updateTool(index, "monthlySpend", parseFloat(e.target.value))
                }
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>
      ))}

      {/* Add Tool button */}
      <button
        onClick={addTool}
        className="w-full border border-dashed border-gray-700 rounded-xl py-3 text-gray-400 hover:border-emerald-500 hover:text-emerald-400 transition-colors"
      >
        + Add Another Tool
      </button>

      {/* Team size and use case */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Team Size (total people)
          </label>
          <input
            type="number"
            min={1}
            value={teamSize}
            onChange={(e) => setTeamSize(parseInt(e.target.value))}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
          />
        </div>
         <div>
          <label className="block text-sm text-gray-400 mb-1">
            Primary Use Case
          </label>
          <select
            value={useCase}
            onChange={(e) => setUseCase(e.target.value as UseCase)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
          >
            {USE_CASE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-gray-700 disabled:text-gray-500 text-black font-bold rounded-xl py-4 text-lg transition-colors"
      >
        {isLoading ? "Analyzing your stack..." : "Get My Free Audit →"}
      </button>
    </div>
  );
}
