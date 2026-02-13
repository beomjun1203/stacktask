"use client";

import { useState, useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";
import { useGameStore } from "@/store/useGameStore";
import { DraggableCard } from "./DraggableCard";
import { Layers, Library, ChevronLeft } from "lucide-react";
import { DeckManagerModal } from "@/components/deck-manager/DeckManagerModal";
import { DeckEditorModal } from "@/components/deck-manager/DeckEditorModal";
import { DECK_RETURN_ID } from "./constants";

type ViewMode = "list" | "detail";

export function DeckSidebar() {
  const decks = useGameStore((s) => s.decks);
  const activeDeckId = useGameStore((s) => s.activeDeckId);
  const field = useGameStore((s) => s.field);
  const setActiveDeckId = useGameStore((s) => s.setActiveDeckId);

  const sidebarCards = useMemo(() => {
    if (!activeDeckId) return [];
    const deck = decks.find((d) => d.id === activeDeckId);
    if (!deck) return [];
    return deck.cards.filter((c) => !field.some((f) => f.id === c.id));
  }, [activeDeckId, decks, field]);

  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
  const [deckManagerOpen, setDeckManagerOpen] = useState(false);
  const [deckEditorOpen, setDeckEditorOpen] = useState(false);

  const selectedDeck = selectedDeckId
    ? decks.find((d) => d.id === selectedDeckId)
    : null;

  const { setNodeRef: setDeckReturnRef, isOver: isDeckReturnOver } =
    useDroppable({ id: DECK_RETURN_ID });

  const handleDeckSelect = (deckId: string) => {
    setSelectedDeckId(deckId);
    setActiveDeckId(deckId);
    setViewMode("detail");
  };

  const handleBack = () => {
    setViewMode("list");
    setSelectedDeckId(null);
  };

  return (
    <>
      <aside className="flex h-full w-72 flex-shrink-0 flex-col border-l border-neutral-200 bg-white transition-[background-color] duration-150 overflow-hidden">
        {viewMode === "list" ? (
          <div className="flex flex-1 flex-col p-4 overflow-hidden">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-neutral-600 flex-shrink-0">
              <Layers className="h-4 w-4" />
              <span>덱 목록</span>
            </div>
            <ul className="flex flex-1 flex-col gap-2 overflow-y-auto">
              {decks.map((deck) => (
                <li key={deck.id}>
                  <button
                    type="button"
                    onClick={() => handleDeckSelect(deck.id)}
                    className="
                      w-full rounded-xl border border-neutral-200 bg-white
                      px-4 py-3 text-left shadow-sm
                      transition-all hover:scale-[1.02] hover:border-neutral-300
                      hover:shadow-md focus:outline-none focus:ring-2
                      focus:ring-neutral-400 focus:ring-offset-2
                    "
                  >
                    <div className="font-medium text-foreground">
                      {deck.title}
                    </div>
                    <div className="mt-1 text-sm text-neutral-500">
                      총 {deck.cards.length}장
                      {activeDeckId === deck.id && field.length > 0 && (
                        <span className="text-neutral-400">
                          {" "}
                          (남은 카드 {deck.cards.length - field.length}장)
                        </span>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
            {decks.length === 0 && (
              <p className="mt-4 text-center text-sm text-neutral-400">
                덱이 없습니다. Deck Manager에서 추가하세요.
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-1 flex-col p-4 overflow-hidden">
            <header className="mb-3 flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={handleBack}
                aria-label="덱 목록으로"
                className="
                  rounded-lg p-1.5 text-neutral-500
                  hover:bg-neutral-100 hover:text-neutral-700
                "
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
                {selectedDeck?.title ?? "카드 목록"}
              </span>
            </header>
            <div
              ref={setDeckReturnRef}
              className={`
                flex flex-1 flex-col overflow-y-auto rounded-lg
                transition-colors duration-150 min-h-0
                ${isDeckReturnOver ? "bg-amber-50/80" : ""}
              `}
            >
              <ul className="flex flex-col gap-2">
                {sidebarCards.map((card) => (
                  <li key={card.id}>
                    <DraggableCard card={card} dragId={`deck-${card.id}`} />
                  </li>
                ))}
              </ul>
              {sidebarCards.length === 0 && (
                <p className="mt-4 text-center text-sm text-neutral-400">
                  {selectedDeck?.cards.length === 0
                    ? "이 덱에 카드가 없습니다."
                    : "필드에 나간 카드를 제외하면 남은 카드가 없습니다."}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="border-t border-neutral-200 p-4 flex-shrink-0">
          <button
            type="button"
            onClick={() => {
              if (viewMode === "detail" && activeDeckId) {
                setDeckEditorOpen(true);
              } else {
                setDeckManagerOpen(true);
              }
            }}
            className="
              flex w-full items-center justify-center gap-2 rounded-lg
              border border-neutral-300 bg-neutral-50 py-2.5 text-sm font-medium
              text-neutral-700 transition-colors hover:border-neutral-400
              hover:bg-neutral-100
            "
          >
            <Library className="h-4 w-4" />
            {viewMode === "detail" ? "덱 편집" : "덱 관리"}
          </button>
        </div>
      </aside>
      <DeckManagerModal
        isOpen={deckManagerOpen}
        onClose={() => setDeckManagerOpen(false)}
      />
      {activeDeckId && (
        <DeckEditorModal
          isOpen={deckEditorOpen}
          onClose={() => setDeckEditorOpen(false)}
          targetDeck={decks.find((d) => d.id === activeDeckId) ?? null}
        />
      )}
    </>
  );
}