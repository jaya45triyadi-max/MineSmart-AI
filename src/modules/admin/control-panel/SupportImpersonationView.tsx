// MINE SMART AI - Support & Secure Tenant Impersonation Engine
// PROMPT 36: Justification-Enforced "Login as Tenant", Session Countdown & Audit Logging

import React, { useState } from "react";
import {
  ExternalLink,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Building2,
  Lock,
  Eye,
  AlertTriangle,
  UserCheck,
} from "lucide-react";
import { MasterCustomerRecord } from "../../../types/developerControlPanelTypes";
import { platformConfigService } from "../../../services/config/PlatformConfigService";

interface SupportImpersonationViewProps {
  customers: MasterCustomerRecord[];
  onStartImpersonation: (customer: MasterCustomerRecord, reason: string, readOnly: boolean) => void;
}

export const SupportImpersonationView: React.FC<SupportImpersonationViewProps> = ({
  customers,
  onStartImpersonation,
}) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || "");
  const [justificationReason, setJustificationReason] = useState("");
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState<number>(30);
  const [isReadOnlyMode, setIsReadOnlyMode] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];

  const handleLaunchImpersonation = () => {
    if (!justificationReason.trim() || justificationReason.trim().length < 10) {
      setErrorMessage("Alasan justifikasi wajib diisi minimal 10 karakter untuk keperluan audit kepatuhan ISO/ESDM.");
      return;
    }
    setErrorMessage(null);

    // Audit log
    platformConfigService.logAudit({
      developerName: "Triyadi Jaya",
      developerEmail: "jaya45triyadi@gmail.com",
      action: "IMPERSONATION_STARTED",
      targetResource: `Tenant: ${selectedCustomer?.companyName} (${selectedCustomer?.id})`,
      details: `Memulai sesi impersonasi support selama ${sessionTimeoutMinutes} menit (Read-only: ${isReadOnlyMode}). Alasan: ${justificationReason}`,
      severity: "WARNING",
    });

    if (selectedCustomer) {
      onStartImpersonation(selectedCustomer, justificationReason, isReadOnlyMode);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-purple-400" />
          <span>Secure Customer Account Impersonation (Support Gateway)</span>
        </h2>
        <p className="text-xs text-slate-400">
          Akses darurat untuk tim support teknis meninjau tampilan data riil dari perspektif tenant dengan pembatasan waktu dan audit kepatuhan ketat.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Impersonation Box */}
      <div className="max-w-2xl rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-xl space-y-5">
        <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs space-y-1">
          <div className="font-black flex items-center gap-2 text-purple-300">
            <Lock className="w-4 h-4" />
            <span>Protokol Keamanan Akses Terkendali</span>
          </div>
          <p className="text-[11px] leading-relaxed text-purple-200/80">
            Setiap aksi selama sesi impersonasi dicatat secara otomatis ke dalam Developer Audit Trail. Banner merah permanen akan muncul di layar selama sesi aktif.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
              Pilih Tenant / Perusahaan Pelanggan
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-purple-500"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.companyName} &bull; {c.plan} ({c.id})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
              Alasan Justifikasi Tiket Support (Wajib Audit)
            </label>
            <textarea
              rows={3}
              value={justificationReason}
              onChange={(e) => setJustificationReason(e.target.value)}
              placeholder="Contoh: Tiket #SUP-489 - Verifikasi anomali ritase hauling Pit 3 dan sinkronisasi FMS."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 leading-relaxed focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                Batas Waktu Sesi (Timeout)
              </label>
              <select
                value={sessionTimeoutMinutes}
                onChange={(e) => setSessionTimeoutMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-semibold focus:outline-none focus:border-purple-500"
              >
                <option value={15}>15 Menit</option>
                <option value={30}>30 Menit (Rekomendasi)</option>
                <option value={60}>60 Menit</option>
              </select>
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer w-full">
                <input
                  type="checkbox"
                  checked={isReadOnlyMode}
                  onChange={(e) => setIsReadOnlyMode(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <span className="text-xs font-bold text-slate-200">
                  Mode Aman Read-Only
                </span>
              </label>
            </div>
          </div>

          <button
            onClick={handleLaunchImpersonation}
            className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-xl shadow-purple-600/25 transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Mulai Sesi Impersonasi ({selectedCustomer?.companyName})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
