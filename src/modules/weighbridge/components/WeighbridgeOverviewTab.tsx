import React from "react";
import {
  Scale,
  Truck,
  FileText,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Bot,
  RefreshCw,
  Plus,
  QrCode,
  GitCompare,
  Flame,
  Radio,
  Layers,
  ShieldAlert,
} from "lucide-react";
import {
  Weighbridge,
  WeighbridgeVehicle,
  WeighbridgeTicket,
  WeighbridgeReconciliation,
  WeighbridgeAlert,
  WeighbridgeAIInsight,
  ScaleDeviceReading,
} from "../../../types/weighbridgeTypes";

interface WeighbridgeOverviewTabProps {
  weighbridges: Weighbridge[];
  vehicles: WeighbridgeVehicle[];
  tickets: WeighbridgeTicket[];
  reconciliations: WeighbridgeReconciliation[];
  alerts: WeighbridgeAlert[];
  insights: WeighbridgeAIInsight[];
  scaleReadings: ScaleDeviceReading[];
  onOpenNewWeighIn: () => void;
  onOpenNewWeighOut: () => void;
  onOpenScanQR: () => void;
  onSelectTab: (tab: string) => void;
}

export const WeighbridgeOverviewTab: React.FC<WeighbridgeOverviewTabProps> = ({
  weighbridges,
  vehicles,
  tickets,
  reconciliations,
  alerts,
  insights,
  scaleReadings,
  onOpenNewWeighIn,
  onOpenNewWeighOut,
  onOpenScanQR,
  onSelectTab,
}) => {
  // KPI Calculations
  const todayTickets = tickets;
  const completedTickets = todayTickets.filter((t) => t.status === "COMPLETED" || t.status === "VALIDATED");
  const openTickets = todayTickets.filter((t) => t.status === "OPEN" || t.status === "DRAFT");
  
  const totalGrossKg = completedTickets.reduce((acc, t) => acc + t.grossWeight, 0);
  const totalTareKg = completedTickets.reduce((acc, t) => acc + t.tareWeight, 0);
  const totalNetKg = completedTickets.reduce((acc, t) => acc + t.netWeight, 0);

  const totalGrossTons = (totalGrossKg / 1000).toFixed(1);
  const totalTareTons = (totalTareKg / 1000).toFixed(1);
  const totalNetTons = (totalNetKg / 1000).toFixed(1);
  
  const avgNetTons = completedTickets.length > 0 ? (totalNetKg / 1000 / completedTickets.length).toFixed(2) : "0.00";
  const overloadCount = todayTickets.filter((t) => t.isOverload).length;
  const activeAlertsCount = alerts.filter((a) => !a.isResolved).length;
  const unresolvedReconciliations = reconciliations.filter((r) => r.status !== "RESOLVED" && r.status !== "MATCHED").length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-800/40 text-white shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Scale className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Weighbridge Command Center</h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Weighbridge Active
            </span>
          </div>
          <p className="text-sm text-slate-300">
            Pusat pencatatan, validasi, monitoring, dan rekonsiliasi penimbangan material tambang terintegrasi dengan Operasi, Stockpile, Sales & AI.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenNewWeighIn}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-all shadow-md shadow-emerald-900/30 active:scale-98 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Weigh-In Baru
          </button>
          <button
            onClick={onOpenNewWeighOut}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold text-sm transition-all active:scale-98 cursor-pointer"
          >
            <Scale className="w-4 h-4 text-emerald-400" />
            Weigh-Out
          </button>
          <button
            onClick={onOpenScanQR}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold text-sm transition-all active:scale-98 cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-sky-400" />
            Scan QR Ticket
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">
            <span>TOTAL WEIGHED TODAY</span>
            <Scale className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{totalNetTons} <span className="text-xs font-normal text-slate-500">Ton</span></div>
          <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600 dark:text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Net Tonnage</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">
            <span>TRANSACTIONS</span>
            <FileText className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{todayTickets.length} <span className="text-xs font-normal text-slate-500">Tiket</span></div>
          <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
            <span>{completedTickets.length} Selesai</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">
            <span>AVG NET / TRUCK</span>
            <Truck className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{avgNetTons} <span className="text-xs font-normal text-slate-500">Ton</span></div>
          <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
            <span>Standard Load</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">
            <span>OPEN / PENDING</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{openTickets.length} <span className="text-xs font-normal text-slate-500">Truk</span></div>
          <div className="flex items-center gap-1 mt-1 text-xs text-amber-600 dark:text-amber-400">
            <span>Dalam Antrean/Loading</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">
            <span>OVERLOAD ALERTS</span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">{overloadCount} <span className="text-xs font-normal text-slate-500">Unit</span></div>
          <div className="flex items-center gap-1 mt-1 text-xs text-rose-500">
            <span>Kapasitas Terlampaui</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">
            <span>RECON VARIANCE</span>
            <GitCompare className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{unresolvedReconciliations} <span className="text-xs font-normal text-slate-500">Item</span></div>
          <div className="flex items-center gap-1 mt-1 text-xs text-purple-500">
            <span>Unresolved Variances</span>
          </div>
        </div>
      </div>

      {/* Live Scale Indicators Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-emerald-500" />
            Live Weighbridge Digital Indicators
          </h2>
          <button
            onClick={() => onSelectTab("settings")}
            className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
          >
            Kelola Jembatan Timbang & Scale Devices →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {weighbridges.map((wb) => {
            const reading = scaleReadings.find((r) => r.weighbridgeId === wb.weighbridgeId);
            const isOnline = wb.status === "ACTIVE";
            return (
              <div
                key={wb.weighbridgeId}
                className="p-5 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">{wb.code}</span>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        wb.status === "ACTIVE"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                          : wb.status === "CALIBRATION_DUE"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${wb.status === "ACTIVE" ? "bg-emerald-500 animate-ping" : "bg-amber-500"}`}></span>
                      {wb.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">{wb.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{wb.location}</p>

                  {/* Digital Scale Display Window */}
                  <div className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-center border border-slate-800 shadow-inner mb-3">
                    <div className="text-xs text-slate-500 mb-0.5 uppercase tracking-widest flex items-center justify-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${reading?.stableReading ? "bg-emerald-400" : "bg-amber-400 animate-pulse"}`}></span>
                      {reading?.stableReading ? "STABLE WEIGHT" : "SAMPLING WEIGHT..."}
                    </div>
                    <div className="text-3xl font-extrabold tracking-tight">
                      {reading ? reading.rawWeight.toLocaleString() : "0"} <span className="text-sm font-normal text-emerald-600">kg</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      = {reading ? (reading.rawWeight / 1000).toFixed(2) : "0.00"} Ton (Kapasitas Maks: {wb.capacity} Ton)
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>Serial: {wb.serialNumber}</span>
                  <span>Metrologi: {wb.calibrationStatus}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Transactions & AI Insight Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Weighbridge Tickets Table */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-sky-500" />
              Transaksi Penimbangan Terbaru
            </h2>
            <button
              onClick={() => onSelectTab("tickets")}
              className="text-xs text-sky-600 dark:text-sky-400 hover:underline font-medium"
            >
              Lihat Semua Tiket ({tickets.length}) →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-900/60 uppercase font-semibold text-slate-500 dark:text-slate-400 border-y border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-3">No. Tiket</th>
                  <th className="py-3 px-3">Unit Truk</th>
                  <th className="py-3 px-3">Material</th>
                  <th className="py-3 px-3">Gross</th>
                  <th className="py-3 px-3">Tare</th>
                  <th className="py-3 px-3 font-bold text-emerald-600 dark:text-emerald-400">NET</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {tickets.slice(0, 5).map((ticket) => (
                  <tr key={ticket.ticketId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">{ticket.ticketNumber}</td>
                    <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">{ticket.unitNumber}</td>
                    <td className="py-3 px-3">{ticket.materialType}</td>
                    <td className="py-3 px-3">{ticket.grossWeight.toLocaleString()} kg</td>
                    <td className="py-3 px-3">{ticket.tareWeight.toLocaleString()} kg</td>
                    <td className="py-3 px-3 font-bold text-emerald-600 dark:text-emerald-400">{ticket.normalizedValue} Ton</td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                          ticket.status === "COMPLETED" || ticket.status === "VALIDATED"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                            : ticket.status === "OPEN"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {ticket.isOverload && <AlertTriangle className="w-3 h-3 text-rose-500" />}
                        {ticket.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Weighbridge Command Center Widget */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 via-emerald-950/40 to-slate-950 border border-emerald-800/30 text-white shadow-md space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-800/30 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <Bot className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm tracking-wide text-emerald-200">WEIGHBRIDGE AI COPILOT</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ACTIVE AI
              </span>
            </div>

            {insights.slice(0, 1).map((insight) => (
              <div key={insight.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-emerald-700/30 space-y-2 text-xs">
                <div className="flex items-center justify-between font-semibold text-emerald-300">
                  <span>{insight.title}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-200">{insight.confidence} Conf</span>
                </div>
                <p className="text-slate-300 leading-relaxed"><strong className="text-white">Finding:</strong> {insight.finding}</p>
                <div className="p-2 rounded bg-slate-950/60 text-slate-400 font-mono text-[11px] border border-slate-800">
                  Variance: <span className="text-amber-300 font-bold">{insight.variance}</span>
                </div>
                <p className="text-emerald-200/90"><strong className="text-white">Rekomendasi:</strong> {insight.recommendation}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => onSelectTab("ai-insight")}
            className="w-full mt-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            Tanya AI Command Center
          </button>
        </div>
      </div>
    </div>
  );
};
