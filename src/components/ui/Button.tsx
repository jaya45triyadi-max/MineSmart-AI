import React from "react";
import { Loader2 } from "lucide-react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "success"
  | "gold";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold transition-all duration-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

  const sizeStyles: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-xs gap-1.5 min-h-[32px]",
    md: "px-4 py-2 text-xs sm:text-sm gap-2 min-h-[40px]",
    lg: "px-5 py-2.5 text-sm sm:text-base gap-2.5 min-h-[48px]",
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      "bg-emerald-600 text-white hover:bg-emerald-500 active:bg-emerald-700 shadow-md shadow-emerald-600/20 focus:ring-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-500",
    secondary:
      "bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 focus:ring-slate-400",
    outline:
      "border border-slate-300 text-slate-700 bg-transparent hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 focus:ring-slate-400",
    ghost:
      "text-slate-700 bg-transparent hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/80 focus:ring-slate-400",
    danger:
      "bg-red-600 text-white hover:bg-red-500 active:bg-red-700 shadow-md shadow-red-600/20 focus:ring-red-500",
    success:
      "bg-teal-600 text-white hover:bg-teal-500 active:bg-teal-700 shadow-md shadow-teal-600/20 focus:ring-teal-500",
    gold:
      "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold hover:from-amber-400 hover:to-amber-500 shadow-md shadow-amber-500/20 focus:ring-amber-400",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin text-current" />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};
