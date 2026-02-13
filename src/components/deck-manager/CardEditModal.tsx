"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useGameStore, type Card } from "@/store/useGameStore";

interface CardEditModalProps {
  isOpen: boolean;
  card: Card | null;
  onClose: () => void;
  onSave: (card: Card) => void;
}

export function CardEditModal({
  isOpen,
  card,
  onClose,
  onSave,
}: CardEditModalProps) {
  const cardTypes = useGameStore((s) => s.cardTypes);
  const costUnits = useGameStore((s) => s.costUnits);
  const [form, setForm] = useState({
    title: "",
    costValue: 0,
    costUnit: "",
    type: "",
  });

  useEffect(() => {
    if (card) {
      setForm({
        title: card.title,
        costValue: card.costValue,
        costUnit: card.costUnit,
        type: card.type,
      });
    }
  }, [card]);

  if (!isOpen || !card) return null;

  const handleSave = () => {
    onSave({ ...card, ...form });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">카드 수정</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="rounded p-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              카드 이름
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="카드 이름"
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-400 focus:outline-none"
              autoFocus
            />
          </div>

          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">
                비용
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={0}
                  value={form.costValue}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, costValue: Number(e.target.value) || 0 }))
                  }
                  className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-400 focus:outline-none"
                  placeholder="숫자"
                />
                <select
                  value={form.costUnit}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, costUnit: e.target.value }))
                  }
                  className="w-32 rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-400 focus:outline-none"
                >
                  <option value="">단위 선택</option>
                  {costUnits.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">
                타입
              </label>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm((f) => ({ ...f, type: e.target.value }))
                }
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-400 focus:outline-none"
              >
                <option value="">타입 선택</option>
                {cardTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
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
    </div>
  );
}
