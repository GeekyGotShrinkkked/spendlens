import { AITool, UseCase } from "@/types";

export interface PlanInfo {
  name: string;
  pricePerSeat: number;
  minSeats: number;
  maxSeats: number | null;
  bestFor: UseCase[];
  features: string[];
}

export interface ToolPricing {
  tool: AITool;
  displayName: string;
  plans: PlanInfo[];
}

export const PRICING_DATA: ToolPricing[] = [
  {
    tool: "cursor",
    displayName: "Cursor",
    plans: [
      {
        name: "Hobby",
        pricePerSeat: 0,
        minSeats: 1,
        maxSeats: 1,
        bestFor: ["coding"],
        features: ["2000 completions/month", "50 slow requests"],
      },
      {
        name: "Pro",
        pricePerSeat: 20,
        minSeats: 1,
        maxSeats: null,
        bestFor: ["coding"],
        features: ["Unlimited completions", "500 fast requests"],
      },
      {
        name: "Business",
        pricePerSeat: 40,
        minSeats: 1,
        maxSeats: null,
        bestFor: ["coding"],
        features: ["Everything in Pro", "Admin dashboard", "SSO"],
      },
    ],
  },
  {
    tool: "github_copilot",
    displayName: "GitHub Copilot",
    plans: [
      {
        name: "Individual",
        pricePerSeat: 10,
        minSeats: 1,
        maxSeats: 1,
        bestFor: ["coding"],
        features: ["Code completions", "Chat in IDE"],
      },
      {
        name: "Business",
        pricePerSeat: 19,
        minSeats: 1,
        maxSeats: null,
        bestFor: ["coding"],
        features: ["Everything in Individual", "Policy management"],
      },
      {
        name: "Enterprise",
        pricePerSeat: 39,
        minSeats: 1,
        maxSeats: null,
        bestFor: ["coding"],
        features: ["Everything in Business", "Fine tuning"],
      },
    ],
  },
  {
    tool: "claude",
    displayName: "Claude",
    plans: [
      {
        name: "Free",
        pricePerSeat: 0,
        minSeats: 1,
        maxSeats: 1,
        bestFor: ["writing", "research", "mixed"],
        features: ["Limited messages", "Claude 3.5 Sonnet"],
      },
      {
        name: "Pro",
        pricePerSeat: 20,
        minSeats: 1,
        maxSeats: 1,
        bestFor: ["writing", "research", "mixed"],
        features: ["5x more usage", "Priority access"],
      },
      {
        name: "Max",
        pricePerSeat: 100,
        minSeats: 1,
        maxSeats: 1,
        bestFor: ["writing", "research", "mixed"],
        features: ["20x more usage", "Priority access"],
      },
      {
        name: "Team",
        pricePerSeat: 30,
        minSeats: 5,
        maxSeats: null,
        bestFor: ["writing", "research", "mixed"],
        features: ["Everything in Pro", "Admin dashboard", "Min 5 seats"],
      },
      {
        name: "Enterprise",
        pricePerSeat: 60,
        minSeats: 1,
        maxSeats: null,
        bestFor: ["writing", "research", "mixed"],
        features: ["Custom limits", "SSO", "Audit logs"],
      },
    ],
  },
  {
    tool: "chatgpt",
    displayName: "ChatGPT",
    plans: [
      {
        name: "Plus",
        pricePerSeat: 20,
        minSeats: 1,
        maxSeats: 1,
        bestFor: ["writing", "research", "mixed"],
        features: ["GPT-4o access", "DALL-E", "Advanced data analysis"],
      },
      {
        name: "Team",
        pricePerSeat: 30,
        minSeats: 2,
        maxSeats: null,
        bestFor: ["writing", "research", "mixed"],
        features: ["Everything in Plus", "Admin console", "Min 2 seats"],
      },
      {
        name: "Enterprise",
        pricePerSeat: 60,
        minSeats: 1,
        maxSeats: null,
        bestFor: ["writing", "research", "mixed"],
        features: ["Custom limits", "SSO", "Advanced security"],
      },
    ],
  },
  {
    tool: "anthropic_api",
    displayName: "Anthropic API",
    plans: [
      {
        name: "Pay as you go",
        pricePerSeat: 0,
        minSeats: 1,
        maxSeats: null,
        bestFor: ["coding", "writing", "data", "research", "mixed"],
        features: ["Claude 3.5 Sonnet: $3/MTok input", "Pay per token"],
      },
    ],
  },
  {
    tool: "openai_api",
    displayName: "OpenAI API",
    plans: [
      {
        name: "Pay as you go",
        pricePerSeat: 0,
        minSeats: 1,
        maxSeats: null,
        bestFor: ["coding", "writing", "data", "research", "mixed"],
        features: ["GPT-4o: $5/MTok input", "Pay per token"],
      },
    ],
  },
  {
    tool: "gemini",
    displayName: "Gemini",
    plans: [
      {
        name: "Free",
        pricePerSeat: 0,
        minSeats: 1,
        maxSeats: 1,
        bestFor: ["writing", "research", "mixed"],
        features: ["Gemini 1.5 Flash", "Limited requests"],
      },
      {
        name: "Advanced",
        pricePerSeat: 20,
        minSeats: 1,
        maxSeats: 1,
        bestFor: ["writing", "research", "mixed"],
        features: ["Gemini Ultra", "2TB storage", "Google One benefits"],
      },
      {
        name: "Business",
        pricePerSeat: 30,
        minSeats: 1,
        maxSeats: null,
        bestFor: ["writing", "research", "mixed"],
        features: ["Gemini for Workspace", "Admin controls"],
      },
    ],
  },
  {
    tool: "windsurf",
    displayName: "Windsurf",
    plans: [
      {
        name: "Free",
        pricePerSeat: 0,
        minSeats: 1,
        maxSeats: 1,
        bestFor: ["coding"],
        features: ["Limited credits", "Basic completions"],
      },
      {
        name: "Pro",
        pricePerSeat: 15,
        minSeats: 1,
        maxSeats: null,
        bestFor: ["coding"],
        features: ["Unlimited completions", "Priority access"],
      },
      {
        name: "Teams",
        pricePerSeat: 30,
        minSeats: 1,
        maxSeats: null,
        bestFor: ["coding"],
        features: ["Everything in Pro", "Admin dashboard"],
      },
    ],
  },
];

export const getToolPricing = (tool: AITool): ToolPricing | undefined => {
  return PRICING_DATA.find((p) => p.tool === tool);
};

export const getPlanInfo = (
  tool: AITool,
  planName: string
): PlanInfo | undefined => {
  const toolPricing = getToolPricing(tool);
  return toolPricing?.plans.find(
    (p) => p.name.toLowerCase() === planName.toLowerCase()
  );
};