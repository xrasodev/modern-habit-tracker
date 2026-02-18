import { useMemo } from "react";
import type { DailyEntryDisplay } from "../../types/data";

type CellDayProps = {
  dayData: DailyEntryDisplay;
  onSelectDay: (data: DailyEntryDisplay) => void;
  isSelected: boolean;
  isAnyDaySelected: boolean;
};

export const CellDay = ({
  dayData,
  onSelectDay,
  isSelected,
  isAnyDaySelected,
}: CellDayProps) => {
  const { isFuture, colorProgress, isTodayFlag, entries } = dayData;

  const hasPendingTasks = useMemo(() => {
    return (
      !isFuture && !isTodayFlag && entries?.some((e) => e.status === "pending")
    );
  }, [entries, isFuture, isTodayFlag]);

  const getContainerClasses = () => {
    const base =
      "w-full aspect-square flex items-center justify-center rounded-lg transition-all duration-300 ease-in-out cursor-pointer group relative shadow-md";

    const status = isFuture
      ? "bg-slate-800/40 cursor-not-allowed shadow-none"
      : `${colorProgress} hover:opacity-90`;

    let feedback = "";
    if (isSelected) {
      feedback =
        "ring-2 ring-indigo-400 ring-offset-2 ring-offset-gray-900 z-10 scale-110 shadow-lg shadow-blue-500/40";
    } else if (isAnyDaySelected && !isFuture) {
      feedback = "opacity-20 scale-95 grayscale-[20%]";
    }

    return `${base} ${status} ${feedback}`;
  };

  return (
    <div
      className={getContainerClasses()}
      onClick={() => !isFuture && onSelectDay(dayData)}
    >
      {hasPendingTasks && (
        <div className="absolute top-1 right-1 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.9)]"></span>
        </div>
      )}

      {isTodayFlag && !isSelected && (
        <div className="absolute bottom-1 w-1 h-1 bg-white/80 rounded-full shadow-sm"></div>
      )}
    </div>
  );
};
