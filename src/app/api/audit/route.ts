// This is the API route that handles audit submissions
// It receives form data, runs the audit, saves to DB
// and returns a unique ID for the results page

import { NextRequest, NextResponse } from "next/server";
import { runAudit } from "@/lib/auditEngine";
import { supabase } from "@/lib/supabase";
import { AuditFormData } from "@/types";

export async function POST(req: NextRequest) {
  try {
    // Step 1: Get the form data from the request
    const body = await req.json() as AuditFormData;

    // Step 2: Basic validation
    // Make sure they actually sent some tools
    if (!body.tools || body.tools.length === 0) {
      return NextResponse.json(
        { error: "Please add at least one tool" },
        { status: 400 }
      );
    }

    // Step 3: Run the audit engine
    // This is the brain — it calculates all savings
    const { recommendations, totalMonthlySavings, totalAnnualSavings } =
      runAudit(body);

    // Step 4: Generate AI summary
    // We call our own AI summary API route
    let aiSummary = "";
    try {
      const summaryRes = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/summary`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recommendations,
            totalMonthlySavings,
            totalAnnualSavings,
            useCase: body.useCase,
            teamSize: body.teamSize,
          }),
        }
      );
      const summaryData = await summaryRes.json();
      aiSummary = summaryData.summary;
    } catch {
      // If AI summary fails, use a fallback template
      // The assignment requires graceful fallback
      aiSummary = `Based on your current AI tool stack, we identified $${totalMonthlySavings.toFixed(0)}/month in potential savings. ${
        totalMonthlySavings > 0
          ? "Your team has room to optimize without losing capability."
          : "Your team is already spending efficiently."
      }`;
    }

    // Step 5: Save everything to Supabase
    const { data, error } = await supabase
      .from("audits")
      .insert({
        form_data: body,
        recommendations: recommendations,
        total_monthly_savings: totalMonthlySavings,
        total_annual_savings: totalAnnualSavings,
        ai_summary: aiSummary,
      })
      .select()
      .single();

    // If database save failed, return error
    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to save audit" },
        { status: 500 }
      );
    }

    // Step 6: Return the unique ID
    // The form uses this to redirect to /results/[id]
    return NextResponse.json({ id: data.id });

  } catch (err) {
    console.error("Audit error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}