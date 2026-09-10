import React, { useState } from "react";
import { Key, ShieldCheck, AlertCircle, Building2, UserCheck, Sparkles, Laptop, CheckCircle2, Lock, Shield } from "lucide-react";
import { useLicense } from "../../providers/LicenseProvider";
import { useAuth } from "../../providers/AuthProvider";

export const ActivateLicenseModule: React.FC = () => {
  const { activateLicense, currentLicense, calculatedStatus } = useLicense();
  const { company, currentUser } = useAuth();

  const [inputKey, setInputKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!inputKey.trim()) {
      setErrorMsg("Masukkan Kode Lisensi Anda.");
      return;
    }

    setLoading(true);
    try {
      const res = await activateLicense(inputKey);
      if (res.success) {
        setSuccessMsg("Selamat! Lisensi MINE SMART AI berhasil diaktifkan dan terikat 1:1 ke akun & perangkat ini.");
        setInputKey("");
      } else {
        setErrorMsg(res.message || "Gagal mengaktifkan lisensi.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan saat memverifikasi lisensi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 backdrop-blur-md text-center space-y-3">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-amber-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20">
          <Key className="h-7 w-7" />
        </div>
        <div className="flex items-center justify-center gap-2">
          <span className="rounded-full bg-emerald-500/20 px-3 py-0.5 text-[10px] font-extrabold text-emerald-400 border border-emerald-500/30 uppercase tracking-widest">
            Aktivasi Lisensi Komersial
          </span>
          <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/30">
            1 Account = 1 License Key
          </span>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Aktivasi & Binding Akun MINE SMART AI
        </h1>
        <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
          Masukkan Kode Lisensi komersial berformat <span className="font-mono text-emerald-400">MSAI-ID-XXXX-XXXX-XXXX</span> yang diterbitkan oleh PT MINE SMART AI Indonesia untuk mengaktifkan seluruh modul tambang & AI.
        </p>
      </div>

      {/* Current Active Status summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs space-y-1">
          <div className="flex items-center gap-2 text-slate-400">
            <Building2 className="h-4 w-4 text-emerald-400" />
            <span>Perusahaan Terikat</span>
          </div>
          <p className="font-bold text-white text-sm">{company.name || "PT Batubara Nusa Utama"}</p>
          <span className="text-[10px] text-slate-500 font-mono">IUP: IUP-OP/540/MINERBA/2026</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs space-y-1">
          <div className="flex items-center gap-2 text-slate-400">
            <UserCheck className="h-4 w-4 text-amber-400" />
            <span>Bound Account</span>
          </div>
          <p className="font-bold text-white text-sm truncate">{currentUser.email}</p>
          <span className="text-[10px] text-amber-400 font-bold">{currentUser.role}</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs space-y-1">
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="h-4 w-4 text-teal-400" />
            <span>Status Lisensi Node</span>
          </div>
          <p className="font-bold text-emerald-400 text-sm">{currentLicense.planId} • {calculatedStatus}</p>
          <span className="text-[10px] text-slate-400">Ending: {new Date(currentLicense.expiryAt).toLocaleDateString("id-ID")}</span>
        </div>
      </div>

      {/* Form Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-5">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <span>Formulir Aktivasi Kode Lisensi</span>
        </h3>

        {errorMsg && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4 text-xs text-red-400 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Aktivasi Ditolak</p>
              <p className="mt-0.5 leading-relaxed">{errorMsg}</p>
            </div>
          </div>
        )}

        {successMsg && (
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-xs text-emerald-400 flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Aktivasi Berhasil!</p>
              <p className="mt-0.5 leading-relaxed">{successMsg}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleActivate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Kode Lisensi (License Key)
            </label>
            <div className="relative">
              <input
                type="text"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value.toUpperCase())}
                placeholder="MSAI-ID-XXXX-XXXX-XXXX"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-mono tracking-widest text-emerald-400 placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <Key className="absolute right-3.5 top-3.5 h-4 w-4 text-slate-500" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Format standar: <span className="font-mono text-slate-400">MSAI-ID-7F89-B214-8A09</span>.
            </p>
          </div>

          <div className="rounded-xl bg-slate-950 p-4 text-xs text-slate-400 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-300">
              <Shield className="h-4 w-4 text-teal-400" />
              <span>Ketentuan Binding & Kebijakan 1 Account = 1 License Key:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
              <li>Setiap 1 akun pengguna terikat secara eksklusif dengan 1 kunci lisensi sah.</li>
              <li>Perangkat Anda akan didaftarkan secara otomatis melalui hardware signature terenkripsi.</li>
              <li>Perpanjangan (renew) dan ganti paket (upgrade/downgrade) mempertahankan konfigurasi akun yang sama.</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 p-3.5 text-xs font-black text-slate-950 hover:brightness-110 shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition-all cursor-pointer"
          >
            {loading ? "Memverifikasi Kode & Melakukan Binding..." : "Aktifkan Lisensi & Bind Akun Sekarang"}
          </button>
        </form>
      </div>
    </div>
  );
};
