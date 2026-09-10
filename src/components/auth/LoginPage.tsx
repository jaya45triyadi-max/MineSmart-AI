import React, { useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import { ShieldCheck, Lock, Mail, Eye, EyeOff, ArrowRight, Pickaxe, CheckCircle2, AlertCircle } from "lucide-react";
import { DEMO_USERS } from "../../data/mockData";

interface LoginPageProps {
  onNavigateRegister: () => void;
  onNavigateForgotPassword: () => void;
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigateRegister,
  onNavigateForgotPassword,
  onLoginSuccess,
}) => {
  const { login, switchUserAccount } = useAuth();
  const [email, setEmail] = useState("owner@minesmart.ai");
  const [password, setPassword] = useState("Password123!");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Email dan password wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      setLoading(false);
      onLoginSuccess();
    } catch (err: any) {
      setLoading(false);
      setErrorMessage(err?.message || "Email atau password tidak valid.");
    }
  };

  const handleQuickDemoLogin = async (userUid: string) => {
    switchUserAccount(userUid);
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen w-full bg-[#080D1A] text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Visual background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-emerald-400 text-xs font-bold shadow-lg shadow-emerald-500/10">
            <Pickaxe className="h-4 w-4" />
            <span>MINE SMART AI Enterprise</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Konsol Otentikasi Terenkripsi
          </h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Sistem Manajemen Operasional Tambang Batubara Multi-Tenant & FMS
          </p>
        </div>

        {/* Form Container */}
        <div className="rounded-3xl border border-slate-800 bg-[#0F172A]/90 p-6 sm:p-8 shadow-2xl space-y-6 backdrop-blur-xl">
          {errorMessage && (
            <div className="flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs font-semibold text-red-300">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-slate-300 font-bold">Email Enterprise</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/80 py-3 pl-10 pr-4 text-white text-xs placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-slate-300 font-bold">Kata Sandi</label>
                <button
                  type="button"
                  onClick={onNavigateForgotPassword}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  Lupa Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/80 py-3 pl-10 pr-10 text-white text-xs placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-900 text-emerald-500 focus:ring-emerald-500 h-4 w-4"
                />
                <span>Simpan Sesi Akses</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3.5 text-xs font-black text-slate-950 shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-500 active:scale-[0.99] transition-all disabled:opacity-50"
            >
              {loading ? (
                <span>Memproses Otentikasi...</span>
              ) : (
                <>
                  <span>MASUK KE PLATFORM</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Switcher */}
          <div className="border-t border-slate-800 pt-4 space-y-2">
            <p className="text-[11px] font-bold text-amber-400 text-center uppercase tracking-wider">
              Akses Cepat Mode Demo RBAC
            </p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_USERS.map((user) => (
                <button
                  key={user.uid}
                  onClick={() => handleQuickDemoLogin(user.uid)}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 p-2 text-left hover:border-emerald-500/50 hover:bg-slate-800 transition-all text-[11px]"
                >
                  <p className="font-bold text-white truncate">{user.fullName}</p>
                  <p className="text-[10px] text-amber-400 font-semibold">{user.role.replace("_", " ")}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Register Prompt */}
          <div className="text-center pt-2">
            <p className="text-xs text-slate-400">
              Belum memiliki akun entitas perusahaan?{" "}
              <button
                type="button"
                onClick={onNavigateRegister}
                className="font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
              >
                Daftar Perusahaan Baru
              </button>
            </p>
          </div>
        </div>

        {/* Security Footer */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>AES-256 Multi-Tenant Firestore Security Enforced</span>
        </div>
      </div>
    </div>
  );
};
