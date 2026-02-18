import React from "react";
import type { HabitDefinition } from "../../types/data";
import { Clock, MoreVertical, Pencil, Trash2, RotateCcw } from "lucide-react";

interface HabitItemProps {
  habit: HabitDefinition;
  isArchived: boolean;
  isMenuOpen: boolean;
  onToggleMenu: (e: React.MouseEvent) => void;
  onEdit: (habit: HabitDefinition) => void;
  onDelete: (habitId: string) => void;
  onRestore: (habitId: string) => void;
}

export const HabitItem: React.FC<HabitItemProps> = ({
  habit,
  isArchived,
  isMenuOpen,
  onToggleMenu,
  onEdit,
  onDelete,
  onRestore,
}) => {
  return (
    <div
      className={`
        relative group transition-all duration-300
        border-y border-r border-l-[6px] border-white/5
        bg-slate-900/80 backdrop-blur-md
        rounded-2xl p-4 shadow-lg hover:shadow-xl hover:-translate-y-0.5
        ${isArchived ? "opacity-60 grayscale" : ""}
        ${isMenuOpen ? "z-50" : "z-0"}
      `}
      style={{ borderLeftColor: `var(--color-${habit.color}, ${habit.color})` }}
    >
      <div className="flex justify-between items-start pl-3">
        <div className="flex-1 min-w-0 mr-4">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-lg text-slate-100 truncate">
              {habit.name}
            </h3>
            {isArchived && (
              <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-xs font-medium border border-red-500/20">
                Deleted
              </span>
            )}
          </div>
          <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
            {habit.description || "No description provided."}
          </p>
          <div className="mt-3 flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/50 text-xs text-slate-300 border border-slate-700/50">
              <Clock className="w-3.5 h-3.5 opacity-70" />
              {habit.targetTimeMinutes} min
            </span>
          </div>
        </div>

        <div className="relative shrink-0">
          {isArchived ? (
            <button
              onClick={() => onRestore(habit.id)}
              className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors text-sm font-medium flex items-center gap-1"
            >
              <RotateCcw className="w-4 h-4" />
              Restore
            </button>
          ) : (
            <>
              <button
                onClick={onToggleMenu}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-700 cursor-pointer legend-toggle"
              >
                <MoreVertical className="w-6 h-6" />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl z-50 overflow-hidden ring-1 ring-black/5">
                  <div className="p-1 space-y-0.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(habit);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors text-left legend-toggle"
                    >
                      <Pencil className="w-4 h-4 opacity-70" />
                      Edit Habit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(habit.id);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-left"
                    >
                      <Trash2 className="w-4 h-4 opacity-70" />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
