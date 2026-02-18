import React from "react";

export interface ProgressBarSegment {
  percentage: number;
  color: string;
}

interface ProgressBarProps {
  segments: ProgressBarSegment[];
}

const ProgressiveBar: React.FC<ProgressBarProps> = ({ segments }) => {
  return (
    <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden flex">
      {segments.map((segment, index) => (
        <div
          key={index}
          className={`h-full transition-all duration-500 ease-out bg-${segment.color}`}
          style={{
            width: `${segment.percentage}%`,
          }}
        />
      ))}
    </div>
  );
};

export default ProgressiveBar;
