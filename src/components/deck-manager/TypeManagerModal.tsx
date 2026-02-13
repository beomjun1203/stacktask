"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { useGameStore } from "@/store/useGameStore";

interface TypeManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TypeManagerModal({ isOpen, onClose }: TypeManagerModalProps) {
  const cardTypes = useGameStore((s) => s.cardTypes);
  const costUnits = useGameStore((s) => s.costUnits);
  const setCardTypes = useGameStore((s) => s.setCardTypes);
  const addCardType = useGameStore((s) => s.addCardType);
  const removeCardType = useGameStore((s) => s.removeCardType);
  const setCostUnits = useGameStore((s) => s.setCostUnits);
  const addCostUnit = useGameStore((s) => s.addCostUnit);
  const removeCostUnit = useGameStore((s) => s.removeCostUnit);

  const [newType, setNewType] = useState("");
  const [newUnit, setNewUnit] = useState("");

  if (!isOpen) return null;

  const handleAddType = () => {
    if (newType.trim() && !cardTypes.includes(newType.trim())) {
      addCardType(newType.trim());
      setNewType("");
    }
  };

  const handleAddUnit = () => {
    if (newUnit.trim() && !costUnits.includes(newUnit.trim())) {
      addCostUnit(newUnit.trim());
      setNewUnit("");
    }
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
          <h3 className="text-lg font-semibold text-foreground">타입 관리</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="rounded p-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-700">
              카드 타입
            </label>
            <div className="mb-2 flex gap-2">
              <input
                type="text"
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddType()}
                placeholder="새 타입 입력"
                className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddType}
                className="flex items-center gap-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                <Plus className="h-4 w-4" />
                추가
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {cardTypes.map((type) => (
                <div
                  key={type}
                  className="flex items-center gap-1 rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-1.5 text-sm"
                >
                  <span>{type}</span>
                  <button
                    type="button"
                    onClick={() => removeCardType(type)}
                    className="text-neutral-500 hover:text-red-600"
                    aria-label={`${type} 삭제`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-700">
              비용 단위
            </label>
            <div className="mb-2 flex gap-2">
              <input
                type="text"
                value={newUnit}
                onChange={(e) => setNewUnit(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddUnit()}
                placeholder="새 단위 입력 (예: 시간, 분, 원)"
                className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddUnit}
                className="flex items-center gap-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                <Plus className="h-4 w-4" />
                추가
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {costUnits.map((unit) => (
                <div
                  key={unit}
                  className="flex items-center gap-1 rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-1.5 text-sm"
                >
                  <span>{unit}</span>
                  <button
                    type="button"
                    onClick={() => removeCostUnit(unit)}
                    className="text-neutral-500 hover:text-red-600"
                    aria-label={`${unit} 삭제`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-neutral-800 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
