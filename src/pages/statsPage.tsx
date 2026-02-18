import React from "react";
import { useHabits } from "../context/HabitsContext";
import { useHabitStats } from "../hooks/useHabitStats";
import {
  Activity,
  TrendingUp,
  CheckCircle,
  Clock,
  Calendar,
  BarChart2,
  Trophy,
  Target,
  Loader2,
} from "lucide-react";

const StatsPage: React.FC = () => {
  const { habits, days, isLoading } = useHabits();
  const stats = useHabitStats(habits, days, isLoading);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center text-gray-400 p-8">
        <div className="flex items-center gap-2 animate-pulse">
          <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
          <span>Analyzing data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-8 pb-20 px-4 flex justify-center w-full">
      <div className="w-full max-w-5xl space-y-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-indigo-500/10 rounded-xl">
            <BarChart2 className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-medium text-white">
              Statistics & Insights
            </h1>
            <p className="text-sm text-slate-400">
              Visualize your progress and consistency over time
            </p>
          </div>
        </div>

        {/* General Summary */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/50 backdrop-blur-md p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
                <Target className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Habits
              </span>
            </div>
            <div>
              <p className="text-3xl font-light text-white mb-1">
                {stats?.totalActiveHabits || 0}
              </p>
              <p className="text-xs text-slate-500">Active tracked habits</p>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-md p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-orange-500/10 rounded-lg group-hover:bg-orange-500/20 transition-colors">
                <Trophy className="w-5 h-5 text-orange-400" />
              </div>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Streak
              </span>
            </div>
            <div>
              <p className="text-3xl font-light text-white mb-1">
                {stats?.currentStreak || 0}
                <span className="text-lg text-slate-500 ml-1">days</span>
              </p>
              <p className="text-xs text-slate-500">Current consistency</p>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-md p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                S. Rate
              </span>
            </div>
            <div>
              <p className="text-3xl font-light text-white mb-1">
                {stats?.successRate || 0}
                <span className="text-lg text-slate-500 ml-1">%</span>
              </p>
              <p className="text-xs text-slate-500">Global completion rate</p>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-md p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                <Clock className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Focus
              </span>
            </div>
            <div>
              <p className="text-3xl font-light text-white mb-1">
                {stats?.totalHours || 0}
                <span className="text-lg text-slate-500 ml-1">h</span>
              </p>
              <p className="text-xs text-slate-500">Total time invested</p>
            </div>
          </div>
        </section>

        {/* Habit Breakdown */}
        <section>
          <div className="flex items-center gap-2 mb-6 px-1">
            <Activity className="w-5 h-5 text-slate-400" />
            <h2 className="text-lg font-medium text-slate-200">
              Habit Performance Breakdown
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats?.habitMetrics.map((hm, i) => (
              <div
                key={i}
                className="bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border-y border-r border-l-[6px] border-white/5 hover:border-white/10 transition-all duration-300 group"
                style={{
                  borderLeftColor: `var(--color-${hm.color}, ${hm.color})`,
                }}
              >
                <div className="flex justify-between items-start mb-4 pl-2">
                  <div>
                    <h3 className="font-medium text-lg text-slate-100 mb-1">
                      {hm.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-wider font-medium">
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        {hm.completedCount} DONE
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-2xl font-light text-white">
                      {hm.successRate}%
                    </span>
                    <span className="text-xs text-slate-500">Consistency</span>
                  </div>
                </div>

                <div className="pl-2">
                  <div className="flex justify-between items-center mb-2 text-sm">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Time invested
                    </span>
                    <span className="text-slate-200 font-medium">
                      {hm.timeDisplay}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${hm.successRate}%`,
                        backgroundColor: `var(--color-${hm.color}, ${hm.color})`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {(!stats || !stats.habitMetrics.length) && (
            <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/30 text-center">
              <Calendar className="w-12 h-12 text-slate-700 mb-4" />
              <p className="text-slate-500 font-medium">
                No active habits found
              </p>
              <p className="text-sm text-slate-600 mt-1">
                Start tracking to see your insights here.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default StatsPage;
