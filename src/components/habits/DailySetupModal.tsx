import React from "react";
import { Button } from "../ui/Button";
import { useDailySetup } from "../../hooks/useDailySetup";
import { DialogTitle } from "@headlessui/react";
import { Modal } from "../ui/Modal";

interface DailySetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: string;
}

const DailySetupModal: React.FC<DailySetupModalProps> = (props) => {
  const { isOpen, onClose, initialDate } = props;

  const {
    selectedDateISO,
    setSelectedDateISO,
    selectedHabitIds,
    selectedHabits,
    habits,
    dateOptions,
    handleToggleHabit,
    handleSelectAll,
    handleSelectNone,
    handleSave,
  } = useDailySetup(props);

  if (habits.length === 0) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <DialogTitle
        as="h3"
        className="text-xl font-medium leading-6 text-gray-400 border-b pb-2 mb-4 flex justify-between items-center"
      >
        📅 Daily Setup
        {initialDate ? (
          <span className="text-lg font-medium text-white bg-transparent border-0 py-1.5 px-3 rounded-md">
            {initialDate}
          </span>
        ) : (
          <select
            value={selectedDateISO}
            onChange={(e) => setSelectedDateISO(e.target.value)}
            className="text-sm p-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-slate-800 text-white"
          >
            {dateOptions.map((option) => (
              <option
                className="bg-slate-800"
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        )}
      </DialogTitle>

      <div className="mb-6">
        <div className="flex justify-between items-end mb-2">
          <label className="block text-sm text-gray-400">
            Select habits for this day:
          </label>
          <div className="space-x-2">
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-xs text-indigo-400 hover:text-indigo-300 underline"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={handleSelectNone}
              className="text-xs text-gray-500 hover:text-gray-400 underline"
            >
              None
            </button>
          </div>
        </div>

        <div className="max-h-64 overflow-y-auto border border-gray-950 bg-slate-950 rounded-lg p-3 space-y-2">
          {habits.map((habit) => {
            const isSelected = selectedHabitIds.includes(habit.id);
            const colorClass = habit.color || "gray-400";

            return (
              <button
                key={habit.id}
                type="button"
                onClick={() => handleToggleHabit(habit.id)}
                className={`w-full p-3 text-left rounded-lg transition duration-150 flex justify-between items-center ${
                  isSelected
                    ? `bg-${colorClass} text-gray-900 shadow-md `
                    : "bg-slate-900 text-gray-400 border border-gray-300 hover:border-gray-500"
                }`}
              >
                <span
                  className={`font-medium ${
                    isSelected ? "text-white" : `text-${colorClass}`
                  }`}
                >
                  {habit.name}
                </span>
                <span
                  className={`text-sm ${
                    isSelected ? "text-white" : "text-gray-400"
                  }`}
                >
                  {habit.targetTimeMinutes} min
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <h4 className="text-md font-medium text-gray-400 mb-2">
        Preview ({selectedHabits.length} Habits)
      </h4>

      {/* Preview */}
      <div className="space-y-2 bg-slate-900 max-h-40 overflow-y-auto border border-gray-950 p-2 rounded-lg">
        {selectedHabits.length > 0 ? (
          selectedHabits.map((habit) => (
            <div
              key={habit.id}
              className={`p-2 rounded-lg bg-slate-900 shadow-sm border-l-4 border-${habit.color}`}
            >
              <span className="font-medium text-gray-400">{habit.name}</span>
              <span className="text-sm text-gray-500 ml-2">
                ({habit.targetTimeMinutes} min)
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic text-center py-4">
            Select one or more habits above to plan for this day.
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end space-x-3">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="button" variant="flat" onClick={handleSave}>
          Save Plan
        </Button>
      </div>
    </Modal>
  );
};

export default DailySetupModal;
