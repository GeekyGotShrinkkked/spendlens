// This route handles email capture
// It saves the lead to Supabase
// and sends a confirmation email via Resend

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    // Step 1: Get the lead data from request
    const { email, companyName, role, auditId } = await req.json();

    // Step 2: Basic validation
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Step 3: Save lead to Supabase
    const { error: dbError } = await supabase
      .from("leads")
      .insert({
        email,
        company_name: companyName || null,
        role: role || null,
        audit_id: auditId,
      });

    if (dbError) {
      console.error("DB error:", dbError);
      return NextResponse.json(
        { error: "Failed to save lead" },
        { status: 500 }
      );
    }

    // Step 4: Fetch the audit to get savings numbers
    const { data: audit } = await supabase
      .from("audits")
      .select("total_monthly_savings, total_annual_savings")
      .eq("id", auditId)
      .single();

    const monthlySavings = audit?.total_monthly_savings ?? 0;
    const annualSavings = audit?.total_annual_savings ?? 0;

    // Step 5: Send confirmation email via Resend
    await resend.emails.send({
      from: "SpendLens <onboarding@resend.dev>",
      to: email,
      subject: "Your SpendLens AI Audit Report",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #0a0a0a; color: #ffffff;">
          
          <h1 style="color: #34d399; font-size: 24px; margin-bottom: 8px;">
            SpendLens
          </h1>
          <p style="color: #9ca3af; margin-bottom: 32px;">
            Your AI Spend Audit Report
          </p>

          ${monthlySavings > 0 ? `
          <div style="background: #064e3b; border: 1px solid #059669; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <p style="color: #9ca3af; margin: 0 0 8px 0; font-size: 14px;">
              Potential monthly savings
            </p>
            <p style="color: #34d399; font-size: 48px; font-weight: 900; margin: 0;">
              $${monthlySavings.toFixed(0)}
            </p>
            <p style="color: #d1fae5; margin: 8px 0 0 0;">
              $${annualSavings.toFixed(0)} per year
            </p>
          </div>
          ` : `
          <div style="background: #1f2937; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <p style="color: #34d399; font-size: 20px; font-weight: bold; margin: 0;">
              ✅ You're spending well
            </p>
            <p style="color: #9ca3af; margin: 8px 0 0 0;">
              Your AI stack is already optimized
            </p>
          </div>
          `}

          <p style="color: #d1d5db; line-height: 1.6; margin-bottom: 24px;">
            Hi${companyName ? ` from ${companyName}` : ""},
            <br/><br/>
            Thanks for using SpendLens to audit your AI tool spend.
            View your full audit report at the link below.
            ${monthlySavings > 500 ? " Given your savings opportunity, a member of the Credex team may reach out to help you capture more of that savings." : ""}
          </p>

          <a 
            href="${process.env.NEXT_PUBLIC_APP_URL}/results/${auditId}"
            style="display: inline-block; background: #10b981; color: #000000; font-weight: bold; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-bottom: 32px;"
          >
            View Full Audit Report →
          </a>

          <hr style="border: none; border-top: 1px solid #1f2937; margin: 24px 0;" />
          
          <p style="color: #6b7280; font-size: 12px;">
            SpendLens is a free tool by Credex — discounted AI infrastructure credits.
            <br/>
            <a href="https://credex.rocks" style="color: #34d399;">credex.rocks</a>
          </p>

        </div>
      `,
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Lead error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}