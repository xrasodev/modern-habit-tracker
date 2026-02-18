import React from "react";
import { useHabits } from "../../context/HabitsContext";

const NotificationBar: React.FC = () => {
  const { notification, restoreHabit } = useHabits();

  if (!notification) return null;

  const handleUndo = () => {
    if (notification.action === "RESTORE" && notification.targetHabitId) {
      restoreHabit(notification.targetHabitId);
    }
  };

  return (
    <div
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-2xl z-50 
                    bg-slate-700 text-white flex items-center space-x-4 border border-gray-600"
    >
      <p>{notification.message}</p>

      {notification.action === "RESTORE" && notification.targetHabitId && (
        <button
          onClick={handleUndo}
          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded transition duration-150"
        >
          Undo
        </button>
      )}
    </div>
  );
};

export default NotificationBar;
