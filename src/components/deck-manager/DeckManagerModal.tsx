"use client";

import { X } from "lucide-react";
import { DeckManagerView } from "./DeckManagerView";

interface DeckManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DeckManagerModal({ isOpen, onClose }: DeckManagerModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="deck-manager-modal-title"
    >
      <div
        className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
          <h2 id="deck-manager-modal-title" className="text-lg font-semibold">
            Deck Manager
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
          <DeckManagerView isInModal onCloseModal={onClose} />
        </div>
      </div>
    </div>
  );
}
