import React from "react";
import { useHabits } from "../../context/HabitsContext";
import { Loader2 } from "lucide-react";

const CalendarFrame: React.FC = () => {
  const { calendarUrl, isCalendarLoading } = useHabits();

  if (isCalendarLoading) {
    return (
      <div className="flex items-center justify-center p-4 text-slate-400">
        <Loader2 className="w-5 h-5 animate-spin text-indigo-500 mr-2" />
        <span className="text-sm font-medium">Loading calendar...</span>
      </div>
    );
  }

  if (!calendarUrl) {
    return (
      <div className="p-4 text-center text-gray-500">
        No calendar URL has been set up
      </div>
    );
  }

  const dynamicEmbedCode = `
        <iframe src="${calendarUrl}" 
        style="border-width:0; filter: invert(0.9) hue-rotate(180deg);" 
        width="100%" 
        height="270"
        frameborder="0" 
        scrolling="no"
        >
        </iframe>
        `;

  return (
    <div className="w-full">
      <div
        dangerouslySetInnerHTML={{ __html: dynamicEmbedCode }}
        className="calendar-embed-container w-full"
      />
    </div>
  );
};

export default CalendarFrame;
