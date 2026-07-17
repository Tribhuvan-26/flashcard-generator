import { FlashcardArraySchema, type Flashcard } from "./types";
import { extractJson } from "./extract";

// ponytail: single OpenAI-compatible provider. Swap base URL/model via env;
// add a provider registry here only when a second provider actually ships.
const BASE_URL = process.env.LLM_BASE_URL;
const API_KEY = process.env.LLM_API_KEY;
const MODEL = process.env.LLM_MODEL;

export class LLMError extends Error {
  status: number;
  constructor(message: string, status = 502) {
    super(message);
    this.status = status;
  }
}

function parseCards(text: string): Flashcard[] | null {
  try {
    return FlashcardArraySchema.parse(JSON.parse(extractJson(text)));
  } catch {
    return null;
  }
}

async function callOnce(prompt: string): Promise<string> {
  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), 60_000);
  try {
    const res = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      signal: ctrl.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.4,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (res.status === 429)
      throw new LLMError("Rate limited by the model provider. Try again shortly.", 429);
    if (!res.ok)
      throw new LLMError(`Model provider error (${res.status}).`, 502);

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (typeof content !== "string")
      throw new LLMError("Model returned an unexpected response shape.");
    return content;
  } catch (err) {
    if (err instanceof LLMError) throw err;
    if (err instanceof Error && err.name === "AbortError")
      throw new LLMError("The model request timed out. Try again.", 504);
    throw new LLMError("Network failure contacting the model provider.", 502);
  } finally {
    clearTimeout(timeout);
  }
}

export async function generateFlashcards(prompt: string): Promise<Flashcard[]> {
  if (!BASE_URL || !API_KEY || !MODEL)
    throw new LLMError("Server is missing LLM configuration.", 500);

  // Retry once on invalid JSON.
  for (let attempt = 0; attempt < 2; attempt++) {
    const cards = parseCards(await callOnce(prompt));
    if (cards) return cards;
  }
  throw new LLMError("The model did not return valid flashcards. Please try again.");
}
