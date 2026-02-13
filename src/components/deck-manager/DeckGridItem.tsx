"use client";

import { Layers } from "lucide-react";
import type { Deck } from "@/store/useGameStore";

interface DeckGridItemProps {
  deck: Deck;
  onClick: () => void;
}

export function DeckGridItem({ deck, onClick }: DeckGridItemProps) {
  const cardCount = deck.cards.length;

  return (
    <button
      type="button"
      onClick={onClick}
      className="
        flex min-h-0 min-w-0 flex-col items-stretch gap-3 rounded-xl border border-neutral-200
        bg-white p-5 text-left shadow-sm aspect-[4/3] w-full
        transition-all hover:border-neutral-300 hover:shadow-md
        focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2
      "
    >
      <div className="flex items-center gap-2 text-neutral-500">
        <Layers className="h-5 w-5 flex-shrink-0" />
        <span className="text-sm font-medium">덱</span>
      </div>
      <h3 className="min-h-0 flex-1 font-semibold text-foreground line-clamp-3">
        {deck.title}
      </h3>
      <p className="text-sm text-neutral-500">
        카드 <span className="font-medium text-neutral-700">{cardCount}</span>장
      </p>
    </button>
  );
}
