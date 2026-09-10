import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../providers/AuthProvider";
import { ShieldCheck, Lock, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";

interface VerifyOtpPageProps {
  onOtpSuccess: () => void;
  onCancel?: () => void;
}

export const VerifyOtpPage: React.FC<VerifyOtpPageProps> = ({ onOtpSuccess, onCancel }) => {
  const { verifyOTP, currentUser } = useAuth();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [timer, setTimer] = useState(300); // 5 minutes expiration
  const [attemptsLeft, setAttemptsLeft] = useState(5);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setErrorMessage("Silakan masukkan 6 digit kode OTP secara lengkap.");
      return;
    }

    if (attemptsLeft <= 0) {
      setErrorMessage("Batas percobaan telah habis. Silakan minta kode OTP baru.");
      return;
    }

    setLoading(true);
    try {
      await verifyOTP(otpCode);
      setLoading(false);
      onOtpSuccess();
    } catch (err: any) {
      setLoading(false);
      setAttemptsLeft((prev) => Math.max(0, prev - 1));
      setErrorMessage(err?.message || "Kode OTP salah atau kadaluarsa.");
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="min-h-screen w-full bg-[#080D1A] text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-[#0F172A]/90 p-8 shadow-2xl space-y-6 backdrop-blur-xl">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-black text-white">Otentikasi Dua Langkah (OTP)</h2>
          <p className="text-xs text-slate-400">
            Masukkan 6-digit kode verifikasi yang dikirimkan ke perangkat terdaftar / email bisnis:
          </p>
          <p className="font-mono font-bold text-amber-300 text-xs">{currentUser.email}</p>
        </div>

        {errorMessage && (
          <div className="flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-xs font-semibold text-red-300">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP Digit Boxes */}
          <div className="flex justify-between gap-2">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className="w-12 h-14 rounded-2xl border border-slate-800 bg-slate-900 text-center text-lg font-black font-mono text-emerald-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
              />
            ))}
          </div>

          <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
            <span>
              Masa berlaku: <span className="font-bold text-amber-400">{formatTimer(timer)}</span>
            </span>
            <span>
              Sisa percobaan: <span className="font-bold text-white">{attemptsLeft}x</span>
            </span>
          </div>

          <button
            type="submit"
            disabled={loading || attemptsLeft <= 0}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3.5 text-xs font-black text-slate-950 shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-500 transition-all disabled:opacity-50"
          >
            {loading ? <span>Memverifikasi Kode OTP...</span> : <span>VERIFIKASI OTP</span>}
          </button>
        </form>

        {onCancel && (
          <button onClick={onCancel} className="w-full text-xs text-slate-400 hover:text-white pt-2 text-center">
            Batal & Kembali
          </button>
        )}
      </div>
    </div>
  );
};
