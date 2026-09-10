// MINE SMART AI - RKAB Manpower & Mandatory Certification Compliance Tab
import React from "react";
import {
  Users,
  Award,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  GraduationCap,
  Briefcase,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import {
  ManpowerComplianceItem,
  MandatoryCertificationPersonnel,
} from "../../../types/rkabTypes";

interface ManpowerCertificationTabProps {
  manpowerData: ManpowerComplianceItem[];
  certifiedPersonnel: MandatoryCertificationPersonnel[];
}

export const ManpowerCertificationTab: React.FC<ManpowerCertificationTabProps> = ({
  manpowerData,
  certifiedPersonnel,
}) => {
  const totalEmployees = manpowerData.reduce((acc, curr) => acc + curr.headcount, 0);
  const totalTrainingHours = manpowerData.reduce((acc, curr) => acc + curr.trainingHoursDelivered, 0);

  const localWorkers = manpowerData
    .filter((m) => m.category === "LOKAL_RING_1" || m.category === "LOKAL_PROVINSI")
    .reduce((acc, curr) => acc + curr.headcount, 0);

  const localRatioPct = totalEmployees > 0 ? (localWorkers / totalEmployees) * 100 : 0;
  const expiringCerts = certifiedPersonnel.filter((c) => c.status === "EXPIRING_SOON");

  return (
    <div className="space-y-6">
      {/* Top Banner KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Manpower */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Tenaga Kerja Site</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {totalEmployees} <span className="text-xs font-normal text-slate-400">Orang</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Karyawan organik, kontraktor penambangan & subkontraktor lokal.
          </p>
        </div>

        {/* 2. Rasio Tenaga Kerja Lokal (Ring 1 & Provinsi) */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Serapan Tenaga Kerja Lokal</span>
            <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              {localRatioPct.toFixed(1)}%
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {localWorkers} <span className="text-xs font-normal text-slate-400">Orang (Target Min. 70%)</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full"
              style={{ width: `${Math.min(localRatioPct, 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-emerald-400/80">
            ✓ Memenuhi Perda Ketenagakerjaan Daerah & Komitmen PPM.
          </p>
        </div>

        {/* 3. Sertifikasi Wajib Kompetensi Tambang */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Kompetensi KTT / POP / POM</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {certifiedPersonnel.length} <span className="text-xs font-normal text-slate-400">Personel Kunci</span>
          </div>
          <p className="text-[11px] text-slate-400">
            {expiringCerts.length > 0 ? (
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> {expiringCerts.length} Sertifikat Renewal 2026
              </span>
            ) : (
              <span className="text-emerald-400 font-bold">Semua Sertifikat Valid</span>
            )}
          </p>
        </div>

        {/* 4. Total Jam Pelatihan K3 & Teknis */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Pelatihan & Pengembangan</span>
            <GraduationCap className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-blue-400">
            {totalTrainingHours.toLocaleString()} <span className="text-xs font-normal text-slate-400">Jam Latih</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Rata-rata 12.5 jam pelatihan per karyawan per tahun.
          </p>
        </div>
      </div>

      {/* Grid: Manpower Demographics & Certified Personnel Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Manpower Distribution Breakdown */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              Komposisi Asal Tenaga Kerja
            </h4>
          </div>

          <div className="space-y-3">
            {manpowerData.map((item) => (
              <div key={item.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300">
                    {item.category.replace(/_/g, " ")}
                  </span>
                  <span className="font-mono font-black text-white">
                    {item.headcount} Orang ({item.actualRatioPercent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      item.actualRatioPercent >= item.targetRatioPercent ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                    style={{ width: `${item.actualRatioPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Target Komitmen: {item.targetRatioPercent}%</span>
                  <span>{item.trainingHoursDelivered} Jam Latih</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certified Mining Personnel Table (KTT, POP, POM, POU, Juru Ukur, Juru Ledak) */}
        <div className="lg:col-span-2 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                Daftar Personel Berkompetensi Wajib Minerba ESDM
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Pengawasan teknis & keselamatan operasional sesuai regulasi Kepmen 1827/2018.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/90 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                <tr>
                  <th className="p-3">Nama & Jabatan</th>
                  <th className="p-3">Jenis Kompetensi</th>
                  <th className="p-3">Nomor Registrasi Sertifikat</th>
                  <th className="p-3">Instansi Penerbit</th>
                  <th className="p-3">Masa Berlaku</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {certifiedPersonnel.map((person) => (
                  <tr key={person.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3">
                      <div className="font-bold text-white leading-snug">{person.name}</div>
                      <div className="text-[10px] text-slate-400">{person.role}</div>
                    </td>
                    <td className="p-3">
                      <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {person.certificateType}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[11px] text-slate-300">
                      {person.certificateNumber}
                    </td>
                    <td className="p-3 text-slate-400 text-[11px]">
                      {person.issuingBody}
                    </td>
                    <td className="p-3 font-mono text-slate-300">
                      {person.validUntil}
                    </td>
                    <td className="p-3 text-right">
                      {person.status === "VALID" ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                          VALID
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          RENEWAL 2026
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
