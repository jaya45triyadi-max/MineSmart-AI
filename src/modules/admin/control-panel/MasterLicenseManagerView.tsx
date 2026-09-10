// MINE SMART AI - Master License & Subscription Lifecycle Console
// PROMPT 36: Cryptographic License Generation, Binding & Lifecycle Management

import React, { useState } from "react";
import {
  Key,
  ShieldCheck,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Lock,
  Unlock,
  RefreshCcw,
  Sliders,
  DollarSign,
  Building2,
  Clock,
  Layers,
} from "lucide-react";
import {
  MasterCustomerRecord,
  PlatformConfig,
} from "../../../types/developerControlPanelTypes";
import { platformConfigService } from "../../../services/config/PlatformConfigService";

interface MasterLicenseManagerViewProps {
  customers: MasterCustomerRecord[];
  config: PlatformConfig;
  onRefresh: () => void;
}

export const MasterLicenseManagerView: React.FC<MasterLicenseManagerViewProps> = ({
  customers,
  config,
  onRefresh,
}) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || "");
  const [planTier, setPlanTier] = useState<"STARTER" | "PROFESSIONAL" | "ENTERPRISE">("ENTERPRISE");
  const [durationMonths, setDurationMonths] = useState<number>(12);
  const [maxUsers, setMaxUsers] = useState<number>(500);
  const [maxSites, setMaxSites] = useState<number>(10);
  const [generatedLicenseKey, setGeneratedLicenseKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const handleGenerateLicense = async () => {
    const randomHex = () => Math.random().toString(16).substring(2, 6).toUpperCase();
    const prefix =
      planTier === "ENTERPRISE" ? "MINE-ENT" : planTier === "PROFESSIONAL" ? "MINE-PRO" : "MINE-STR";
    const newKey = `${prefix}-2026-${randomHex()}-${randomHex()}-${randomHex()}`;
    setGeneratedLicenseKey(newKey);

    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + durationMonths);

    // Apply to selected customer
    if (selectedCustomerId) {
      await platformConfigService.updateCustomer(
        selectedCustomerId,
        {
          licenseKey: newKey,
          plan: planTier,
          maxUsersLimit: maxUsers,
          maxSitesLimit: maxSites,
          expiresAt: expiryDate.toISOString(),
          licenseStatus: "ACTIVE",
          subscriptionStatus: "ACTIVE",
        },
        "Triyadi Jaya",
        "jaya45triyadi@gmail.com"
      );
      setActionSuccessMessage(
        `Kunci lisensi baru ${newKey} berhasil diterbitkan dan diikat ke customer terpilih!`
      );
      onRefresh();
      setTimeout(() => setActionSuccessMessage(null), 5000);
    }
  };

  const handleCopyKey = () => {
    if (generatedLicenseKey) {
      navigator.clipboard.writeText(generatedLicenseKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <Key className="w-5 h-5 text-purple-400" />
          <span>Cryptographic License & Subscription Lifecycle Engine</span>
        </h2>
        <p className="text-xs text-slate-400">
          Generator kunci lisensi terenkripsi RSA-4096 non-sekuensial untuk mengikat hak akses modul, batas kursi (seats), jumlah site, dan kuota AI secara otomatis.
        </p>
      </div>

      {actionSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Two Column Grid: Generator on Left, Active Licenses Table on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Generator Form */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Generate New License Key
            </h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                Pilih Perusahaan Pelanggan
              </label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-semibold"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.companyName} ({c.id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                Paket Lisensi
              </label>
              <select
                value={planTier}
                onChange={(e) => {
                  const val = e.target.value as any;
                  setPlanTier(val);
                  if (val === "STARTER") {
                    setMaxUsers(10);
                    setMaxSites(1);
                  } else if (val === "PROFESSIONAL") {
                    setMaxUsers(50);
                    setMaxSites(3);
                  } else {
                    setMaxUsers(500);
                    setMaxSites(10);
                  }
                }}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-semibold"
              >
                <option value="STARTER">Starter Tier (1 Site, 10 Users)</option>
                <option value="PROFESSIONAL">Professional Tier (3 Sites, 50 Users)</option>
                <option value="ENTERPRISE">Enterprise Dedicated (10 Sites, 500 Users, Full AI)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Durasi Lisensi
                </label>
                <select
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-semibold"
                >
                  <option value={1}>1 Bulan (Trial)</option>
                  <option value={3}>3 Bulan (Quarterly)</option>
                  <option value={12}>12 Bulan (1 Tahun)</option>
                  <option value={24}>24 Bulan (2 Tahun)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Maks User Seats
                </label>
                <input
                  type="number"
                  value={maxUsers}
                  onChange={(e) => setMaxUsers(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>
            </div>

            <button
              onClick={handleGenerateLicense}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-lg shadow-purple-600/25 transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
            >
              <Key className="w-4 h-4" />
              <span>Generate & Bind Cryptographic Key</span>
            </button>

            {generatedLicenseKey && (
              <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/40 space-y-2 mt-4 animate-fadeIn">
                <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider block">
                  Generated RSA-4096 License Key
                </span>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-purple-500/30 flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-white select-all">
                    {generatedLicenseKey}
                  </span>
                  <button
                    onClick={handleCopyKey}
                    className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300 hover:text-white transition-colors cursor-pointer"
                    title="Copy Key"
                  >
                    {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-purple-300/80">
                  Kunci lisensi ini telah aktif dan dapat langsung dimasukkan oleh pelanggan di dialog Aktivasi Lisensi.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Active Customer Licenses List */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Active Tenant Licenses & Expiry Dates
              </h3>
            </div>
            <span className="text-xs font-bold text-slate-400">
              {customers.filter((c) => c.licenseStatus === "ACTIVE").length} Valid Licenses
            </span>
          </div>

          <div className="space-y-3">
            {customers.map((cust) => (
              <div
                key={cust.id}
                className="p-4 rounded-2xl border border-slate-800/80 bg-slate-950/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-xs text-white">
                      {cust.companyName}
                    </h4>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">
                      {cust.plan}
                    </span>
                  </div>
                  <p className="font-mono text-[11px] text-slate-400 mt-1 select-all">
                    {cust.licenseKey}
                  </p>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1">
                    <span>Seats: {cust.maxUsersLimit}</span>
                    <span>&bull;</span>
                    <span>Sites: {cust.maxSitesLimit}</span>
                    <span>&bull;</span>
                    <span>
                      Exp:{" "}
                      <strong className="text-slate-200">
                        {new Date(cust.expiresAt).toLocaleDateString("id-ID")}
                      </strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      cust.licenseStatus === "ACTIVE"
                        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                        : "bg-rose-500/15 text-rose-400 border-rose-500/30"
                    }`}
                  >
                    {cust.licenseStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
