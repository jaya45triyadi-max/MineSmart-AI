import React from "react";
import {
  ShieldCheck,
  Layers,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Building2,
  Scale,
} from "lucide-react";
import { SoilAndTopsoilRecord } from "../../../types/reclamationTypes";

interface Props {
  soilRecords: SoilAndTopsoilRecord[];
}

export const ReclamationComplianceTab: React.FC<Props> = ({ soilRecords }) => {
  const complianceMatrix = [
    {
      id: "comp-1",
      requirement: "Rencana Reklamasi 5 Tahun (2026-2030) Persetujuan ESDM",
      targetArea: "125.0 Hektare",
      deadline: "31 Des 2030",
      evidenceDoc: "SK Dirjen Minerba No. 452.K/30/DJB/2026",
      status: "COMPLIANT",
    },
    {
      id: "comp-2",
      requirement: "Laporan Pelaksanaan Reklamasi Triwulan III Tahun 2026",
      targetArea: "18.5 Hektare (Triwulan III)",
      deadline: "10 Okt 2026",
      evidenceDoc: "Form 04.C Laporan Reklamasi RKAB",
      status: "COMPLIANT",
    },
    {
      id: "comp-3",
      requirement: "Jaminan Reklamasi (Jamrek) Bank Guarantee Penataan Lahan",
      targetArea: "Rp 12.5 Miliar",
      deadline: "15 Nov 2026",
      evidenceDoc: "Bank Guarantee Mandiri No. BG-REC-2026",
      status: "COMPLIANT",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-400" />
          Topsoil Management & Reclamation Legal Compliance
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Inventarisasi persediaan humus tanah pucuk (topsoil bank), pemanfaatan media tanam, dan matriks pemenuhan regulasi RKAB ESDM.
        </p>
      </div>

      {/* Topsoil Management Log */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-md">
        <div className="px-5 py-4 border-b border-slate-800">
          <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
            <Layers className="h-4 w-4 text-amber-400" /> Catat Penebaran & Stockpile Topsoil (Topsoil Movement Log)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800 tracking-wider">
              <tr>
                <th className="px-4 py-3">ID Catatan</th>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Tipe Gerakan</th>
                <th className="px-4 py-3">Area Asal</th>
                <th className="px-4 py-3">Area Tujuan</th>
                <th className="px-4 py-3">Volume (m³)</th>
                <th className="px-4 py-3">Kualitas Soil</th>
                <th className="px-4 py-3">Operator / Alat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {soilRecords.map((s) => (
                <tr key={s.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-4 py-3 font-mono font-bold text-amber-400">{s.recordId}</td>
                  <td className="px-4 py-3 text-slate-400">{s.date}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {s.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-200">{s.sourceArea}</td>
                  <td className="px-4 py-3 text-emerald-400 font-medium">{s.destinationArea}</td>
                  <td className="px-4 py-3 font-black text-white text-sm">
                    {s.volumeM3.toLocaleString()} m³
                  </td>
                  <td className="px-4 py-3 font-bold text-cyan-400">{s.quality}</td>
                  <td className="px-4 py-3 text-slate-400 text-[11px]">{s.equipment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compliance Matrix Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-md space-y-4 p-5">
        <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
          <Scale className="h-4 w-4 text-emerald-400" /> Matriks Ketaatan Regulasi & Jamrek Reklamasi ESDM
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800 tracking-wider">
              <tr>
                <th className="px-4 py-3">Persyaratan Regulasi / Kewajiban</th>
                <th className="px-4 py-3">Target Area / Nilai</th>
                <th className="px-4 py-3">Batas Waktu</th>
                <th className="px-4 py-3">Dokumen Bukti</th>
                <th className="px-4 py-3">Status Ketaatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {complianceMatrix.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-4 py-3 font-bold text-white">{item.requirement}</td>
                  <td className="px-4 py-3 text-emerald-400 font-bold">{item.targetArea}</td>
                  <td className="px-4 py-3 text-slate-400">{item.deadline}</td>
                  <td className="px-4 py-3 text-slate-300 font-mono text-[11px]">{item.evidenceDoc}</td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {item.status}
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
