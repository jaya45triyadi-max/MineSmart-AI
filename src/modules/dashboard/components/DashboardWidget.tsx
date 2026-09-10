// MINE SMART AI - Luxury Enterprise Dashboard Widget Container
// Features: Glassmorphism, Micro-glows, Full-Screen expand, Clean Light/Dark styling

import React, { useState } from "react";
import { Maximize2, Minimize2, RefreshCw, AlertCircle, EyeOff } from "lucide-react";

interface DashboardWidgetProps {
  id: string;
  title: string;
  subtitle?: string;
  badgeText?: string;
  badgeType?: "EMERALD" | "CYAN" | "AMBER" | "ROSE" | "VIOLET";
  children: React.ReactNode;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  onHide?: () => void;
  colSpan?: "col-span-12" | "col-span-12 lg:col-span-6" | "col-span-12 lg:col-span-8" | "col-span-12 lg:col-span-4";
  actionButton?: React.ReactNode;
}

export const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  title,
  subtitle,
  badgeText,
  badgeType = "EMERALD",
  children,
  isLoading,
  isError,
  errorMessage = "Gagal memuat data widget.",
  onRetry,
  onHide,
  colSpan = "col-span-12 lg:col-span-6",
  actionButton,
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const getBadgeStyle = () => {
    switch (badgeType) {
      case "EMERALD":
        return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30";
      case "CYAN":
        return "bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border-cyan-500/30";
      case "AMBER":
        return "bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/30";
      case "ROSE":
        return "bg-rose-500/15 text-rose-600 dark:text-rose-300 border-rose-500/30";
      case "VIOLET":
        return "bg-violet-500/15 text-violet-600 dark:text-violet-300 border-violet-500/30";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  return (
    <div
      className={`rounded-3xl border border-slate-800/90 bg-[#0D1A3B]/85 p-5 sm:p-6 shadow-xl backdrop-blur-xl transition-all duration-300 flex flex-col justify-between luxury-card-glow ${
        isFullScreen
          ? "fixed inset-4 z-50 bg-[#070E20]/95 overflow-auto shadow-2xl ring-1 ring-slate-800"
          : colSpan
      }`}
    >
      {/* Widget Header */}
      <div className="flex items-start justify-between gap-2 mb-4 pb-3.5 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
              {title}
            </h3>
            {badgeText && (
              <span className={`rounded-lg border px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${getBadgeStyle()}`}>
                {badgeText}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {actionButton}

          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-1.5 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title={isFullScreen ? "Kecilkan" : "Perbesar Full Screen"}
          >
            {isFullScreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>

          {onHide && (
            <button
              onClick={onHide}
              className="p-1.5 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Sembunyikan Widget Ini"
            >
              <EyeOff className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Widget Body Content */}
      <div className="flex-1">
        {isLoading ? (
          <div className="h-48 flex flex-col items-center justify-center gap-2 text-xs text-slate-400">
            <RefreshCw className="h-6 w-6 text-emerald-500 animate-spin" />
            <span>Memperbarui data analitik...</span>
          </div>
        ) : isError ? (
          <div className="h-48 flex flex-col items-center justify-center gap-3 text-center p-4">
            <div className="p-3 rounded-full bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-500/20">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{errorMessage}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Periksa koneksi jaringan atau hubungi admin.</p>
            </div>
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Coba Lagi</span>
              </button>
            )}
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};
