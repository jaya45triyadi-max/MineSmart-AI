import React, { useState, useEffect } from "react";
import { useAuth } from "../../providers/AuthProvider";
import { MailCheck, RefreshCw, LogOut, CheckCircle2, AlertCircle } from "lucide-react";

interface VerifyEmailPageProps {
  onVerifiedSuccess: () => void;
}

export const VerifyEmailPage: React.FC<VerifyEmailPageProps> = ({ onVerifiedSuccess }) => {
  const { currentUser, sendVerificationEmail, logout } = useAuth();
  const [cooldown, setCooldown] = useState(0);
  const [message, setMessage] = useState("");
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0) return;
    try {
      await sendVerificationEmail();
      setMessage("Email verifikasi baru telah dikirimkan ke inbox Anda.");
      setCooldown(60);
    } catch (err: any) {
      setMessage(err?.message || "Gagal mengirim email verifikasi.");
    }
  };

  const handleCheckStatus = () => {
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      onVerifiedSuccess();
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full bg-[#080D1A] text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-[#0F172A]/90 p-8 shadow-2xl space-y-6 text-center backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <MailCheck className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-black text-white">Verifikasi Alamat Email Anda</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Instruksi verifikasi email telah dikirimkan ke alamat email bisnis:
          </p>
          <p className="font-mono font-bold text-amber-300 text-sm bg-slate-900/80 py-2 rounded-xl border border-slate-800">
            {currentUser.email}
          </p>
        </div>

        {message && (
          <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="h-4 w-4" />
            <span>{message}</span>
          </div>
        )}

        <div className="space-y-3 pt-2">
          <button
            onClick={handleCheckStatus}
            disabled={checking}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3 text-xs font-black text-slate-950 shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-500 transition-all"
          >
            {checking ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <span>Cek Status Verifikasi Email</span>
            )}
          </button>

          <button
            onClick={handleResend}
            disabled={cooldown > 0}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/80 py-3 text-xs font-bold text-slate-300 hover:border-slate-700 transition-all disabled:opacity-50"
          >
            {cooldown > 0 ? `Kirim Ulang Email (${cooldown}s)` : "Kirim Ulang Email Verifikasi"}
          </button>

          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 w-full text-xs text-slate-400 hover:text-white pt-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Keluar / Kelola Akun Lain</span>
          </button>
        </div>
      </div>
    </div>
  );
};
