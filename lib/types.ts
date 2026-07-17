import { z } from "zod";

export const FlashcardSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  category: z.string().min(1),
  difficulty: z.string().min(1),
});

export const FlashcardArraySchema = z.array(FlashcardSchema).min(1);

export type Flashcard = z.infer<typeof FlashcardSchema>;

export type Count = "10" | "20" | "auto";
export type Difficulty = "beginner" | "intermediate" | "mixed";
export type CardStyle = "definition" | "interview" | "mixed";

export interface GenerateRequest {
  notes: string;
  count?: Count;
  difficulty?: Difficulty;
  style?: CardStyle;
  emphasis?: string;
}
