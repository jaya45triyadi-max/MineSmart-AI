import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  ShieldCheck,
  FileText,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import { AttendanceCorrection } from "../../../types/attendanceTypes";

interface Props {
  corrections: AttendanceCorrection[];
  onApprove: (id: string, approverName: string, comment: string) => Promise<void>;
  onReject: (id: string, approverName: string, comment: string) => Promise<void>;
}

export const AttendanceApprovalsTab: React.FC<Props> = ({
  corrections,
  onApprove,
  onReject,
}) => {
  const pendingCorrections = corrections.filter((c) => c.status === "PENDING_SUPERVISOR" || c.status === "PENDING_HR");
  const completedCorrections = corrections.filter((c) => c.status === "APPROVED" || c.status === "REJECTED");

  const [commentInput, setCommentInput] = useState("");
  const [approverName, setApproverName] = useState("Ir. Hendra Gunawan (Mine Manager)");
  const [actionLoading, setActionLoading] = useState(false);

  const handleApprove = async (id: string) => {
    setActionLoading(true);
    await onApprove(id, approverName, commentInput || "Disetujui sesuai verifikasi lokasi dan log p2h.");
    setCommentInput("");
    setActionLoading(false);
  };

  const handleReject = async (id: string) => {
    setActionLoading(true);
    await onReject(id, approverName, commentInput || "Ditolak karena tidak ada bukti p2h.");
    setCommentInput("");
    setActionLoading(false);
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-extrabold text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
            RBAC PERMISSION: ATTENDANCE.APPROVE
          </span>
        </div>
        <h2 className="text-xl font-black text-white mt-1">Approval Hub Presensi & Koreksi Jam Kerja</h2>
        <p className="text-xs text-slate-400">
          Antrean persetujuan koreksi presensi, kualifikasi verifikasi geofence, dan otorisasi jam kerja dari Supervisor & HR.
        </p>
      </div>

      {/* Main Approval Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Clock className="h-4 w-4 text-amber-400" />
          <span>Menunggu Persetujuan ({pendingCorrections.length})</span>
        </h3>

        {pendingCorrections.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center text-xs text-slate-400 font-bold">
            Tidak ada pengajuan koreksi presensi yang menunggu persetujuan saat ini.
          </div>
        ) : (
          pendingCorrections.map((c) => (
            <div key={c.id} className="rounded-2xl border border-amber-500/30 bg-slate-900 p-5 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">{c.requestNumber}</span>
                  <h4 className="text-base font-black text-white">{c.employeeName}</h4>
                  <p className="text-xs text-slate-400">{c.departmentName} • Tanggal Presensi: {c.date}</p>
                </div>
                <span className="rounded-xl bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-300 border border-amber-500/30">
                  {c.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Jam Yang Diminta</span>
                  <p className="font-mono text-emerald-400 font-bold text-sm">
                    In: {c.requestedClockIn} WITA | Out: {c.requestedClockOut} WITA
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Kategori & Alasan</span>
                  <p className="font-bold text-slate-200">{c.reason}</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{c.explanation}</p>
                </div>
              </div>

              {/* Action Area */}
              <div className="space-y-3 pt-2">
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Tambahkan catatan approval / verifikasi supervisor..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                />

                <div className="flex items-center gap-3">
                  <button
                    disabled={actionLoading}
                    onClick={() => handleApprove(c.id)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 text-xs font-black text-slate-950 hover:bg-emerald-400 transition-all shadow-lg"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>SETUJUI (APPROVE)</span>
                  </button>

                  <button
                    disabled={actionLoading}
                    onClick={() => handleReject(c.id)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-rose-500/40 bg-rose-950/40 py-2.5 text-xs font-bold text-rose-300 hover:bg-rose-900/60 transition-all"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>TOLAK (REJECT)</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Completed History */}
      {completedCorrections.length > 0 && (
        <div className="space-y-3 pt-4">
          <h3 className="text-sm font-bold text-slate-300">Riwayat Approval Terakhir</h3>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-bold uppercase text-slate-400">
                  <tr>
                    <th className="py-2.5 px-3">Request ID</th>
                    <th className="py-2.5 px-3">Karyawan</th>
                    <th className="py-2.5 px-3">Tanggal</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Approver</th>
                    <th className="py-2.5 px-3">Catatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {completedCorrections.map((c) => (
                    <tr key={c.id}>
                      <td className="py-2.5 px-3 font-mono text-cyan-400 font-bold">{c.requestNumber}</td>
                      <td className="py-2.5 px-3 font-bold text-white">{c.employeeName}</td>
                      <td className="py-2.5 px-3">{c.date}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            c.status === "APPROVED"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">{c.hrApproverName || "-"}</td>
                      <td className="py-2.5 px-3 text-slate-400">{c.hrComment || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
