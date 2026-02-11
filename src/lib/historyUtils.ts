export interface HistoryItem {
  id: string;
  tool: string;
  fileName: string;
  timestamp: number;
  thumbnail?: string;
}

const HISTORY_KEY = "ai_tools_history";
const MAX_ITEMS = 10;

export const getHistory = (): HistoryItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
};

export const clearHistory = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(HISTORY_KEY);
  window.dispatchEvent(new Event("historyUpdated"));
};

export const addToHistory = (item: Omit<HistoryItem, "id" | "timestamp">) => {
  if (typeof window === "undefined") return;
  
  const newItem: HistoryItem = {
    ...item,
    id: Math.random().toString(36).substr(2, 9),
    timestamp: Date.now(),
  };

  const current = getHistory();
  const updated = [newItem, ...current].slice(0, MAX_ITEMS);
  
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("historyUpdated"));
  } catch (e) {
    console.error("Failed to save history", e);
  }
};
