export type AITool =
  | "cursor"
  | "github_copilot"
  | "claude"
  | "chatgpt"
  | "anthropic_api"
  | "openai_api"
  | "gemini"
  | "windsurf";

export type UseCase =
  | "coding"
  | "writing"
  | "data"
  | "research"
  | "mixed";

export interface ToolEntry {
  tool: AITool;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditFormData {
  tools: ToolEntry[];
  teamSize: number;
  useCase: UseCase;
}

export interface ToolRecommendation {
  tool: AITool;
  currentPlan: string;
  currentSpend: number;
  recommendedAction: string;
  recommendedPlan: string | null;
  estimatedSpend: number;
  monthlySavings: number;
  reason: string;
}

export interface AuditResult {
  id: string;
  formData: AuditFormData;
  recommendations: ToolRecommendation[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  aiSummary: string;
  createdAt: string;
}

export interface LeadData {
  email: string;
  companyName?: string;
  role?: string;
  teamSize?: number;
  auditId: string;
}