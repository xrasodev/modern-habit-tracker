import React, { useState, useMemo, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "../ui/Button";
import ProgressiveBar from "../layout/ProgressiveBar";
import type {
  SessionLogState,
  DailyEntryDisplay,
  HabitStatus,
  CompletedSessionLog,
} from "../../types/data";
import LogSessionModal from "./LogSessionModal";
import DailySetupModal from "./DailySetupModal";
import { useHabits } from "../../context/HabitsContext";
import { STATUS_OPTIONS } from "../../utils/constants";

type DailyEntryWithDetails = DailyEntryDisplay;

interface DayDetailsProps {
  selectedDay: DailyEntryWithDetails;
  onClose: () => void;

  onUpdateDayEntries: (
    date: string,
    newEntries: SessionLogState[],
  ) => Promise<void>;
}

const DayDetails: React.FC<DayDetailsProps> = ({
  selectedDay,
  onClose,
  onUpdateDayEntries,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEntries, setEditedEntries] = useState<SessionLogState[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);

  const [sessionToEdit, setSessionToEdit] = useState<SessionLogState | null>(
    null,
  );

  const { habits, logSession, days } = useHabits();

  useEffect(() => {
    setIsEditing(false);
    setEditedEntries([]);
  }, [selectedDay.date, selectedDay.entries.length]);

  const entriesToDisplay = isEditing ? editedEntries : selectedDay.entries;

  const { segments } = useMemo(() => {
    const total = entriesToDisplay ? entriesToDisplay.length : 0;
    const completedEntries = entriesToDisplay
      ? entriesToDisplay.filter((entry) => entry.status === "completed")
      : [];

    const completed = completedEntries.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Progress Bar based on time distribution
    const totalCompletedMinutes = completedEntries.reduce(
      (acc, curr) => acc + (curr.sessionTimeMinutes || 0),
      0,
    );

    const segments = completedEntries.map((entry) => ({
      percentage:
        totalCompletedMinutes > 0
          ? (entry.sessionTimeMinutes / totalCompletedMinutes) * 100
          : 0,
      color: entry.color,
    }));

    return {
      currentTotalHabits: total,
      currentCompletedHabits: completed,
      currentPercentage: percentage,
      segments,
    };
  }, [entriesToDisplay]);

  if (selectedDay.isFuture) return null;

  const handleOpenAddModal = () => {
    setSessionToEdit({ date: selectedDay.date } as SessionLogState);
    setIsLogModalOpen(true);
  };

  const handleEdit = () => {
    setEditedEntries([...selectedDay.entries]);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedEntries([]);
    setIsEditing(false);
  };

  const handleDelete = (indexToDelete: number) => {
    setEditedEntries((prevEntries) =>
      prevEntries.filter((_, index) => index !== indexToDelete),
    );
  };

  const handleSave = async () => {
    if (editedEntries.length === selectedDay.entries.length) {
      setIsEditing(false);
      setEditedEntries([]);
      return;
    }

    setIsSaving(true);

    try {
      await onUpdateDayEntries(selectedDay.date, editedEntries);

      setIsEditing(false);

      setEditedEntries([]);
    } catch (error) {
      console.error("Error al guardar las entradas:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditSession = (logData: CompletedSessionLog) => {
    const { date, ...logData2 } = logData;
    logSession(date, logData2);
    setIsLogModalOpen(false);
    setSessionToEdit(null);
  };

  const handleOpenEditModal = (entry: SessionLogState) => {
    const entryToEdit = { ...entry, date: selectedDay.date };
    if (selectedDay && selectedDay.date) {
      entryToEdit.date = selectedDay.date;
    } else {
      console.error("No se pudo obtener la fecha del día para la edición.");
      return;
    }
    setSessionToEdit(entryToEdit);
    setIsLogModalOpen(true);
  };

  return (
    <div className="px-6 pb-4 pt-4 md:w-[350px] lg:w-[420px] bg-slate-900/80 rounded-xl shadow-xl ">
      <div className="h-6 mb-4 flex justify-between items-center  ">
        <h3 className="text-xl font-medium text-gray-400">
          {selectedDay.date}
        </h3>
        <div className="flex items-center">
          {!isEditing && (
            <button
              onClick={handleOpenAddModal}
              className="legend-toggle mr-3 flex items-center justify-center w-6 h-6 text-gray-400 hover:text-indigo-300 transition duration-150"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
          {/* Primary Button: EDIT / SAVE */}
          <button
            hidden={!isEditing && entriesToDisplay.length === 0}
            onClick={isEditing ? handleSave : handleEdit}
            disabled={isSaving}
            className={`legend-toggle text-sm font-medium mr-4 transition duration-150 ${
              isSaving
                ? "text-blue-500 opacity-50 cursor-not-allowed"
                : isEditing
                  ? "text-emerald-400 hover:text-emerald-300"
                  : "text-gray-400 hover:text-indigo-300"
            }`}
          >
            {isSaving ? "Saving..." : isEditing ? <>Save</> : <>Edit</>}
          </button>

          {/* Secondary Button: CLOSE / CANCEL */}
          <button
            onClick={isEditing ? handleCancel : onClose}
            className="legend-toggle text-sm font-medium text-gray-400 hover:text-indigo-300 transition duration-150"
          >
            {isEditing ? <>Cancel</> : "Close"}
          </button>
        </div>
      </div>

      <div className="mb-2 pb-2">
        <div className="w-full flex items-center space-x-3">
          <ProgressiveBar segments={segments} />
        </div>
      </div>

      <ul className="list-none p-0 text-gray-300 max-h-90 overflow-y-auto pr-2">
        {entriesToDisplay && entriesToDisplay.length > 0 ? (
          entriesToDisplay.map((entry: SessionLogState, i) => {
            const statusInfo = STATUS_OPTIONS[entry.status as HabitStatus];
            return (
              <li
                key={i}
                className={`flex justify-between items-center py-2 border-b border-gray-700/50 last:border-b-0 text-gray-100 group `}
              >
                {/* Habit Name */}
                <div
                  onClick={() => handleOpenEditModal(entry)}
                  className={` max-w-42 pl-1  truncate rounded-lg border-2 border-${
                    entry.color
                  } hover:bg-slate-800 cursor-pointer 
                  ${isEditing ? "w-32" : "w-42"}
                  `}
                  style={{ color: entry.color }}
                  title={entry.habitName}
                >
                  {entry.habitName}
                </div>

                {/* Status and Trash Button */}
                <div className="flex items-center space-x-4">
                  <span className={`text-sm  font-medium`}>
                    {statusInfo.icon} {statusInfo.label}
                  </span>
                  {isEditing && (
                    <button
                      onClick={() => handleDelete(i)}
                      className="text-red-600 hover:text-red-400 opacity-100 transition duration-150"
                      title="Delete this habit from your day"
                    >
                      🗑
                    </button>
                  )}
                </div>
              </li>
            );
          })
        ) : (
          <li className="text-center py-4 text-gray-500 flex flex-col items-center">
            {isEditing ? (
              "No habits."
            ) : (
              <>
                <p className="mb-3">There are no habits for this day.</p>
                <div className="flex gap-2">
                  <Button
                    variant="flat"
                    onClick={() => setIsSetupModalOpen(true)}
                  >
                    <span className="mr-2">⚡</span> Quick Plan
                  </Button>
                </div>
              </>
            )}
          </li>
        )}
      </ul>
      <LogSessionModal
        key={
          (sessionToEdit ? sessionToEdit.habitId : "new") +
          (sessionToEdit ? sessionToEdit.date : "") +
          isLogModalOpen
        }
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        availableHabits={habits}
        onLog={handleEditSession}
        dailyLogs={days}
        isUpdate={!!(sessionToEdit && sessionToEdit.habitId)}
        habit={sessionToEdit}
      />

      <DailySetupModal
        key={selectedDay.date + isSetupModalOpen}
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        initialDate={selectedDay.date}
      />
    </div>
  );
};

export default DayDetails;
