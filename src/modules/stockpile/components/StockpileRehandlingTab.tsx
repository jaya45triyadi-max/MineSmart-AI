import React from "react";
import { RefreshCw, Truck, DollarSign, Fuel, AlertTriangle, CheckCircle2, Route, Clock } from "lucide-react";
import { RehandlingRecord } from "../../../types/stockpileTypes";

interface StockpileRehandlingTabProps {
  rehandlings: RehandlingRecord[];
}

export const StockpileRehandlingTab: React.FC<StockpileRehandlingTabProps> = ({ rehandlings }) => {
  const totalRehandledTon = rehandlings.reduce((acc, r) => acc + r.quantity, 0);
  const totalCostIDR = rehandlings.reduce((acc, r) => acc + r.costIDR, 0);
  const totalFuelLiters = rehandlings.reduce((acc, r) => acc + r.fuelConsumptionLiters, 0);

  const avgCostPerTon = totalRehandledTon > 0 ? Math.round(totalCostIDR / totalRehandledTon) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-amber-500" />
            Stockpile Rehandling Cost & Fuel Analytics
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Laporan efisiensi pemindahan ulang (rehandling) batubara antar-pad, konsumsi BBM solar, jarak tempuh, serta beban biaya operasional.
          </p>
        </div>
      </div>

      {/* Rehandling KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Volume Rehandled</span>
            <div className="rounded-xl bg-amber-500/10 p-2 text-amber-500">
              <RefreshCw className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {totalRehandledTon.toLocaleString()}
            </span>
            <span className="ml-1 text-xs text-slate-500">Ton</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Pemindahan MTD Site BBNU-01</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Biaya Rehandling</span>
            <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-500">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              Rp {(totalCostIDR / 1000000).toFixed(1)}M
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Rata-rata: Rp {avgCostPerTon.toLocaleString()}/Ton</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">BBM Solar Terpakai</span>
            <div className="rounded-xl bg-blue-500/10 p-2 text-blue-500">
              <Fuel className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {totalFuelLiters.toLocaleString()}
            </span>
            <span className="ml-1 text-xs text-slate-500">Liter</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Solar Industri Dump Truck</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Alert Rehandling Berlebih</span>
            <div className="rounded-xl bg-amber-500/10 p-2 text-amber-500">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400">1</span>
            <span className="ml-1 text-xs text-slate-500">Warning</span>
          </div>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-medium">ROM-02 Distance High (4.8 km)</p>
        </div>
      </div>

      {/* Rehandling Records Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 font-bold text-sm text-slate-900 dark:text-white">
          Log Transaksi Rehandling Stockpile
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 dark:bg-slate-800/50 dark:border-slate-800 text-slate-500">
              <tr>
                <th className="p-3.5 font-bold">ID Transaksi & Waktu</th>
                <th className="p-3.5 font-bold">Rute (Asal → Tujuan)</th>
                <th className="p-3.5 font-bold text-right">Volume Ton</th>
                <th className="p-3.5 font-bold">Jarak & Waktu Siklus</th>
                <th className="p-3.5 font-bold text-right">BBM (Liter)</th>
                <th className="p-3.5 font-bold text-right">Estimasi Biaya (IDR)</th>
                <th className="p-3.5 font-bold">Alasan Rehandling</th>
                <th className="p-3.5 font-bold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {rehandlings.map((rh) => (
                <tr key={rh.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-3.5">
                    <span className="font-bold text-slate-900 dark:text-white">{rh.rehandlingId}</span>
                    <p className="text-[10px] text-slate-400">{rh.date} • {rh.shift}</p>
                  </td>
                  <td className="p-3.5 font-semibold text-slate-900 dark:text-white">
                    {rh.sourceStockpileName} → {rh.destinationStockpileName}
                  </td>
                  <td className="p-3.5 text-right font-black text-amber-600 dark:text-amber-400">
                    {rh.quantity.toLocaleString()} Ton
                  </td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-300">
                    {rh.distanceKm} km • {rh.cycleTimeMinutes} menit
                  </td>
                  <td className="p-3.5 text-right font-semibold text-blue-600 dark:text-blue-400">
                    {rh.fuelConsumptionLiters.toLocaleString()} L
                  </td>
                  <td className="p-3.5 text-right font-bold text-slate-900 dark:text-white">
                    Rp {rh.costIDR.toLocaleString()}
                  </td>
                  <td className="p-3.5 text-slate-500 text-[11px] max-w-xs truncate">{rh.reason}</td>
                  <td className="p-3.5 text-center">
                    <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      {rh.status}
                    </span>
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
