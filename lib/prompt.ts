import type { GenerateRequest } from "./types";

export function buildPrompt(req: GenerateRequest): string {
  const count =
    req.count === "auto" || !req.count
      ? "an appropriate number of"
      : `about ${req.count}`;

  const difficulty =
    {
      beginner: "Target beginner-level difficulty (mark most cards Easy).",
      intermediate: "Target intermediate difficulty (mostly Medium).",
      mixed: "Use a mix of Easy, Medium and Hard difficulties.",
    }[req.difficulty ?? "mixed"];

  const style =
    {
      definition: "Favor definition-style cards.",
      interview: "Favor common interview-question style cards.",
      mixed:
        "Use a balanced mix of definitions, concept explanations, why/how questions, examples, advantages, disadvantages, common interview questions, common misconceptions and best practices.",
    }[req.style ?? "mixed"];

  const emphasis = req.emphasis?.trim()
    ? `Emphasize these topics: ${req.emphasis.trim()}.`
    : "";

  return `You are an expert technical interviewer and educator.

Your task is to convert the provided study material into high-quality interview flashcards.

Requirements:
- Focus only on important interview concepts.
- Create conceptual questions rather than copying sentences.
- Keep answers concise (maximum 60 words).
- Include definitions, explanations, advantages, disadvantages, examples, common interview questions, and common misconceptions whenever applicable.
- Avoid duplicate questions.
- Cover all major concepts from the notes.
- If examples improve understanding, include them.
- Questions should be beginner-friendly but interview-oriented.
- Generate ${count} flashcards.
- ${difficulty}
- ${style}
${emphasis}

Return ONLY valid JSON, no markdown fences, matching this schema exactly:
[{"question":"...","answer":"...","category":"Definition","difficulty":"Easy"}]

Study Material:
${req.notes}`;
}
