import React from "react";
import { TrendingUp, TrendingDown, Minus, ArrowUpRight, AlertTriangle, CheckCircle2, Info } from "lucide-react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  hoverable = false,
  ...props
}) => {
  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all dark:border-slate-800 dark:bg-[#0F172A] ${
        hoverable ? "hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: number; // e.g. 8.4 for +8.4%, -2.1 for -2.1%
  trendText?: string; // e.g. "vs kemarin" or "vs target"
  subtitle?: string;
  status?: "success" | "warning" | "danger" | "info" | "neutral";
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  trend,
  trendText = "vs target",
  subtitle,
  status = "neutral",
  icon,
  action,
}) => {
  const isPositive = trend !== undefined && trend > 0;
  const isNegative = trend !== undefined && trend < 0;

  return (
    <Card hoverable className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              {value}
            </span>
            {unit && (
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                {unit}
              </span>
            )}
          </div>
        </div>

        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-emerald-500">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800/80 text-xs">
        {trend !== undefined ? (
          <div className="flex items-center gap-1.5 font-bold">
            {isPositive && (
              <span className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="h-3.5 w-3.5" />
                +{trend}%
              </span>
            )}
            {isNegative && (
              <span className="flex items-center gap-0.5 text-red-600 dark:text-red-400">
                <TrendingDown className="h-3.5 w-3.5" />
                {trend}%
              </span>
            )}
            {!isPositive && !isNegative && (
              <span className="flex items-center gap-0.5 text-slate-400">
                <Minus className="h-3.5 w-3.5" />
                0%
              </span>
            )}
            <span className="text-[11px] font-normal text-slate-400 dark:text-slate-500">
              {trendText}
            </span>
          </div>
        ) : (
          <span className="text-[11px] text-slate-400">{subtitle}</span>
        )}

        {action}
      </div>
    </Card>
  );
};

export interface AlertCardProps {
  title: string;
  description: string;
  type?: "critical" | "warning" | "info" | "success";
  time?: string;
  onAction?: () => void;
  actionText?: string;
}

export const AlertCard: React.FC<AlertCardProps> = ({
  title,
  description,
  type = "warning",
  time,
  onAction,
  actionText = "Tinjau",
}) => {
  const styles = {
    critical: "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300",
    warning: "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300",
    info: "bg-sky-500/10 border-sky-500/30 text-sky-700 dark:text-sky-300",
    success: "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300",
  };

  const icons = {
    critical: <AlertTriangle className="h-5 w-5 text-red-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    info: <Info className="h-5 w-5 text-sky-500" />,
    success: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
  };

  return (
    <div className={`rounded-xl border p-4 transition-all ${styles[type]}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">{icons[type]}</div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold">{title}</h4>
            <p className="mt-1 text-xs opacity-90">{description}</p>
            {time && <p className="mt-2 text-[10px] opacity-75">{time}</p>}
          </div>
        </div>

        {onAction && (
          <button
            onClick={onAction}
            className="flex items-center gap-1 text-xs font-bold underline hover:opacity-80"
          >
            {actionText} <ArrowUpRight className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
};
