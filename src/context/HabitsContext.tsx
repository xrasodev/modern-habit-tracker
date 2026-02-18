import { createContext, useContext } from "react";
import type { HabitsContextType } from "../types/data";

export const HabitsContext = createContext<HabitsContextType | undefined>(
  undefined,
);

// --- HABITS HOOK ---
export const useHabits = () => {
  const context = useContext(HabitsContext);
  if (context === undefined) {
    throw new Error("useHabits has to be used inside a HabitsProvider");
  }
  return context;
};
