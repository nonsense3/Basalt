import { NextResponse } from "next/server";
import { getApiKey, preferredModels } from "@/lib/gemma";

export const runtime = "nodejs";

export async function GET() {
  const configured = Boolean(getApiKey());
  return NextResponse.json({
    ok: true,
    gemmaConfigured: configured,
    models: preferredModels(),
  });
}
