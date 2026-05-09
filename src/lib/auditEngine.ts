// This file is the brain of SpendLens
// It takes what the user entered and figures out:
// 1. Are they overpaying?
// 2. What should they switch to?
// 3. How much can they save?

import { AuditFormData, ToolRecommendation, AITool } from "@/types";

// This function checks one tool at a time
// and returns a recommendation for it
function auditSingleTool(
  tool: AITool,
  plan: string,
  monthlySpend: number,
  seats: number,
  teamSize: number,
  useCase: string
): ToolRecommendation {

  // We'll store our recommendation here
  let recommendedAction = "No change needed";
  let recommendedPlan: string | null = plan;
  let estimatedSpend = monthlySpend;
  let reason = "Your current plan fits your usage well.";

  // ---- CURSOR RULES ----
  if (tool === "cursor") {
    if (plan === "Business" && seats <= 5) {
      recommendedAction = "Downgrade to Pro";
      recommendedPlan = "Pro";
      estimatedSpend = seats * 20;
      reason =
        "Cursor Business adds SSO and admin features you likely don't need under 5 seats. Pro gives the same coding experience at half the price.";
    } else if (plan === "Pro" && useCase !== "coding") {
      recommendedAction = "Consider switching";
      recommendedPlan = null;
      estimatedSpend = 0;
      reason =
        "Cursor is built for coding. For your use case, Claude Pro or ChatGPT Plus would serve you better at the same price.";
    }
  }

  // ---- GITHUB COPILOT RULES ----
  if (tool === "github_copilot") {
    if (plan === "Enterprise" && seats <= 10) {
      recommendedAction = "Downgrade to Business";
      recommendedPlan = "Business";
      estimatedSpend = seats * 19;
      reason =
        "Copilot Enterprise adds fine-tuning on private repos — valuable for large orgs, overkill under 10 seats. Business plan covers all core features.";
    }
    if (plan === "Individual" && seats > 1) {
      recommendedAction = "Switch to Business plan";
      recommendedPlan = "Business";
      estimatedSpend = seats * 19;
      reason =
        "Individual plan is meant for solo use. With multiple seats, Business gives you proper team management at only $9 more per seat.";
    }
  }

  // ---- CLAUDE RULES ----
  if (tool === "claude") {
    if (plan === "Team" && seats < 5) {
      recommendedAction = "Switch to Pro per person";
      recommendedPlan = "Pro";
      estimatedSpend = seats * 20;
      reason =
        "Claude Team has a 5-seat minimum. Under 5 users, individual Pro plans are cheaper and give the same features.";
    }
    if (plan === "Max" && useCase === "coding") {
      recommendedAction = "Switch to Pro";
      recommendedPlan = "Pro";
      estimatedSpend = seats * 20;
      reason =
        "Claude Max gives 20x usage limits — useful for heavy writers and researchers, but for coding workflows Pro limits are rarely hit.";
    }
    if (plan === "Enterprise" && seats <= 10) {
      recommendedAction = "Downgrade to Team";
      recommendedPlan = "Team";
      estimatedSpend = seats * 30;
      reason =
        "Claude Enterprise adds audit logs and custom retention — compliance features for large orgs. Under 10 seats, Team plan covers all practical needs.";
    }
  }

  // ---- CHATGPT RULES ----
  if (tool === "chatgpt") {
    if (plan === "Team" && seats < 5) {
      recommendedAction = "Switch to Plus per person";
      recommendedPlan = "Plus";
      estimatedSpend = seats * 20;
      reason =
        "ChatGPT Team costs $30/seat with a 2-seat minimum. Under 5 users, individual Plus plans at $20/seat give nearly identical features.";
    }
    if (plan === "Enterprise" && seats <= 15) {
      recommendedAction = "Downgrade to Team";
      recommendedPlan = "Team";
      estimatedSpend = seats * 30;
      reason =
        "ChatGPT Enterprise adds SSO and advanced security — worth it at 15+ seats, overkill below that. Team plan handles all core use cases.";
    }
  }

  // ---- GEMINI RULES ----
  if (tool === "gemini") {
    if (plan === "Advanced" && useCase === "coding") {
      recommendedAction = "Consider switching to Cursor or Copilot";
      recommendedPlan = null;
      estimatedSpend = seats * 10;
      reason =
        "Gemini Advanced is a general AI assistant. For coding specifically, Cursor Pro or GitHub Copilot Individual provide much better code completion at the same or lower price.";
    }
  }

  // ---- API DIRECT RULES ----
  if (tool === "anthropic_api" || tool === "openai_api") {
    if (monthlySpend > 500) {
      recommendedAction = "Explore Credex credits";
      recommendedPlan = "Credits via Credex";
      estimatedSpend = monthlySpend * 0.7;
      reason =
        "At this API spend level, sourcing credits through Credex typically saves 25-35% on the same infrastructure. Worth a consultation.";
    }
  }

  // Calculate how much they save
  const monthlySavings = monthlySpend - estimatedSpend;

  return {
    tool,
    currentPlan: plan,
    currentSpend: monthlySpend,
    recommendedAction,
    recommendedPlan,
    estimatedSpend,
    monthlySavings,
    reason,
  };
}

// This is the main function
// It loops through ALL tools the user entered
// and returns recommendations for each one
export function runAudit(formData: AuditFormData): {
  recommendations: ToolRecommendation[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
} {
  const recommendations = formData.tools.map((entry) =>
    auditSingleTool(
      entry.tool,
      entry.plan,
      entry.monthlySpend,
      entry.seats,
      formData.teamSize,
      formData.useCase
    )
  );

  // Add up all the savings
  const totalMonthlySavings = recommendations.reduce(
    (total, rec) => total + rec.monthlySavings,
    0
  );

  // Annual savings is just monthly x 12
  const totalAnnualSavings = totalMonthlySavings * 12;

  return {
    recommendations,
    totalMonthlySavings,
    totalAnnualSavings,
  };
}