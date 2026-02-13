"use client";

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus, Pencil } from "lucide-react";
import type { RoadmapStage } from "@/store/useGameStore";
import { RoadmapTaskNode, getTaskId } from "./RoadmapTaskNode";

const STAGE_PREFIX = "stage-";

export function getStageId(stageId: string) {
  return `${STAGE_PREFIX}${stageId}`;
}

export function parseStageId(dragId: string): string | null {
  if (typeof dragId !== "string" || !dragId.startsWith(STAGE_PREFIX))
    return null;
  return dragId.slice(STAGE_PREFIX.length);
}

interface RoadmapStageColumnProps {
  stage: RoadmapStage;
  onAddTask: () => void;
  onUpdateTask: (taskId: string, newTitle: string) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTitle: (newTitle: string) => void;
}

export function RoadmapStageColumn({
  stage,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onUpdateTitle,
}: RoadmapStageColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: getStageId(stage.id),
    data: { stage },
  });

  const taskIds = stage.tasks.map((t) => getTaskId(t.id));
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(stage.title);

  const handleTitleSave = () => {
    onUpdateTitle(titleValue);
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setTitleValue(stage.title);
    setIsEditingTitle(false);
  };

  const isEmpty = stage.tasks.length === 0;

  return (
    <div
      ref={setNodeRef}
      className={`
        flex min-w-[300px] flex-col rounded-xl border-2 border-neutral-200
        bg-white p-4 shadow-sm transition-colors
        ${isEmpty ? "w-[300px] flex-shrink-0 aspect-square" : "w-[300px] min-h-[300px] flex-1"}
        ${isOver ? "border-neutral-400 bg-neutral-50" : ""}
      `}
    >
      <div className="mb-3 flex items-center gap-2">
        {isEditingTitle ? (
          <div className="flex flex-1 items-center gap-2">
            <input
              type="text"
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleTitleSave();
                if (e.key === "Escape") handleTitleCancel();
              }}
              className="flex-1 rounded border border-neutral-300 px-2 py-1 text-sm focus:border-neutral-400 focus:outline-none"
              placeholder={`단계 ${stage.index + 1}`}
              autoFocus
            />
            <button
              type="button"
              onClick={handleTitleSave}
              className="rounded px-2 py-1 text-xs text-neutral-600 hover:bg-neutral-100"
            >
              저장
            </button>
            <button
              type="button"
              onClick={handleTitleCancel}
              className="rounded px-2 py-1 text-xs text-neutral-500 hover:bg-neutral-100"
            >
              취소
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 text-sm font-semibold text-neutral-700">
              {stage.title || `단계 ${stage.index + 1}`}
            </div>
            <button
              type="button"
              onClick={() => setIsEditingTitle(true)}
              className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
              aria-label="단계명 편집"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          </>
        )}
      </div>
      <SortableContext
        items={taskIds}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-1 flex-col gap-2 min-h-[200px] overflow-y-auto pr-1">
          {stage.tasks.map((task) => (
            <RoadmapTaskNode
              key={task.id}
              task={task}
              stageId={stage.id}
              onUpdate={(newTitle) => onUpdateTask(task.id, newTitle)}
              onDelete={() => onDeleteTask(task.id)}
            />
          ))}
        </div>
      </SortableContext>
      <button
        type="button"
        onClick={onAddTask}
        className="
          mt-3 flex items-center justify-center gap-2 rounded-lg border-2
          border-dashed border-neutral-300 bg-neutral-50 py-2 text-sm
          font-medium text-neutral-600 transition-colors hover:border-neutral-400
          hover:text-neutral-800 hover:bg-neutral-100
        "
      >
        <Plus className="h-4 w-4" />
        할 일 추가
      </button>
    </div>
  );
}
