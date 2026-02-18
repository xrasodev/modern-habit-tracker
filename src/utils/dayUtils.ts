import type { DailyEntry, SessionLogState } from "../types/data";

export const getColorClass = (
  tasksDone: number,
  tasksTotal: number,
): string => {
  const progress = tasksDone / tasksTotal;

  if (tasksTotal === 0) {
    return "bg-slate-800";
  }

  if (progress === 1) return "bg-emerald-400";
  if (progress > 0.75) return "bg-emerald-400/80";
  if (progress >= 0.5) return "bg-emerald-400/50";
  if (progress > 0.25) return "bg-emerald-400/35";
  if (progress > 0) return "bg-emerald-400/15";
  return "bg-slate-700/50";
};

export const calculateHabitSummary = (
  day: Omit<DailyEntry, "completedHabits" | "totalHabits">,
): DailyEntry => {
  const entries: SessionLogState[] = day.entries || [];

  const totalHabits = entries.length;

  const completedHabits = entries.filter((entry) => entry.status).length;

  return {
    ...day,
    totalHabits,
    completedHabits,
  } as DailyEntry;
};

// --- Date Utilities ---

export const getCurrentTime = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const getTodayDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getDateXDaysAgo = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getTomorrowDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow;
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
};

// ISO Format (YYYY-MM-DD) based on local time to avoid timezone issues (UTC)
export const formatISODate = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};
