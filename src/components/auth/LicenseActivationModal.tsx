import React, { useState } from "react";
import { Key, ShieldCheck, CheckCircle2, AlertCircle, X, Sparkles } from "lucide-react";
import { useAuth } from "../../providers/AuthProvider";

interface LicenseActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LicenseActivationModal: React.FC<LicenseActivationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { license, activateNewLicense } = useAuth();
  const [inputKey, setInputKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKey.trim()) {
      setErrorMsg("Masukkan kode lisensi.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const ok = await activateNewLicense(inputKey);
    setLoading(false);

    if (ok) {
      setSuccessMsg("Lisensi berhasil diaktifkan! Fitur Enterprise telah terbuka.");
      setTimeout(() => {
        onClose();
        setSuccessMsg("");
      }, 1500);
    } else {
      setErrorMsg("Kode lisensi tidak valid atau telah kedaluwarsa.");
    }
  };

  const handleApplyDemoKey = async (demoKey: string) => {
    setInputKey(demoKey);
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const ok = await activateNewLicense(demoKey);
    setLoading(false);

    if (ok) {
      setSuccessMsg(`Lisensi ${demoKey} berhasil diaktifkan!`);
      setTimeout(() => {
        onClose();
        setSuccessMsg("");
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-[#0F172A] p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Key className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Aktivasi Lisensi MINE SMART AI</h3>
              <p className="text-xs text-slate-400">Lisensi Komersial Enterprise Platform</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Current Active License Status */}
        {license && (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" /> Status Lisensi Aktif
              </span>
              <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-black text-emerald-300">
                {license.plan}
              </span>
            </div>
            <div className="text-xs text-slate-300 space-y-1">
              <p><span className="text-slate-400">Kode Lisensi:</span> <code className="font-mono text-amber-300">{license.licenseKey}</code></p>
              <p><span className="text-slate-400">Perusahaan:</span> {license.companyName}</p>
              <p><span className="text-slate-400">Batas User:</span> {license.userLimit} Users | <span className="text-slate-400">Batas Device:</span> {license.deviceLimit} Devices</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleActivate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Masukkan Key Lisensi Baru</label>
            <input
              type="text"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="Contoh: MSAI-ENT-2026-X89K-MINE"
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs text-white uppercase tracking-wider font-mono focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 text-xs font-extrabold text-slate-950 hover:brightness-110 transition-all"
          >
            {loading ? "Memverifikasi..." : "Verifikasi & Aktifkan Lisensi"}
          </button>
        </form>

        {/* Demo Preset Keys */}
        <div className="border-t border-slate-800 pt-4 space-y-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Coba Kode Lisensi Demo Eksekutif:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleApplyDemoKey("MSAI-ENT-2026-X89K-MINE")}
              className="rounded-xl border border-slate-700 bg-slate-800/80 p-2 text-left hover:border-amber-500/50"
            >
              <p className="font-mono text-amber-300 font-bold">MSAI-ENT-2026</p>
              <p className="text-[10px] text-slate-400">Enterprise Holding Plan</p>
            </button>
            <button
              onClick={() => handleApplyDemoKey("MSAI-PRO-2026-KALM-7731")}
              className="rounded-xl border border-slate-700 bg-slate-800/80 p-2 text-left hover:border-emerald-500/50"
            >
              <p className="font-mono text-emerald-400 font-bold">MSAI-PRO-2026</p>
              <p className="text-[10px] text-slate-400">Professional Contractor Plan</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
