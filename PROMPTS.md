# Prompts

This file documents all LLM prompts used in SpendLens,
why they were written this way, and what didn't work.

## Prompt 1 — Audit Summary Generator

**Used in:** `src/app/api/summary/route.ts`
**Model:** claude-sonnet-4-20250514
**Purpose:** Generate a personalized 100-word audit summary
for the user based on their specific tool stack and savings.

### Full prompt:

You are an AI spend analyst. Write a concise, personalized 
100-word audit summary for a team.

Here is their data:
- Team size: ${teamSize} people
- Primary use case: ${useCase}
- Total monthly savings identified: $${totalMonthlySavings}
- Tool recommendations: ${JSON.stringify(recommendations)}

Write the summary in second person ("Your team..."). 
Be specific about their situation.
Be honest — if savings are low, say they're spending well.
End with one actionable next step.
Keep it under 100 words.
No bullet points — just one flowing paragraph.

### Why I wrote it this way:

- **Second person ("Your team...")** makes it feel personal
and specific, not generic. Users should feel like this was
written for them.
- **"Be honest"** explicitly tells the model not to
manufacture savings. Without this, the model tends to
oversell optimization opportunities.
- **"No bullet points"** — the summary sits in a card on
the results page. Flowing prose looks better than a list
in that context.
- **"End with one actionable next step"** gives the user
something concrete to do, which increases engagement and
lead conversion.
- **Injecting actual data** — passing real numbers and
recommendations into the prompt ensures the summary is
genuinely personalized, not templated.

### What I tried that didn't work:

Attempt 1 — Asked the model to write a "detailed analysis"
and it produced 400+ words that overwhelmed the results page.
Switched to explicitly saying "100 words" and "one paragraph."

Attempt 2 — Didn't include the actual recommendations data
in the prompt so the model produced generic summaries not
specific to the user's stack. Added JSON.stringify to fix this.

Attempt 3 — Used "you are overspending" framing which felt
pushy and inaccurate for users already spending optimally.
Changed to "be honest" framing which handles both cases
gracefully.

### Fallback behavior:

If the Anthropic API fails due to timeout or rate limit,
the app falls back to a templated summary:

"Based on your current AI tool stack, we identified 
$X/month in potential savings. Your team has room to 
optimize without losing capability."

This ensures the results page never breaks even if the
AI call fails. Documented in src/app/api/audit/route.ts.

## Note on audit engine

The audit engine itself uses hardcoded rules and NOT AI.
This was a deliberate decision. The audit math needs to be
financially defensible and consistent. AI-generated audit
logic would be unpredictable and hard to verify.
Knowing when NOT to use AI is part of good engineering
judgment.