import React from "react";
import {
  FileText,
  ShieldCheck,
  AlertCircle,
  Plus,
  Scale,
  Building,
  CheckCircle2,
} from "lucide-react";
import { QualitySpecification } from "../../../types/laboratoryTypes";

interface SpecificationsTabProps {
  specifications: QualitySpecification[];
}

export const SpecificationsTab: React.FC<SpecificationsTabProps> = ({ specifications }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-500" /> Spesifikasi Kualitas Batubara & Kontrak Pembeli
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pusat konfigurasi spesifikasi produk batubara, batasan toleransi parameter (GAR, TM, Ash, TS), aturan penalti komersial, dan kriteria penolakan (rejection).
          </p>
        </div>
        <button
          onClick={() => alert("Tambah Spesifikasi Kontrak Baru...")}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Tambah Spec Kontrak
        </button>
      </div>

      <div className="space-y-6">
        {specifications.map((spec) => (
          <div
            key={spec.id}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-500">{spec.specCode}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    {spec.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                  {spec.specName}
                </h3>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" /> Pembeli: {spec.clientName} (Kontrak: {spec.contractRef})
                </p>
              </div>

              <div className="text-xs text-slate-500 text-right">
                <span>Berlaku: {spec.effectiveDate} s.d. {spec.expiryDate || "Seterusnya"}</span>
              </div>
            </div>

            {/* Parameters Grid Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Parameter</th>
                    <th className="py-2.5 px-3">Basis</th>
                    <th className="py-2.5 px-3">Satuan</th>
                    <th className="py-2.5 px-3">Target</th>
                    <th className="py-2.5 px-3">Rentang Min - Max</th>
                    <th className="py-2.5 px-3">Toleransi Warning</th>
                    <th className="py-2.5 px-3">Aturan Penalti Komersial</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {spec.parameters.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-slate-100">
                        {p.parameter}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">{p.basis}</td>
                      <td className="py-3 px-3 text-slate-500">{p.unit}</td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">{p.target}</td>
                      <td className="py-3 px-3 font-mono text-slate-700 dark:text-slate-300">
                        {p.minValue} - {p.maxValue}
                      </td>
                      <td className="py-3 px-3 font-mono text-amber-600 dark:text-amber-400">
                        {p.warningMin} - {p.warningMax}
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                        {p.penaltyRule || "Tidak Ada Penalti"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
