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
    // Fisher–Yates.
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
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>
          Card {pos + 1} of {order.length}
        </span>
        <span className="flex gap-2">
          <Badge>{card.category}</Badge>
          <Badge>{card.difficulty}</Badge>
        </span>
      </div>

      <div className="perspective">
        <button
          onClick={() => setFlipped((f) => !f)}
          className={`flip-inner relative h-72 w-full cursor-pointer rounded-2xl text-left ${
            flipped ? "flipped" : ""
          }`}
          aria-label="Flip card"
        >
          <Face label="Question" text={card.question} />
          <Face label="Answer" text={card.answer} back />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        <Ctrl onClick={() => setFlipped((f) => !f)}>Flip</Ctrl>
        <Ctrl onClick={prev}>Previous</Ctrl>
        <Ctrl onClick={next}>Next</Ctrl>
        <Ctrl onClick={shuffle}>Shuffle</Ctrl>
        <Ctrl onClick={restart}>Restart</Ctrl>
      </div>
    </div>
  );
}

function Face({
  label,
  text,
  back,
}: {
  label: string;
  text: string;
  back?: boolean;
}) {
  return (
    <div
      className={`flip-face absolute inset-0 flex flex-col justify-center gap-3 rounded-2xl border border-slate-200 p-8 shadow-sm ${
        back ? "flip-back bg-indigo-600 text-white" : "bg-white"
      }`}
    >
      <span
        className={`text-xs font-semibold uppercase tracking-wide ${
          back ? "text-indigo-200" : "text-indigo-500"
        }`}
      >
        {label}
      </span>
      <p className="overflow-auto text-lg leading-relaxed">{text}</p>
    </div>
  );
}

function Ctrl({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 active:scale-95"
    >
      {children}
    </button>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
      {children}
    </span>
  );
}
