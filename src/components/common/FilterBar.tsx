import React, { useState } from "react";
import { Filter, Calendar, Layers, Clock, RefreshCw } from "lucide-react";
import { Button } from "../ui/Button";

export interface FilterBarProps {
  onSiteChange?: (siteId: string) => void;
  onShiftChange?: (shift: string) => void;
  onDateChange?: (dateRange: string) => void;
  onReset?: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  onShiftChange,
  onDateChange,
  onReset,
}) => {
  const [selectedShift, setSelectedShift] = useState("SHIFT_ALL");
  const [selectedPeriod, setSelectedPeriod] = useState("TODAY");

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-[#0F172A] p-3 shadow-xs">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase mr-1">
          <Filter className="h-3.5 w-3.5 text-emerald-400" />
          <span>Filter Operasional:</span>
        </div>

        {/* Date / Period Filter */}
        <div className="flex rounded-xl border border-slate-700 bg-slate-900 p-0.5">
          {[
            { id: "TODAY", label: "Hari Ini" },
            { id: "THIS_WEEK", label: "Minggu Ini" },
            { id: "MTD", label: "MTD (Bulan Ini)" },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setSelectedPeriod(p.id);
                onDateChange && onDateChange(p.id);
              }}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                selectedPeriod === p.id
                  ? "bg-emerald-600 text-white shadow-xs font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Shift Filter */}
        <div className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5 text-slate-400 ml-2" />
          <select
            value={selectedShift}
            onChange={(e) => {
              setSelectedShift(e.target.value);
              onShiftChange && onShiftChange(e.target.value);
            }}
            className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-semibold text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="SHIFT_ALL">Semua Shift (1 & 2)</option>
            <option value="SHIFT_1">Shift 1 (Siang: 06.00 - 18.00)</option>
            <option value="SHIFT_2">Shift 2 (Malam: 18.00 - 06.00)</option>
          </select>
        </div>
      </div>

      {onReset && (
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<RefreshCw className="h-3 w-3" />}
          onClick={() => {
            setSelectedShift("SHIFT_ALL");
            setSelectedPeriod("TODAY");
            onReset();
          }}
        >
          Reset Filter
        </Button>
      )}
    </div>
  );
};
