"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { useGameStore, type Deck, type Card } from "@/store/useGameStore";
import { CardEditorSlot } from "./CardEditorSlot";
import { CardEditModal } from "./CardEditModal";

const CARDS_PER_ROW = 5;
const DEFAULT_ROWS = 3;
const DEFAULT_SLOT_COUNT = CARDS_PER_ROW * DEFAULT_ROWS; // 15

function generateCardId() {
  return `card-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

interface DeckEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetDeck: Deck | null;
}

export function DeckEditorModal({
  isOpen,
  onClose,
  targetDeck,
}: DeckEditorModalProps) {
  const updateDeck = useGameStore((s) => s.updateDeck);

  const [editingCards, setEditingCards] = useState<Card[]>([]);
  const [editingCard, setEditingCard] = useState<Card | null>(null);

  useEffect(() => {
    if (!isOpen || !targetDeck) return;
    setEditingCards([...targetDeck.cards]);
  }, [isOpen, targetDeck?.id, targetDeck?.cards]);

  const hasUnsavedChanges = useMemo(() => {
    if (!targetDeck) return false;
    if (editingCards.length !== targetDeck.cards.length) return true;
    const same = editingCards.every(
      (c, i) =>
        targetDeck.cards[i] &&
        c.id === targetDeck.cards[i].id &&
        c.title === targetDeck.cards[i].title &&
        c.costValue === targetDeck.cards[i].costValue &&
        c.costUnit === targetDeck.cards[i].costUnit &&
        c.type === targetDeck.cards[i].type
    );
    return !same;
  }, [targetDeck, editingCards]);

  const handleClose = () => {
    if (hasUnsavedChanges && !window.confirm("저장하지 않고 닫으시겠습니까?")) {
      return;
    }
    onClose();
  };

  const handleSave = () => {
    if (!targetDeck) return;
    updateDeck(targetDeck.id, editingCards);
    onClose();
  };

  const addCard = () => {
    setEditingCards((prev) => [
      ...prev,
      {
        id: generateCardId(),
        title: "새 카드",
        costValue: 0,
        costUnit: "",
        type: "",
      },
    ]);
  };

  const updateCard = (cardId: string, updatedCard: Card) => {
    setEditingCards((prev) =>
      prev.map((c) => (c.id === cardId ? updatedCard : c))
    );
  };

  const removeCard = (cardId: string) => {
    setEditingCards((prev) => prev.filter((c) => c.id !== cardId));
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleClose}
      onKeyDown={(e) => e.key === "Escape" && handleClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="deck-editor-title"
    >
      <div
        className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <h2 id="deck-editor-title" className="text-lg font-semibold text-foreground">
            {targetDeck?.title ?? "덱 편집"}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label="닫기"
            className="rounded p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-5 gap-3">
            {editingCards.map((card) => (
              <CardEditorSlot
                key={card.id}
                card={card}
                onAdd={() => {}}
                onUpdate={(updatedCard) => updateCard(card.id, updatedCard)}
                onRemove={() => removeCard(card.id)}
                onEdit={(card) => setEditingCard(card)}
              />
            ))}
            {/* 빈 슬롯: 항상 하나만 표시 (줄이 꽉 차면 다음 줄 왼쪽에) */}
            <CardEditorSlot
              key="empty-slot"
              card={null}
              onAdd={addCard}
              onUpdate={() => {}}
              onRemove={() => {}}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-neutral-200 px-6 py-4">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-neutral-800 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
          >
            저장
          </button>
        </div>
      </div>

      <CardEditModal
        isOpen={editingCard !== null}
        card={editingCard}
        onClose={() => setEditingCard(null)}
        onSave={(updatedCard) => {
          updateCard(updatedCard.id, updatedCard);
          setEditingCard(null);
        }}
      />
    </div>
  );
}
