"use client";

import { useDraggable } from "@dnd-kit/core";
import type { Card } from "@/store/useGameStore";

interface DraggableCardProps {
  card: Card;
  /** 덱 사이드바용 드래그 id (deck-{id}). 필드에 놓인 카드는 이 컴포넌트 대신 정적 카드 UI 사용 가능. */
  dragId: string;
}

export function DraggableCard({ card, dragId }: DraggableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: dragId,
    data: { card },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        rounded-xl bg-white px-4 py-3 text-left shadow-md ring-1 ring-black/5
        cursor-grab active:cursor-grabbing
        transition-shadow
        hover:shadow-lg
        ${isDragging ? "opacity-80 shadow-lg z-50" : ""}
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
