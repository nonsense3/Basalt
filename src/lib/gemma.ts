import { GoogleGenerativeAI } from "@google/generative-ai";

/** Models known to support generateContent on Google AI Studio (as of Oct 2026). */
export const DEFAULT_GEMMA_MODEL = "gemma-4-26b-a4b-it";

export const GEMMA_FALLBACKS = [
  "gemma-4-26b-a4b-it",
  "gemma-4-31b-it",
] as const;

/** Strip accidental chain-of-thought if the model leaks planning text. */
export function cleanModelOutput(raw: string): string {
  let text = raw.trim();
  // Drop leading planning blocks that end before a clear document header
  const markers = [
    /\n(?=INVOICE\b)/i,
    /\n(?=BILL TO:)/i,
    /\n(?=Subject:)/i,
    /\n(?=## )/ ,
    /\n(?=Proposal\b)/i,
    /\n(?=Goals\b)/i,
  ];
  for (const marker of markers) {
    const match = marker.exec(text);
    if (match && match.index > 80) {
      const candidate = text.slice(match.index).trim();
      if (candidate.length > 40) {
        text = candidate;
        break;
      }
    }
  }
  // Remove common preamble lines
  text = text.replace(/^(okay[,.]?\s*)+/i, "").trim();
  return text;
}

export function getApiKey(): string | undefined {
  return (
    process.env.GOOGLE_AI_API_KEY?.trim() ||
    process.env.GEMINI_API_KEY?.trim() ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim() ||
    undefined
  );
}

export function preferredModels(): string[] {
  const preferred = process.env.GEMMA_MODEL?.trim();
  const list = preferred
    ? [preferred, ...GEMMA_FALLBACKS.filter((m) => m !== preferred)]
    : [...GEMMA_FALLBACKS];
  return Array.from(new Set(list));
}

export async function generateWithGemma(prompt: string): Promise<{
  text: string;
  model: string;
}> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error(
      "Missing GOOGLE_AI_API_KEY. Add it in .env (local) or Render Environment."
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const models = preferredModels();
  let lastError = "No Gemma model available.";

  for (const modelName of models) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.55,
          maxOutputTokens: 2048,
        },
      });
      const text = cleanModelOutput(result.response.text() ?? "");
      if (!text) {
        lastError = `${modelName} returned empty text.`;
        continue;
      }
      return { text, model: modelName };
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      // Try next fallback on 404 / unsupported model
      if (/404|not found|not supported/i.test(lastError)) continue;
      throw err;
    }
  }

  throw new Error(lastError);
}
