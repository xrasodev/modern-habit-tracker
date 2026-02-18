import React from "react";
import { DialogTitle } from "@headlessui/react";
import type { LogSessionModalProps } from "../../types/data";
import { STATUS_LIST } from "../../utils/constants";
import { useSessionLogForm } from "../../hooks/useSessionLogForm";
import { getTodayDate, getDateXDaysAgo } from "../../utils/dayUtils";
import StarRating from "../ui/StarRating";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";

const LogSessionModal: React.FC<LogSessionModalProps> = (props) => {
  const { isOpen, onClose, availableHabits, isUpdate } = props;

  const {
    formData,
    isFixedDateMode,
    isExistingInDay,
    dateInputRef,
    handleChange,
    handleHabitChange,
    handleSubmit,
    setFormData,
  } = useSessionLogForm(props);

  const maxDate = getTodayDate();
  const minDate = getDateXDaysAgo(100);

  const borderColorClass = `border-${formData.color || "gray-700"}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className={`border-4 ${borderColorClass}`}
    >
      <div className="flex justify-between items-center border-b pb-2 mb-4">
        <DialogTitle as="h3" className="text-lg leading-6 text-white">
          {isUpdate || isExistingInDay ? formData.habitName : "📝 Log Activity"}
        </DialogTitle>

        {/* Date */}
        <div className="flex flex-col">
          <div className="relative mt-1">
            {isFixedDateMode ? (
              <p className="text-lg text-white bg-transparent border-0 py-1.5 px-3 rounded-md">
                📅 {formData.date}
              </p>
            ) : (
              <input
                type="date"
                name="date"
                required
                min={minDate}
                max={maxDate}
                value={formData.date}
                onChange={handleChange}
                ref={dateInputRef}
                className="block w-33 rounded-md border-gray-300 shadow-sm p-1.5 border bg-slate-900 text-base"
              />
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Selector *only if not updating */}
        {!isUpdate && (
          <div>
            <label htmlFor="habitId" className="block text-sm font-medium">
              Habit
            </label>
            <select
              id="habitId"
              name="habitId"
              required
              value={formData.habitId}
              onChange={handleHabitChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border bg-slate-900"
            >
              <option value="" disabled>
                Select a habit
              </option>
              {availableHabits.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">
            Session Status
          </label>
          <div className="flex space-x-4">
            {STATUS_LIST.map(({ id, label, icon, colorClass }) => (
              <label
                key={id}
                className="inline-flex items-center cursor-pointer"
              >
                <input
                  type="radio"
                  name="status"
                  value={id}
                  checked={formData.status === id}
                  onChange={handleChange}
                  className={`form-radio`}
                />
                <span className={`ml-2 ${colorClass}`}>
                  {icon} {label}
                </span>
              </label>
            ))}
          </div>
        </div>
        {/* 2. Session Time and Duration */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <label htmlFor="sessionTime" className="block text-sm font-medium">
              Completed Time
            </label>
            <input
              type="time"
              name="sessionTime"
              id="sessionTime"
              required
              value={formData.sessionTime}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            />
          </div>

          {/* 2. Session Time (with default value) */}
          <div className="flex-1">
            <label
              htmlFor="sessionTimeMinutes"
              className="block text-sm font-medium"
            >
              Time (min)
            </label>
            <input
              type="number"
              name="sessionTimeMinutes"
              id="sessionTimeMinutes"
              required
              disabled={formData.status === "missed"}
              min="0"
              value={formData.sessionTimeMinutes}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            />
          </div>
        </div>

        {/* 3. Personal Score */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Personal Score (1-5)
          </label>
          <StarRating
            value={formData.selfRating}
            disabled={formData.status === "missed"}
            onRatingChange={(v: number) =>
              setFormData((prev) => ({ ...prev, selfRating: v }))
            }
          />
        </div>

        {/* 4. Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium">
            Notes
          </label>
          <textarea
            name="notes"
            id="notes"
            rows={3}
            value={formData.notes}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="flat" disabled={!formData.habitId}>
            {isUpdate || isExistingInDay ? "Update Entry" : "Add Entry"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default LogSessionModal;
