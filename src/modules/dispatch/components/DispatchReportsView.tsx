// MINE SMART AI - Dispatch Reports & AI Daily Report Generator

import React, { useState } from "react";
import { Sparkles, FileText, Printer, FileSpreadsheet, CheckCircle2 } from "lucide-react";
import { AIDailyDispatchReport } from "../../../types/dispatchTypes";

export const DispatchReportsView: React.FC = () => {
  const [reportDate, setReportDate] = useState("2026-08-13");
  const [report, setReport] = useState<AIDailyDispatchReport | null>({
    reportDate: "2026-08-13",
    shift: "SHIFT-DAY-1",
    executiveSummary:
      "Laporan operasional dispatch shift siang tanggal 13 Agustus 2026 berjalan secara optimal dengan pencapaian produksi 2,850 Ton (95% dari target 3,000 Ton). Terjadi peningkatan antrean di Pit 1 South pada jam 10:20 akibat alokasi berlebih ke EX-201, namun telah dimitigasi melalui reassign ke EX-202.",
    fleetStatusSummary: {
      totalActiveDispatch: 12,
      operatingTrucks: 8,
      queuedTrucks: 3,
      haulingTrucks: 5,
      idleTrucks: 1,
    },
    productionMetrics: {
      targetProductionTon: 3000,
      actualProductionTon: 2850,
      varianceTon: -150,
      achievementPercent: 95.0,
    },
    cycleTimeMetrics: {
      avgCycleTimeMin: 32.0,
      avgQueueTimeMin: 4.5,
      avgLoadingTimeMin: 4.2,
      avgHaulingTimeMin: 12.0,
      avgDumpingTimeMin: 2.5,
    },
    bottleneckAnalysis: [
      {
        location: "Pit 1 South Loading Bay",
        issue: "Antrean 3 Dump Truck di EX-201",
        impactMin: 10.0,
        cause: "Ketidakseimbangan alokasi armada truk dibanding kapasitas excavator.",
      },
      {
        location: "Haul Road Interburden Km 2.4",
        issue: "Penyempitan jalur dan perbaikan drainase",
        impactMin: 5.5,
        cause: "Alat berat grader sedang melakukan pemeliharaan badan jalan.",
      },
    ],
    aiRecommendations: [
      "Pindahkan 2 unit dump truck dari Pit 1 South ke Pit 2 North pada jam sibuk 11:00 - 13:00.",
      "Optimalkan penataan antrean tipping di ROM Stockpile 01 untuk mencegah bottleneck kendaraan dari Pit 1.",
    ],
    dataLimitations: "Data telemetri GPS beberapa unit Light Vehicle dalam kondisi offline, namun tidak mempengaruhi perhitungan siklus dump truck utama.",
    generatedAt: new Date().toISOString(),
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              AI DAILY & SHIFT DISPATCH REPORTS GENERATOR
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Laporan operasional terstruktur otomatis mencakup status fleet, cycle time, bottleneck, dan AI insight
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-3.5 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak / Export PDF</span>
        </button>
      </div>

      {report && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-wider">
                LAPORAN DISPATCH HARIAN (DAILY DISPATCH REPORT)
              </h2>
              <p className="text-xs text-amber-400 font-mono mt-1">
                Tanggal: {report.reportDate} | Shift: {report.shift}
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-xs font-bold rounded-full font-mono">
              AI GENERATED REPORT
            </span>
          </div>

          {/* Executive Summary */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-amber-400 uppercase font-mono">1. EXECUTIVE SUMMARY</h4>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed">
              {report.executiveSummary}
            </div>
          </div>

          {/* Fleet & Production Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-sky-400 uppercase font-mono">2. FLEET STATUS SUMMARY</h4>
              <div className="space-y-1 text-xs font-mono">
                <div className="flex justify-between text-slate-300"><span>Total Active Dispatch:</span><strong className="text-white">{report.fleetStatusSummary.totalActiveDispatch}</strong></div>
                <div className="flex justify-between text-slate-300"><span>Operating Trucks:</span><strong className="text-emerald-400">{report.fleetStatusSummary.operatingTrucks}</strong></div>
                <div className="flex justify-between text-slate-300"><span>Queued Trucks:</span><strong className="text-rose-400">{report.fleetStatusSummary.queuedTrucks}</strong></div>
                <div className="flex justify-between text-slate-300"><span>Hauling Trucks:</span><strong className="text-sky-400">{report.fleetStatusSummary.haulingTrucks}</strong></div>
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-emerald-400 uppercase font-mono">3. PRODUCTION METRICS</h4>
              <div className="space-y-1 text-xs font-mono">
                <div className="flex justify-between text-slate-300"><span>Target Production:</span><strong className="text-white">{report.productionMetrics.targetProductionTon} Ton</strong></div>
                <div className="flex justify-between text-slate-300"><span>Actual Production:</span><strong className="text-emerald-400">{report.productionMetrics.actualProductionTon} Ton</strong></div>
                <div className="flex justify-between text-slate-300"><span>Variance:</span><strong className="text-amber-400">{report.productionMetrics.varianceTon} Ton</strong></div>
                <div className="flex justify-between text-slate-300"><span>Achievement:</span><strong className="text-emerald-300">{report.productionMetrics.achievementPercent}%</strong></div>
              </div>
            </div>
          </div>

          {/* Bottleneck & AI Recommendations */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-rose-400 uppercase font-mono">4. BOTTLENECK & MAJOR DELAYS</h4>
            <div className="space-y-2">
              {report.bottleneckAnalysis.map((b, idx) => (
                <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-rose-500/30 text-xs">
                  <span className="font-bold text-white block">{b.location} - {b.issue}</span>
                  <p className="text-slate-400 mt-0.5">Dampak: +{b.impactMin} min delay • Penyebab: {b.cause}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-indigo-400 uppercase font-mono">5. AI REKOMENDASI DISPATCH</h4>
            <div className="p-4 bg-indigo-950/40 rounded-xl border border-indigo-500/30 text-xs text-slate-200 space-y-2">
              {report.aiRecommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-slate-500 font-mono italic pt-3 border-t border-slate-800">
            Data Limitations: {report.dataLimitations}
          </div>
        </div>
      )}
    </div>
  );
};
