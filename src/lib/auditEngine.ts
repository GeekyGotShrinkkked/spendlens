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
        "Individual plan is meant for solo use. With multiple seats, Business gives you p