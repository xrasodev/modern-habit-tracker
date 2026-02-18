import { useState, useRef } from "react";
import type {
  SessionLogState,
  LogSessionModalProps,
  HabitStatus,
  CompletedSessionLog,
} from "../types/data";
import { getCurrentTime, getTodayDate } from "../utils/dayUtils";

type SessionLogFormState = Omit<
  SessionLogState,
  "id" | "sessionTimeMinutes"
> & {
  sessionTimeMinutes: number | string;
};

export const useSessionLogForm = ({
  isOpen,
  onClose,
  availableHabits,
  onLog,
  dailyLogs,
  isUpdate,
  habit,
}: LogSessionModalProps) => {
  const dateInputRef = useRef<HTMLInputElement>(null);

  const initialHabitDefinition = availableHabits[0];

  // New state to avoid flickering: "Fixed Date Mode"
  const [isFixedDateMode] = useState(() => !!(habit && habit.date));

  const getInitialFormState = (): SessionLogFormState => {
    if (habit && (isUpdate || habit.date)) {
      const { id: _id, ...rest } = habit;

      return {
        ...rest,
        habitId: rest.habitId || initialHabitDefinition?.id || "",
        habitName: rest.habitName || initialHabitDefinition?.name || "",
        color: rest.color || initialHabitDefinition?.color || "",
        targetTimeMinutes: rest.targetTimeMinutes || 30,
        sessionTime: rest.sessionTime || getCurrentTime(),
        sessionTimeMinutes:
          rest.sessionTimeMinutes !== undefined
            ? rest.sessionTimeMinutes
            : rest.targetTimeMinutes || 30,
        selfRating: rest.selfRating !== undefined ? rest.selfRating : 3,
        notes: rest.notes || "",
        date: rest.date || getTodayDate(),
      };
    } else {
      return {
        habitId: initialHabitDefinition?.id || "",
        habitName: initialHabitDefinition?.name || "",
        color: initialHabitDefinition?.color || "",
        status: "pending",
        sessionTime: getCurrentTime(),
        targetTimeMinutes: 30,
        sessionTimeMinutes: 30,
        selfRating: 3,
        notes: "",
        date: getTodayDate(),
      };
    }
  };

  const [formData, setFormData] =
    useState<SessionLogFormState>(getInitialFormState);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [prevHabitId, setPrevHabitId] = useState(habit?.id);

  if (isOpen && !prevIsOpen) {
    setFormData(getInitialFormState());
    setPrevIsOpen(true);
  } else if (!isOpen && prevIsOpen) {
    setPrevIsOpen(false);
  }

  if (habit?.id !== prevHabitId) {
    setFormData(getInitialFormState());
    setPrevHabitId(habit?.id);
  }

  const isExistingInDay = dailyLogs
    .find((d) => d.date === formData.date)
    ?.entries?.some((e) => e.habitId === formData.habitId);

  const [prevDate, setPrevDate] = useState(formData.date);
  const [prevHabitIdSync, setPrevHabitIdSync] = useState(formData.habitId);

  if (formData.date !== prevDate || formData.habitId !== prevHabitIdSync) {
    const day = dailyLogs.find((d) => d.date === formData.date);
    const entry = day?.entries?.find((e) => e.habitId === formData.habitId);

    if (entry) {
      setPrevDate(formData.date);
      setPrevHabitIdSync(formData.habitId);

      setFormData((prev) => ({
        ...prev,
        ...entry,
        status: entry.status || "pending",
      }));
    } else {
      setPrevDate(formData.date);
      setPrevHabitIdSync(formData.habitId);
    }
  }

  const handleHabitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedHabit = availableHabits.find((h) => h.id === selectedId);

    if (!selectedHabit) return;

    const defaultTime = selectedHabit.targetTimeMinutes;

    setFormData((prev) => ({
      ...prev,
      habitId: selectedId,
      habitName: selectedHabit.name,
      color: selectedHabit.color,
      targetTimeMinutes: selectedHabit.targetTimeMinutes,
      sessionTimeMinutes: defaultTime,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    let newValue: string | number = value;

    if (name === "sessionTimeMinutes") {
      if (value === "") {
        newValue = "";
      } else {
        const parsed = parseInt(value);
        newValue = isNaN(parsed) ? "" : parsed;
      }
    }

    if (name === "status") {
      if (value === "missed") {
        setFormData({
          ...formData,
          [name]: value as HabitStatus,
          sessionTimeMinutes: 0,
          selfRating: 0,
        });
      } else {
        setFormData({ ...formData, [name]: value as HabitStatus });
      }
      return;
    }

    setFormData({ ...formData, [name]: newValue } as SessionLogFormState);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ensure sessionTimeMinutes is a valid number before sending
    const finalData = {
      ...formData,
      sessionTimeMinutes:
        formData.sessionTimeMinutes === "" ||
        isNaN(Number(formData.sessionTimeMinutes))
          ? 0
          : Number(formData.sessionTimeMinutes),
    };
    onLog(finalData as CompletedSessionLog);
    onClose();
  };

  return {
    formData,
    isFixedDateMode,
    isExistingInDay,
    dateInputRef,
    handleChange,
    handleHabitChange,
    handleSubmit,
    setFormData,
  };
};
