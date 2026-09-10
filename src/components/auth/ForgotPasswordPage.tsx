import React, { useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

interface ForgotPasswordPageProps {
  onNavigateLogin: () => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigateLogin }) => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    await forgotPassword(email);
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen w-full bg-[#080D1A] text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-[#0F172A]/90 p-8 shadow-2xl space-y-6 backdrop-blur-xl">
        <button
          onClick={onNavigateLogin}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Halaman Login</span>
        </button>

        <div className="space-y-2 text-center">
          <h2 className="text-xl font-black text-white">Pemulihan Kata Sandi</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Masukkan email terdaftar Anda. Jika akun tersedia, instruksi reset password akan dikirimkan.
          </p>
        </div>

        {submitted ? (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 space-y-3 text-center">
            <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto" />
            <p className="text-xs font-bold text-emerald-300">Permintaan Dikirimkan</p>
            <p className="text-xs text-slate-400">
              Jika akun terkait tersedia di sistem MINE SMART AI, instruksi pemulihan kata sandi telah dikirimkan ke email Anda.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="block text-slate-300 font-bold">Email Enterprise</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/80 py-3 pl-10 pr-4 text-white text-xs font-mono focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3.5 text-xs font-black text-slate-950 shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-500 transition-all disabled:opacity-50"
            >
              {loading ? "Mengirimkan Instruksi..." : "KIRIM TAUTAN RESET PASSWORD"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
