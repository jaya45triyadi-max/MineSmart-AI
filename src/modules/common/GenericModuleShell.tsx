import React, { useState } from "react";
import {
  Pickaxe,
  Search,
  Filter,
  Download,
  PlusCircle,
  Sparkles,
  Bot,
  CheckCircle2,
  Clock,
  Layers,
  MapPin,
} from "lucide-react";
import { useAuth } from "../../providers/AuthProvider";

interface ModuleShellProps {
  moduleKey: string;
  moduleTitle: string;
  department: string;
  description: string;
  metrics: { label: string; value: string; subtext: string; color?: string }[];
  tableHeaders: string[];
  tableRows: (string | number)[][];
  onOpenAICopilot: () => void;
}

export const GenericModuleShell: React.FC<ModuleShellProps> = ({
  moduleTitle,
  department,
  description,
  metrics,
  tableHeaders,
  tableRows,
  onOpenAICopilot,
}) => {
  const { activeSite } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Semua Status");

  const filteredRows = tableRows.filter((row) =>
    row.some((cell) => String(cell).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
              {department}
            </span>
            <span className="text-xs text-slate-400 font-medium">Site: {activeSite.name}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            {moduleTitle}
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl mt-0.5">{description}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAICopilot}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-3.5 py-2 text-xs font-bold text-slate-950 hover:brightness-110 shadow-lg shadow-emerald-500/20"
          >
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span>AI Assist</span>
          </button>

          <button className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-700">
            <PlusCircle className="h-4 w-4 text-emerald-400" />
            <span>Tambah Record</span>
          </button>
        </div>
      </div>

      {/* Dynamic Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <div key={idx} className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{m.label}</p>
            <div className="text-2xl font-black text-white">{m.value}</div>
            <p className="text-[11px] text-emerald-400 font-medium">{m.subtext}</p>
          </div>
        ))}
      </div>

      {/* Operational Table & Filter Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari record operasional..."
              className="w-full rounded-xl border border-slate-700 bg-slate-800/80 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700">
              <Filter className="h-3.5 w-3.5" /> Filter
            </button>
            <button className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700">
              <Download className="h-3.5 w-3.5" /> Export Excel
            </button>
          </div>
        </div>

        {/* Data Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-[11px] font-bold uppercase text-slate-400 border-b border-slate-700">
              <tr>
                {tableHeaders.map((header, idx) => (
                  <th key={idx} className="px-4 py-3">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRows.length > 0 ? (
                filteredRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-800/40 transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-4 py-3 font-medium">
                        {String(cell).includes("APPROVED") || String(cell).includes("OPERATING") ? (
                          <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                            {cell}
                          </span>
                        ) : String(cell).includes("BREAKDOWN") ? (
                          <span className="rounded bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-400 border border-red-500/30">
                            {cell}
                          </span>
                        ) : String(cell).includes("STANDBY") ? (
                          <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                            {cell}
                          </span>
                        ) : (
                          cell
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={tableHeaders.length} className="px-4 py-8 text-center text-slate-500">
                    Tidak ada record yang sesuai pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
