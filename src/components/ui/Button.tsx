import React from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "flat";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus:ring-0 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl cursor-pointer";
  const variants = {
    primary:
      "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 focus:ring-indigo-500 border border-transparent",
    flat: "bg-indigo-600 hover:bg-indigo-500 text-white focus:ring-indigo-500 border border-transparent",
    secondary:
      "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 focus:ring-slate-500",
    outline:
      "bg-transparent hover:bg-slate-800/50 text-slate-300 border-2 border-slate-700 hover:border-slate-600 focus:ring-slate-500",
    ghost:
      "bg-transparent hover:bg-slate-800 text-slate-400 hover:text-white focus:ring-slate-500",
    danger: "bg-red-600 hover:bg-red-500 text-white focus:ring-red-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3.5 text-base",
  };

  const variantStyles = variants[variant];
  const sizeStyles = sizes[size];

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="animate-spin -ml-1 h-4 w-4" />
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};
