import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (url: string) => void;
  currentUrl: string | null;
}

const CalendarModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  currentUrl,
}) => {
  const [url, setUrl] = useState(currentUrl || "");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      className="border border-slate-800"
    >
      <h2 className="text-xl font-medium text-gray-100 mb-4">
        Configure Google Calendar
      </h2>

      <p className="text-sm text-gray-400 mb-4">
        Paste your Google Calendar public embed URL or iCal link below to sync
        your schedule.
      </p>

      <textarea
        className="w-full h-32 placeholder-gray-400 bg-slate-800 border border-gray-700 rounded-xl p-3 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all resize-none"
        placeholder="https://calendar.google.com/calendar/embed?..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="flat"
          onClick={() => {
            onSave(url);
            onClose();
          }}
        >
          Save Configuration
        </Button>
      </div>
    </Modal>
  );
};

export default CalendarModal;
