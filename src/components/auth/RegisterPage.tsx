import React, { useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import { Pickaxe, ShieldCheck, Mail, Lock, Building2, Phone, Globe, User, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

interface RegisterPageProps {
  onNavigateLogin: () => void;
  onRegisterSuccess: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigateLogin, onRegisterSuccess }) => {
  const { register } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("Indonesia");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Password strength logic
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "Kosong", color: "bg-slate-700" };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 25, label: "Lemah (Weak)", color: "bg-red-500" };
      case 2:
        return { score: 50, label: "Cukup (Fair)", color: "bg-amber-500" };
      case 3:
        return { score: 75, label: "Bagus (Good)", color: "bg-blue-500" };
      case 4:
        return { score: 100, label: "Kuat (Strong)", color: "bg-emerald-500" };
      default:
        return { score: 10, label: "Sangat Lemah", color: "bg-red-600" };
    }
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!fullName || !email || !password || !companyName) {
      setErrorMessage("Seluruh kolom bertanda bintang wajib diisi.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    if (!agreeTerms) {
      setErrorMessage("Anda harus menyetujui Syarat & Ketentuan serta Kebijakan Privasi.");
      return;
    }

    setLoading(true);
    try {
      await register({
        fullName,
        email,
        password,
        companyName,
        phone,
        country,
        agreeTerms,
      });
      setLoading(false);
      onRegisterSuccess();
    } catch (err: any) {
      setLoading(false);
      setErrorMessage(err?.message || "Gagal melakukan pendaftaran akun.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#080D1A] text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden font-sans">
      <div className="w-full max-w-xl z-10 space-y-6 my-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <Pickaxe className="h-4 w-4" />
            <span>Pendaftaran Perusahaan & Owner</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Registrasi Entitas MINE SMART AI
          </h1>
          <p className="text-xs text-slate-400">
            Daftarkan perusahaan tambang batubara Anda untuk mendapatkan akses platform SaaS enterprise.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-slate-800 bg-[#0F172A]/90 p-6 sm:p-8 shadow-2xl space-y-6 backdrop-blur-xl">
          {errorMessage && (
            <div className="flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs font-semibold text-red-300">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-slate-300 font-bold">Nama Lengkap *</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ir. Budi Santoso"
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/80 py-3 pl-10 pr-4 text-white text-xs focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Company Name */}
              <div className="space-y-1.5">
                <label className="block text-slate-300 font-bold">Nama Perusahaan Tambang *</label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="PT Batubara Energi Utama"
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/80 py-3 pl-10 pr-4 text-white text-xs focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-slate-300 font-bold">Email Bisnis *</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="owner@company.com"
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/80 py-3 pl-10 pr-4 text-white text-xs font-mono focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="block text-slate-300 font-bold">Nomor Telepon / WA</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+62 812-3456-7890"
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/80 py-3 pl-10 pr-4 text-white text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-slate-300 font-bold">Kata Sandi *</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 8 karakter"
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/80 py-3 pl-10 pr-4 text-white text-xs font-mono focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-300 font-bold">Konfirmasi Kata Sandi *</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi"
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/80 py-3 pl-10 pr-4 text-white text-xs font-mono focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Password Strength Meter */}
            {password && (
              <div className="space-y-1 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Kekuatan Sandi:</span>
                  <span className="font-bold text-white">{strength.label}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: `${strength.score}%` }} />
                </div>
              </div>
            )}

            {/* Terms Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-slate-400 text-xs">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded border-slate-800 bg-slate-900 text-emerald-500 focus:ring-emerald-500 h-4 w-4"
                  required
                />
                <span>
                  Saya menyetujui <span className="text-emerald-400 font-bold">Syarat & Ketentuan Layanan</span> serta{" "}
                  <span className="text-emerald-400 font-bold">Kebijakan Privasi</span> platform MINE SMART AI.
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3.5 text-xs font-black text-slate-950 shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-500 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span>Mendaftarkan Entitas Perusahaan...</span>
              ) : (
                <>
                  <span>DAFTARKAN PERUSAHAAN</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center border-t border-slate-800 pt-4">
            <p className="text-xs text-slate-400">
              Sudah memiliki akun terdaftar?{" "}
              <button
                type="button"
                onClick={onNavigateLogin}
                className="font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
              >
                Masuk Halaman Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
