"use client";

import { useState } from "react";
import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useGameStore, type Card } from "@/store/useGameStore";
import { BackToLobbyLink } from "@/components/layout/BackToLobbyLink";
import { DropZone, getPlaygroundFieldId } from "@/components/playground/DropZone";
import { DeckSidebar } from "@/components/playground/DeckSidebar";
import { DECK_RETURN_ID } from "@/components/playground/constants";
import {
  getFieldCardId,
  parseFieldCardId,
} from "@/components/playground/SortableFieldCard";

export default function PlaygroundPage() {
  const field = useGameStore((s) => s.field);
  const decks = useGameStore((s) => s.decks);
  const activeDeckId = useGameStore((s) => s.activeDeckId);
  const moveCardToField = useGameStore((s) => s.moveCardToField);
  const moveCardToDeck = useGameStore((s) => s.moveCardToDeck);
  const reorderFieldCards = useGameStore((s) => s.reorderFieldCards);

  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragCancel() {
    setActiveId(null);
  }

  const activeCard = activeId
    ? (() => {
        if (activeId.startsWith("field-")) {
          const cardId = parseFieldCardId(activeId);
          return field.find((c) => c.id === cardId);
        } else if (activeId.startsWith("deck-")) {
          const cardId = activeId.slice(5);
          if (activeDeckId) {
            const deck = decks.find((d) => d.id === activeDeckId);
            return deck?.cards.find((c) => c.id === cardId);
          }
        }
        return undefined;
      })()
    : undefined;

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const activeIdStr = String(active.id);
    setActiveId(null);

    // Deploy: 덱 → 필드 (필드 영역 또는 필드 카드 위에 놓아도 배치)
    if (activeIdStr.startsWith("deck-")) {
      const overId = over ? String(over.id) : "";
      const isFieldDrop =
        overId === getPlaygroundFieldId() || overId.startsWith("field-");
      if (isFieldDrop) {
        const card = active.data.current?.card as Card | undefined;
        if (card) moveCardToField(card);
      }
      return;
    }

    // Source: 필드
    if (activeIdStr.startsWith("field-")) {
      const cardId = parseFieldCardId(activeIdStr);
      if (!cardId) return;

      // Return to deck: 필드 카드를 덱으로 반환 (over가 null이거나 deck-return)
      if (over == null || over.id === DECK_RETURN_ID) {
        moveCardToDeck(cardId);
        return;
      }

      // Reorder: 필드 내부 이동
      const overId = String(over.id);
      if (overId.startsWith("field-") && overId !== activeIdStr) {
        const overCardId = parseFieldCardId(overId);
        if (!overCardId) return;
        const oldIndex = field.findIndex((c) => c.id === cardId);
        const newIndex = field.findIndex((c) => c.id === overCardId);
        if (oldIndex !== -1 && newIndex !== -1) {
          reorderFieldCards(oldIndex, newIndex);
        }
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex h-screen flex-col bg-neutral-100 md:flex-row overflow-hidden">
        <main className="flex flex-1 flex-col p-6 overflow-hidden">
          <div className="mb-4 flex-shrink-0">
            <BackToLobbyLink />
          </div>
          <div className="flex flex-1 items-center justify-center overflow-hidden">
            <DropZone />
          </div>
        </main>
        <DeckSidebar />
      </div>
      <DragOverlay>
        {activeCard ? (
          <div className="rounded-xl bg-white px-4 py-3 shadow-lg ring-1 ring-black/5">
            <div className="font-medium text-foreground">{activeCard.title}</div>
            <div className="mt-1 text-sm text-neutral-500">
              <div>{activeCard.costValue}{activeCard.costUnit}</div>
              <div>{activeCard.type}</div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
