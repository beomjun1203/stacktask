"use client";

import { useState, useRef, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X } from "lucide-react";
import type { RoadmapTask } from "@/store/useGameStore";

const TASK_PREFIX = "task-";

export function getTaskId(taskId: string) {
  return `${TASK_PREFIX}${taskId}`;
}

export function parseTaskId(dragId: string): string | null {
  if (typeof dragId !== "string" || !dragId.startsWith(TASK_PREFIX))
    return null;
  return dragId.slice(TASK_PREFIX.length);
}

interface RoadmapTaskNodeProps {
  task: RoadmapTask;
  stageId: string;
  onUpdate: (newTitle: string) => void;
  onDelete: () => void;
}

export function RoadmapTaskNode({
  task,
  stageId,
  onUpdate,
  onDelete,
}: RoadmapTaskNodeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const id = getTaskId(task.id);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: { task, stageId },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (title.trim() && title !== task.title) {
      onUpdate(title.trim());
    } else {
      setTitle(task.title);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleBlur();
    } else if (e.key === "Escape") {
      setTitle(task.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        group relative rounded-lg border-2 border-neutral-200 bg-white
        px-3 py-2 shadow-sm transition-all
        ${isDragging ? "opacity-50 shadow-md z-50" : "hover:border-neutral-300 hover:shadow-md"}
      `}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent text-foreground outline-none"
        />
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className="cursor-text text-foreground"
        >
          {task.title || "할 일을 입력하세요"}
        </div>
      )}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="
          absolute right-2 top-2 opacity-0 transition-opacity
          group-hover:opacity-100
          rounded p-1 text-neutral-400 hover:text-red-500 hover:bg-red-50
        "
        aria-label="삭제"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
