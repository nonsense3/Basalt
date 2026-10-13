import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { COMMANDS, systemPromptFor, type CommandId } from "@/lib/commands";

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

    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Missing GOOGLE_AI_API_KEY. Add it in .env (or Render env vars) to call Gemma.",
        },
        { status: 503 }
      );
    }

    const modelName = process.env.GEMMA_MODEL || "gemma-3-12b-it";
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName });

    // Gemma variants via Google AI may ignore systemInstruction — fold it into the user turn.
    const prompt = `${systemPromptFor(command)}

Command: ${command}

Freelancer notes:
${notes}`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.55,
        maxOutputTokens: 2048,
      },
    });


    const text = result.response.text()?.trim();
    if (!text) {
      return NextResponse.json(
        { error: "Gemma returned an empty response. Try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      text,
      model: modelName,
      command,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unexpected error calling Gemma.";
    console.error("[basalt/generate]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
