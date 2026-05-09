import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import ResultsClient from "@/components/ResultsClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ResultsPage({ params }: Props) {
  // Await params — required in newer Next.js versions
  const { id } = await params;

  const { data, error } = await supabase
    .from("audits")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  return <ResultsClient audit={data} />;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;

  const { data } = await supabase
    .from("audits")
    .select("total_monthly_savings")
    .eq("id", id)
    .single();

  const savings = data?.total_monthly_savings ?? 0;

  return {
    title: `SpendLens Audit — $${savings}/mo in potential savings`,
    description: `I just audited my AI tool stack and found $${savings}/month in savings. Check yours free.`,
    openGraph: {
      title: `SpendLens Audit — $${savings}/mo in potential savings`,
      description: `I just audited my AI tool stack and found $${savings}/month in savings. Check yours free.`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `SpendLens Audit — $${savings}/mo in potential savings`,
      description: `I just audited my AI tool stack and found $${savings}/month in savings. Check yours free.`,
    },
  };
}