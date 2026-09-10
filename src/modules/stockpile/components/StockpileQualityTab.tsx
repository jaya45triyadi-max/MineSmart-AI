import React, { useState } from "react";
import { FlaskConical, CheckCircle2, AlertTriangle, XCircle, Search, Filter, ShieldCheck, Flame, Layers } from "lucide-react";
import { Stockpile, StockpileQualityStatus } from "../../../types/stockpileTypes";

interface StockpileQualityTabProps {
  stockpiles: Stockpile[];
}

export const StockpileQualityTab: React.FC<StockpileQualityTabProps> = ({ stockpiles }) => {
  const [selectedStockpileId, setSelectedStockpileId] = useState<string>(stockpiles[0]?.id || "");
  const [filterSpec, setFilterSpec] = useState<string>("ALL");

  const selectedStockpile = stockpiles.find((s) => s.id === selectedStockpileId) || stockpiles[0];

  const filteredStockpiles = stockpiles.filter((s) => {
    if (filterSpec === "ALL") return true;
    return s.quality.status === filterSpec;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-amber-500" />
            Coal Quality & Assay Parameter Profiling
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Sertifikasi lab assay batubara (CV GAR, TM, Ash, Sulfur, Volatile Matter, HGI) dan pemantauan spesifikasi garansi kontrak.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterSpec}
            onChange={(e) => setFilterSpec(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            <option value="ALL">Semua Compliance Spec</option>
            <option value="ON SPEC">ON SPEC (Sesuai Kontrak)</option>
            <option value="WARNING">WARNING (Mendekati Limit)</option>
            <option value="OUT OF SPEC">OUT OF SPEC (Melebihi Limit)</option>
          </select>
        </div>
      </div>

      {/* Main Selected Stockpile Quality Certificate View */}
      {selectedStockpile && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                  {selectedStockpile.stockpileCode}
                </span>
                <span className="text-xs font-semibold text-slate-500">{selectedStockpile.stockpileType}</span>
              </div>
              <h4 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                {selectedStockpile.stockpileName}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Area: {selectedStockpile.location.area} • Sampel Terakhir: {selectedStockpile.quality.lastSampleDate || "2026-08-13"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold ${
                  selectedStockpile.quality.status === "ON SPEC"
                    ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                    : selectedStockpile.quality.status === "WARNING"
                    ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                    : "bg-red-500/10 text-red-600 border border-red-500/20"
                }`}
              >
                {selectedStockpile.quality.status === "ON SPEC" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
                <span>STATUS: {selectedStockpile.quality.status}</span>
              </span>
            </div>
          </div>

          {/* Detailed Parameter Metric Cards */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-center dark:border-slate-800/80 dark:bg-slate-800/40">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Calorific Value</span>
              <p className="text-xl font-black text-amber-600 dark:text-amber-400 mt-1">{selectedStockpile.quality.cvGAR}</p>
              <span className="text-[10px] text-slate-500">kcal/kg GAR</span>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-center dark:border-slate-800/80 dark:bg-slate-800/40">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total Moisture</span>
              <p className="text-xl font-black text-slate-900 dark:text-white mt-1">{selectedStockpile.quality.totalMoisture}%</p>
              <span className="text-[10px] text-slate-500">ARB %</span>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-center dark:border-slate-800/80 dark:bg-slate-800/40">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Ash Content</span>
              <p className={`text-xl font-black mt-1 ${selectedStockpile.quality.ash > 9 ? "text-red-500" : "text-slate-900 dark:text-white"}`}>
                {selectedStockpile.quality.ash}%
              </p>
              <span className="text-[10px] text-slate-500">ADB %</span>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-center dark:border-slate-800/80 dark:bg-slate-800/40">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total Sulfur</span>
              <p className="text-xl font-black text-slate-900 dark:text-white mt-1">{selectedStockpile.quality.sulfur}%</p>
              <span className="text-[10px] text-slate-500">ADB %</span>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-center dark:border-slate-800/80 dark:bg-slate-800/40">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Volatile Matter</span>
              <p className="text-xl font-black text-slate-900 dark:text-white mt-1">{selectedStockpile.quality.volatileMatter}%</p>
              <span className="text-[10px] text-slate-500">ADB %</span>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-center dark:border-slate-800/80 dark:bg-slate-800/40">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">HGI Index</span>
              <p className="text-xl font-black text-slate-900 dark:text-white mt-1">{selectedStockpile.quality.hgi}</p>
              <span className="text-[10px] text-slate-500">Hardgrove</span>
            </div>
          </div>
        </div>
      )}

      {/* Quality Comparison Matrix Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 font-bold text-sm text-slate-900 dark:text-white">
          Matriks Perbandingan Kualitas Seluruh Stockpile
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 dark:bg-slate-800/50 dark:border-slate-800 text-slate-500">
              <tr>
                <th className="p-3 font-bold">Stockpile</th>
                <th className="p-3 font-bold">Jenis Batubara</th>
                <th className="p-3 font-bold text-right">CV GAR (kcal)</th>
                <th className="p-3 font-bold text-right">TM (%)</th>
                <th className="p-3 font-bold text-right">Ash (%)</th>
                <th className="p-3 font-bold text-right">Sulfur (%)</th>
                <th className="p-3 font-bold text-right">HGI</th>
                <th className="p-3 font-bold text-center">Quality Spec</th>
                <th className="p-3 font-bold text-center">Pilih</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStockpiles.map((sp) => (
                <tr key={sp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-3">
                    <span className="font-bold text-slate-900 dark:text-white">{sp.stockpileName}</span>
                    <p className="text-[10px] text-slate-400">{sp.stockpileCode}</p>
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{sp.coalType}</td>
                  <td className="p-3 text-right font-black text-amber-600 dark:text-amber-400">{sp.quality.cvGAR}</td>
                  <td className="p-3 text-right text-slate-900 dark:text-white font-semibold">{sp.quality.totalMoisture}%</td>
                  <td className={`p-3 text-right font-semibold ${sp.quality.ash > 9 ? "text-red-500" : "text-slate-900 dark:text-white"}`}>
                    {sp.quality.ash}%
                  </td>
                  <td className="p-3 text-right text-slate-900 dark:text-white font-semibold">{sp.quality.sulfur}%</td>
                  <td className="p-3 text-right text-slate-900 dark:text-white">{sp.quality.hgi}</td>
                  <td className="p-3 text-center">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                        sp.quality.status === "ON SPEC"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : sp.quality.status === "WARNING"
                          ? "bg-amber-500/10 text-amber-600"
                          : "bg-red-500/10 text-red-600"
                      }`}
                    >
                      {sp.quality.status}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => setSelectedStockpileId(sp.id)}
                      className="rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-700 hover:bg-amber-500 hover:text-slate-950 dark:bg-slate-800 dark:text-slate-300"
                    >
                      Pilih
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
