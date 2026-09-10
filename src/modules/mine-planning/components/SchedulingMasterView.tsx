// MINE SMART AI - Comprehensive Scheduling Master Component
// Covering: Life of Mine (LOM), Long Term Plan (LTP), Medium Term Plan (MTP), Short Term Plan (STP), Weekly Plan, and Daily Plan

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  TrendingUp,
  BarChart3,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Play,
  Flame,
  ArrowRight,
  Filter,
  DollarSign,
  Fuel,
  Users,
} from "lucide-react";
import {
  MinePlan,
  LOMPlan,
  WeeklyPlan,
  DailyPlan,
} from "../../../types/minePlanningTypes";
import { MinePlanningRepository } from "../../../services/repositories/MinePlanningRepository";

export const SchedulingMasterView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<
    "LOM" | "LTP" | "MTP" | "STP" | "WEEKLY" | "DAILY"
  >("WEEKLY");

  const lomPlan = MinePlanningRepository.getLOMPlan();
  const [weeklyPlans, setWeeklyPlans] = useState<WeeklyPlan[]>(
    MinePlanningRepository.getWeeklyPlans()
  );
  const [dailyPlans, setDailyPlans] = useState<DailyPlan[]>(
    MinePlanningRepository.getDailyPlans()
  );

  const selectedWeekly = weeklyPlans[0];

  return (
    <div className="space-y-6">
      {/* Top Banner & Sub-Navigation */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-4 md:p-5 shadow-sm backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-indigo-500/10 dark:bg-indigo-500/20 px-2.5 py-0.5 text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 uppercase tracking-wider">
                MINE PRODUCTION SCHEDULING & FLEET ALLOCATION
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Multi-Horizon Hierarchy (10-Yr to Shift Level)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1 flex items-center gap-2">
              <Calendar className="h-6 w-6 text-indigo-500" />
              Integrated Mine Scheduling Engine
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Hierarki rencana produksi terpadu: Life of Mine (LOM 10-Tahun), Rencana Jangka Panjang (LTP/RKAB), Jangka Menengah (MTP 3-Bulan), Jangka Pendek (STP 2-Minggu), Rencana Mingguan (Weekly 7-Hari), dan Rencana Harian Shift (Daily Plan).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 min-w-[120px]">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Target Mingguan</span>
              <span className="text-sm font-black text-amber-500 font-mono">88,000 Ton</span>
            </div>
            <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 min-w-[120px]">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">OB Stripping</span>
              <span className="text-sm font-black text-indigo-500 font-mono">368,000 BCM</span>
            </div>
          </div>
        </div>

        {/* Sub-Tabs Selector */}
        <div className="flex flex-wrap items-center gap-2 pt-3">
          {[
            { id: "LOM", label: "1. Life of Mine (LOM)", icon: BarChart3 },
            { id: "LTP", label: "2. Long Term Plan (LTP)", icon: TrendingUp },
            { id: "MTP", label: "3. Medium Term Plan (MTP)", icon: Layers },
            { id: "STP", label: "4. Short Term Plan (STP)", icon: Sparkles },
            { id: "WEEKLY", label: "5. Weekly Plan (7-Day)", icon: Calendar },
            { id: "DAILY", label: "6. Daily Shift Plan (24-Hr)", icon: Clock },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  active
                    ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-500/20"
                    : "border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SUBTAB 1: LOM (LIFE OF MINE) */}
      {activeSubTab === "LOM" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-extrabold text-indigo-500 uppercase">
                  10-YEAR STRATEGIC RESERVE DEPLETION & FINANCIAL TRAJECTORY
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {lomPlan.title}
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Cadangan Awal: <strong className="text-teal-500">{lomPlan.initialReserveMt} Mt</strong> | Rata-rata SR: <strong className="text-amber-500">{lomPlan.overallStripRatio}</strong>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 font-bold text-slate-400 font-sans">
                    <th className="p-3">Tahun</th>
                    <th className="p-3">Target Batubara (Mt)</th>
                    <th className="p-3">Overburden (Mbc)</th>
                    <th className="p-3">Strip Ratio (SR)</th>
                    <th className="p-3">Sisa Cadangan (Mt)</th>
                    <th className="p-3">Jarak Haul Rata-rata</th>
                    <th className="p-3">Biaya Mining ($/Ton)</th>
                    <th className="p-3">Estimasi Revenue ($M)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {lomPlan.yearlyData.map((y) => (
                    <tr key={y.year} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-indigo-500">{y.year}</td>
                      <td className="p-3 font-black text-amber-500">{y.coalTargetMt} Mt</td>
                      <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{y.wasteTargetMbc} Mbc</td>
                      <td className="p-3 font-bold text-teal-500">{y.stripRatio} : 1</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">{y.remainingReserveMt} Mt</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">{y.averageHaulKm} km</td>
                      <td className="p-3 text-rose-500 font-bold">${y.unitMiningCostUSD}</td>
                      <td className="p-3 font-bold text-emerald-500">${y.revenueEstMUSD} M</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: LTP (LONG TERM PLAN) */}
      {activeSubTab === "LTP" && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-extrabold text-indigo-500 uppercase">
                RKAB & ANNUAL EXPANSION HORIZON (3 - 5 YEARS)
              </span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Rencana Jangka Panjang LTP Pit Sangatta (2026 - 2030)
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-500 font-bold">Status: RKAB ESDM Compliant</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-2">
              <span className="text-slate-400 text-xs font-bold uppercase block">Target Batubara 2026:</span>
              <span className="text-2xl font-black text-amber-500 font-mono">4.20 Juta Ton</span>
              <p className="text-xs text-slate-500 dark:text-slate-400">Diproyeksikan 100% terserap kontrak PLTU domestik (DMO 25%) dan ekspor Asia Timur.</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-2">
              <span className="text-slate-400 text-xs font-bold uppercase block">Kebutuhan Fleet Loader:</span>
              <span className="text-2xl font-black text-indigo-500 font-mono">4 Primary Units</span>
              <p className="text-xs text-slate-500 dark:text-slate-400">2x Komatsu PC2000 & 2x CAT 6020B Hydraulic Excavator.</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-2">
              <span className="text-slate-400 text-xs font-bold uppercase block">Kebutuhan Hauling Trucks:</span>
              <span className="text-2xl font-black text-teal-500 font-mono">22 Rigid Trucks</span>
              <p className="text-xs text-slate-500 dark:text-slate-400">Komatsu HD785-7 (100 Ton class) & CAT 777D (100 Ton class).</p>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: MTP (MEDIUM TERM PLAN) */}
      {activeSubTab === "MTP" && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-extrabold text-indigo-500 uppercase">
                ROLLING 3-MONTH (Q3 2026) OPERATIONAL TARGET
              </span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Rencana Jangka Menengah Triwulan III (Juli - September 2026)
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">Total Q3: 1.15 Mt Coal | 4.83 Mbc OB</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { month: "Juli 2026", coal: "380,000 Ton", ob: "1,596,000 BCM", sr: "4.20", gar: "4,210 kcal", status: "Selesai 102%" },
              { month: "Agustus 2026", coal: "385,000 Ton", ob: "1,617,000 BCM", sr: "4.20", gar: "4,215 kcal", status: "Sedang Berjalan" },
              { month: "September 2026", coal: "385,000 Ton", ob: "1,617,000 BCM", sr: "4.20", gar: "4,200 kcal", status: "Terjadwal" },
            ].map((m, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-black text-slate-900 dark:text-white text-sm">{m.month}</h4>
                  <span className="text-[10px] bg-indigo-500/10 text-indigo-500 font-bold px-2 py-0.5 rounded">{m.status}</span>
                </div>
                <div className="space-y-1 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">Batubara:</span>
                    <span className="font-bold text-amber-500">{m.coal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">Overburden:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{m.ob}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">Kalori Blend:</span>
                    <span className="font-bold text-teal-500">{m.gar}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: STP (SHORT TERM PLAN) */}
      {activeSubTab === "STP" && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-extrabold text-indigo-500 uppercase">
                14-DAY OPERATIONAL LOOKAHEAD & BENCH ADVANCE
              </span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Rencana Jangka Pendek Dua Mingguan (STP Period 32-33)
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">10 Ags - 23 Ags 2026</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-2">
              <span className="text-indigo-500 font-bold text-xs">Minggu I (Week 32)</span>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">Penetrasi Seam 30 Bench RL +30m</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Penggalian batubara bersih 88,000 Ton menggunakan EX-02 PC2000 dan pembuangan OB 368,000 BCM ke North Waste Dump.</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-2">
              <span className="text-sky-500 font-bold text-xs">Minggu II (Week 33)</span>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">Pembersihan Interburden & Pembukaan Seam 28</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Ripping dan loading interburden shale tebal 14m di Bench RL +10m dengan alokasi dozer ripping DZ-01 & DZ-02.</p>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 5: WEEKLY PLAN BOARD */}
      {activeSubTab === "WEEKLY" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-extrabold text-indigo-500 uppercase">
                  WEEKLY PLAN SCHEDULE (WEEK 32 / AGUSTUS 2026)
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Jadwal Operasional Harian 7 Hari & Alokasi Ritase
                </h3>
              </div>
              <span className="text-xs font-mono text-emerald-500 font-bold">Status: Rencana Aktif</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-3">
              {selectedWeekly.dailyAllocations.map((day, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-2"
                >
                  <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800/80 pb-1">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{day.dayName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{day.dateStr}</span>
                  </div>

                  <div className="space-y-1 text-xs font-mono">
                    <div>
                      <span className="text-slate-400 block text-[9px] font-sans">Coal Target:</span>
                      <span className="font-bold text-amber-500">{(day.coalTargetMt * 1000).toFixed(0)} Ton</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] font-sans">OB Removal:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{(day.wasteTargetMbc * 1000).toFixed(0)} BCM</span>
                    </div>
                  </div>

                  <div className="pt-1 text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    Fleet: {day.equipmentAssigned}
                  </div>

                  <div className="pt-1">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold block text-center ${
                      day.status === "COMPLETED"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : day.status === "IN_PROGRESS"
                        ? "bg-amber-500/10 text-amber-500"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-400"
                    }`}>
                      {day.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 6: DAILY SHIFT PLAN */}
      {activeSubTab === "DAILY" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dailyPlans.map((dp) => (
              <div
                key={dp.id}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-extrabold text-indigo-500 uppercase">{dp.dailyId}</span>
                    <h4 className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                      {dp.shift === "SHIFT_1_DAY" ? "Shift 1 - Siang (07:00 - 19:00)" : "Shift 2 - Malam (19:00 - 07:00)"}
                    </h4>
                  </div>
                  <span className="bg-emerald-500/10 text-emerald-500 font-bold text-xs px-2.5 py-1 rounded-full">
                    {dp.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 text-[10px] block uppercase font-sans">Target Batubara Shift:</span>
                    <span className="font-bold text-amber-500">{(dp.coalTargetMt * 1000).toFixed(0)} Ton</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 text-[10px] block uppercase font-sans">Target Overburden Shift:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{(dp.wasteTargetMbc * 1000).toFixed(0)} BCM</span>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Armada Ditugaskan:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {dp.assignedEquipment.map((eq, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono">
                  <span className="text-slate-400 block text-[10px] font-sans">Rute & Jarak Hauling:</span>
                  <span className="font-bold text-indigo-500">{dp.haulingRoute} ({dp.haulDistanceKm} km)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
