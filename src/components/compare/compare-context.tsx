"use client";

import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
  type ReactNode,
} from "react";

const STORAGE_KEY = "fitmyball_compare_balls";
const MAX_BALLS = 4;

interface SelectedBall {
  id: string;
  name: string;
}

interface CompareContextValue {
  selectedBalls: SelectedBall[];
  addBall: (ball: SelectedBall) => void;
  removeBall: (id: string) => void;
  clearAll: () => void;
  isSelected: (id: string) => boolean;
  isFull: boolean;
  count: number;
}

const CompareContext = createContext<CompareContextValue | null>(null);

function loadSavedBalls(): SelectedBall[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function CompareProvider({ children }: { children: ReactNode }) {
  const [selectedBalls, setSelectedBalls] = useState<SelectedBall[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load saved balls on mount
  useEffect(() => {
    setSelectedBalls(loadSavedBalls());
    setIsHydrated(true);
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedBalls));
      } catch {
        // localStorage might be full or unavailable
      }
    }
  }, [selectedBalls, isHydrated]);

  const addBall = useCallback((ball: SelectedBall) => {
    setSelectedBalls((prev) => {
      // Don't add if already exists
      if (prev.some((b) => b.id === ball.id)) {
        return prev;
      }
      // Don't add if already at max
      if (prev.length >= MAX_BALLS) {
        return prev;
      }
      return [...prev, ball];
    });
  }, []);

  const removeBall = useCallback((id: string) => {
    setSelectedBalls((prev) => prev.filter((ball) => ball.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setSelectedBalls([]);
  }, []);

  const isSelected = useCallback(
    (id: string) => selectedBalls.some((ball) => ball.id === id),
    [selectedBalls]
  );

  const contextValue: CompareContextValue = {
    selectedBalls,
    addBall,
    removeBall,
    clearAll,
    isSelected,
    isFull: selectedBalls.length >= MAX_BALLS,
    count: selectedBalls.length,
  };

  return (
    <CompareContext.Provider value={contextValue}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}
