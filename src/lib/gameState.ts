export type GameStage =
  | "opening"
  | "aurora"
  | "sakura"
  | "waterfall"
  | "nyc"
  | "mountain"
  | "math"
  | "time"
  | "final";

export interface GameProgress {
  currentStage: GameStage;
  puzzle1Completed: boolean;
  puzzle2Completed: boolean;
  puzzle3Completed: boolean;
  puzzle4Completed: boolean;
  gameCompleted: boolean;
  mathCompleted: boolean;
  timeCompleted: boolean;
}

const STORAGE_KEY = "our_little_journey_progress_v1";

export const initialProgress: GameProgress = {
  currentStage: "opening",
  puzzle1Completed: false,
  puzzle2Completed: false,
  puzzle3Completed: false,
  puzzle4Completed: false,
  gameCompleted: false,
  mathCompleted: false,
  timeCompleted: false
};

export function loadSavedProgress(): GameProgress {
  if (typeof window === "undefined") return initialProgress;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialProgress;
    return JSON.parse(raw) as GameProgress;
  } catch {
    return initialProgress;
  }
}

export function saveProgress(progress: GameProgress): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Ignore storage quota
  }
}

export function resetProgress(): GameProgress {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }
  return initialProgress;
}
