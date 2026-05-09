// This route calls the Anthropic API
// to generate a personalized 100-word summary
// of the user's audit results

import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { recommendations, totalMonthlySavings, useCase, teamSize } =
      await req.json();

    // Build a prompt with the user's actual data
    const prompt = `You are an AI spend analyst. Write a concise, personalized 100-word audit summary for a team.

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
No bullet points — just one flowing paragraph.`;

    // Call Anthropic API
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }],
    });

    // Extract the text from the response
    const summary =
      message.content[0].type === "text" ? message.content[0].text : "";

    return NextResponse.json({ summary });

  } catch (err) {
    console.error("Summary error:", err);
    // Return fallback so the app doesn't break
    return NextResponse.json(
      { summary: "We analyzed your AI tool stack and identified optimization opportunities. Review the recommendations below to see where your team can save." },
      { status: 200 }
    );
  }
}