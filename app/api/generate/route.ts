import { NextResponse } from "next/server";
import { buildPrompt } from "@/lib/prompt";
import { generateFlashcards, LLMError } from "@/lib/llm";
import type { GenerateRequest } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  let body: GenerateRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const notes = body.notes?.trim();
  if (!notes)
    return NextResponse.json({ error: "Please paste some notes first." }, { status: 400 });
  if (notes.length > 20_000)
    return NextResponse.json({ error: "Notes are too long (20k char limit)." }, { status: 400 });

  try {
    const cards = await generateFlashcards(buildPrompt({ ...body, notes }));
    return NextResponse.json({ cards });
  } catch (err) {
    const status = err instanceof LLMError ? err.status : 500;
    const message =
      err instanceof LLMError ? err.message : "Unexpected server error.";
    return NextResponse.json({ error: message }, { status });
  }
}
