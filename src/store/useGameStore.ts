import { create } from "zustand";
import { arrayMove } from "@dnd-kit/sortable";

export type CardType = string;

export interface Card {
  id: string;
  title: string;
  costValue: number;
  costUnit: string;
  type: CardType;
}

export interface Deck {
  id: string;
  title: string;
  cards: Card[];
}

export type RoadmapTaskStatus = "locked" | "active" | "completed";

export interface RoadmapTask {
  id: string;
  title: string;
  status: RoadmapTaskStatus;
  /** 덱 카드를 드래그해 만든 할 일인 경우, 해당 카드 id (할 일 삭제 시 덱은 그대로 유지) */
  linkedCardId?: string;
}

export interface RoadmapStage {
  id: string;
  index: number;
  title: string;
  tasks: RoadmapTask[];
}

const DUMMY_DECK: Card[] = [
  { id: "card-1", title: "모닝 루틴", costValue: 1, costUnit: "시간", type: "action" },
  { id: "card-2", title: "딥 워크", costValue: 2, costUnit: "시간", type: "skill" },
  { id: "card-3", title: "에너지 충전", costValue: 0, costUnit: "시간", type: "resource" },
  { id: "card-4", title: "미팅 정리", costValue: 1, costUnit: "시간", type: "event" },
  { id: "card-5", title: "자유 선택", costValue: 1, costUnit: "시간", type: "wild" },
];

const DUMMY_DECKS: Deck[] = [
  { id: "deck-1", title: "기본 덱", cards: [...DUMMY_DECK] },
  { id: "deck-2", title: "주간 루틴", cards: DUMMY_DECK.slice(0, 3) },
];

function generateId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const INITIAL_ROADMAP_STAGES: RoadmapStage[] = [
  { id: generateId("stage"), index: 0, title: "", tasks: [] },
  { id: generateId("stage"), index: 1, title: "", tasks: [] },
];

export interface GameState {
  field: Card[];
  decks: Deck[];
  activeDeckId: string | null;
  roadmapDeckId: string | null;
  roadmapStages: RoadmapStage[];
  cardTypes: string[];
  costUnits: string[];
  setActiveDeckId: (id: string | null) => void;
  setRoadmapDeckId: (id: string | null) => void;
  moveCardToField: (card: Card) => void;
  moveCardToDeck: (cardId: string) => void;
  reorderFieldCards: (oldIndex: number, newIndex: number) => void;
  removeCardFromField: (cardId: string) => void;
  clearField: () => void;
  createDeck: (title: string) => void;
  updateDeck: (deckId: string, newCards: Card[]) => void;
  deleteDeck: (deckId: string) => void;
  addStage: (index: number) => void;
  deleteStage: (stageId: string) => void;
  updateStageTitle: (stageId: string, newTitle: string) => void;
  addTask: (
    stageId: string,
    title: string,
    options?: { linkCard?: boolean; linkedCardId?: string }
  ) => void;
  deleteTask: (stageId: string, taskId: string) => void;
  updateTask: (stageId: string, taskId: string, newTitle: string) => void;
  moveTask: (
    activeId: string,
    overId: string,
    activeStageId: string,
    overStageId: string
  ) => void;
  setCardTypes: (types: string[]) => void;
  addCardType: (type: string) => void;
  removeCardType: (type: string) => void;
  setCostUnits: (units: string[]) => void;
  addCostUnit: (unit: string) => void;
  removeCostUnit: (unit: string) => void;
}

