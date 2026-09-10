import React from "react";
import { useLicense } from "../../providers/LicenseProvider";
import { ShieldAlert, AlertTriangle, RefreshCw, PhoneCall, Lock } from "lucide-react";

interface LicenseGuardProps {
  children: React.ReactNode;
}

export const LicenseGuard: React.FC<LicenseGuardProps> = ({ children }) => {
  const { calculatedStatus, currentLicense, renewLicense, isExpired, isSuspended, isRevoked } = useLicense();

  if (isExpired || isSuspended || isRevoked) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="max-w-xl w-full rounded-2xl border border-red-500/30 bg-slate-900/95 p-8 text-center backdrop-blur-md shadow-2xl space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">
            {isSuspended ? (
              <AlertTriangle className="h-8 w-8 animate-pulse" />
            ) : isRevoked ? (
              <Lock className="h-8 w-8 text-red-500" />
            ) : (
              <ShieldAlert className="h-8 w-8" />
            )}
          </div>

          <div>
            <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-bold text-red-400 border border-red-500/30 uppercase tracking-widest">
              {calculatedStatus}
            </span>
            <h2 className="text-2xl font-black text-white mt-3 tracking-tight">
              {isSuspended
                ? "Lisensi Perusahaan Ditangguhkan (Suspended)"
                : isRevoked
                ? "Lisensi Telah Dicabut (Revoked)"
                : "Akses Lisensi Telah Berakhir (Expired)"}
            </h2>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {isSuspended
                ? `Akses ke fitur utama MINE SMART AI ditangguhkan sementara. Alasan: ${
                    currentLicense.suspendedReason || "Verifikasi administrasi atau penyesuaian pembayaran"
                  }.`
                : isRevoked
                ? "Lisensi ini telah dicabut oleh Administrator Platform. Semua data perusahaan tersimpan aman."
                : `Masa berlaku lisensi paket ${currentLicense.planId} untuk PT ${currentLicense.companyName} telah berakhir pada ${new Date(
                    currentLicense.expiryAt
                  ).toLocaleDateString("id-ID")}. Data perusahaan tetap tersimpan dengan aman.`}
            </p>
          </div>

          <div className="rounded-xl bg-slate-950/80 p-4 text-xs text-slate-400 border border-slate-800 space-y-1 text-left">
            <div>Perusahaan: <span className="text-white font-semibold">{currentLicense.companyName}</span></div>
            <div>Masa Aktif: <span className="text-slate-300 font-mono">{new Date(currentLicense.startAt).toLocaleDateString("id-ID")} - {new Date(currentLicense.expiryAt).toLocaleDateString("id-ID")}</span></div>
            <div>Status Sistem: <span className="text-red-400 font-bold">{calculatedStatus}</span></div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {!isRevoked && (
              <button
                onClick={() => renewLicense(12)}
                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-xs font-bold text-slate-950 hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Perpanjang Lisensi Sekarang</span>
              </button>
            )}

            <button
              onClick={() => alert("Hubungi Customer Support MINE SMART AI: +62 811-2026-MINE (sales@minesmart.ai)")}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-all"
            >
              <PhoneCall className="h-4 w-4 text-emerald-400" />
              <span>Hubungi Support / Sales</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
