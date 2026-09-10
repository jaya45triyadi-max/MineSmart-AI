import React, { useState, useEffect } from "react";
import { licenseRepository } from "../../services/repositories/LicenseRepository";
import { LicenseService } from "../../services/license/license-service";
import { LicenseRecord, LicensePlanId, SubscriptionCycleType } from "../../types/license";
import { useAuth } from "../../providers/AuthProvider";
import {
  Key,
  Plus,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RefreshCw,
  Search,
  Copy,
  Lock,
  X,
  Send,
  Building2,
  Users,
  Laptop,
  Check,
  ShieldCheck,
  Calendar,
  Layers,
  Power,
  RotateCcw,
  Sparkles,
  Info,
} from "lucide-react";

export const AdminLicensesModule: React.FC = () => {
  const { currentUser } = useAuth();
  const [licenses, setLicenses] = useState<LicenseRecord[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State for Generating License Key
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [genCompanyId, setGenCompanyId] = useState("COMP-BNU-01");
  const [genCompanyName, setGenCompanyName] = useState("PT Batubara Nusa Utama");
  const [genIupNumber, setGenIupNumber] = useState("IUP-OP/540/MINERBA/2026");
  const [genTaxNpwp, setGenTaxNpwp] = useState("01.892.451.2-062.000");
  const [genOwnerEmail, setGenOwnerEmail] = useState("jaya45triyadi@gmail.com");
  const [genOwnerName, setGenOwnerName] = useState("Ir. Hendra Gunawan (Mine Manager)");
  const [genPlanId, setGenPlanId] = useState<LicensePlanId>("PROFESSIONAL");
  const [genCycle, setGenCycle] = useState<SubscriptionCycleType>("YEARLY");
  const [genMaxUsers, setGenMaxUsers] = useState(50);
  const [genMaxSites, setGenMaxSites] = useState(3);
  const [genMaxDevices, setGenMaxDevices] = useState(25);

  // Result Modal State (ONE-TIME Reveal of Plaintext Key)
  const [generatedPlaintextKey, setGeneratedPlaintextKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  // Suspend Modal
  const [suspendTargetId, setSuspendTargetId] = useState<string | null>(null);
  const [suspendReason, setSuspendReason] = useState("");

  // Renew Modal
  const [renewTargetId, setRenewTargetId] = useState<string | null>(null);
  const [renewCycle, setRenewCycle] = useState<SubscriptionCycleType>("YEARLY");

  // Inspect Modal
  const [inspectLicense, setInspectLicense] = useState<LicenseRecord | null>(null);

  useEffect(() => {
    loadLicenses();
  }, []);

  const loadLicenses = async () => {
    const all = await licenseRepository.getAll();
    setLicenses(all);
  };

  const handleGenerateLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await LicenseService.createLicenseKey({
        companyId: genCompanyId,
        companyName: genCompanyName,
        iupPermitNumber: genIupNumber,
        taxIdNpwp: genTaxNpwp,
        ownerUserId: "USR-GEN-" + Date.now(),
        ownerEmail: genOwnerEmail,
        ownerFullName: genOwnerName,
        planId: genPlanId,
        billingCycle: genCycle,
        maxUsers: genMaxUsers,
        maxSites: genMaxSites,
        maxDevices: genMaxDevices,
        createdBy: currentUser.email,
      });

      setGeneratedPlaintextKey(res.plaintextKey);
      setIsGeneratorOpen(false);
      await loadLicenses();
    } catch (err) {
      console.error("Failed to generate license key", err);
    }
  };

  const handleCopyGeneratedKey = () => {
    if (generatedPlaintextKey) {
      navigator.clipboard.writeText(generatedPlaintextKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  const handleRenewConfirm = async () => {
    if (renewTargetId) {
      await LicenseService.renewLicense(renewTargetId, renewCycle, currentUser.email);
      setRenewTargetId(null);
      await loadLicenses();
    }
  };

  const handleConfirmSuspend = async () => {
    if (suspendTargetId && suspendReason) {
      await LicenseService.suspendLicense(suspendTargetId, suspendReason, currentUser.email);
      setSuspendTargetId(null);
      setSuspendReason("");
      await loadLicenses();
    }
  };

  const handleResume = async (licenseId: string) => {
    await LicenseService.resumeLicense(licenseId, currentUser.email);
    await loadLicenses();
  };

  const handleForceExpire = async (licenseId: string) => {
    if (confirm("Set status lisensi ini menjadi EXPIRED (kedaluwarsa)? Fitur proteksi akan terkunci.")) {
      await LicenseService.forceExpireLicense(licenseId, currentUser.email);
      await loadLicenses();
    }
  };

  const handleDeactivate = async (licenseId: string) => {
    if (confirm("Deaktivasi lisensi ini? Status akan kembali menjadi UNACTIVATED.")) {
      await LicenseService.deactivateLicense(licenseId, "Deaktivasi oleh Super Admin", currentUser.email);
      await loadLicenses();
    }
  };

  const filteredLicenses = licenses.filter((lic) => {
    if (filterStatus !== "ALL" && lic.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        lic.companyName.toLowerCase().includes(q) ||
        lic.ownerEmail.toLowerCase().includes(q) ||
        lic.licenseKeyLast4.toLowerCase().includes(q) ||
        (lic.maskedKey && lic.maskedKey.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-400 border border-amber-500/30 uppercase tracking-widest">
              SUPER ADMIN LICENSE ENGINE
            </span>
            <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
              Format: MSAI-ID-XXXX-XXXX-XXXX
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1.5 flex items-center gap-2">
            <Key className="h-6 w-6 text-amber-400" />
            <span>Manajemen Lisensi Komersial (1 Account = 1 Key)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Pusat kontrol penerbitan lisensi, binding akun/perusahaan/perangkat, siklus subskripsi (Monthly, Quarterly, Yearly, Enterprise), perpanjangan (renew), suspend, serta audit trail.
          </p>
        </div>

        <button
          onClick={() => setIsGeneratorOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 px-5 py-3 text-xs font-black text-slate-950 hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all shrink-0 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Generate License Key Baru</span>
        </button>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Lisensi Diterbitkan</span>
          <p className="text-2xl font-black text-white mt-1">{licenses.length}</p>
        </div>
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Lisensi Aktif</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">
            {licenses.filter((l) => l.status === "ACTIVE").length}
          </p>
        </div>
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Unactivated / Pending</span>
          <p className="text-2xl font-black text-amber-400 mt-1">
            {licenses.filter((l) => l.status === "UNACTIVATED").length}
          </p>
        </div>
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
          <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Suspended / Expired</span>
          <p className="text-2xl font-black text-red-400 mt-1">
            {licenses.filter((l) => l.status === "SUSPENDED" || l.status === "EXPIRED").length}
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/80 p-3">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
          {["ALL", "ACTIVE", "UNACTIVATED", "EXPIRING", "GRACE_PERIOD", "SUSPENDED", "EXPIRED", "REVOKED"].map(
            (st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`rounded-lg px-3 py-1.5 transition-all uppercase text-[10px] font-bold ${
                  filterStatus === st
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "text-slate-400 hover:bg-slate-800"
                }`}
              >
                {st}
              </button>
            )
          )}
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari perusahaan, email, atau key..."
            className="w-full rounded-lg border border-slate-700 bg-slate-950 pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
          />
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
        </div>
      </div>

      {/* Licenses Master Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
              <th className="p-3">Perusahaan & User Binding</th>
              <th className="p-3">Paket & Siklus</th>
              <th className="p-3">Masked License Key</th>
              <th className="p-3">Status</th>
              <th className="p-3">Masa Berlaku</th>
              <th className="p-3">Quota (User/Site/Dev)</th>
              <th className="p-3 text-right">Tindakan Kontrol</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {filteredLicenses.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500">
                  Tidak ada lisensi yang cocok dengan kriteria filter.
                </td>
              </tr>
            ) : (
              filteredLicenses.map((lic) => {
                const expDate = new Date(lic.expiryAt);
                const days = Math.max(0, Math.ceil((expDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
                const isExpired = Date.now() > expDate.getTime();

                return (
                  <tr key={lic.id} className="hover:bg-slate-800/40">
                    <td className="p-3">
                      <div className="flex items-start gap-2">
                        <Building2 className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="font-bold text-white">{lic.companyName}</p>
                          <p className="text-[10px] text-amber-400 font-mono">
                            Bound: {lic.bindingInfo?.userBinding.userEmail || lic.ownerEmail}
                          </p>
                          {lic.bindingInfo?.companyBinding.iupPermitNumber && (
                            <p className="text-[9px] text-slate-500">
                              IUP: {lic.bindingInfo.companyBinding.iupPermitNumber}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="p-3">
                      <span className="font-bold text-amber-400">{lic.planId}</span>
                      <span className="block text-[10px] text-slate-400 font-mono">
                        {lic.billingCycle || "YEARLY"}
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                        <span>{lic.maskedKey || `MSAI-ID-••••-••••-${lic.licenseKeyLast4}`}</span>
                      </div>
                    </td>

                    <td className="p-3">
                      <span
                        className={`rounded px-2.5 py-1 text-[9px] font-extrabold uppercase inline-block ${
                          lic.status === "ACTIVE"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : lic.status === "SUSPENDED"
                            ? "bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse"
                            : lic.status === "EXPIRED"
                            ? "bg-slate-700 text-slate-300 border border-slate-600"
                            : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {lic.status}
                      </span>
                    </td>

                    <td className="p-3 font-mono text-slate-300">
                      <div>{expDate.toLocaleDateString("id-ID")}</div>
                      <span className={`text-[10px] ${isExpired ? "text-red-400" : "text-slate-400"}`}>
                        {isExpired ? "Kedaluwarsa" : `${days} hari tersisa`}
                      </span>
                    </td>

                    <td className="p-3 text-[11px] text-slate-400">
                      <div>{lic.maxUsers} Users</div>
                      <div>{lic.maxSites} Sites • {lic.maxDevices} Devs</div>
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        {/* Inspect Info */}
                        <button
                          onClick={() => setInspectLicense(lic)}
                          className="rounded bg-slate-800 p-1.5 text-slate-300 hover:text-white hover:bg-slate-700"
                          title="Detail Binding & Quota"
                        >
                          <Info className="h-3.5 w-3.5" />
                        </button>

                        {/* Renew */}
                        <button
                          onClick={() => {
                            setRenewTargetId(lic.id);
                            setRenewCycle(lic.billingCycle || "YEARLY");
                          }}
                          className="rounded bg-emerald-500/20 px-2.5 py-1 text-[10px] font-bold text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30"
                          title="Perpanjang Lisensi"
                        >
                          <RotateCcw className="h-3 w-3 inline mr-1" />
                          Renew
                        </button>

                        {/* Suspend / Resume */}
                        {lic.status === "SUSPENDED" ? (
                          <button
                            onClick={() => handleResume(lic.id)}
                            className="rounded bg-teal-500/20 px-2.5 py-1 text-[10px] font-bold text-teal-400 hover:bg-teal-500/30 border border-teal-500/30"
                          >
                            Resume
                          </button>
                        ) : (
                          <button
                            onClick={() => setSuspendTargetId(lic.id)}
                            className="rounded bg-red-500/20 px-2.5 py-1 text-[10px] font-bold text-red-400 hover:bg-red-500/30 border border-red-500/30"
                            title="Tangguhkan Akses Lisensi"
                          >
                            Suspend
                          </button>
                        )}

                        {/* Force Expire (for testing / admin policy) */}
                        {lic.status !== "EXPIRED" && (
                          <button
                            onClick={() => handleForceExpire(lic.id)}
                            className="rounded bg-slate-800 px-2 py-1 text-[10px] text-slate-400 hover:text-red-400 hover:bg-slate-700"
                            title="Force Expire"
                          >
                            Expire
                          </button>
                        )}

                        {/* Deactivate */}
                        {lic.status === "ACTIVE" && (
                          <button
                            onClick={() => handleDeactivate(lic.id)}
                            className="rounded bg-slate-800 px-2 py-1 text-[10px] text-slate-400 hover:text-amber-400 hover:bg-slate-700"
                            title="Deaktivasi Lisensi"
                          >
                            <Power className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Generator Modal */}
      {isGeneratorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="max-w-xl w-full rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl relative my-8">
            <button
              onClick={() => setIsGeneratorOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <Key className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Generate License Key Komersial</h3>
                <p className="text-[11px] text-slate-400">
                  Format Standar: <span className="font-mono text-emerald-400">MSAI-ID-XXXX-XXXX-XXXX</span> (1 Account = 1 Key)
                </p>
              </div>
            </div>

            <form onSubmit={handleGenerateLicense} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Nama Perusahaan Tambang</label>
                  <input
                    type="text"
                    value={genCompanyName}
                    onChange={(e) => setGenCompanyName(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Nomor Izin Usaha Tambang (IUP)</label>
                  <input
                    type="text"
                    value={genIupNumber}
                    onChange={(e) => setGenIupNumber(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">NPWP Badan Usaha</label>
                  <input
                    type="text"
                    value={genTaxNpwp}
                    onChange={(e) => setGenTaxNpwp(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Company Code ID</label>
                  <input
                    type="text"
                    value={genCompanyId}
                    onChange={(e) => setGenCompanyId(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-amber-500"
                  />
                </div>
              </div>

              {/* 1 Account = 1 License Key section */}
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 space-y-3">
                <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest block">
                  1 Account = 1 License Key (User Binding)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Email Akun Utama (Bound Email)</label>
                    <input
                      type="email"
                      value={genOwnerEmail}
                      onChange={(e) => setGenOwnerEmail(e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-amber-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Nama Lengkap Pemegang Akun</label>
                    <input
                      type="text"
                      value={genOwnerName}
                      onChange={(e) => setGenOwnerName(e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-amber-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Subscription Tier & Cycle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Pilih Paket Lisensi</label>
                  <select
                    value={genPlanId}
                    onChange={(e) => {
                      const p = e.target.value as LicensePlanId;
                      setGenPlanId(p);
                      if (p === "STARTER") {
                        setGenMaxUsers(10);
                        setGenMaxSites(1);
                        setGenMaxDevices(5);
                      } else if (p === "PROFESSIONAL") {
                        setGenMaxUsers(50);
                        setGenMaxSites(3);
                        setGenMaxDevices(25);
                      } else if (p === "BUSINESS") {
                        setGenMaxUsers(200);
                        setGenMaxSites(10);
                        setGenMaxDevices(100);
                      } else if (p === "ENTERPRISE") {
                        setGenMaxUsers(1000);
                        setGenMaxSites(50);
                        setGenMaxDevices(500);
                      }
                    }}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-amber-500"
                  >
                    <option value="STARTER">STARTER (10 Users, 1 Site, 5 Devs)</option>
                    <option value="PROFESSIONAL">PROFESSIONAL (50 Users, 3 Sites, 25 Devs)</option>
                    <option value="BUSINESS">BUSINESS (200 Users, 10 Sites, 100 Devs)</option>
                    <option value="ENTERPRISE">ENTERPRISE (1000 Users, 50 Sites, 500 Devs)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Siklus Subskripsi (Billing)</label>
                  <select
                    value={genCycle}
                    onChange={(e) => setGenCycle(e.target.value as SubscriptionCycleType)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-amber-500"
                  >
                    <option value="MONTHLY">Monthly (1 Bulan)</option>
                    <option value="QUARTERLY">Quarterly (3 Bulan - Diskon 7%)</option>
                    <option value="YEARLY">Yearly (12 Bulan - Hemat 2 Bulan)</option>
                    <option value="ENTERPRISE">Enterprise (Annual / Dedicated SLA 24/7)</option>
                  </select>
                </div>
              </div>

              {/* Quotas */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 text-[10px] mb-1">Max Users</label>
                  <input
                    type="number"
                    value={genMaxUsers}
                    onChange={(e) => setGenMaxUsers(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[10px] mb-1">Max Sites</label>
                  <input
                    type="number"
                    value={genMaxSites}
                    onChange={(e) => setGenMaxSites(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[10px] mb-1">Max Devices</label>
                  <input
                    type="number"
                    value={genMaxDevices}
                    onChange={(e) => setGenMaxDevices(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-amber-500 p-3 text-xs font-black text-slate-950 hover:brightness-110 shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                Generate Secure Cryptographic Key (MSAI-ID)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ONE-TIME Reveal Result Modal */}
      {generatedPlaintextKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
          <div className="max-w-lg w-full rounded-2xl border border-emerald-500/50 bg-slate-900 p-6 space-y-5 text-center shadow-2xl relative">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
              <Key className="h-7 w-7" />
            </div>

            <div>
              <span className="rounded bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30 uppercase tracking-widest">
                ONE-TIME REVEAL SECURE KEY
              </span>
              <h3 className="text-xl font-black text-white mt-2">Kode Lisensi Berhasil Diterbitkan</h3>
              <p className="text-xs text-slate-400 mt-1">
                Salin dan berikan kode lisensi ini kepada klien tambang. Kunci ini terikat 1:1 dengan akun pemilik.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 font-mono text-xl font-black text-emerald-400 tracking-widest flex items-center justify-between">
              <span>{generatedPlaintextKey}</span>
              <button
                onClick={handleCopyGeneratedKey}
                className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 cursor-pointer"
                title="Salin Key"
              >
                {copiedKey ? <Check className="h-5 w-5 text-emerald-400" /> : <Copy className="h-5 w-5 text-amber-400" />}
              </button>
            </div>

            {copiedKey && <p className="text-xs font-bold text-emerald-400">Kode Lisensi Berhasil Disalin ke Clipboard!</p>}

            <button
              onClick={() => setGeneratedPlaintextKey(null)}
              className="w-full rounded-xl bg-slate-800 p-3 text-xs font-bold text-slate-200 hover:bg-slate-700 cursor-pointer"
            >
              Tutup & Simpan Hash ke Database
            </button>
          </div>
        </div>
      )}

      {/* Renew Modal */}
      {renewTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="max-w-md w-full rounded-2xl border border-emerald-500/30 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
              <RotateCcw className="h-5 w-5" />
              <span>Perpanjangan Masa Aktif Lisensi (Renew)</span>
            </h3>
            <p className="text-xs text-slate-300">
              Pilih siklus perpanjangan untuk lisensi ini. Tanggal kedaluwarsa baru akan dihitung secara otomatis.
            </p>

            <div>
              <label className="block text-slate-300 text-xs font-medium mb-1">Pilih Siklus Subskripsi</label>
              <select
                value={renewCycle}
                onChange={(e) => setRenewCycle(e.target.value as SubscriptionCycleType)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white focus:border-emerald-500"
              >
                <option value="MONTHLY">+1 Bulan (Monthly)</option>
                <option value="QUARTERLY">+3 Bulan (Quarterly)</option>
                <option value="YEARLY">+12 Bulan (Yearly)</option>
                <option value="ENTERPRISE">+12 Bulan (Enterprise Dedicated SLA)</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setRenewTargetId(null)}
                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
              >
                Batal
              </button>
              <button
                onClick={handleRenewConfirm}
                className="rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 cursor-pointer"
              >
                Konfirmasi Renew
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend Confirmation Modal */}
      {suspendTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="max-w-md w-full rounded-2xl border border-red-500/30 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-red-400 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5" />
              <span>Konfirmasi Penangguhan (Suspend) Lisensi</span>
            </h3>
            <p className="text-xs text-slate-300">
              Masukkan alasan penangguhan lisensi. Seluruh akses pengguna non-admin ke modul operasional akan diblokir sementara.
            </p>
            <textarea
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              placeholder="Contoh: Menunggu konfirmasi pembayaran tagihan commercial..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white focus:border-red-500"
              rows={3}
            />
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSuspendTargetId(null)}
                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmSuspend}
                className="rounded-xl bg-red-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-red-400 cursor-pointer"
              >
                Tangguhkan Lisensi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inspect License Details Modal */}
      {inspectLicense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="max-w-lg w-full rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setInspectLicense(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Detail Binding & Lisensi ID: {inspectLicense.id}</h3>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase">1 Account = 1 Key Binding</span>
                <p><strong className="text-white">Owner Email:</strong> {inspectLicense.ownerEmail}</p>
                <p><strong className="text-white">User ID:</strong> {inspectLicense.ownerUserId}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-emerald-400 uppercase">Company Binding</span>
                <p><strong className="text-white">Perusahaan:</strong> {inspectLicense.companyName}</p>
                <p><strong className="text-white">Company ID:</strong> {inspectLicense.companyId}</p>
                <p><strong className="text-white">IUP Permit:</strong> {inspectLicense.bindingInfo?.companyBinding.iupPermitNumber || "N/A"}</p>
                <p><strong className="text-white">NPWP:</strong> {inspectLicense.bindingInfo?.companyBinding.taxIdNpwp || "N/A"}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-teal-400 uppercase">Device Binding Limits</span>
                <p><strong className="text-white">Max Allowed Devices:</strong> {inspectLicense.maxDevices} unit</p>
                <p><strong className="text-white">Hardware Enforcement:</strong> Aktif (Fingerprint SHA-256)</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-blue-400 uppercase">Cryptographic Integrity</span>
                <p className="font-mono text-[10px] text-slate-400 break-all"><strong className="text-white">Hash SHA-256:</strong> {inspectLicense.licenseKeyHash}</p>
              </div>
            </div>

            <button
              onClick={() => setInspectLicense(null)}
              className="w-full rounded-xl bg-slate-800 p-2.5 text-xs font-bold text-slate-200 hover:bg-slate-700"
            >
              Tutup Detail
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