export const useGameStore = create<GameState>((set) => ({
  field: [],
  decks: DUMMY_DECKS,
  activeDeckId: null,
  roadmapDeckId: null,
  cardTypes: ["action", "resource", "skill", "event", "wild"],
  costUnits: ["시간", "분", "원"],

  setActiveDeckId: (id) =>
    set((state) => ({
      activeDeckId: id,
      field: id !== state.activeDeckId ? [] : state.field,
    })),

  setRoadmapDeckId: (id) => set({ roadmapDeckId: id }),

  moveCardToField: (card) =>
    set((state) => ({ field: [...state.field, card] })),

  moveCardToDeck: (cardId) =>
    set((state) => ({
      field: state.field.filter((c) => c.id !== cardId),
    })),

  reorderFieldCards: (oldIndex, newIndex) =>
    set((state) => ({
      field: arrayMove(state.field, oldIndex, newIndex),
    })),

  removeCardFromField: (cardId) =>
    set((state) => ({
      field: state.field.filter((c) => c.id !== cardId),
    })),

  clearField: () => set({ field: [] }),

  createDeck: (title) =>
    set((state) => ({
      decks: [
        ...state.decks,
        { id: generateId("deck"), title, cards: [] },
      ],
    })),

  updateDeck: (deckId, newCards) =>
    set((state) => ({
      decks: state.decks.map((d) =>
        d.id === deckId ? { ...d, cards: newCards } : d
      ),
    })),

  deleteDeck: (deckId) =>
    set((state) => ({
      decks: state.decks.filter((d) => d.id !== deckId),
      roadmapDeckId:
        state.roadmapDeckId === deckId ? null : state.roadmapDeckId,
    })),

  roadmapStages: INITIAL_ROADMAP_STAGES,

  addStage: (index) =>
    set((state) => {
      const newStage: RoadmapStage = {
        id: generateId("stage"),
        index,
        title: "",
        tasks: [],
      };
      const updated = [...state.roadmapStages];
      updated.splice(index, 0, newStage);
      return {
        roadmapStages: updated.map((s, i) => ({ ...s, index: i })),
      };
    }),

  deleteStage: (stageId) =>
    set((state) => {
      const filtered = state.roadmapStages.filter((s) => s.id !== stageId);
      if (filtered.length < 2) return state;
      return {
        roadmapStages: filtered.map((s, i) => ({ ...s, index: i })),
      };
    }),

  updateStageTitle: (stageId, newTitle) =>
    set((state) => ({
      roadmapStages: state.roadmapStages.map((stage) =>
        stage.id === stageId ? { ...stage, title: newTitle } : stage
      ),
    })),

  addTask: (stageId, title, options) =>
    set((state) => {
      const linkCard = options?.linkCard !== false;
      const newTask = {
        id: generateId("task"),
        title,
        status: "active" as RoadmapTaskStatus,
        ...(options?.linkedCardId && { linkedCardId: options.linkedCardId }),
      };
      const updatedStages = state.roadmapStages.map((stage) =>
        stage.id === stageId
          ? { ...stage, tasks: [...stage.tasks, newTask] }
          : stage
      );
      if (!linkCard || !state.roadmapDeckId) {
        return { roadmapStages: updatedStages };
      }
      const deck = state.decks.find((d) => d.id === state.roadmapDeckId);
      if (!deck) return { roadmapStages: updatedStages };
      const newCard: Card = {
        id: generateId("card"),
        title,
        costValue: 0,
        costUnit: state.costUnits[0] ?? "시간",
        type: state.cardTypes[0] ?? "action",
      };
      const updatedDecks = state.decks.map((d) =>
        d.id === state.roadmapDeckId
          ? { ...d, cards: [...d.cards, newCard] }
          : d
      );
      return { roadmapStages: updatedStages, decks: updatedDecks };
    }),

  deleteTask: (stageId, taskId) =>
    set((state) => ({
      roadmapStages: state.roadmapStages.map((stage) =>
        stage.id === stageId
          ? {
              ...stage,
              tasks: stage.tasks.filter((t) => t.id !== taskId),
            }
          : stage
      ),
    })),

  updateTask: (stageId, taskId, newTitle) =>
    set((state) => ({
      roadmapStages: state.roadmapStages.map((stage) =>
        stage.id === stageId
          ? {
              ...stage,
              tasks: stage.tasks.map((task) =>
                task.id === taskId ? { ...task, title: newTitle } : task
              ),
            }
          : stage
      ),
    })),

  moveTask: (activeId, overId, activeStageId, overStageId) =>
    set((state) => {
      const activeStage = state.roadmapStages.find(
        (s) => s.id === activeStageId
      );
      const overStage = state.roadmapStages.find((s) => s.id === overStageId);
      if (!activeStage || !overStage) return state;

      const activeTask = activeStage.tasks.find((t) => t.id === activeId);
      if (!activeTask) return state;

      const activeIndex = activeStage.tasks.findIndex((t) => t.id === activeId);
      if (activeIndex === -1) return state;
      let overIndex: number;
      const overTaskIndex = overStage.tasks.findIndex((t) => t.id === overId);
      if (overStageId === activeStageId) {
        // 같은 컬럼 내: overId를 못 찾으면(컬럼 빈 공간 드롭) 맨 아래로 보냄
        overIndex =
          overTaskIndex !== -1
            ? overTaskIndex
            : Math.max(0, overStage.tasks.length - 1);
      } else {
        // 다른 컬럼: overId를 못 찾으면(컬럼 컨테이너 드롭) 맨 끝에 추가
        overIndex = overTaskIndex !== -1 ? overTaskIndex : overStage.tasks.length;
      }

      if (activeStageId === overStageId) {
        if (activeIndex === overIndex) return state;
        const reordered = arrayMove(activeStage.tasks, activeIndex, overIndex);
        return {
          roadmapStages: state.roadmapStages.map((stage) =>
            stage.id === activeStageId ? { ...stage, tasks: reordered } : stage
          ),
        };
      } else {
        const newActiveTasks = activeStage.tasks.filter((t) => t.id !== activeId);
        const newOverTasks = [...overStage.tasks];
        newOverTasks.splice(overIndex, 0, activeTask);
        return {
          roadmapStages: state.roadmapStages.map((stage) => {
            if (stage.id === activeStageId) return { ...stage, tasks: newActiveTasks };
            if (stage.id === overStageId) return { ...stage, tasks: newOverTasks };
            return stage;
          }),
        };
      }
    }),

  setCardTypes: (types) => set({ cardTypes: types }),
  addCardType: (type) =>
    set((state) => ({
      cardTypes: state.cardTypes.includes(type)
        ? state.cardTypes
        : [...state.cardTypes, type],
    })),
  removeCardType: (type) =>
    set((state) => ({
      cardTypes: state.cardTypes.filter((t) => t !== type),
    })),

  setCostUnits: (units) => set({ costUnits: units }),
  addCostUnit: (unit) =>
    set((state) => ({
      costUnits: state.costUnits.includes(unit)
        ? state.costUnits
        : [...state.costUnits, unit],
    })),
  removeCostUnit: (unit) =>
    set((state) => ({
      costUnits: state.costUnits.filter((u) => u !== unit),
    })),
}));

/** 현재 플레이 중인 덱의 카드 중 필드에 없는 카드만 반환 (사이드바용). decks/field 구독 시 덱 매니저 변경 즉시 반영 */
export function selectSidebarCards(state: GameState): Card[] {
  if (!state.activeDeckId) return [];
  const deck = state.decks.find((d) => d.id === state.activeDeckId);
  if (!deck) return [];
  return deck.cards.filter(
    (c) => !state.field.some((f) => f.id === c.id)
  );
}
