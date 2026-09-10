import React, { useState } from "react";
import { useLicense } from "../../providers/LicenseProvider";
import { useAuth } from "../../providers/AuthProvider";
import {
  Key,
  ShieldCheck,
  Users,
  MapPin,
  Laptop,
  Bot,
  HardDrive,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  Sparkles,
  ChevronRight,
  Building2,
  UserCheck,
  Power,
  RotateCcw,
  AlertCircle,
  FileCheck,
  Check,
} from "lucide-react";
import { LicenseService } from "../../services/license/license-service";
import { SubscriptionCycleType } from "../../types/license";

export const CustomerLicenseModule: React.FC = () => {
  const { currentLicense, currentPlanDef, usageSummary, calculatedStatus, daysRemaining, renewLicense } = useLicense();
  const { company, currentUser } = useAuth();

  const [showKeyReveal, setShowKeyReveal] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [selectedRenewCycle, setSelectedRenewCycle] = useState<SubscriptionCycleType>("YEARLY");
  const [deactivateMsg, setDeactivateMsg] = useState<string | null>(null);

  const handleCopyMaskedKey = () => {
    const keyToCopy = currentLicense.maskedKey || `MSAI-ID-••••-••••-${currentLicense.licenseKeyLast4}`;
    navigator.clipboard.writeText(keyToCopy);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleRenew = async () => {
    await renewLicense(selectedRenewCycle === "MONTHLY" ? 1 : selectedRenewCycle === "QUARTERLY" ? 3 : 12);
    setIsRenewModalOpen(false);
  };

  const handleDeactivate = async () => {
    if (confirm("Apakah Anda yakin ingin mendeaktivasi lisensi pada akun dan perangkat ini?")) {
      const res = await LicenseService.deactivateLicense(currentLicense.id, "Deaktivasi mandiri", currentUser.email);
      setDeactivateMsg(res.message);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  return (
    <div className="space-y-6">
      {/* License Summary Banner Card */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-[#0B1220] to-slate-900 p-6 backdrop-blur-md relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 z-10 relative">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="rounded bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-400 border border-emerald-500/30 uppercase tracking-widest">
                LISENSI KOMERSIAL AKTIF
              </span>
              <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/30">
                1 Account = 1 License Key
              </span>
              <span className="text-xs text-slate-400 font-medium">ID: {currentLicense.id}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {currentPlanDef.displayName}
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              {currentPlanDef.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2">
              <div>Perusahaan: <span className="text-white font-bold">{company.name}</span></div>
              <div>•</div>
              <div>Pemegang Akun: <span className="text-amber-400 font-bold">{currentUser.email}</span></div>
              <div>•</div>
              <div>Sisa Masa Aktif: <span className="text-emerald-400 font-bold">{daysRemaining} Hari</span></div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              onClick={() => setIsRenewModalOpen(true)}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Perpanjang Lisensi (Renew)</span>
            </button>
            <button
              onClick={handleDeactivate}
              className="flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
            >
              <Power className="h-4 w-4" />
              <span>Deaktivasi Lisensi</span>
            </button>
          </div>
        </div>
      </div>

      {deactivateMsg && (
        <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-4 text-xs text-amber-400 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span>{deactivateMsg}</span>
        </div>
      )}

      {/* 3-Pillar Binding Cards (User Binding, Company Binding, Device Binding) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* User Binding Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-amber-400" />
              <span>1. User Binding (1 Acc = 1 Key)</span>
            </span>
            <span className="text-[10px] text-amber-400 font-bold bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
              BOUND
            </span>
          </div>
          <div className="text-xs space-y-2 text-slate-300">
            <div>
              <span className="text-slate-500 text-[10px] block">Bound Account Email</span>
              <p className="font-bold text-white font-mono">{currentLicense.ownerEmail || currentUser.email}</p>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">Nama Pemilik Akun</span>
              <p className="text-slate-200">{currentUser.fullName || "Ir. Hendra Gunawan"}</p>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">Peran Akses RBAC</span>
              <span className="text-amber-400 font-bold">{currentUser.role}</span>
            </div>
          </div>
        </div>

        {/* Company Binding Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <Building2 className="h-4 w-4 text-emerald-400" />
              <span>2. Company Binding</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
              VERIFIED
            </span>
          </div>
          <div className="text-xs space-y-2 text-slate-300">
            <div>
              <span className="text-slate-500 text-[10px] block">Nama Badan Usaha Tambang</span>
              <p className="font-bold text-white">{company.name || "PT Batubara Nusa Utama"}</p>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">Nomor Izin Usaha Tambang (IUP)</span>
              <p className="text-slate-200 font-mono">
                {currentLicense.bindingInfo?.companyBinding.iupPermitNumber || "IUP-OP/540/MINERBA/2026"}
              </p>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">NPWP Terdaftar</span>
              <p className="text-slate-400 font-mono">
                {currentLicense.bindingInfo?.companyBinding.taxIdNpwp || "01.892.451.2-062.000"}
              </p>
            </div>
          </div>
        </div>

        {/* Device Binding Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <Laptop className="h-4 w-4 text-teal-400" />
              <span>3. Device Binding & Node</span>
            </span>
            <span className="text-[10px] text-teal-400 font-bold bg-teal-500/20 px-2 py-0.5 rounded border border-teal-500/30">
              ENFORCED
            </span>
          </div>
          <div className="text-xs space-y-2 text-slate-300">
            <div>
              <span className="text-slate-500 text-[10px] block">Kuota Perangkat Aktif</span>
              <p className="font-bold text-white">
                {usageSummary.activeDevices} / {usageSummary.maxDevices} unit terikat
              </p>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">Hardware Fingerprint</span>
              <p className="text-teal-400 font-mono text-[11px]">Enkripsi SHA-256 Valid</p>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">Status Node</span>
              <span className="text-emerald-400 font-bold">Node Aktif Terverifikasi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Details & Masked Reveal */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-xs font-bold text-white flex items-center gap-2">
            <Key className="h-4 w-4 text-amber-400" />
            <span>Format Kunci MSAI-ID-XXXX-XXXX-XXXX & Cryptographic Hash</span>
          </span>
          <span className="text-[11px] text-emerald-400 font-bold uppercase">{calculatedStatus}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block mb-1">Kode Lisensi (Masked Key)</span>
            <div className="flex items-center gap-2 font-mono font-bold text-emerald-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span>{showKeyReveal ? `MSAI-ID-7F89-B214-${currentLicense.licenseKeyLast4}` : (currentLicense.maskedKey || `MSAI-ID-••••-••••-${currentLicense.licenseKeyLast4}`)}</span>
              <button
                onClick={() => setShowKeyReveal(!showKeyReveal)}
                className="ml-auto text-slate-400 hover:text-white cursor-pointer"
                title="Toggle Reveal Key"
              >
                {showKeyReveal ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
              <button
                onClick={handleCopyMaskedKey}
                className="text-slate-400 hover:text-amber-400 cursor-pointer"
                title="Salin Key"
              >
                {copiedKey ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
            {copiedKey && <span className="text-[10px] text-amber-400 mt-1 block">Tersalin ke clipboard!</span>}
          </div>

          <div>
            <span className="text-slate-400 block mb-1">SHA-256 Key Hash</span>
            <div className="font-mono text-[11px] text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800 truncate">
              {currentLicense.licenseKeyHash}
            </div>
          </div>

          <div>
            <span className="text-slate-400 block mb-1">Masa Berlaku Lisensi</span>
            <div className="font-medium text-white bg-slate-950 p-2.5 rounded-xl border border-slate-800 truncate">
              Hingga {new Date(currentLicense.expiryAt).toLocaleDateString("id-ID")} ({daysRemaining} hari)
            </div>
          </div>
        </div>
      </div>

      {/* Usage Quota Cards Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-emerald-400" />
          <span>Penggunaan Kuota Subskripsi Perusahaan</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Active Users */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-bold text-slate-300">
                <Users className="h-4 w-4 text-emerald-400" /> Pengguna (Users)
              </span>
            </div>
            <div>
              <div className="flex items-baseline justify-between text-white">
                <span className="text-2xl font-black">{usageSummary.activeUsers}</span>
                <span className="text-xs text-slate-400">/ {usageSummary.maxUsers} max</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (usageSummary.activeUsers / usageSummary.maxUsers) * 100)}%` }}
                />
              </div>
            </div>
            <span className="text-[10px] text-slate-500 block">Batas user terikat akun</span>
          </div>

          {/* Active Sites */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-bold text-slate-300">
                <MapPin className="h-4 w-4 text-amber-400" /> Site Tambang
              </span>
            </div>
            <div>
              <div className="flex items-baseline justify-between text-white">
                <span className="text-2xl font-black">{usageSummary.activeSites}</span>
                <span className="text-xs text-slate-400">/ {usageSummary.maxSites} max</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (usageSummary.activeSites / usageSummary.maxSites) * 100)}%` }}
                />
              </div>
            </div>
            <span className="text-[10px] text-slate-500 block">IUP / Titik Konsesi</span>
          </div>

          {/* Active Devices */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-bold text-slate-300">
                <Laptop className="h-4 w-4 text-teal-400" /> Perangkat (Devices)
              </span>
            </div>
            <div>
              <div className="flex items-baseline justify-between text-white">
                <span className="text-2xl font-black">{usageSummary.activeDevices}</span>
                <span className="text-xs text-slate-400">/ {usageSummary.maxDevices} max</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-teal-500 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (usageSummary.activeDevices / usageSummary.maxDevices) * 100)}%` }}
                />
              </div>
            </div>
            <span className="text-[10px] text-slate-500 block">Device Installation ID</span>
          </div>

          {/* AI Quota */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-bold text-slate-300">
                <Bot className="h-4 w-4 text-sky-400" /> AI Requests
              </span>
            </div>
            <div>
              <div className="flex items-baseline justify-between text-white">
                <span className="text-2xl font-black">{usageSummary.aiRequestsUsed.toLocaleString("id-ID")}</span>
                <span className="text-[10px] text-slate-400">/ {usageSummary.aiRequestsLimit.toLocaleString("id-ID")}</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-sky-500 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (usageSummary.aiRequestsUsed / usageSummary.aiRequestsLimit) * 100)}%` }}
                />
              </div>
            </div>
            <span className="text-[10px] text-slate-500 block">Reset tiap awal bulan</span>
          </div>

          {/* Storage */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-bold text-slate-300">
                <HardDrive className="h-4 w-4 text-purple-400" /> Storage
              </span>
            </div>
            <div>
              <div className="flex items-baseline justify-between text-white">
                <span className="text-2xl font-black">{usageSummary.storageUsedGB} GB</span>
                <span className="text-xs text-slate-400">/ {usageSummary.storageLimitGB} GB</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-purple-500 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (usageSummary.storageUsedGB / usageSummary.storageLimitGB) * 100)}%` }}
                />
              </div>
            </div>
            <span className="text-[10px] text-slate-500 block">Dokumen & Drone LiDAR</span>
          </div>
        </div>
      </div>

      {/* Enabled vs Restricted Modules Matrix */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Hak Akses Modul Terbuka ({currentPlanDef.displayName})</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Daftar modul pertambangan yang aktif dan terlisensi penuh untuk akun dan perusahaan Anda.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
          {currentPlanDef.enabledModules.map((modKey) => (
            <div
              key={modKey}
              className="flex items-center gap-2 rounded-xl bg-slate-950 p-2.5 border border-emerald-500/20 text-slate-200"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span className="capitalize font-medium">{modKey.replace("-", " ")}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Renew Modal */}
      {isRenewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="max-w-md w-full rounded-2xl border border-emerald-500/30 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
              <RotateCcw className="h-5 w-5" />
              <span>Perpanjangan Masa Aktif Lisensi (Renew)</span>
            </h3>
            <p className="text-xs text-slate-300">
              Pilih siklus durasi perpanjangan lisensi komersial tambang Anda:
            </p>

            <div className="space-y-2 text-xs">
              <label
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedRenewCycle === "MONTHLY"
                    ? "border-emerald-500 bg-emerald-500/10 text-white"
                    : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700"
                }`}
                onClick={() => setSelectedRenewCycle("MONTHLY")}
              >
                <div>
                  <span className="font-bold block text-white">Monthly (1 Bulan)</span>
                  <span className="text-[10px] text-slate-400">Fleksibilitas bulanan</span>
                </div>
                <span className="font-mono font-bold text-emerald-400">
                  Rp {(currentPlanDef.priceMonthlyIDR / 1000000).toLocaleString()} Jt
                </span>
              </label>

              <label
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedRenewCycle === "QUARTERLY"
                    ? "border-emerald-500 bg-emerald-500/10 text-white"
                    : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700"
                }`}
                onClick={() => setSelectedRenewCycle("QUARTERLY")}
              >
                <div>
                  <span className="font-bold block text-white">Quarterly (3 Bulan)</span>
                  <span className="text-[10px] text-emerald-400">Diskon 7% per kuartal</span>
                </div>
                <span className="font-mono font-bold text-emerald-400">
                  Rp {(currentPlanDef.priceQuarterlyIDR / 1000000).toLocaleString()} Jt
                </span>
              </label>

              <label
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedRenewCycle === "YEARLY"
                    ? "border-emerald-500 bg-emerald-500/10 text-white"
                    : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700"
                }`}
                onClick={() => setSelectedRenewCycle("YEARLY")}
              >
                <div>
                  <span className="font-bold block text-white">Yearly (12 Bulan)</span>
                  <span className="text-[10px] text-amber-400">Hemat 2 Bulan (~17% OFF)</span>
                </div>
                <span className="font-mono font-bold text-emerald-400">
                  Rp {(currentPlanDef.priceAnnualIDR / 1000000).toLocaleString()} Jt
                </span>
              </label>

              <label
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedRenewCycle === "ENTERPRISE"
                    ? "border-emerald-500 bg-emerald-500/10 text-white"
                    : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700"
                }`}
                onClick={() => setSelectedRenewCycle("ENTERPRISE")}
              >
                <div>
                  <span className="font-bold block text-white">Enterprise (Dedicated SLA)</span>
                  <span className="text-[10px] text-teal-400">24/7 Dedicated On-site Engineer</span>
                </div>
                <span className="font-mono font-bold text-emerald-400">Custom SLA</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsRenewModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
              >
                Batal
              </button>
              <button
                onClick={handleRenew}
                className="rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 cursor-pointer"
              >
                Konfirmasi Perpanjangan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
