"use client";

import { useMemo } from "react";
import { useGameStore } from "@/store/useGameStore";
import { DraggableCard } from "@/components/playground/DraggableCard";
import { Layers } from "lucide-react";

const ROADMAP_DECK_PREFIX = "roadmap-deck-";

export function getRoadmapDeckCardId(cardId: string) {
  return `${ROADMAP_DECK_PREFIX}${cardId}`;
}

export function parseRoadmapDeckCardId(dragId: string): string | null {
  if (typeof dragId !== "string" || !dragId.startsWith(ROADMAP_DECK_PREFIX))
    return null;
  return dragId.slice(ROADMAP_DECK_PREFIX.length);
}

export function RoadmapDeckSidebar() {
  const decks = useGameStore((s) => s.decks);
  const roadmapDeckId = useGameStore((s) => s.roadmapDeckId);
  const roadmapStages = useGameStore((s) => s.roadmapStages);

  const cards = useMemo(() => {
    if (!roadmapDeckId) return [];
    const deck = decks.find((d) => d.id === roadmapDeckId);
    if (!deck) return [];
    const usedCardIds = new Set(
      roadmapStages.flatMap((s) =>
        s.tasks.map((t) => t.linkedCardId).filter(Boolean) as string[]
      )
    );
    return deck.cards.filter((c) => !usedCardIds.has(c.id));
  }, [roadmapDeckId, decks, roadmapStages]);

  const deck = useMemo(
    () => (roadmapDeckId ? decks.find((d) => d.id === roadmapDeckId) : null),
    [roadmapDeckId, decks]
  );

  return (
    <aside className="flex h-full w-72 flex-shrink-0 flex-col border-l border-neutral-200 bg-white overflow-hidden">
      <div className="flex flex-1 flex-col p-4 overflow-hidden">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-neutral-600 flex-shrink-0">
          <Layers className="h-4 w-4" />
          <span>덱 카드</span>
        </div>
        {deck ? (
          <>
            <p className="mb-2 truncate text-xs text-neutral-500">
              {deck.title}
            </p>
            <div className="flex flex-1 flex-col gap-2 overflow-y-auto min-h-0">
              {cards.length === 0 ? (
                <p className="mt-4 text-center text-sm text-neutral-400">
                  이 덱에 카드가 없습니다. 할 일을 추가하면 카드도 함께 추가됩니다.
                </p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {cards.map((card) => (
                    <li key={card.id}>
                      <DraggableCard
                        card={card}
                        dragId={getRoadmapDeckCardId(card.id)}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        ) : (
          <p className="mt-4 text-center text-sm text-neutral-400">
            로드맵 관리에서 덱을 선택하세요.
          </p>
        )}
      </div>
    </aside>
  );
}
