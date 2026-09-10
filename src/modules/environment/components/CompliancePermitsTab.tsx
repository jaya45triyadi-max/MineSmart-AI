import React from "react";
import {
  FileCheck2,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Building2,
  FileText,
  Clock,
} from "lucide-react";
import {
  EnvironmentalStandard,
  EnvironmentalComplianceRequirement,
  EnvironmentalPermit,
} from "../../../types/environmentTypes";

interface Props {
  standards: EnvironmentalStandard[];
  complianceRequirements: EnvironmentalComplianceRequirement[];
  permits: EnvironmentalPermit[];
}

export const CompliancePermitsTab: React.FC<Props> = ({
  standards,
  complianceRequirements,
  permits,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-slate-900 p-6 border border-slate-800 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck2 className="h-6 w-6 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">
              Compliance Requirements & Environmental Permits
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Matriks kepatuhan hukum lingkungan, baku mutu nasional, izin IPLC/AMDAL/TPS-B3 & kalender perpanjangan
          </p>
        </div>
      </div>

      {/* Environmental Permits Countdown Grid */}
      <div className="space-y-4">
        <h3 className="font-bold text-white text-sm flex items-center gap-2">
          <FileText className="h-4 w-4 text-emerald-400" />
          Status Perizinan Lingkungan Hidup Tambang (Permits)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {permits.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-md space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                    {p.permitType}
                  </span>
                  <h4 className="font-bold text-white text-sm mt-0.5">{p.permitNumber}</h4>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    p.status === "EXPIRING"
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  }`}
                >
                  {p.status === "EXPIRING" ? `${p.daysToExpiry} Hari Lagi` : "AKTIF"}
                </span>
              </div>

              <p className="text-xs text-slate-400">
                Penerbit: <strong className="text-slate-300">{p.issuerAuthority}</strong>
              </p>

              <div className="pt-2 border-t border-slate-800 flex justify-between text-[11px] text-slate-400">
                <span>Berlaku: {p.effectiveDate}</span>
                <span>Berakhir: {p.expiryDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Matrix Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-md space-y-4">
        <h3 className="font-bold text-white text-sm">
          Matriks Kepatuhan Persyaratan Lingkungan (Compliance Matrix)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Persyaratan & Judul</th>
                <th className="px-4 py-3.5">Kategori & Dasar Hukum</th>
                <th className="px-4 py-3.5">Baku Mutu / Batas Maksimum</th>
                <th className="px-4 py-3.5">Frekuensi Laporan</th>
                <th className="px-4 py-3.5">Penanggung Jawab</th>
                <th className="px-4 py-3.5">Status Kepatuhan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {complianceRequirements.map((req) => (
                <tr key={req.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-4 py-3 font-semibold text-white">
                    {req.title}
                    <div className="text-[10px] text-slate-400">{req.description}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {req.category}
                    </span>
                    <div className="text-[10px] text-slate-500">{req.referenceDoc}</div>
                  </td>
                  <td className="px-4 py-3 font-bold text-cyan-400">{req.limitText}</td>
                  <td className="px-4 py-3 text-slate-400">{req.reportingFrequency}</td>
                  <td className="px-4 py-3 text-slate-300">{req.responsiblePerson}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="h-3 w-3" /> {req.complianceStatus}
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
