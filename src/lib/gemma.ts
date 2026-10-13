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
  const markers = [
    /\n(?=INVOICE\b)/i,
    /\n(?=BILL TO:)/i,
    /\n(?=Subject:)/i,
    /\n(?=## )/,
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

function isRetryable(message: string): boolean {
  return /500|503|429|Internal error|unavailable|timeout|ECONNRESET|fetch failed/i.test(
    message
  );
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateOnce(
  genAI: GoogleGenerativeAI,
  modelName: string,
  prompt: string
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: modelName });
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.55,
      maxOutputTokens: 2048,
    },
  });
  return cleanModelOutput(result.response.text() ?? "");
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
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const text = await generateOnce(genAI, modelName, prompt);
        if (!text) {
          lastError = `${modelName} returned empty text.`;
          break;
        }
        return { text, model: modelName };
      } catch (err) {
        lastError = err instanceof Error ? err.message : String(err);

        if (/404|not found|not supported/i.test(lastError)) {
          break; // try next model
        }

        if (isRetryable(lastError) && attempt < 2) {
          await sleep(600 * (attempt + 1));
          continue; // retry same model
        }

        if (isRetryable(lastError)) {
          break; // exhausted retries — try next Gemma model
        }

        throw new Error(lastError);
      }
    }
  }

  if (isRetryable(lastError)) {
    throw new Error(
      `Gemma is temporarily unavailable (Google 500). Wait a few seconds and try Run again. Details: ${lastError}`
    );
  }

  throw new Error(lastError);
}
