// MINE SMART AI - Luxury Enterprise Animated Dashboard KPI Card
// Features: Glassmorphism, Micro-glows, Sparklines, Status Beacon, Light/Dark support

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  Sparkles,
} from "lucide-react";

export interface DashboardKPICardProps {
  id?: string;
  title: string;
  value: string | number;
  unit?: string;
  target?: string | number;
  variance?: string | number;
  achievementPct?: number;
  icon: React.ReactNode;
  iconBgColor?: string;
  statusBadge?: {
    label: string;
    type: "SUCCESS" | "WARNING" | "DANGER" | "INFO";
  };
  trend?: {
    direction: "UP" | "DOWN" | "STABLE";
    text: string;
  };
  sparklineData?: number[];
  onClick?: () => void;
  isLoading?: boolean;
}

export const DashboardKPICard: React.FC<DashboardKPICardProps> = ({
  title,
  value,
  unit,
  target,
  variance,
  achievementPct,
  icon,
  iconBgColor = "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  statusBadge,
  trend,
  sparklineData = [35, 42, 40, 55, 62, 58, 72, 85],
  onClick,
  isLoading,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl animate-pulse">
        <div className="flex items-center justify-between mb-3">
          <div className="h-3.5 w-24 bg-slate-800 rounded-lg" />
          <div className="h-9 w-9 bg-slate-800 rounded-xl" />
        </div>
        <div className="h-8 w-32 bg-slate-800 rounded-lg mb-2" />
        <div className="h-3 w-20 bg-slate-800 rounded-lg" />
      </div>
    );
  }

  const getStatusBadgeStyle = (type: "SUCCESS" | "WARNING" | "DANGER" | "INFO") => {
    switch (type) {
      case "SUCCESS":
        return {
          bg: "bg-emerald-500/15 text-emerald-400 dark:text-emerald-300 border-emerald-500/30",
          glow: "shadow-emerald-500/20",
          icon: <CheckCircle2 className="h-3 w-3 mr-1 shrink-0" />,
        };
      case "WARNING":
        return {
          bg: "bg-amber-500/15 text-amber-500 dark:text-amber-300 border-amber-500/30",
          glow: "shadow-amber-500/20",
          icon: <AlertTriangle className="h-3 w-3 mr-1 shrink-0" />,
        };
      case "DANGER":
        return {
          bg: "bg-rose-500/15 text-rose-500 dark:text-rose-300 border-rose-500/30",
          glow: "shadow-rose-500/20",
          icon: <AlertCircle className="h-3 w-3 mr-1 shrink-0" />,
        };
      case "INFO":
      default:
        return {
          bg: "bg-sky-500/15 text-sky-500 dark:text-sky-300 border-sky-500/30",
          glow: "shadow-sky-500/20",
          icon: <Info className="h-3 w-3 mr-1 shrink-0" />,
        };
    }
  };

  // Generate SVG Sparkline Path
  const min = Math.min(...sparklineData);
  const max = Math.max(...sparklineData);
  const range = max - min || 1;
  const width = 100;
  const height = 28;
  const points = sparklineData
    .map((d, i) => {
      const x = (i / (sparklineData.length - 1)) * width;
      const y = height - ((d - min) / range) * (height - 6) - 3;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative rounded-2xl border border-slate-800/90 bg-[#0D1A3B]/85 p-4 sm:p-5 shadow-lg shadow-black/40 backdrop-blur-xl transition-all duration-300 luxury-card-glow overflow-hidden ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      {/* Ambient Top Glow on Hover */}
      <div
        className={`absolute -top-12 -right-12 w-28 h-28 rounded-full bg-emerald-500/15 blur-2xl transition-opacity duration-500 pointer-events-none ${
          isHovered ? "opacity-100" : "opacity-30"
        }`}
      />

      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-3 relative z-10">
        <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 truncate">
          {title}
        </span>
        <div
          className={`p-2 rounded-xl border ${iconBgColor} group-hover:scale-110 group-hover:shadow-md transition-all duration-300 shrink-0`}
        >
          {icon}
        </div>
      </div>

      {/* Primary Metric Value & Sparkline */}
      <div className="flex items-end justify-between gap-2 mb-2 relative z-10">
        <div className="flex items-baseline gap-1.5 min-w-0">
          <span className="text-2xl sm:text-3xl font-black tracking-tight text-white truncate">
            {value}
          </span>
          {unit && (
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">
              {unit}
            </span>
          )}
        </div>

        {/* Mini Sparkline Visualization */}
        <div className="w-16 h-7 shrink-0 hidden xs:block opacity-80 group-hover:opacity-100 transition-opacity">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id={`grad-${title.replace(/\s+/g, "")}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <polyline
              fill="none"
              stroke="#10B981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>
      </div>

      {/* Target & Achievement Row */}
      {(target !== undefined || variance !== undefined || achievementPct !== undefined) && (
        <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800/80 relative z-10">
          {target !== undefined && (
            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              Target: <span className="font-semibold text-slate-800 dark:text-slate-200">{target}</span>
            </div>
          )}

          {achievementPct !== undefined && (
            <div className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{achievementPct}%</span>
            </div>
          )}

          {variance !== undefined && (
            <div
              className={`font-semibold text-xs ${
                String(variance).startsWith("-")
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              Var: {variance}
            </div>
          )}
        </div>
      )}

      {/* Bottom Status Badge & Action */}
      {(statusBadge || trend || onClick) && (
        <div className="flex items-center justify-between gap-1 mt-3 pt-2 border-t border-slate-100/60 dark:border-slate-800/60 relative z-10">
          {statusBadge && (
            <span
              className={`inline-flex items-center rounded-lg border px-2 py-0.5 text-[10px] font-bold shadow-xs ${
                getStatusBadgeStyle(statusBadge.type).bg
              } ${getStatusBadgeStyle(statusBadge.type).glow}`}
            >
              {getStatusBadgeStyle(statusBadge.type).icon}
              <span className="truncate">{statusBadge.label}</span>
            </span>
          )}

          {trend && (
            <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 ml-auto">
              {trend.direction === "UP" ? (
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
              ) : trend.direction === "DOWN" ? (
                <TrendingDown className="h-3.5 w-3.5 text-rose-500 dark:text-rose-400" />
              ) : (
                <Minus className="h-3.5 w-3.5 text-slate-400" />
              )}
              <span className="font-mono text-[10px]">{trend.text}</span>
            </div>
          )}

          {onClick && !trend && (
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform ml-auto">
              <span className="hidden sm:inline text-[10px] uppercase tracking-wider">Inspect</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
