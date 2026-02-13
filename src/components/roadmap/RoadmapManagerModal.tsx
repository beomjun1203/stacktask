"use client";

import { X } from "lucide-react";
import { useGameStore } from "@/store/useGameStore";

interface RoadmapManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RoadmapManagerModal({
  isOpen,
  onClose,
}: RoadmapManagerModalProps) {
  const decks = useGameStore((s) => s.decks);
  const roadmapDeckId = useGameStore((s) => s.roadmapDeckId);
  const setRoadmapDeckId = useGameStore((s) => s.setRoadmapDeckId);

  if (!isOpen) return null;

  const handleSelect = (deckId: string) => {
    setRoadmapDeckId(deckId);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="roadmap-manager-modal-title"
    >
      <div
        className="flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
          <h2
            id="roadmap-manager-modal-title"
            className="text-lg font-semibold"
          >
            로드맵 관리
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="rounded p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <p className="mb-3 text-sm text-neutral-600">
            로드맵과 연동할 덱을 선택하세요. 선택한 덱의 카드가 우측에 표시되며
            단계로 드래그할 수 있습니다.
          </p>
          {decks.length === 0 ? (
            <p className="text-center text-sm text-neutral-500">
              덱이 없습니다. 덱 관리에서 먼저 덱을 만드세요.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {decks.map((deck) => (
                <li key={deck.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(deck.id)}
                    className={`
                      w-full rounded-xl border px-4 py-3 text-left
                      transition-all hover:border-neutral-400 hover:bg-neutral-50
                      focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2
                      ${
                        roadmapDeckId === deck.id
                          ? "border-neutral-400 bg-neutral-100 font-medium"
                          : "border-neutral-200 bg-white"
                      }
                    `}
                  >
                    <div className="font-medium text-foreground">
                      {deck.title}
                    </div>
                    <div className="mt-1 text-sm text-neutral-500">
                      카드 {deck.cards.length}장
                      {roadmapDeckId === deck.id && (
                        <span className="ml-1 text-neutral-600">
                          · 연동 중
                        </span>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
