import React from "react";
import { ChevronRight, MapPin, Sparkles } from "lucide-react";
import { useAuth } from "../../providers/AuthProvider";

export interface PageHeaderProps {
  breadcrumb?: string[];
  title: string;
  description?: string;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  filterBar?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  breadcrumb = ["MINE SMART AI", "Dashboard"],
  title,
  description,
  primaryAction,
  secondaryAction,
  filterBar,
}) => {
  const { activeSite } = useAuth();

  return (
    <div className="mb-6 space-y-4">
      {/* Top Breadcrumb & Site Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          {breadcrumb.map((item, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <ChevronRight className="h-3 w-3 text-slate-400" />}
              <span
                className={
                  idx === breadcrumb.length - 1
                    ? "font-bold text-slate-800 dark:text-slate-200"
                    : ""
                }
              >
                {item}
              </span>
            </React.Fragment>
          ))}
        </div>

        <div className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs font-semibold text-slate-300">
          <MapPin className="h-3.5 w-3.5 text-emerald-400" />
          <span>{activeSite.name}</span>
        </div>
      </div>

      {/* Main Title & CTA Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              {description}
            </p>
          )}
        </div>

        {(primaryAction || secondaryAction) && (
          <div className="flex items-center gap-2">
            {secondaryAction}
            {primaryAction}
          </div>
        )}
      </div>

      {/* Optional FilterBar */}
      {filterBar && <div className="pt-2">{filterBar}</div>}
    </div>
  );
};
