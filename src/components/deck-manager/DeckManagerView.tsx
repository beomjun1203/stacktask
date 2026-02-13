"use client";

import { useState } from "react";
import { Plus, Settings } from "lucide-react";
import { useGameStore, type Deck } from "@/store/useGameStore";
import { DeckGridItem } from "./DeckGridItem";
import { DeckEditorModal } from "./DeckEditorModal";
import { TypeManagerModal } from "./TypeManagerModal";

interface DeckManagerViewProps {
  /** 모달 안에서 렌더될 때 상단에 닫기 버튼 표시 */
  isInModal?: boolean;
  onCloseModal?: () => void;
}

export function DeckManagerView({
  isInModal,
  onCloseModal,
}: DeckManagerViewProps) {
  const decks = useGameStore((s) => s.decks);
  const createDeck = useGameStore((s) => s.createDeck);

  const [editorOpen, setEditorOpen] = useState(false);
  const [targetDeck, setTargetDeck] = useState<Deck | null>(null);
  const [typeManagerOpen, setTypeManagerOpen] = useState(false);

  const handleNewDeck = () => {
    const title = window.prompt("새 덱 이름을 입력하세요", "새 덱");
    if (title?.trim()) createDeck(title.trim());
  };

  const handleDeckClick = (deck: Deck) => {
    setTargetDeck(deck);
    setEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setEditorOpen(false);
    setTargetDeck(null);
  };

  return (
    <>
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-foreground">My Decks</h2>
          {isInModal && onCloseModal && (
            <button
              type="button"
              onClick={onCloseModal}
              className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100"
            >
              닫기
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTypeManagerOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:border-neutral-400 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2"
          >
            <Settings className="h-4 w-4" />
            타입 관리
          </button>
          <button
            type="button"
            onClick={handleNewDeck}
            className="flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:border-neutral-400 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2"
          >
            <Plus className="h-4 w-4" />
            새 덱 만들기
          </button>
        </div>
      </header>

      {decks.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-neutral-300 bg-white/80 py-12 text-center">
          <p className="text-neutral-500">아직 덱이 없습니다.</p>
          <button
            type="button"
            onClick={handleNewDeck}
            className="mt-3 text-sm font-medium text-neutral-600 underline hover:text-neutral-800"
          >
            새 덱 만들기
          </button>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {decks.map((deck) => (
            <li key={deck.id}>
              <DeckGridItem deck={deck} onClick={() => handleDeckClick(deck)} />
            </li>
          ))}
        </ul>
      )}

      <DeckEditorModal
        isOpen={editorOpen}
        onClose={handleCloseEditor}
        targetDeck={targetDeck}
      />
      <TypeManagerModal
        isOpen={typeManagerOpen}
        onClose={() => setTypeManagerOpen(false)}
      />
    </>
  );
}
