import React from "react";
import { useAuth } from "../../providers/AuthProvider";
import { ShieldAlert, Lock, KeyRound, RefreshCw } from "lucide-react";
import { UserRole } from "../../types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  onNavigateLogin?: () => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, onNavigateLogin }) => {
  const { authLoading, isAuthenticated, currentUser } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B1220] text-slate-100 p-6 space-y-4">
        <RefreshCw className="h-10 w-10 text-emerald-400 animate-spin" />
        <p className="text-sm font-bold text-slate-300">Memeriksa Sesi Otentikasi Terenkripsi...</p>
      </div>
    );
  }

  if (!isAuthenticated || currentUser.status === "SUSPENDED" || currentUser.status === "DEACTIVATED") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B1220] text-slate-100 p-6">
        <div className="w-full max-w-md rounded-3xl border border-red-500/30 bg-slate-900/90 p-8 shadow-2xl text-center space-y-5 backdrop-blur-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20">
            <Lock className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black text-white">Akses Dibatasi</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              {currentUser.status === "SUSPENDED"
                ? "Akun Anda sedang ditangguhkan/suspended oleh Administrator Perusahaan."
                : "Silakan melakukan login terlebih dahulu untuk mengakses Platform Pertambangan MINE SMART AI."}
            </p>
          </div>
          {onNavigateLogin && (
            <button
              onClick={onNavigateLogin}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-500 transition-all"
            >
              Ke Halaman Login Enterprise
            </button>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  permission?: string;
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles, permission, fallback }) => {
  const { currentUser } = useAuth();

  // Super Admin & Mining Owner always bypass
  if (currentUser.role === "SUPER_ADMIN" || currentUser.role === "MINING_OWNER") {
    return <>{children}</>;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(currentUser.role)) {
      if (fallback) return <>{fallback}</>;
      return (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 text-center space-y-3 my-4">
          <ShieldAlert className="h-8 w-8 text-amber-400 mx-auto" />
          <h3 className="text-sm font-extrabold text-amber-300">403 Access Denied — Peran Tidak Diizinkan</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Peran Anda ({currentUser.role}) tidak memiliki otoritas otorisasi untuk mengakses fitur ini.
          </p>
        </div>
      );
    }
  }

  return <>{children}</>;
};

export const LicenseGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLicenseActive, license } = useAuth();

  if (!isLicenseActive) {
    return (
      <div className="rounded-2xl border border-amber-500/40 bg-slate-900/90 p-8 text-center space-y-4 my-6 shadow-2xl">
        <KeyRound className="h-10 w-10 text-amber-400 mx-auto" />
        <h3 className="text-lg font-black text-white">Lisensi Perusahaan Berakhir / Suspend</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
          Lisensi komersial SaaS perusahaan Anda ({license?.companyName || "PT Batubara"}) telah berakhir. Silakan hubungi tim tim Sales atau Administrator untuk memperbarui lisensi.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
