"use client";

import { useEffect, useMemo, useState } from "react";
import type { Flashcard } from "@/lib/types";

export default function FlashcardViewer({ cards }: { cards: Flashcard[] }) {
  const [order, setOrder] = useState<number[]>([]);
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);

  // Reset when a new deck arrives.
  useEffect(() => {
    setOrder(cards.map((_, i) => i));
    setPos(0);
    setFlipped(false);
  }, [cards]);

  const card = useMemo(() => cards[order[pos]], [cards, order, pos]);

  if (!card) return null;

  const go = (next: number) => {
    setFlipped(false);
    setPos(next);
  };
  const prev = () => order.length && go((pos - 1 + order.length) % order.length);
  const next = () => order.length && go((pos + 1) % order.length);

  const shuffle = () => {
    const a = [...order];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    setOrder(a);
    go(0);
  };
  const restart = () => {
    setOrder(cards.map((_, i) => i));
    go(0);
  };

  return (
    <div className="flex h-full flex-col gap-5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs tracking-wide text-[var(--muted)]">
          CARD {String(pos + 1).padStart(2, "0")} / {String(order.length).padStart(2, "0")}
        </span>
        <span className="flex gap-2">
          <Tag>{card.category}</Tag>
          <Tag accent>{card.difficulty}</Tag>
        </span>
      </div>

      <div className="perspective flex-1">
        <div className="deck-shadow relative h-full min-h-72">
          <button
            onClick={() => setFlipped((f) => !f)}
            className={`flip-inner absolute inset-0 cursor-pointer rounded-2xl text-left ${
              flipped ? "flipped" : ""
            }`}
            aria-label="Flip card"
          >
            <Face label="Question" text={card.question} />
            <Face label="Answer" text={card.answer} back />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Ctrl primary onClick={() => setFlipped((f) => !f)}>
          Flip
        </Ctrl>
        <Ctrl onClick={prev}>← Prev</Ctrl>
        <Ctrl onClick={next}>Next →</Ctrl>
        <span className="mx-1 h-6 w-px bg-[var(--line)]" />
        <Ctrl onClick={shuffle}>Shuffle</Ctrl>
        <Ctrl onClick={restart}>Restart</Ctrl>
      </div>
    </div>
  );
}

function Face({ label, text, back }: { label: string; text: string; back?: boolean }) {
  return (
    <div
      className={`flip-face absolute inset-0 flex flex-col gap-4 rounded-2xl border p-8 shadow-[0_20px_50px_-20px_rgba(23,23,28,0.4)] ${
        back
          ? "flip-back border-transparent bg-[var(--accent)] text-[var(--accent-soft)]"
          : "index-card border-black/5"
      }`}
    >
      <span
        className={`font-mono text-[11px] font-bold uppercase tracking-[0.2em] ${
          back ? "text-white/60" : "text-[var(--accent)]"
        }`}
      >
        {label}
      </span>
      <p
        className={`overflow-auto font-display leading-relaxed ${
          back ? "text-xl text-white" : "text-2xl"
        }`}
      >
        {text}
      </p>
      <span
        className={`mt-auto font-mono text-[11px] ${
          back ? "text-white/40" : "text-[var(--muted)]"
        }`}
      >
        {back ? "click to see question" : "click to reveal answer"}
      </span>
    </div>
  );
}

function Ctrl({
  children,
  onClick,
  primary,
}: {
  children: React.ReactNode;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition active:scale-95 ${
        primary
          ? "bg-[var(--ink)] text-white hover:bg-black"
          : "border border-[var(--line)] bg-white/70 text-[var(--ink)] hover:bg-white"
      }`}
    >
      {children}
    </button>
  );
}

function Tag({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 font-mono text-[11px] ${
        accent
          ? "bg-[var(--accent-soft)] text-[var(--accent)]"
          : "bg-black/5 text-[var(--muted)]"
      }`}
    >
      {children}
    </span>
  );
}
