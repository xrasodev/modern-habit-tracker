import React, { useState, useMemo, type ReactNode } from "react";
import type {
  AppNotification,
  DailyEntryBase,
  HabitDefinition,
  SessionLogState,
} from "../types/data";
import demoDataArray from "./demoData.json";
import demoHabits from "./demoHabits.json";

import { AuthContext } from "../context/AuthContext";
import { HabitsContext } from "../context/HabitsContext";
import DemoBanner from "./DemoBanner";

interface DemoDayJson {
  entries: SessionLogState[];
}

// --- UTILITY FUNCTIONS ---
const formatISODate = (date: Date): string =>
  date.toISOString().substring(0, 10);

const getLastNDaysISOs = (n: number): string[] => {
  const dates: string[] = [];
  const currentDate = new Date();
  for (let i = 0; i < n; i++) {
    const isoDate = formatISODate(currentDate);
    dates.unshift(isoDate);
    currentDate.setDate(currentDate.getDate() - 1);
  }
  return dates;
};

// --- DEMO PROVIDER COMPONENT ---
export const DemoProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Auth state
  const [userId] = useState<string>("demo-user");
  const [isAuthReady] = useState(true);
  const [isAuthLoading] = useState(false);

  // Habits state
  // Initializers (Synchronous)
  const getInitialDaysMap = (): Map<string, DailyEntryBase> => {
    const loadedDaysMap = new Map<string, DailyEntryBase>();
    const today = new Date();

    (demoDataArray as DemoDayJson[]).forEach((day, index) => {
      const dateObj = new Date(today);
      dateObj.setDate(today.getDate() - index);
      // We use the helper defined outside component or we need to ensure it's available.
      // formatISODate is defined above component scope, so safe.
      const dynamicDate = formatISODate(dateObj);

      loadedDaysMap.set(dynamicDate, {
        date: dynamicDate,
        entries: day.entries || [],
      });
    });
    return loadedDaysMap;
  };

  const getInitialHabitsMap = (): Map<string, HabitDefinition> => {
    const loadedHabitsMap = new Map<string, HabitDefinition>();
    demoHabits.forEach((habit) => {
      loadedHabitsMap.set(habit.id, {
        ...habit,
        description: habit.description || "",
      });
    });
    return loadedHabitsMap;
  };

  // Habits state
  const [daysMap, setDaysMap] =
    useState<Map<string, DailyEntryBase>>(getInitialDaysMap);
  const [habitsMap, setHabitsMap] =
    useState<Map<string, HabitDefinition>>(getInitialHabitsMap);
  const [notification, setNotification] = useState<AppNotification | null>(
    null,
  );
  // Data is loaded synchronously from JSON
  const [isDataLoaded] = useState(true);

  // Memoized todayISO
  const todayISO = useMemo(() => formatISODate(new Date()), []);

  // --- COMPUTED VALUES ---
  const days = useMemo(() => {
    const last100DaysISOs = getLastNDaysISOs(100);

    const fullDayHistory: DailyEntryBase[] = last100DaysISOs.map((isoDate) => {
      const existingData = daysMap.get(isoDate);
      if (existingData) {
        return existingData;
      }

      return {
        date: isoDate,
        entries: [],
      } as DailyEntryBase;
    });
    return fullDayHistory;
  }, [daysMap]);

  const habits = useMemo(() => {
    return Array.from(habitsMap.values()).filter((h) => !h.deletedAt);
  }, [habitsMap]);

  const plannedDays = useMemo(() => {
    return Array.from(daysMap.values());
  }, [daysMap]);

  const [calendarUrl, setCalendarUrl] = useState<string | null>(
    "https://calendar.google.com/calendar/embed?src=usa__en@holiday.calendar.google.com&ctz=America/New_York&mode=AGENDA",
  );
  const isCalendarLoading = false;
  const isLoading = !isDataLoaded;

  // --- AUTH METHODS (Demo implementations) ---
  const loginUser = async (): Promise<void> => {
    console.log("🚀 Demo Mode: Login called (no Firebase)");
    return Promise.resolve();
  };

  const signOutUser = async (): Promise<void> => {
    console.log("🚀 Demo Mode: Sign out called");
    // Clear demo mode flag and reload (Acts as Exit Demo)
    localStorage.removeItem("isDemoMode");
    window.location.reload();
  };

  // --- HABITS METHODS (Demo implementations) ---
  const updatePlannedDay = async (
    dayToUpdate: DailyEntryBase,
  ): Promise<void> => {
    console.log("🚀 Demo Mode: Updating day", dayToUpdate.date);

    setDaysMap((prev) => {
      const newMap = new Map(prev);
      const updatedDay = {
        ...dayToUpdate,
        entries: [...dayToUpdate.entries],
      };

      newMap.set(dayToUpdate.date, updatedDay);
      return newMap;
    });

    return Promise.resolve();
  };

  const updateDayEntries = async (
    date: string,
    newEntries: SessionLogState[],
  ): Promise<void> => {
    console.log("🚀 Demo Mode: Updating day entries for", date);
    const dayToUpdate: DailyEntryBase = {
      date: date,
      entries: newEntries,
    };
    await updatePlannedDay(dayToUpdate);
  };

  const addHabit = async (
    newHabitData: Omit<HabitDefinition, "id">,
  ): Promise<void> => {
    console.log("🚀 Demo Mode: Adding habit", newHabitData.name);
    const newId = `demo-habit-${Date.now()}`;
    const newHabit: HabitDefinition = {
      id: newId,
      ...newHabitData,
    };

    setHabitsMap((prev) => {
      const newMap = new Map(prev);
      newMap.set(newId, newHabit);
      return newMap;
    });

    return Promise.resolve();
  };

  const updateHabit = async (
    habitId: string,
    updates: Partial<Omit<HabitDefinition, "id">>,
  ): Promise<void> => {
    console.log("🚀 Demo Mode: Updating habit", habitId);
    setHabitsMap((prev) => {
      const newMap = new Map(prev);
      const existingHabit = newMap.get(habitId);
      if (existingHabit) {
        newMap.set(habitId, { ...existingHabit, ...updates });
      }
      return newMap;
    });
    return Promise.resolve();
  };

  const logSession = async (
    entryDate: string,
    logData: Omit<SessionLogState, "id" | "date">,
  ): Promise<void> => {
    console.log("🚀 Demo Mode: Logging session for", entryDate);

    const dayToUpdate = days.find((day) => day.date === entryDate);
    let updatedDay: DailyEntryBase;

    if (dayToUpdate) {
      updatedDay = {
        ...dayToUpdate,
        entries: [...dayToUpdate.entries],
      };
      const entryIndex = updatedDay.entries.findIndex(
        (entry) => entry.habitId === logData.habitId,
      );

      if (entryIndex !== -1) {
        updatedDay.entries[entryIndex] = logData;
      } else {
        updatedDay.entries.push(logData);
      }
    } else {
      updatedDay = {
        date: entryDate,
        entries: [logData],
      };
    }

    await updatePlannedDay(updatedDay);
  };

  const softDeleteHabit = async (habitId: string): Promise<void> => {
    console.log("🚀 Demo Mode: Soft deleting habit", habitId);
    const habitToArchive = habitsMap.get(habitId);
    if (!habitToArchive) return;

    setHabitsMap((prev) => {
      const newMap = new Map(prev);
      newMap.set(habitId, { ...habitToArchive, deletedAt: todayISO });
      return newMap;
    });

    setNotification({
      message: `Habit "${habitToArchive.name}" archived.`,
      action: "RESTORE",
      targetHabitId: habitId,
    });

    setTimeout(() => setNotification(null), 5000);
    return Promise.resolve();
  };

  const restoreHabit = async (habitId: string): Promise<void> => {
    console.log("🚀 Demo Mode: Restoring habit", habitId);
    setNotification(null);

    setHabitsMap((prev) => {
      const newMap = new Map(prev);
      const habit = newMap.get(habitId);
      if (habit) {
        const { deletedAt: _deletedAt, ...rest } = habit;
        newMap.set(habitId, rest as HabitDefinition);
      }
      return newMap;
    });

    return Promise.resolve();
  };

  const updateCalendarUrl = async (url: string): Promise<void> => {
    console.log("🚀 Demo Mode: Temporarily updating calendar URL to", url);
    setCalendarUrl(url);
    return Promise.resolve();
  };

  return (
    <AuthContext.Provider
      value={{
        userId,
        isAuthReady,
        isAuthLoading,
        loginUser,
        signOutUser,
      }}
    >
      <HabitsContext.Provider
        value={{
          days,
          plannedDays,
          habits,
          updatePlannedDay,
          updateDayEntries,
          addHabit,
          updateHabit,
          logSession,
          softDeleteHabit,
          restoreHabit,
          notification,
          isLoading,
          calendarUrl,
          isCalendarLoading,
          updateCalendarUrl,
        }}
      >
        <DemoBanner />
        {children}
      </HabitsContext.Provider>
    </AuthContext.Provider>
  );
};
