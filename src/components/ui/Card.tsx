import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  title,
}) => {
  return (
    <div
      className={`bg-slate-900/50 backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl p-6 ${className}`}
    >
      {title && (
        <h3 className="text-xl font-medium text-slate-100 mb-4">{title}</h3>
      )}
      {children}
    </div>
  );
};
