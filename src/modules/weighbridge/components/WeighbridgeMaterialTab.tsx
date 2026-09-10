import React from "react";
import { Layers, Flame, Truck, ArrowUpRight, BarChart3, TrendingUp } from "lucide-react";
import { WeighbridgeTicket } from "../../../types/weighbridgeTypes";

interface WeighbridgeMaterialTabProps {
  tickets: WeighbridgeTicket[];
}

export const WeighbridgeMaterialTab: React.FC<WeighbridgeMaterialTabProps> = ({ tickets }) => {
  // Material breakdown calculations
  const materials = ["ROM Coal", "Product Coal GAR 5000", "Thermal Coal", "Overburden (OB)"];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-500" />
            Pergerakan Material & Analisis Tonase Penimbangan
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pencatatan pergerakan batubara (ROM, Crushed, Product) dan Overburden (OB) berdasarkan asal, tujuan, dan unit angkut.
          </p>
        </div>
      </div>

      {/* Material Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {materials.map((mat) => {
          const matTickets = tickets.filter((t) => t.materialType.includes(mat) || mat.includes(t.materialType));
          const totalTon = matTickets.reduce((acc, t) => acc + t.normalizedValue, 0).toFixed(1);
          const totalTrips = matTickets.length;

          return (
            <div key={mat} className="p-5 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">{mat}</span>
                <Flame className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{totalTon} <span className="text-xs font-normal text-slate-500">Ton</span></div>
              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Trip Penimbangan:</span>
                <strong className="text-slate-900 dark:text-white font-mono">{totalTrips} Trip</strong>
              </div>
            </div>
          );
        })}
      </div>

      {/* Movement Details Table */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-emerald-500" />
          Rincian Pergerakan Material Hari Ini
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-900 uppercase font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Material</th>
                <th className="py-3 px-4">Lokasi Asal (Source)</th>
                <th className="py-3 px-4">Lokasi Tujuan (Destination)</th>
                <th className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">Total Net Tonnage</th>
                <th className="py-3 px-4">Jumlah Trip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {tickets.map((t) => (
                <tr key={t.ticketId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{t.materialType}</td>
                  <td className="py-3 px-4">{t.source}</td>
                  <td className="py-3 px-4">{t.destination}</td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">{t.normalizedValue} Ton</td>
                  <td className="py-3 px-4 font-mono">1 Trip ({t.unitNumber})</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
