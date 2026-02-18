export interface PlannedEntry {
  date: string;
  entries: PlannedTaskEntry[];
}

export interface PlannedTaskEntry {
  habitId: string;
  status: HabitStatus;
  targetTimeMinutes: number;
}

export interface DailyEntryBase {
  date: string;
  entries: SessionLogState[];
}

export interface DailyEntry extends DailyEntryBase {
  dayNumber: number;
  completedHabits: number;
  totalHabits: number;
}

export interface HabitDefinition {
  id: string;
  name: string;
  description: string;
  targetTimeMinutes: number;
  color: string;
  deletedAt?: string;
}

export interface HabitsContextType {
  days: DailyEntryBase[];
  plannedDays: PlannedEntry[];
  habits: HabitDefinition[];
  isLoading: boolean;
  notification: AppNotification | null;
  calendarUrl: string | null;
  isCalendarLoading: boolean;

  updatePlannedDay: (dayToUpdate: DailyEntryBase) => Promise<void>;
  updateDayEntries: (
    date: string,
    newEntries: SessionLogState[],
  ) => Promise<void>;
  addHabit: (newHabit: Omit<HabitDefinition, "id">) => Promise<void>;
  updateHabit: (
    habitId: string,
    updates: Partial<Omit<HabitDefinition, "id">>,
  ) => Promise<void>;
  softDeleteHabit: (habitId: string) => Promise<void>;
  restoreHabit: (habitId: string) => Promise<void>;
  logSession: (
    entryDate: string,
    logData: Omit<SessionLogState, "id" | "date">,
  ) => Promise<void>;
  updateCalendarUrl: (url: string) => Promise<void>;
}

export type HabitStatus = "pending" | "completed" | "missed";

export interface StatusConfig {
  id: HabitStatus;
  label: string;
  icon: string;
  colorClass: string;
  colorBg: string;
}

export interface SessionLogState {
  id?: string;
  habitId: string;
  habitName: string;
  color: string;
  status: HabitStatus;
  sessionTime: string;
  targetTimeMinutes: number;
  sessionTimeMinutes: number;
  selfRating: number;
  notes: string;
  date?: string;
}

export interface CompletedSessionLog extends SessionLogState {
  date: string;
}

export interface AvailableHabit {
  id: string;
  name: string;
  color: string;
  targetTimeMinutes: number;
}

export interface LogSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableHabits: AvailableHabit[]; // Lista de hábitos para el select
  onLog: (logData: CompletedSessionLog) => void;
  dailyLogs: DailyEntryBase[];
  isUpdate?: boolean;
  habit?: SessionLogState | null;
}

export interface DailyEntryDisplay {
  date: string;
  completedHabits: number;
  totalHabits: number;
  isFuture: boolean;
  colorProgress: string;
  isTodayFlag: boolean;
  entries: SessionLogState[];
}

export interface AppNotification {
  message: string;
  action?: "RESTORE" | "DELETE";
  targetHabitId?: string;
}
