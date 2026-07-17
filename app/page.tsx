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
  const [showHelp, setShowHelp] = useState(true);

  const words = notes.trim() ? notes.trim().split(/\s+/).length : 0;

  async function generate() {
    setError("");
    if (!notes.trim()) {
      setError("Paste some notes to generate from.");
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
    <div className="mx-auto min-h-screen max-w-6xl px-4 py-6 sm:px-8 sm:py-10">
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}

      <header className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            re<span className="marker">call</span>
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Turn technical notes into interview flashcards.
          </p>
        </div>
        <span className="hidden font-mono text-xs text-[var(--muted)] sm:block">
          paste → generate → study
        </span>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        {/* Left: compose */}
        <section className="flex flex-col gap-5 rounded-2xl border border-black/5 bg-white/70 p-5 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
              Your notes
            </span>
            <span className="font-mono text-xs text-[var(--muted)]">
              {words} {words === 1 ? "word" : "words"}
            </span>
          </div>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste your interview notes here — JavaScript, SQL, OS, system design, anything…"
            className="h-56 w-full resize-y rounded-xl border border-[var(--line)] bg-[var(--card)] p-4 text-sm leading-relaxed shadow-inner placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
          />

          <div className="grid gap-4">
            <Segmented
              label="Cards"
              value={count}
              onChange={(v) => setCount(v as Count)}
              options={[
                ["auto", "Auto"],
                ["10", "10"],
                ["20", "20"],
              ]}
            />
            <Segmented
              label="Difficulty"
              value={difficulty}
              onChange={(v) => setDifficulty(v as Difficulty)}
              options={[
                ["beginner", "Beginner"],
                ["intermediate", "Intermediate"],
                ["mixed", "Mixed"],
              ]}
            />
            <Segmented
              label="Style"
              value={style}
              onChange={(v) => setStyle(v as CardStyle)}
              options={[
                ["definition", "Definitions"],
                ["interview", "Questions"],
                ["mixed", "Mixed"],
              ]}
            />
          </div>

          <div className="mt-1 flex gap-3">
            <button
              onClick={generate}
              disabled={loading}
              className="flex-1 rounded-xl bg-[var(--ink)] px-4 py-3 font-medium text-white shadow-sm transition hover:bg-black active:scale-[0.99] disabled:opacity-60"
            >
              {loading ? "Generating…" : "Generate Flashcards"}
            </button>
            <button
              onClick={() => {
                setNotes("");
                setError("");
              }}
              className="rounded-xl border border-[var(--line)] px-4 py-3 font-medium text-[var(--ink)] transition hover:bg-white"
            >
              Clear
            </button>
          </div>

          {error && (
            <p className="rounded-xl border border-[var(--margin)]/30 bg-[var(--margin)]/10 px-4 py-3 text-sm text-[var(--margin)]">
              {error}
            </p>
          )}
        </section>

        {/* Right: study */}
        <section className="flex min-h-[26rem] flex-col rounded-2xl border border-black/5 bg-white/40 p-5 shadow-sm backdrop-blur-sm">
          {cards.length > 0 ? (
            <div key={cards.length} className="rise flex h-full flex-col">
              <FlashcardViewer cards={cards} />
            </div>
          ) : (
            <EmptyState loading={loading} />
          )}
        </section>
      </div>
    </div>
  );
}

function EmptyState({ loading }: { loading: boolean }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
      <div className="deck-shadow relative h-32 w-52 rounded-2xl border border-black/5 index-card shadow-[0_16px_40px_-20px_rgba(23,23,28,0.4)]" />
      <p className="max-w-xs text-sm text-[var(--muted)]">
        {loading
          ? "Shuffling your notes into a deck…"
          : "Your flashcards land here. Paste notes and hit Generate."}
      </p>
    </div>
  );
}

function Segmented({
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
    <div className="flex flex-col gap-2">
      <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--muted)]">
        {label}
      </span>
      <div className="flex gap-1 rounded-xl border border-[var(--line)] bg-black/[0.03] p-1">
        {options.map(([v, l]) => (
          <button
            key={v}
            onClick={() => onChange(v)}
            className={`flex-1 rounded-lg px-2 py-2 text-sm font-medium transition ${
              value === v
                ? "bg-white text-[var(--ink)] shadow-sm"
                : "text-[var(--muted)] hover:text-[var(--ink)]"
            }`}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}

function HelpModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-auto rounded-2xl border border-black/5 bg-[var(--card)] p-7 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
          Take-home
        </span>
        <h2 className="mt-2 font-display text-2xl font-bold">Build the backend</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          The UI is done. Make <b className="text-[var(--ink)]">Generate Flashcards</b>{" "}
          work by implementing three stubbed files:
        </p>
        <ul className="mt-4 space-y-3 text-sm">
          <FileItem path="lib/prompt.ts">
            build the LLM prompt from the notes and options.
          </FileItem>
          <FileItem path="lib/llm.ts">
            call an OpenAI-compatible <Code>/chat/completions</Code> API — timeout,
            error handling, JSON validation, retry-once.
          </FileItem>
          <FileItem path="app/api/generate/route.ts">
            validate input, call the model, return the cards.
          </FileItem>
        </ul>
        <p className="mt-4 text-sm text-[var(--muted)]">
          Run <Code>npm install</Code>, copy <Code>.env.example</Code> to{" "}
          <Code>.env.local</Code> with your own API key. Full brief in{" "}
          <Code>README.md</Code>.
        </p>
        <button
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-[var(--ink)] px-4 py-3 font-medium text-white transition hover:bg-black"
        >
          Got it — let me build
        </button>
      </div>
    </div>
  );
}

function FileItem({ path, children }: { path: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--marker)] ring-2 ring-[var(--marker)]/30" />
      <span>
        <Code>{path}</Code> <span className="text-[var(--muted)]">— {children}</span>
      </span>
    </li>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-black/[0.06] px-1.5 py-0.5 font-mono text-[13px] text-[var(--ink)]">
      {children}
    </code>
  );
}
