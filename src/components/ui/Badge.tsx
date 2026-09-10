import React from "react";

export type BadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "gold"
  | "neutral"
  | "purple";

export type BadgeSize = "sm" | "md";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "neutral",
  size = "sm",
  dot = false,
  className = "",
}) => {
  const sizeStyles: Record<BadgeSize, string> = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
  };

  const variantStyles: Record<BadgeVariant, string> = {
    success:
      "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30",
    warning:
      "bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30",
    danger:
      "bg-red-500/15 text-red-700 dark:text-red-400 border border-red-500/30",
    info:
      "bg-sky-500/15 text-sky-700 dark:text-sky-400 border border-sky-500/30",
    gold:
      "bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40 font-bold",
    neutral:
      "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700",
    purple:
      "bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30",
  };

  const dotColorMap: Record<BadgeVariant, string> = {
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-red-500",
    info: "bg-sky-500",
    gold: "bg-amber-400",
    neutral: "bg-slate-400",
    purple: "bg-purple-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-md ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${dotColorMap[variant]} animate-pulse`}
        />
      )}
      {children}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const upper = status.toUpperCase();

  if (["ACTIVE", "RUNNING", "COMPLETED", "APPROVED", "ONLINE", "PRO"].includes(upper)) {
    return <Badge variant="success" dot>{status}</Badge>;
  }
  if (["PENDING", "WARNING", "MAINTENANCE", "IDLE", "TRIAL", "IN_PROGRESS"].includes(upper)) {
    return <Badge variant="warning" dot>{status}</Badge>;
  }
  if (["CRITICAL", "DANGER", "EXPIRED", "REJECTED", "BREAKDOWN", "OFFLINE"].includes(upper)) {
    return <Badge variant="danger" dot>{status}</Badge>;
  }
  if (["ENTERPRISE", "GOLD", "VIP"].includes(upper)) {
    return <Badge variant="gold" dot>{status}</Badge>;
  }
  return <Badge variant="info">{status}</Badge>;
};
