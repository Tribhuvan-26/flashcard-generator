"use client";

import { useState } from "react";
import FlashcardViewer from "@/components/FlashcardViewer";
import type {
  CardStyle,
  Count,
  Difficulty,
  Flashcard,
  GenerateRequest,
} from "@/lib/types";

export default function Home() {
  const [notes, setNotes] = useState("");
  const [count, setCount] = useState<Count>("auto");
  const [difficulty, setDifficulty] = useState<Difficulty>("mixed");
  const [style, setStyle] = useState<CardStyle>("mixed");
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    setError("");
    if (!notes.trim()) {
      setError("Please paste some notes first.");
      return;
    }
    setLoading(true);
    try {
      const payload: GenerateRequest = { notes, count, difficulty, style };
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setCards(data.cards);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl p-4 sm:p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">
          AI Flashcard Generator
        </h1>
        <p className="text-slate-500">
          Paste technical notes, get interview-ready flashcards.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left panel */}
        <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste your interview notes here..."
            className="h-64 w-full resize-y rounded-lg border border-slate-300 p-3 text-sm focus:border-indigo-500 focus:outline-none"
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Select
              label="Cards"
              value={count}
              onChange={(v) => setCount(v as Count)}
              options={[
                ["auto", "Auto"],
                ["10", "10"],
                ["20", "20"],
              ]}
            />
            <Select
              label="Difficulty"
              value={difficulty}
              onChange={(v) => setDifficulty(v as Difficulty)}
              options={[
                ["beginner", "Beginner"],
                ["intermediate", "Intermediate"],
                ["mixed", "Mixed"],
              ]}
            />
            <Select
              label="Style"
              value={style}
              onChange={(v) => setStyle(v as CardStyle)}
              options={[
                ["definition", "Definition"],
                ["interview", "Interview Questions"],
                ["mixed", "Mixed"],
              ]}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={generate}
              disabled={loading}
              className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? "Generating…" : "Generate Flashcards"}
            </button>
            <button
              onClick={() => {
                setNotes("");
                setError("");
              }}
              className="rounded-lg border border-slate-300 px-4 py-2.5 font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Clear Notes
            </button>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
        </section>

        {/* Right panel */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          {cards.length > 0 ? (
            <FlashcardViewer cards={cards} />
          ) : (
            <div className="flex h-full min-h-64 items-center justify-center text-center text-slate-400">
              {loading
                ? "Building your flashcards…"
                : "Your flashcards will appear here."}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-slate-600">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-slate-300 px-2 py-2 focus:border-indigo-500 focus:outline-none"
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
}
