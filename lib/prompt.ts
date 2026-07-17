import type { GenerateRequest } from "./types";

// TODO(candidate): Build the LLM prompt from the request.
//
// Turn the user's notes plus the options (count, difficulty, style, emphasis)
// into a single prompt string that instructs the model to return ONLY a JSON
// array of flashcards matching the schema in ./types (question, answer,
// category, difficulty). Inject the options dynamically.
//
// Design the prompt however you think produces the best interview flashcards.
export function buildPrompt(_req: GenerateRequest): string {
  throw new Error("Not implemented: build the prompt in lib/prompt.ts");
}
