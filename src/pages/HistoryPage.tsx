import { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { DailyEntryDisplay } from "../types/data";
import { CellDay } from "../components/habits/CellDays";
import { getColorClass } from "../utils/dayUtils";
import { useHabits } from "../context/HabitsContext";
import CalendarFrame from "../components/calendar/CalendarFrame";
import LegendContent from "../components/calendar/LegendContent";
import DayDetails from "../components/habits/DayDetails";
import { Calendar, Loader2 } from "lucide-react";

type DailyEntryWithDetails = DailyEntryDisplay;

const GridDays = () => {
  const { date } = useParams();
  const navigate = useNavigate();
  const { days: contextDays, isLoading, updateDayEntries } = useHabits();

  const detailPanelClasses = [
    // Base y Mobile (Bottom Sheet)
    "fixed inset-x-0 bottom-0 z-50",
    "bg-slate-900 border-t border-slate-800 rounded-t-3xl shadow-2xl",
    "max-h-[85vh] overflow-y-auto animate-bottom-sheet",
    // Desktop (Side Panel)
    "md:relative md:inset-auto md:z-0",
    "md:bg-transparent md:border-none md:rounded-none md:shadow-none",
    "md:max-h-none md:overflow-visible md:animate-none md:transform-none",
  ].join(" ");

  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const daysData: DailyEntryWithDetails[] = useMemo(() => {
    const reversedDays = [...contextDays].reverse();
    const todayISO = new Date().toISOString().substring(0, 10);

    const activeDays = contextDays.filter(
      (d) => d.entries && d.entries.length > 0,
    );

    let earliestDateISO = todayISO;

    if (activeDays.length > 0) {
      const sortedDates = activeDays.map((d) => d.date).sort();
      earliestDateISO = sortedDates[0];
    }

    return reversedDays.map((currentDay, index) => {
      const totalHabits = currentDay.entries?.length || 0;
      const completedHabits =
        currentDay.entries?.filter((entry) => entry.status === "completed")
          .length || 0;

      const isTodayFlag = currentDay.date === todayISO;

      const isRealFuture = currentDay.date > todayISO;
      const isBeforeStart = currentDay.date < earliestDateISO;

      const isFuture = isRealFuture || isBeforeStart;

      return {
        ...currentDay,
        dayNumber: 100 - index,
        completedHabits,
        totalHabits,
        isFuture,
        colorProgress: getColorClass(completedHabits, totalHabits),
        isTodayFlag,
      } as DailyEntryWithDetails;
    });
  }, [contextDays]);

  // --- DAY SELECTION BASED ON URL ---
  const selectedDay = useMemo(() => {
    if (!date) return null;
    return daysData.find((d) => d.date === date) || null;
  }, [date, daysData]);

  const isAnyDaySelected = !!selectedDay;

  // --- SCROLL LOCK (Mobile) ---
  useEffect(() => {
    if (isAnyDaySelected && window.innerWidth < 768) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isAnyDaySelected]);

  // --- SAFETY REDIRECTION ---
  useEffect(() => {
    if (!date || isLoading) return;
    const targetDay = daysData.find((d) => d.date === date);

    if (!targetDay || targetDay.isFuture) {
      navigate("/", { replace: true });
    }
  }, [date, daysData, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center text-slate-400 p-8 font-sans">
        <div className="flex items-center gap-2 animate-pulse">
          <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
          <span className="font-medium text-sm">Loading today's data...</span>
        </div>
      </div>
    );
  }

  const handleSelectDay = (dayData: DailyEntryDisplay) => {
    if (date === dayData.date) {
      navigate("/");
    } else {
      navigate(`/day/${dayData.date}`);
    }
  };

  const handleCloseDetail = () => navigate("/");

  return (
    <div className="pt-4 px-2 md:px-4 flex justify-center w-full">
      <div className="h-fit w-[94vw] flex flex-col justify-center md:flex-row md:w-full max-w-7xl">
        {/* Grid Container (Calendar) */}
        <div className="p-4 w-full md:w-[450px] lg:w-[560px] md:shrink-0 md:grow-0 bg-slate-900/80 rounded-xl shadow-xl mb-4 md:mb-0 md:mr-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <Calendar className="w-6 h-6 text-indigo-400" />
            </div>
            <h2 className="text-xl font-medium text-white">
              Your 100-day streak
            </h2>
          </div>

          <div className="grid grid-cols-10 gap-1">
            {daysData.map((day) => (
              <CellDay
                key={day.date}
                dayData={day}
                onSelectDay={handleSelectDay}
                isSelected={selectedDay?.date === day.date}
                isAnyDaySelected={isAnyDaySelected}
              />
            ))}
          </div>

          {/* Legend and Agenda */}
          <div className="mt-6 pt-4 border-t border-gray-800">
            <div className="flex justify-between items-center w-full mb-3">
              <button
                onClick={() => setIsLegendOpen(!isLegendOpen)}
                className="legend-toggle text-sm font-medium text-gray-400 hover:text-indigo-300 transition duration-150 cursor-pointer"
              >
                {isLegendOpen ? "▼ Hide Legend" : "► Show Legend"}
              </button>
              <button
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className="legend-toggle text-sm font-medium text-gray-400 hover:text-indigo-300 transition duration-150 cursor-pointer"
              >
                {isCalendarOpen ? "Hide Agenda ▼" : "Show Agenda ◄"}
              </button>
            </div>
            {isLegendOpen && <LegendContent />}
            {isCalendarOpen && (
              <div className="p-4 border border-gray-800 rounded-lg">
                <CalendarFrame />
              </div>
            )}
          </div>
        </div>
        {/* Day Details */}
        {selectedDay && (
          <>
            {/* Dark Overlay for mobile view */}
            <div
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              onClick={handleCloseDetail}
            />

            <div className={detailPanelClasses}>
              {/* "Handle" for mobile view */}
              <div className="w-12 h-1.5 bg-slate-700/50 rounded-full mx-auto mt-3 md:hidden" />
              <DayDetails
                selectedDay={selectedDay}
                onClose={handleCloseDetail}
                onUpdateDayEntries={updateDayEntries}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GridDays;
