import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

// TODO(candidate): Implement the generate endpoint.
//
// The frontend POSTs JSON: { notes, count, difficulty, style } (see
// GenerateRequest in lib/types.ts) and expects back { cards: Flashcard[] }
// on success, or { error: string } with an appropriate HTTP status on failure.
//
// Steps:
//  1. Parse the request body; reject empty notes and oversized input.
//  2. Build the prompt   -> lib/prompt.ts   (buildPrompt)
//  3. Call the model      -> lib/llm.ts      (generateFlashcards)
//  4. Return { cards }, or { error } with the right status code.
export async function POST(_req: Request) {
  return NextResponse.json(
    { error: "Not implemented: build the endpoint in app/api/generate/route.ts" },
    { status: 501 },
  );
}
