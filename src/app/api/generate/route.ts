import { NextRequest, NextResponse } from "next/server";
import { COMMANDS, systemPromptFor, type CommandId } from "@/lib/commands";
import { generateWithGemma } from "@/lib/gemma";

export const runtime = "nodejs";

const VALID = new Set(COMMANDS.map((c) => c.id));

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      command?: string;
      notes?: string;
    };

    const command = body.command as CommandId | undefined;
    const notes = (body.notes ?? "").trim();

    if (!command || !VALID.has(command)) {
      return NextResponse.json(
        { error: "Unknown command. Use invoice, proposal, followup, or scope." },
        { status: 400 }
      );
    }

    if (notes.length < 8) {
      return NextResponse.json(
        { error: "Add a bit more context so Gemma has something to work with." },
        { status: 400 }
      );
    }

    const prompt = `${systemPromptFor(command)}

Command: ${command}

Freelancer notes:
${notes}`;

    const { text, model } = await generateWithGemma(prompt);

    return NextResponse.json({
      text,
      model,
      command,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unexpected error calling Gemma.";
    console.error("[basalt/generate]", message);
    const status = /Missing GOOGLE_AI_API_KEY/i.test(message) ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
