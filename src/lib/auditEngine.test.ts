import { runAudit } from "./auditEngine";

// ---- TEST 1 ----
// Cursor Business with small team should trigger downgrade
test("Cursor Business with 3 seats should recommend downgrade to Pro", () => {
  const result = runAudit({
    tools: [{ tool: "cursor", plan: "Business", monthlySpend: 120, seats: 3 }],
    teamSize: 3,
    useCase: "coding",
  });

  expect(result.recommendations[0].recommendedAction).toBe("Downgrade to Pro");
  expect(result.recommendations[0].monthlySavings).toBe(60);
});

// ---- TEST 2 ----
// Optimal setup should show zero savings
test("Cursor Pro with coding use case should show no savings", () => {
  const result = runAudit({
    tools: [{ tool: "cursor", plan: "Pro", monthlySpend: 20, seats: 1 }],
    teamSize: 1,
    useCase: "coding",
  });

  expect(result.recommendations[0].monthlySavings).toBe(0);
  expect(result.totalMonthlySavings).toBe(0);
});

// ---- TEST 3 ----
// Claude Team with less than 5 seats should recommend Pro
test("Claude Team with 2 seats should recommend switching to Pro", () => {
  const result = runAudit({
    tools: [{ tool: "claude", plan: "Team", monthlySpend: 60, seats: 2 }],
    teamSize: 2,
    useCase: "writing",
  });

  expect(result.recommendations[0].recommendedAction).toBe(
    "Switch to Pro per person"
  );
  expect(result.recommendations[0].monthlySavings).toBeGreaterThan(0);
});

// ---- TEST 4 ----
// Annual savings should always be monthly x 12
test("Annual savings should equal monthly savings times 12", () => {
  const result = runAudit({
    tools: [{ tool: "cursor", plan: "Business", monthlySpend: 120, seats: 3 }],
    teamSize: 3,
    useCase: "coding",
  });

  expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12);
});

// ---- TEST 5 ----
// Multiple tools should add up total savings correctly
test("Multiple tools savings should add up correctly", () => {
  const result = runAudit({
    tools: [
      { tool: "cursor", plan: "Business", monthlySpend: 120, seats: 3 },
      { tool: "claude", plan: "Team", monthlySpend: 60, seats: 2 },
    ],
    teamSize: 3,
    useCase: "coding",
  });

  const expectedTotal = result.recommendations.reduce(
    (sum, rec) => sum + rec.monthlySavings,
    0
  );

  expect(result.totalMonthlySavings).toBe(expectedTotal);
});

// ---- TEST 6 ----
// GitHub Copilot Individual with multiple seats should flag issue
test("GitHub Copilot Individual with 3 seats should recommend Business", () => {
  const result = runAudit({
    tools: [
      { tool: "github_copilot", plan: "Individual", monthlySpend: 30, seats: 3 },
    ],
    teamSize: 3,
    useCase: "coding",
  });

  expect(result.recommendations[0].recommendedAction).toBe(
    "Switch to Business plan"
  );
});