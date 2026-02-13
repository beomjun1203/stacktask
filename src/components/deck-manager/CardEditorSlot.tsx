"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useGameStore, type Card } from "@/store/useGameStore";

interface CardEditorSlotProps {
  card: Card | null;
  onAdd: () => void;
  onUpdate: (card: Card) => void;
  onRemove: () => void;
  onEdit?: (card: Card) => void;
}

export function CardEditorSlot({
  card,
  onAdd,
  onUpdate,
  onRemove,
  onEdit,
}: CardEditorSlotProps) {
  const cardTypes = useGameStore((s) => s.cardTypes);
  const costUnits = useGameStore((s) => s.costUnits);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    title: "",
    costValue: 0,
    costUnit: "",
    type: "",
  });

  const startEdit = () => {
    if (card) {
      if (onEdit) {
        onEdit(card);
      } else {
        setForm({
          title: card.title,
          costValue: card.costValue,
          costUnit: card.costUnit,
          type: card.type,
        });
        setIsEditing(true);
      }
    }
  };

  const saveEdit = () => {
    if (card) {
      onUpdate({ ...card, ...form });
      setIsEditing(false);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("이 카드를 삭제할까요?")) onRemove();
  };

  if (card === null) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={onAdd}
        onKeyDown={(e) => e.key === "Enter" && onAdd()}
        className="
          flex min-h-[100px] flex-col items-center justify-center gap-2
          rounded-lg border-2 border-dashed border-neutral-300
          bg-neutral-50/80 text-neutral-400
          transition-colors hover:border-neutral-400 hover:bg-neutral-100
          cursor-pointer focus:outline-none focus:ring-2 focus:ring-neutral-400
        "
      >
        <Plus className="h-6 w-6" />
        <span className="text-sm font-medium">빈 슬롯</span>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-3 shadow-sm">
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          placeholder="카드 이름"
          className="mb-2 w-full rounded border border-neutral-200 px-2 py-1.5 text-sm focus:border-neutral-400 focus:outline-none"
        />
        <div className="mb-2 flex gap-2">
          <input
            type="number"
            min={0}
            value={form.costValue}
            onChange={(e) =>
              setForm((f) => ({ ...f, costValue: Number(e.target.value) || 0 }))
            }
            className="w-20 rounded border border-neutral-200 px-2 py-1.5 text-sm focus:border-neutral-400 focus:outline-none"
            placeholder="비용"
          />
          <select
            value={form.costUnit}
            onChange={(e) =>
              setForm((f) => ({ ...f, costUnit: e.target.value }))
            }
            className="w-24 rounded border border-neutral-200 px-2 py-1.5 text-sm focus:border-neutral-400 focus:outline-none"
          >
            <option value="">단위</option>
            {costUnits.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
          <select
            value={form.type}
            onChange={(e) =>
              setForm((f) => ({ ...f, type: e.target.value }))
            }
            className="flex-1 rounded border border-neutral-200 px-2 py-1.5 text-sm focus:border-neutral-400 focus:outline-none"
          >
            <option value="">타입</option>
            {cardTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-1">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="rounded px-2 py-1 text-sm text-neutral-500 hover:bg-neutral-100"
          >
            취소
          </button>
          <button
            type="button"
            onClick={saveEdit}
            className="rounded bg-neutral-800 px-2 py-1 text-sm text-white hover:bg-neutral-700"
          >
            적용
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        group flex min-h-[100px] flex-col rounded-lg border border-neutral-200
        bg-white p-3 shadow-sm transition-shadow hover:shadow-md
      "
    >
      <div className="font-medium text-foreground">{card.title}</div>
      <div className="mt-1 text-sm text-neutral-500">
        <div>{card.costValue}{card.costUnit}</div>
        <div>{card.type}</div>
      </div>
      <div className="mt-3 flex gap-2 pt-2 border-t border-neutral-100 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={startEdit}
          className="flex flex-1 items-center justify-center rounded border border-neutral-300 bg-white px-2 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-800"
          aria-label="수정"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={handleRemove}
          className="flex flex-1 items-center justify-center rounded border border-red-200 bg-white px-2 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
          aria-label="삭제"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
