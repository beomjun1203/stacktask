"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Card } from "@/store/useGameStore";

const FIELD_CARD_PREFIX = "field-";

export function getFieldCardId(cardId: string) {
  return `${FIELD_CARD_PREFIX}${cardId}`;
}

export function parseFieldCardId(dragId: string): string | null {
  if (typeof dragId !== "string" || !dragId.startsWith(FIELD_CARD_PREFIX))
    return null;
  return dragId.slice(FIELD_CARD_PREFIX.length);
}

interface SortableFieldCardProps {
  card: Card;
}

export function SortableFieldCard({ card }: SortableFieldCardProps) {
  const id = getFieldCardId(card.id);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, data: { card } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? "none" : transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        rounded-xl bg-white px-4 py-3 text-left shadow-md ring-1 ring-black/5
        cursor-grab active:cursor-grabbing
        ${isDragging ? "opacity-0" : ""}
      `}
    >
      <div className="font-medium text-foreground">{card.title}</div>
      <div className="mt-1 text-sm text-neutral-500">
        <div>{card.costValue}{card.costUnit}</div>
        <div>{card.type}</div>
      </div>
    </div>
  );
}
