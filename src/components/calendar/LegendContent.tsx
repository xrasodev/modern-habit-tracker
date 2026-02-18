import React from "react";

const LegendContent: React.FC = () => {
  return (
    <div className="py-2">
      {/* Daily Progress (Intensity Scale) */}
      <h4 className="text-sm font-medium text-gray-300 mb-2">
        Daily Progress (Intensity Scale)
      </h4>

      {/* Color Scale */}
      <div className="flex w-full mb-4 rounded overflow-hidden shadow-lg">
        <div className="w-1/5 h-6 bg-emerald-300"></div>
        <div className="w-1/5 h-6 bg-emerald-400/80"></div>
        <div className="w-1/5 h-6 bg-emerald-400/50"></div>
        <div className="w-1/5 h-6 bg-emerald-400/35"></div>
        <div className="w-1/5 h-6 bg-emerald-400/15"></div>
      </div>

      {/* Percentage Labels */}
      <div className="flex justify-between text-xs text-gray-400 font-medium mb-4">
        <span className="text-emerald-300">100%</span>
        <span>75%</span>
        <span>50%</span>
        <span>25%</span>
        <span className="text-gray-500">&gt; 0%</span>
      </div>

      {/* Status & Indicators */}
      <h4 className="text-sm font-medium text-gray-300 mt-2 mb-2">
        Status & Indicators
      </h4>
      <div className="space-y-3 text-sm text-gray-400">
        {/* Inactive */}
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-sm bg-slate-700/50 mr-3 border border-gray-600"></div>
          <span>Inactive / No habits planned</span>
        </div>

        {/* Pending */}
        <div className="flex items-center">
          <div className="relative w-3 h-3 mr-3">
            <span className="absolute inset-0 rounded-full bg-yellow-500 shadow-[0_0_5px_rgba(234,179,8,0.6)]"></span>
          </div>
          <span>
            <strong className="text-yellow-500 font-medium">Pending:</strong>{" "}
            Unfinished habits in past days
          </span>
        </div>
      </div>

      <p className="mt-4 text-[10px] text-gray-500 italic border-t border-gray-800 pt-2">
        * The yellow indicator helps you identify days that require your
        attention to finalize logs.
      </p>
    </div>
  );
};

export default LegendContent;
