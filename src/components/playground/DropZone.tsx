"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { useGameStore } from "@/store/useGameStore";
import { SortableFieldCard, getFieldCardId } from "./SortableFieldCard";

const DROP_ZONE_ID = "playground-field";

export function getPlaygroundFieldId() {
  return DROP_ZONE_ID;
}

export function DropZone() {
  const { setNodeRef, isOver } = useDroppable({
    id: DROP_ZONE_ID,
  });
  const field = useGameStore((s) => s.field);
  const fieldItemIds = field.map((c) => getFieldCardId(c.id));

  return (
    <div
      ref={setNodeRef}
      className={`
        min-h-[320px] w-full max-w-2xl rounded-2xl border-2 border-dashed
        flex flex-col items-center justify-center gap-3 p-6
        transition-colors duration-150
        ${
          isOver
            ? "border-emerald-400 bg-emerald-50/80"
            : "border-neutral-300 bg-neutral-50/50"
        }
      `}
    >
      {field.length > 0 ? (
        <SortableContext items={fieldItemIds} strategy={rectSortingStrategy}>
          <ul className="flex flex-wrap justify-center gap-3">
            {field.map((card) => (
              <li key={card.id}>
                <SortableFieldCard card={card} />
              </li>
            ))}
          </ul>
        </SortableContext>
      ) : null}
      <p
        className={`text-sm transition-colors ${
          isOver ? "text-emerald-600" : "text-neutral-400"
        }`}
      >
        {isOver
          ? "여기에 놓기"
          : field.length
            ? "카드를 더 놓을 수 있습니다"
            : "카드를 이곳에 놓으세요"}
      </p>
    </div>
  );
}
