import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = "",
  id,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-300 ml-1">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`
          flex h-11 w-full rounded-xl border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-100 
          placeholder:text-slate-500 
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
          disabled:cursor-not-allowed disabled:opacity-50
          transition-all duration-200
          ${error ? "border-red-500 focus:ring-red-500" : ""}
          ${className}
        `}
        {...props}
      />
      {error && <span className="text-xs text-red-400 ml-1">{error}</span>}
    </div>
  );
};
