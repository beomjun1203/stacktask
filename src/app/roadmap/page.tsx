"use client";

import { Fragment, useRef, useState, useEffect } from "react";
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  closestCenter,
} from "@dnd-kit/core";
import { useGameStore } from "@/store/useGameStore";
import { BackToLobbyLink } from "@/components/layout/BackToLobbyLink";
import { RoadmapStageColumn, getStageId, parseStageId } from "@/components/roadmap/RoadmapStageColumn";
import { StageDivider } from "@/components/roadmap/StageDivider";
import { RoadmapDeckSidebar, parseRoadmapDeckCardId } from "@/components/roadmap/RoadmapDeckSidebar";
import { RoadmapManagerModal } from "@/components/roadmap/RoadmapManagerModal";
import {
  getTaskId,
  parseTaskId,
} from "@/components/roadmap/RoadmapTaskNode";
import { Settings } from "lucide-react";

export default function RoadmapPage() {
  const roadmapStages = useGameStore((s) => s.roadmapStages);
  const decks = useGameStore((s) => s.decks);
  const roadmapDeckId = useGameStore((s) => s.roadmapDeckId);
  const addStage = useGameStore((s) => s.addStage);
  const deleteStage = useGameStore((s) => s.deleteStage);
  const updateStageTitle = useGameStore((s) => s.updateStageTitle);
  const addTask = useGameStore((s) => s.addTask);
  const deleteTask = useGameStore((s) => s.deleteTask);
  const updateTask = useGameStore((s) => s.updateTask);
  const moveTask = useGameStore((s) => s.moveTask);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [roadmapManagerOpen, setRoadmapManagerOpen] = useState(false);
  const lastMoveKeyRef = useRef<string>("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Shift 키를 누르지 않은 상태에서 수직 스크롤을 좌우 스크롤로 변환
      if (!e.shiftKey && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, []);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeIdStr = String(active.id);
    const overIdStr = String(over.id);

    const activeTaskId = parseTaskId(activeIdStr);
    if (!activeTaskId) return;

    const activeData = active.data.current as
      | { task: { id: string }; stageId: string }
      | undefined;
    if (!activeData) return;

    // over가 태스크면: 그 태스크의 stageId, over가 스테이지 컨테이너면: parseStageId로 stageId
    const overTaskId = parseTaskId(overIdStr);
    const overStageId =
      overTaskId
        ? (over.data.current as { task: { id: string }; stageId: string } | undefined)?.stageId
        : parseStageId(overIdStr);

    if (!overStageId) return;

    const key = `${activeTaskId}->${overIdStr}`;
    if (lastMoveKeyRef.current === key) return;
    lastMoveKeyRef.current = key;

    moveTask(
      activeTaskId,
      overTaskId ?? "",
      activeData.stageId,
      overStageId
    );
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const activeIdStr = String(active.id);
    setActiveId(null);
    lastMoveKeyRef.current = "";

    if (!over) return;

    // 덱 카드를 단계에 드롭한 경우: 해당 단계에 할 일 추가 (연동만 표시, 덱에서는 제거하지 않음 → 할 일 삭제 시 덱 카드는 그대로 유지)
    const cardId = parseRoadmapDeckCardId(activeIdStr);
    if (cardId) {
      const card = active.data.current?.card as { title: string } | undefined;
      if (!card) return;
      const overIdStr = String(over.id);
      const overTaskId = parseTaskId(overIdStr);
      const overStageId = overTaskId
        ? (over.data.current as { stageId: string } | undefined)?.stageId
        : parseStageId(overIdStr);
      if (overStageId) {
        addTask(overStageId, card.title, {
          linkCard: false,
          linkedCardId: cardId,
        });
      }
      return;
    }
    // onDragOver에서 실시간으로 moveTask를 처리하므로 태스크 이동은 여기서 상태 정리만
  }

  function handleDragCancel() {
    setActiveId(null);
    lastMoveKeyRef.current = "";
  }

  const activeTask = activeId
    ? (() => {
        const taskId = parseTaskId(activeId);
        if (!taskId) return null;
        for (const stage of roadmapStages) {
          const task = stage.tasks.find((t) => t.id === taskId);
          if (task) return { task, stageId: stage.id };
        }
        return null;
      })()
    : null;

  const activeCardFromDeck =
    activeId && parseRoadmapDeckCardId(activeId)
      ? (() => {
          const cardId = parseRoadmapDeckCardId(activeId);
          if (!cardId) return null;
          for (const deck of decks) {
            const card = deck.cards.find((c) => c.id === cardId);
            if (card) return card;
          }
          return null;
        })()
      : null;

  return (
    <div className="flex h-screen flex-col bg-neutral-100 md:flex-row overflow-hidden">
      <RoadmapManagerModal
        isOpen={roadmapManagerOpen}
        onClose={() => setRoadmapManagerOpen(false)}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="flex flex-shrink-0 items-center gap-4 p-4">
            <BackToLobbyLink />
            <button
              type="button"
              onClick={() => setRoadmapManagerOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50"
            >
              <Settings className="h-4 w-4" />
              로드맵 관리
            </button>
          </div>

          <div
            ref={scrollContainerRef}
            className="flex flex-1 items-center overflow-x-auto overflow-y-hidden"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#d1d5db transparent",
            }}
          >
            <div className="flex min-w-max items-stretch gap-4 px-4 py-6">
              {roadmapStages.map((stage, index) => (
                <Fragment key={stage.id}>
                  <RoadmapStageColumn
                    stage={stage}
                    onAddTask={() => addTask(stage.id, "새 할 일")}
                    onUpdateTask={(taskId, newTitle) =>
                      updateTask(stage.id, taskId, newTitle)
                    }
                    onDeleteTask={(taskId) => {
                      deleteTask(stage.id, taskId);
                      const updatedTasks = stage.tasks.filter(
                        (t) => t.id !== taskId
                      );
                      if (
                        updatedTasks.length === 0 &&
                        roadmapStages.length > 2
                      ) {
                        setTimeout(() => {
                          if (
                            window.confirm(
                              "이 단계의 모든 할 일이 삭제되었습니다. 단계를 삭제할까요?"
                            )
                          ) {
                            deleteStage(stage.id);
                          }
                        }, 100);
                      }
                    }}
                    onUpdateTitle={(newTitle) =>
                      updateStageTitle(stage.id, newTitle)
                    }
                  />
                  {index < roadmapStages.length - 1 && (
                    <StageDivider
                      index={index}
                      onAddStage={() => addStage(index + 1)}
                    />
                  )}
                </Fragment>
              ))}
            </div>
          </div>
        </main>

        <RoadmapDeckSidebar />

        <DragOverlay>
          {activeTask ? (
            <div className="rounded-lg border-2 border-neutral-300 bg-white px-3 py-2 shadow-lg">
              <div className="text-foreground">{activeTask.task.title}</div>
            </div>
          ) : activeCardFromDeck ? (
            <div className="rounded-lg border-2 border-neutral-300 bg-white px-3 py-2 shadow-lg">
              <div className="text-foreground">{activeCardFromDeck.title}</div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
