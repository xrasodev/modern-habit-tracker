import { useState, useMemo } from "react";
import { useHabits } from "../context/HabitsContext";
import type { DailyEntryBase, SessionLogState } from "../types/data";
import { formatDate, formatISODate, getTomorrowDate } from "../utils/dayUtils";

interface UseDailySetupProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: string;
}

export const useDailySetup = ({
  isOpen,
  onClose,
  initialDate,
}: UseDailySetupProps) => {
  const { habits, plannedDays, updatePlannedDay } = useHabits();

  const todayDate = useMemo(() => new Date(), []);
  const tomorrowDate = useMemo(() => getTomorrowDate(), []);
  const todayISO = formatISODate(todayDate);
  const tomorrowISO = formatISODate(tomorrowDate);

  const dateOptions = useMemo(
    () => [
      { value: todayISO, label: `Today · ${formatDate(todayDate)}` },
      { value: tomorrowISO, label: `Tomorrow · ${formatDate(tomorrowDate)}` },
    ],
    [todayISO, tomorrowISO, todayDate, tomorrowDate],
  );

  const [selectedDateISO, setSelectedDateISO] = useState<string>(
    initialDate || todayISO,
  );
  const [selectedHabitIds, setSelectedHabitIds] = useState<string[]>([]);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [prevDateISO, setPrevDateISO] = useState(selectedDateISO);

  // --- LÓGICA DE SINCRONIZACIÓN Y CARGA DE HÁBITOS EXISTENTES ---
  const getInitialHabits = () => {
    const dayToLoad = plannedDays.find((d) => d.date === selectedDateISO);
    return dayToLoad && Array.isArray(dayToLoad.entries)
      ? dayToLoad.entries.map((entry) => entry.habitId)
      : habits.filter((h) => !h.deletedAt).map((h) => h.id);
  };

  if (isOpen && !prevIsOpen) {
    setSelectedHabitIds(getInitialHabits());
    setPrevIsOpen(true);
  } else if (!isOpen && prevIsOpen) {
    setPrevIsOpen(false);
  }

  if (selectedDateISO !== prevDateISO) {
    const dayToLoad = plannedDays.find((d) => d.date === selectedDateISO);
    const newIds =
      dayToLoad && Array.isArray(dayToLoad.entries)
        ? dayToLoad.entries.map((entry) => entry.habitId)
        : habits.filter((h) => !h.deletedAt).map((h) => h.id);

    setSelectedHabitIds(newIds);
    setPrevDateISO(selectedDateISO);
  }

  const selectedHabits = habits.filter((h) => selectedHabitIds.includes(h.id));

  const handleToggleHabit = (habitId: string) => {
    setSelectedHabitIds((prevIds) =>
      prevIds.includes(habitId)
        ? prevIds.filter((id) => id !== habitId)
        : [...prevIds, habitId],
    );
  };

  const handleSelectAll = () => {
    const allActiveIds = habits.filter((h) => !h.deletedAt).map((h) => h.id);
    setSelectedHabitIds(allActiveIds);
  };

  const handleSelectNone = () => {
    setSelectedHabitIds([]);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const currentDayToEdit = plannedDays.find(
      (d) => d.date === selectedDateISO,
    );

    const newDayBase: DailyEntryBase = {
      date: selectedDateISO,
      entries: [],
    };

    const dayToEdit: DailyEntryBase = (currentDayToEdit ||
      newDayBase) as DailyEntryBase;

    if (!dayToEdit.entries) {
      dayToEdit.entries = [];
    }

    const newEntries: SessionLogState[] = selectedHabitIds.map((habitId) => {
      const habitDef = habits.find((h) => h.id === habitId);
      const existingEntry = dayToEdit.entries.find(
        (e) => e.habitId === habitId,
      );

      if (existingEntry) {
        return existingEntry;
      }

      return {
        habitId: habitId,
        habitName: habitDef?.name,
        color: habitDef?.color || "gray-400",
        status: "pending",
        targetTimeMinutes: habitDef?.targetTimeMinutes || 30,
        selfRating: 3,
        notes: "",
      } as SessionLogState;
    });

    const updatedDay: DailyEntryBase = {
      ...dayToEdit,
      entries: newEntries,
    };

    updatePlannedDay(updatedDay);
    onClose();
  };

  return {
    selectedDateISO,
    setSelectedDateISO,
    selectedHabitIds,
    selectedHabits,
    habits,
    isHabitsEmpty: habits.length === 0,
    dateOptions,
    initialDate,

    handleToggleHabit,
    handleSelectAll,
    handleSelectNone,
    handleSave,
  };
};
