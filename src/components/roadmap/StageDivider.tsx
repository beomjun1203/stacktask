"use client";

import { Plus } from "lucide-react";

interface StageDividerProps {
  index: number;
  onAddStage: () => void;
}

export function StageDivider({ index, onAddStage }: StageDividerProps) {
  return (
    <div
      className="
        group relative flex w-10 items-center justify-center self-stretch
        transition-all hover:w-12 cursor-pointer
      "
      onClick={onAddStage}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onAddStage()}
    >
      <div
        className="
          h-full w-0.5 bg-neutral-300 transition-all
          group-hover:w-1 group-hover:bg-neutral-400
        "
      />
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onAddStage();
        }}
        className="
          absolute inset-0 flex items-center justify-center
          opacity-0 transition-opacity group-hover:opacity-100
          rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200
        "
        aria-label={`단계 ${index + 1}과 ${index + 2} 사이에 새 단계 추가`}
      >
        <Plus className="h-5 w-5" />
      </button>
    </div>
  );
}
