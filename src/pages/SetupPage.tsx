import React, { useState, useMemo } from "react";
import { ClipboardX, Settings, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useHabits } from "../context/HabitsContext";
import NewHabitModal from "../components/habits/HabitModal";
import LogSessionModal from "../components/habits/LogSessionModal";
import type {
  AvailableHabit,
  HabitDefinition,
  CompletedSessionLog,
} from "../types/data";
import DailySetupModal from "../components/habits/DailySetupModal";
import NotificationBar from "../components/layout/NotificationBar";
import CalendarModal from "../components/calendar/CalendarModal";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { HabitItem } from "../components/habits/HabitItem";

const SetupPage: React.FC = () => {
  const {
    habits,
    addHabit,
    updateHabit,
    logSession,
    days,
    softDeleteHabit,
    restoreHabit,
    calendarUrl,
    updateCalendarUrl,
  } = useHabits();

  const { signOutUser } = useAuth();
  const isDemoMode = localStorage.getItem("isDemoMode") === "true";

  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isDailySetupModalOpen, setIsDailySetupModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  const [habitToEdit, setHabitToEdit] = useState<HabitDefinition | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  const [openMenuHabitId, setOpenMenuHabitId] = useState<string | null>(null);

  // Close menus when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => setOpenMenuHabitId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleToggleMenu = (e: React.MouseEvent, habitId: string) => {
    e.stopPropagation();
    setOpenMenuHabitId(openMenuHabitId === habitId ? null : habitId);
  };

  const { activeHabits, archivedHabits } = useMemo(() => {
    const active = habits.filter((h) => !h.deletedAt);
    const archived = habits.filter((h) => h.deletedAt);
    return { activeHabits: active, archivedHabits: archived };
  }, [habits]);

  const availableHabits: AvailableHabit[] = activeHabits.map((h) => ({
    id: h.id,
    name: h.name,
    color: h.color,
    targetTimeMinutes: h.targetTimeMinutes,
  }));

  const handleEditHabitClick = (habit: HabitDefinition) => {
    setHabitToEdit(habit);
    setIsHabitModalOpen(true);
    setOpenMenuHabitId(null);
  };

  const handleCreateHabitClick = () => {
    setHabitToEdit(null);
    setIsHabitModalOpen(true);
  };

  const handleSaveHabit = (formData: Omit<HabitDefinition, "id">) => {
    const habitData: Omit<HabitDefinition, "id"> = {
      name: formData.name,
      description: formData.description,
      targetTimeMinutes: Number(formData.targetTimeMinutes),
      color: formData.color,
    };

    if (habitToEdit) {
      updateHabit(habitToEdit.id, habitData);
    } else {
      addHabit(habitData);
    }

    setHabitToEdit(null);
    setIsHabitModalOpen(false);
  };

  const handleLogSession = (logData: CompletedSessionLog) => {
    const { date, ...logData2 } = logData;
    logSession(date, logData2);
    setIsLogModalOpen(false);
  };

  const handleDelete = (id: string) => {
    softDeleteHabit(id);
    setOpenMenuHabitId(null);
  };

  const handleRestore = (id: string) => {
    restoreHabit(id);
    setOpenMenuHabitId(null);
  };

  return (
    <div className="text-slate-200 pb-20 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-3 bg-indigo-500/10 rounded-xl">
            <Settings className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-medium text-white">
              Settings & Habits
            </h1>
            <p className="text-sm text-slate-400">
              Manage your daily routines and configure your tracking
              preferences.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar: Quick Actions */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-6">
            <Card
              title="Quick Actions"
              className="bg-gradient-to-br from-slate-900 to-slate-900/50"
            >
              <div className="space-y-3">
                <Button
                  onClick={handleCreateHabitClick}
                  className="w-full justify-start"
                  size="lg"
                >
                  <span className="mr-2 text-xl">✨</span> New Habit
                </Button>

                <Button
                  onClick={() => setIsDailySetupModalOpen(true)}
                  variant="secondary"
                  className="w-full justify-start"
                  size="lg"
                >
                  <span className="mr-2 text-xl">📅</span> Daily Setup
                </Button>

                <Button
                  onClick={() => setIsLogModalOpen(true)}
                  variant="secondary"
                  className="w-full justify-start"
                  size="lg"
                  disabled={availableHabits.length === 0}
                >
                  <span className="mr-2 text-xl">⏱️</span> Log Activity
                </Button>

                <div className="h-px bg-white/10 my-4" />

                <Button
                  onClick={() => setIsCalendarModalOpen(true)}
                  variant="ghost"
                  className="w-full justify-start text-slate-400 hover:text-white"
                >
                  <span className="mr-2 text-lg">⚙️</span> Configure Calendar
                </Button>

                <Button
                  onClick={signOutUser}
                  variant="ghost"
                  className="w-full justify-start text-slate-400 hover:text-red-400 hover:bg-red-500/10 group"
                >
                  <LogOut className="w-5 h-5 mr-3 opacity-70 group-hover:opacity-100" />
                  {isDemoMode ? "Exit Demo" : "Sign Out"}
                </Button>
              </div>
            </Card>

            <div className="hidden lg:block p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
              <h4 className="text-indigo-400 font-medium mb-1">Pro Tip</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Try to keep focused on 3-5 key habits at a time. It's better to
                master a few routines than to juggle too many at once.
              </p>
            </div>
          </div>

          {/* Main Content: Habits List */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-8">
            <div>
              <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-xl text-white flex items-center gap-2">
                  Active Habits
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-medium ring-1 ring-inset ring-indigo-500/30">
                    {activeHabits.length}
                  </span>
                </h2>
              </div>

              {activeHabits.length === 0 ? (
                <div className="text-center py-16 px-4 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/30">
                  <div className="mx-auto h-12 w-12 text-slate-600 mb-4 flex items-center justify-center">
                    <ClipboardX strokeWidth={1.5} className="w-full h-full" />
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-white">
                    No habits defined
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Get started by creating a new habit to track.
                  </p>
                  <div className="mt-6">
                    <Button onClick={handleCreateHabitClick}>
                      <span className="mr-2">+</span> Create Habit
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeHabits.map((habit) => (
                    <HabitItem
                      key={habit.id}
                      habit={habit}
                      isArchived={false}
                      isMenuOpen={openMenuHabitId === habit.id}
                      onToggleMenu={(e) => handleToggleMenu(e, habit.id)}
                      onEdit={handleEditHabitClick}
                      onDelete={() => handleDelete(habit.id)}
                      onRestore={() => handleRestore(habit.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Archived Habits Section */}
            {archivedHabits.length > 0 && (
              <div className="pt-8 border-t border-slate-800/60">
                <button
                  onClick={() => setShowArchived(!showArchived)}
                  className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <span
                    className={`transition-transform duration-200 ${
                      showArchived ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                  {showArchived ? "Hide" : "Show"} Archived Habits (
                  {archivedHabits.length})
                </button>

                {showArchived && (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
                    {archivedHabits.map((habit) => (
                      <HabitItem
                        key={habit.id}
                        habit={habit}
                        isArchived={true}
                        isMenuOpen={false}
                        onToggleMenu={() => {}}
                        onEdit={handleEditHabitClick}
                        onDelete={() => handleDelete(habit.id)}
                        onRestore={() => handleRestore(habit.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <NewHabitModal
          isOpen={isHabitModalOpen}
          onClose={() => setIsHabitModalOpen(false)}
          onSave={handleSaveHabit}
          habitToEdit={habitToEdit}
        />

        <LogSessionModal
          isOpen={isLogModalOpen}
          onClose={() => setIsLogModalOpen(false)}
          availableHabits={availableHabits}
          onLog={handleLogSession}
          dailyLogs={days}
        />

        <DailySetupModal
          isOpen={isDailySetupModalOpen}
          onClose={() => setIsDailySetupModalOpen(false)}
        />

        <CalendarModal
          key={isCalendarModalOpen ? "opened" : "closed"}
          isOpen={isCalendarModalOpen}
          onClose={() => setIsCalendarModalOpen(false)}
          onSave={updateCalendarUrl}
          currentUrl={calendarUrl}
        />

        <NotificationBar />
      </div>
    </div>
  );
};

export default SetupPage;
