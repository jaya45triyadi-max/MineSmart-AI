import React from "react";
import { BarChart3, TrendingUp, Users, Clock, Award } from "lucide-react";
import { HRKPISummary } from "../../../types/hrTypes";

interface Props {
  kpi: HRKPISummary | null;
}

export const HRAnalyticsTab: React.FC<Props> = ({ kpi }) => {
  if (!kpi) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-emerald-400" />
          HR Analytics & Workforce Performance Scorecard
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Analisis metrik SDM, produktivitas per departemen, turnover rate, tren absensi, dan efisiensi jam lembur.
        </p>
      </div>

      {/* Analytics Scorecard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-2 shadow-md">
          <span className="text-xs font-bold text-slate-400 uppercase">Tingkat Retensi & Turnover Rate</span>
          <h3 className="text-2xl font-black text-emerald-400">98.5% Retensi</h3>
          <p className="text-xs text-slate-400">Turnover tahunan berada di angka 1.5% (Target &lt; 3.0%).</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-2 shadow-md">
          <span className="text-xs font-bold text-slate-400 uppercase">Rata-rata Jam Overtime / Karyawan</span>
          <h3 className="text-2xl font-black text-amber-400">3.1 Jam / Minggu</h3>
          <p className="text-xs text-slate-400">Terdistribusi terbesar pada Dept Plant Maintenance.</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-2 shadow-md">
          <span className="text-xs font-bold text-slate-400 uppercase">Kepatuhan Lisensi Sertifikasi K3</span>
          <h3 className="text-2xl font-black text-cyan-400">94.8% Compliant</h3>
          <p className="text-xs text-slate-400">Memenuhi regulasi KESDM KTT & Pengawas Operasional.</p>
        </div>
      </div>
    </div>
  );
};
