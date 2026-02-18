import { useMemo } from "react";
import type { DailyEntryBase, HabitDefinition } from "../types/data";
import { formatISODate } from "../utils/dayUtils";

interface HabitMetric {
  name: string;
  color: string;
  completedCount: number;
  successRate: number;
  timeDisplay: string;
  totalMinutes: number;
}

interface StatsResult {
  totalActiveHabits: number;
  currentStreak: number;
  successRate: number;
  totalHours: number;
  habitMetrics: HabitMetric[];
}

export const useHabitStats = (
  habits: HabitDefinition[],
  days: DailyEntryBase[],
  isLoading: boolean,
): StatsResult | null => {
  return useMemo(() => {
    if (isLoading || !habits || !days || days.length === 0) return null;

    const activeHabits = habits.filter((h) => !h.deletedAt);

    const completedDates = new Set(
      days
        .filter((d) => d.entries?.some((e) => e.status === "completed"))
        .map((d) => d.date),
    );

    let currentStreak = 0;
    const checkDate = new Date(); // Current local time

    const todayISO = formatISODate(checkDate);

    // If today is not completed, we check from yesterday
    if (!completedDates.has(todayISO)) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
      const dateStr = formatISODate(checkDate);
      if (completedDates.has(dateStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    let globalTotalMinutes = 0;
    let globalTotalEntries = 0;
    let globalCompletedEntries = 0;

    const habitMetrics = activeHabits
      .map((h) => {
        const habitEntries = days
          .flatMap((d) => d.entries || [])
          .filter((e) => e.habitId === h.id);

        const completedCount = habitEntries.filter(
          (e) => e.status === "completed",
        ).length;

        const totalMinutes = habitEntries
          .filter((e) => e.status === "completed")
          .reduce((acc, curr) => acc + (curr.sessionTimeMinutes || 0), 0);

        const successRate =
          habitEntries.length > 0
            ? Math.round((completedCount / habitEntries.length) * 100)
            : 0;

        globalTotalMinutes += totalMinutes;
        globalTotalEntries += habitEntries.length;
        globalCompletedEntries += completedCount;

        const hrs = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;
        const timeDisplay = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;

        return {
          name: h.name,
          color: h.color,
          completedCount,
          successRate,
          timeDisplay,
          totalMinutes,
        };
      })
      .sort((a, b) => b.totalMinutes - a.totalMinutes);

    return {
      totalActiveHabits: activeHabits.length,
      currentStreak,
      successRate:
        globalTotalEntries > 0
          ? Math.round((globalCompletedEntries / globalTotalEntries) * 100)
          : 0,
      totalHours: Math.round(globalTotalMinutes / 60),
      habitMetrics,
    };
  }, [habits, days, isLoading]);
};
