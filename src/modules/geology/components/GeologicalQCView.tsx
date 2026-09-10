// MINE SMART AI - Geological Quality Control (QC) & Outlier Audit Dashboard

import React, { useState } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Search,
  Filter,
} from "lucide-react";
import { GeologicalQCIssue } from "../../../types/geologyTypes";

interface GeologicalQCViewProps {
  issues: GeologicalQCIssue[];
  onResolveIssue: (issueId: string) => void;
  onRunQCScan: () => void;
}

export const GeologicalQCView: React.FC<GeologicalQCViewProps> = ({
  issues,
  onResolveIssue,
  onRunQCScan,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>("ALL");

  const filteredIssues = issues.filter(
    (i) => filterSeverity === "ALL" || i.severity === filterSeverity
  );

  const criticalCount = issues.filter((i) => i.severity === "CRITICAL").length;
  const warningCount = issues.filter((i) => i.severity === "WARNING").length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Geological Quality Control & Outlier Engine</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Pemeriksaan otomatis tumpang tindih kedalaman, kesalahan koordinat collar, dan pencairan outlier lab
            </p>
          </div>
        </div>

        <button
          onClick={onRunQCScan}
          className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-900/30"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Jalankan QC Scan Ulang</span>
        </button>
      </div>

      {/* QC Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Critical Errors</span>
            <div className="text-2xl font-bold text-rose-400 mt-1">{criticalCount}</div>
            <span className="text-[10px] text-rose-300">Wajib Diperbaiki Sebelum Release</span>
          </div>
          <XCircle className="w-8 h-8 text-rose-500/80" />
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Outlier & QC Warnings</span>
            <div className="text-2xl font-bold text-amber-400 mt-1">{warningCount}</div>
            <span className="text-[10px] text-amber-300">Perlu Verifikasi Senior Geologist</span>
          </div>
          <AlertTriangle className="w-8 h-8 text-amber-500/80" />
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">QC Rule Set Version</span>
            <div className="text-lg font-bold text-emerald-400 mt-1">Rule Engine v2.0</div>
            <span className="text-[10px] text-emerald-300">3-Sigma & Depth Overlap Checks</span>
          </div>
          <CheckCircle2 className="w-8 h-8 text-emerald-500/80" />
        </div>
      </div>

      {/* Issues Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Daftar Peringatan Quality Control ({filteredIssues.length} Item)
          </h4>

          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
          >
            <option value="ALL">Semua Tingkat Keparahan</option>
            <option value="CRITICAL">Critical</option>
            <option value="WARNING">Warning</option>
          </select>
        </div>

        <div className="space-y-3">
          {filteredIssues.map((issue) => (
            <div
              key={issue.id}
              className={`p-4 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${
                issue.severity === "CRITICAL"
                  ? "bg-rose-950/30 border-rose-500/40"
                  : "bg-amber-950/30 border-amber-500/40"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      issue.severity === "CRITICAL"
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    }`}
                  >
                    {issue.severity}
                  </span>
                  <span className="text-xs font-bold text-white font-mono">{issue.ruleName}</span>
                  <span className="text-xs text-slate-400">({issue.entityCode})</span>
                </div>
                <p className="text-xs text-slate-200">{issue.description}</p>
                <p className="text-[11px] text-emerald-400 font-semibold italic">
                  Tindakan Disarankan: {issue.suggestedAction}
                </p>
              </div>

              <button
                onClick={() => onResolveIssue(issue.id)}
                className="px-3.5 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 rounded-lg transition-colors flex-shrink-0 cursor-pointer"
              >
                Tandai Selesai / Resolved
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
