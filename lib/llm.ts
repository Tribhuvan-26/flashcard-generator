import type { Flashcard } from "./types";

// Optional helper: throw this from your integration so the API route can map
// a message + HTTP status back to the client. Use it or replace it.
export class LLMError extends Error {
  status: number;
  constructor(message: string, status = 502) {
    super(message);
    this.status = status;
  }
}

// TODO(candidate): Integrate an OpenAI-compatible chat completions API.
//
// Requirements:
//  - Read LLM_BASE_URL, LLM_API_KEY, LLM_MODEL from process.env (never hardcode).
//  - POST the prompt to `${LLM_BASE_URL}/chat/completions` with Bearer auth.
//  - Enforce a request timeout (~60s) via AbortController.
//  - Handle: missing config, 429 rate limit, non-2xx responses, network
//    failures, and timeouts — each with a clear message + status.
//  - The model returns text; extract the JSON array of flashcards from it
//    (it may wrap the JSON in prose or ```code fences```).
//  - Validate the parsed cards against the schema in ./types.
//  - If the JSON is invalid, retry once; if still invalid, throw a clear error.
//  - Return Flashcard[].
export async function generateFlashcards(_prompt: string): Promise<Flashcard[]> {
  throw new Error("Not implemented: integrate the LLM API in lib/llm.ts");
}
