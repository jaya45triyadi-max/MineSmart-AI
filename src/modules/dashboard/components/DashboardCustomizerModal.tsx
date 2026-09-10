// MINE SMART AI - Dashboard Customizer Modal Component

import React from "react";
import { X, SlidersHorizontal, Check, Eye, EyeOff, RotateCcw } from "lucide-react";

export interface WidgetVisibilityState {
  executiveSummary: boolean;
  production: boolean;
  fleet: boolean;
  fuelCost: boolean;
  hse: boolean;
  stockpile: boolean;
  aiInsights: boolean;
  alerts: boolean;
  operationalSummary: boolean;
  topIssues: boolean;
}

interface DashboardCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  visibility: WidgetVisibilityState;
  onChangeVisibility: (key: keyof WidgetVisibilityState, visible: boolean) => void;
  onReset: () => void;
}

export const DashboardCustomizerModal: React.FC<DashboardCustomizerModalProps> = ({
  isOpen,
  onClose,
  visibility,
  onChangeVisibility,
  onReset,
}) => {
  if (!isOpen) return null;

  const widgetsList: Array<{ key: keyof WidgetVisibilityState; name: string; category: string }> = [
    { key: "executiveSummary", name: "Executive Summary & Health Score", category: "Ringkasan Eksekutif" },
    { key: "production", name: "Produksi Batu Bara & Overburden (OB)", category: "Operasional Tambang" },
    { key: "fleet", name: "Performa Fleet & Status Peralatan", category: "Manajemen Armada" },
    { key: "fuelCost", name: "Konsumsi BBM & Biaya Operasional (OPEX)", category: "Finance & Energy" },
    { key: "hse", name: "K3LH & Keselamatan Kerja (Zero LTI)", category: "HSE & Environment" },
    { key: "stockpile", name: "Kapasitas Stockpile & Kualitas Batubara", category: "Logistik & Quality" },
    { key: "aiInsights", name: "AI Insights & Rekomendasi Preskriptif", category: "Intelligence" },
    { key: "alerts", name: "Real-Time Operational Alerts Center", category: "Monitoring" },
    { key: "operationalSummary", name: "Tabel Ringkasan Metrik Operasional", category: "Summary Table" },
    { key: "topIssues", name: "Top Operational Issues & Bottlenecks", category: "Issues Tracking" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300">
              <SlidersHorizontal className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">Kustomisasi Layout Dashboard</h2>
              <p className="text-xs text-slate-400">Atur tampilan widget sesuai preferensi peran dan kebutuhan Anda.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl border border-slate-800 bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Widget Toggle List */}
        <div className="py-4 space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
          {widgetsList.map((item) => {
            const isVisible = visibility[item.key];

            return (
              <div
                key={item.key}
                onClick={() => onChangeVisibility(item.key, !isVisible)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isVisible
                    ? "bg-slate-950 border-slate-700 hover:border-slate-600"
                    : "bg-slate-950/40 border-slate-800 opacity-60 hover:opacity-100"
                }`}
              >
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    {item.category}
                  </span>
                  <span className="text-xs font-bold text-white">{item.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-bold ${
                      isVisible
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : "bg-slate-800 text-slate-400 border-slate-700"
                    }`}
                  >
                    {isVisible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    <span>{isVisible ? "Tampil" : "Sembunyi"}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Layout Standard</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs hover:bg-emerald-400 transition-colors shadow-md shadow-emerald-500/20"
          >
            Simpan Preferensi
          </button>
        </div>
      </div>
    </div>
  );
};
