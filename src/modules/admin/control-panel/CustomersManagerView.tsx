// MINE SMART AI - Master Customer Directory & Provisioning Console
// PROMPT 36: Create Customer, License Binding, Tenant Isolation & Usage Limits

import React, { useState } from "react";
import {
  Building2,
  Plus,
  Search,
  Filter,
  Shield,
  Key,
  Calendar,
  Users,
  HardDrive,
  Cpu,
  MoreVertical,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Edit,
  Trash2,
  Sparkles,
  Lock,
  Unlock,
  RefreshCcw,
  Sliders,
  DollarSign,
  ChevronRight,
  Save,
} from "lucide-react";
import {
  MasterCustomerRecord,
  PlatformConfig,
} from "../../../types/developerControlPanelTypes";
import { platformConfigService } from "../../../services/config/PlatformConfigService";

interface CustomersManagerViewProps {
  customers: MasterCustomerRecord[];
  config: PlatformConfig;
  onRefresh: () => void;
  onOpenCreateModal: () => void;
  onImpersonateTenant: (company: MasterCustomerRecord) => void;
}

export const CustomersManagerView: React.FC<CustomersManagerViewProps> = ({
  customers,
  config,
  onRefresh,
  onOpenCreateModal,
  onImpersonateTenant,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlanFilter, setSelectedPlanFilter] = useState<string>("ALL");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("ALL");
  const [selectedCustomerForDetail, setSelectedCustomerForDetail] = useState<MasterCustomerRecord | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<MasterCustomerRecord | null>(null);
  const [editForm, setEditForm] = useState<{
    companyName: string;
    iupNumber: string;
    adminName: string;
    adminEmail: string;
    adminPhone: string;
    plan: "STARTER" | "PROFESSIONAL" | "ENTERPRISE";
    licenseStatus: "ACTIVE" | "TRIAL" | "SUSPENDED" | "EXPIRED";
    expiresAt: string;
    maxUsersLimit: number;
    maxSitesLimit: number;
    maxStorageGB: number;
    maxAiQuotaMonth: number;
    monthlyRevenueIDR: number;
  }>({
    companyName: "",
    iupNumber: "",
    adminName: "",
    adminEmail: "",
    adminPhone: "",
    plan: "PROFESSIONAL",
    licenseStatus: "ACTIVE",
    expiresAt: "",
    maxUsersLimit: 50,
    maxSitesLimit: 3,
    maxStorageGB: 100,
    maxAiQuotaMonth: 10000,
    monthlyRevenueIDR: 45000000,
  });
  const [isExtendingLicense, setIsExtendingLicense] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const handleOpenEdit = (cust: MasterCustomerRecord) => {
    setEditingCustomer(cust);
    setEditForm({
      companyName: cust.companyName,
      iupNumber: cust.iupNumber,
      adminName: cust.adminName,
      adminEmail: cust.adminEmail,
      adminPhone: cust.adminPhone,
      plan: cust.plan,
      licenseStatus: cust.licenseStatus,
      expiresAt: cust.expiresAt ? cust.expiresAt.split("T")[0] : "",
      maxUsersLimit: cust.maxUsersLimit,
      maxSitesLimit: cust.maxSitesLimit,
      maxStorageGB: cust.maxStorageGB,
      maxAiQuotaMonth: cust.maxAiQuotaMonth,
      monthlyRevenueIDR: cust.monthlyRevenueIDR,
    });
  };

  const handleSaveCustomerEdit = async () => {
    if (!editingCustomer) return;
    await platformConfigService.updateCustomer(
      editingCustomer.id,
      {
        companyName: editForm.companyName,
        iupNumber: editForm.iupNumber,
        adminName: editForm.adminName,
        adminEmail: editForm.adminEmail,
        adminPhone: editForm.adminPhone,
        plan: editForm.plan,
        licenseStatus: editForm.licenseStatus,
        expiresAt: new Date(editForm.expiresAt || editingCustomer.expiresAt).toISOString(),
        maxUsersLimit: Number(editForm.maxUsersLimit),
        maxSitesLimit: Number(editForm.maxSitesLimit),
        maxStorageGB: Number(editForm.maxStorageGB),
        maxAiQuotaMonth: Number(editForm.maxAiQuotaMonth),
        monthlyRevenueIDR: Number(editForm.monthlyRevenueIDR),
      },
      "Triyadi Jaya",
      "jaya45triyadi@gmail.com"
    );

    setEditingCustomer(null);
    setActionSuccessMessage(`✅ Data akun pelanggan [${editForm.companyName}] berhasil diperbarui secara instan!`);
    onRefresh();
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.adminEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.iupNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.licenseKey.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPlan = selectedPlanFilter === "ALL" || c.plan === selectedPlanFilter;
    const matchesStatus = selectedStatusFilter === "ALL" || c.licenseStatus === selectedStatusFilter;

    return matchesSearch && matchesPlan && matchesStatus;
  });

  const handleToggleSuspend = async (customer: MasterCustomerRecord) => {
    const newStatus = customer.licenseStatus === "SUSPENDED" ? "ACTIVE" : "SUSPENDED";
    await platformConfigService.updateCustomer(
      customer.id,
      { licenseStatus: newStatus },
      "Triyadi Jaya",
      "jaya45triyadi@gmail.com"
    );
    setActionSuccessMessage(
      `Status customer ${customer.companyName} berhasil diubah menjadi ${newStatus}.`
    );
    onRefresh();
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  const handleExtendOneYear = async (customer: MasterCustomerRecord) => {
    const currentExpiry = new Date(customer.expiresAt);
    currentExpiry.setFullYear(currentExpiry.getFullYear() + 1);
    const newExpiryIso = currentExpiry.toISOString();

    await platformConfigService.updateCustomer(
      customer.id,
      { expiresAt: newExpiryIso, licenseStatus: "ACTIVE" },
      "Triyadi Jaya",
      "jaya45triyadi@gmail.com"
    );
    setActionSuccessMessage(
      `Masa aktif lisensi ${customer.companyName} diperpanjang hingga ${new Date(
        newExpiryIso
      ).toLocaleDateString("id-ID")}.`
    );
    onRefresh();
    if (selectedCustomerForDetail) {
      setSelectedCustomerForDetail({ ...selectedCustomerForDetail, expiresAt: newExpiryIso });
    }
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-500" />
            <span>Master Customer Directory ({customers.length} Tenants)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Kelola data perusahaan pelanggan, alokasi lisensi kriptografis, batasan kuota seat, dan override tenant.
          </p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create New Customer Company</span>
        </button>
      </div>

      {/* Success Notification Alert */}
      {actionSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Search & Filters */}
      <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama perusahaan, nomor IUP, email admin, atau license key..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedPlanFilter}
            onChange={(e) => setSelectedPlanFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
          >
            <option value="ALL">Semua Paket Plan</option>
            <option value="STARTER">Starter</option>
            <option value="PROFESSIONAL">Professional</option>
            <option value="ENTERPRISE">Enterprise Dedicated</option>
          </select>

          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
          >
            <option value="ALL">Semua Status</option>
            <option value="ACTIVE">Active</option>
            <option value="TRIAL">Trial</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="EXPIRED">Expired</option>
          </select>
        </div>
      </div>

      {/* Customer Records Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Perusahaan & IUP</th>
                <th className="py-3.5 px-4">Admin Contact</th>
                <th className="py-3.5 px-4">Paket & Billing</th>
                <th className="py-3.5 px-4">Kunci Lisensi RSA</th>
                <th className="py-3.5 px-4">Penggunaan Kuota</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs">
              {filteredCustomers.map((cust) => {
                const isSuspended = cust.licenseStatus === "SUSPENDED";
                const isEnterprise = cust.plan === "ENTERPRISE";

                return (
                  <tr
                    key={cust.id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Company & IUP */}
                    <td className="py-3.5 px-4">
                      <div className="font-black text-white flex items-center gap-1.5">
                        <span>{cust.companyName}</span>
                        {cust.holdingGroupId && (
                          <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 text-[9px] font-bold border border-purple-500/30">
                            HOLDING
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-mono text-slate-400">{cust.iupNumber}</p>
                      <span className="text-[10px] text-slate-500 font-mono">ID: {cust.id}</span>
                    </td>

                    {/* Admin Contact */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200">
                        {cust.adminName}
                      </div>
                      <p className="text-[11px] text-slate-400">{cust.adminEmail}</p>
                      <p className="text-[10px] font-mono text-slate-500">{cust.adminPhone}</p>
                    </td>

                    {/* Plan & Billing */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md font-bold text-[10px] border ${
                          isEnterprise
                            ? "bg-purple-500/15 text-purple-400 border-purple-500/30"
                            : cust.plan === "PROFESSIONAL"
                            ? "bg-cyan-500/15 text-cyan-400 border-cyan-500/30"
                            : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                        }`}
                      >
                        {cust.plan}
                      </span>
                      <p className="text-[11px] font-mono font-bold text-white mt-1">
                        {formatIDR(cust.monthlyRevenueIDR)}/bln
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Exp: {new Date(cust.expiresAt).toLocaleDateString("id-ID")}
                      </p>
                    </td>

                    {/* License Key */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-[11px] text-slate-300 bg-slate-950 px-2 py-1 rounded border border-slate-800 select-all">
                        {cust.licenseKey}
                      </div>
                      <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                        <Key className="w-3 h-3" />
                        <span>RSA-4096 Signed</span>
                      </span>
                    </td>

                    {/* Usage Progress */}
                    <td className="py-3.5 px-4 space-y-1 min-w-[160px]">
                      {/* Users */}
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>Users:</span>
                        <strong className="text-slate-200 font-mono">
                          {cust.activeUsersCount} / {cust.maxUsersLimit}
                        </strong>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              (cust.activeUsersCount / cust.maxUsersLimit) * 100
                            )}%`,
                          }}
                        />
                      </div>

                      {/* AI Monthly Invocations */}
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                        <span>AI Calls:</span>
                        <strong className="text-amber-400 font-mono">
                          {cust.aiUsageCallsMonth} / {cust.maxAiQuotaMonth}
                        </strong>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          cust.licenseStatus === "ACTIVE"
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                            : cust.licenseStatus === "TRIAL"
                            ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                            : "bg-rose-500/15 text-rose-400 border-rose-500/30"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            cust.licenseStatus === "ACTIVE"
                              ? "bg-emerald-400"
                              : cust.licenseStatus === "TRIAL"
                              ? "bg-amber-400"
                              : "bg-rose-400"
                          }`}
                        />
                        <span>{cust.licenseStatus}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(cust)}
                          className="p-1.5 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors cursor-pointer"
                          title="Edit Akun Pelanggan & Kuota"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setSelectedCustomerForDetail(cust)}
                          className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                          title="Detail & Tenant Configuration"
                        >
                          <Sliders className="w-4 h-4 text-cyan-400" />
                        </button>

                        <button
                          onClick={() => onImpersonateTenant(cust)}
                          className="p-1.5 hover:bg-purple-500/20 text-purple-400 rounded-lg transition-colors cursor-pointer"
                          title="Support: Login as Tenant (Impersonate)"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleToggleSuspend(cust)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            isSuspended
                              ? "hover:bg-emerald-500/20 text-emerald-400"
                              : "hover:bg-rose-500/20 text-rose-400"
                          }`}
                          title={isSuspended ? "Aktifkan Kembali" : "Suspend Customer"}
                        >
                          {isSuspended ? (
                            <Unlock className="w-4 h-4" />
                          ) : (
                            <Lock className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Drawer Modal */}
      {selectedCustomerForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-white shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  TENANT CONTROL & OVERRIDES
                </span>
                <h3 className="text-xl font-black text-white mt-1">
                  {selectedCustomerForDetail.companyName}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  IUP: {selectedCustomerForDetail.iupNumber} &bull; ID: {selectedCustomerForDetail.id}
                </p>
              </div>

              <button
                onClick={() => setSelectedCustomerForDetail(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Plan Tier</span>
                <span className="text-sm font-black text-purple-400">
                  {selectedCustomerForDetail.plan}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Users Active</span>
                <span className="text-sm font-black text-emerald-400 font-mono">
                  {selectedCustomerForDetail.activeUsersCount} / {selectedCustomerForDetail.maxUsersLimit}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Storage</span>
                <span className="text-sm font-black text-cyan-400 font-mono">
                  {selectedCustomerForDetail.storageUsageGB} GB / {selectedCustomerForDetail.maxStorageGB} GB
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">AI Calls/Mo</span>
                <span className="text-sm font-black text-amber-400 font-mono">
                  {selectedCustomerForDetail.aiUsageCallsMonth} / {selectedCustomerForDetail.maxAiQuotaMonth}
                </span>
              </div>
            </div>

            {/* License Key Info */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  <span>Kunci Lisensi RSA-4096</span>
                </span>
                <span className="font-mono text-emerald-400 font-bold">
                  {selectedCustomerForDetail.licenseStatus}
                </span>
              </div>
              <p className="font-mono text-xs text-white bg-slate-900 p-2.5 rounded-xl border border-slate-800 select-all">
                {selectedCustomerForDetail.licenseKey}
              </p>
              <p className="text-[11px] text-slate-400">
                Masa Berlaku:{" "}
                <strong className="text-white">
                  {new Date(selectedCustomerForDetail.expiresAt).toLocaleDateString("id-ID")}
                </strong>
              </p>
            </div>

            {/* Actions for this tenant */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  const cust = selectedCustomerForDetail;
                  setSelectedCustomerForDetail(null);
                  handleOpenEdit(cust);
                }}
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Data & Kuota Tenant</span>
              </button>

              <button
                onClick={() => handleExtendOneYear(selectedCustomerForDetail)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Calendar className="w-4 h-4" />
                <span>Perpanjang Lisensi +1 Thn</span>
              </button>

              <button
                onClick={() => {
                  onImpersonateTenant(selectedCustomerForDetail);
                  setSelectedCustomerForDetail(null);
                }}
                className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/25 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Impersonate Account</span>
              </button>

              <button
                onClick={() => setSelectedCustomerForDetail(null)}
                className="px-4 py-2.5 bg-slate-800 text-slate-300 hover:text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {editingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-white shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  EDIT TENANT / CUSTOMER RECORD
                </span>
                <h3 className="text-xl font-black text-white mt-1">
                  Edit Akun Pelanggan: {editingCustomer.companyName}
                </h3>
                <p className="text-xs text-slate-400">
                  Perubahan akan langsung sinkron ke database tenant tanpa perlu redeploy aplikasi.
                </p>
              </div>

              <button
                onClick={() => setEditingCustomer(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Nama Perusahaan / IUP
                </label>
                <input
                  type="text"
                  value={editForm.companyName}
                  onChange={(e) => setEditForm({ ...editForm, companyName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Nomor IUP / PKP2B
                </label>
                <input
                  type="text"
                  value={editForm.iupNumber}
                  onChange={(e) => setEditForm({ ...editForm, iupNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Nama Kontak Penanggung Jawab
                </label>
                <input
                  type="text"
                  value={editForm.adminName}
                  onChange={(e) => setEditForm({ ...editForm, adminName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Email Admin Customer
                </label>
                <input
                  type="email"
                  value={editForm.adminEmail}
                  onChange={(e) => setEditForm({ ...editForm, adminEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Paket Langganan (Plan Tier)
                </label>
                <select
                  value={editForm.plan}
                  onChange={(e) => setEditForm({ ...editForm, plan: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
                >
                  <option value="STARTER">STARTER</option>
                  <option value="PROFESSIONAL">PROFESSIONAL</option>
                  <option value="ENTERPRISE">ENTERPRISE DEDICATED</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Status Lisensi
                </label>
                <select
                  value={editForm.licenseStatus}
                  onChange={(e) => setEditForm({ ...editForm, licenseStatus: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
                >
                  <option value="ACTIVE">ACTIVE (Aktif Normal)</option>
                  <option value="TRIAL">TRIAL (Uji Coba)</option>
                  <option value="SUSPENDED">SUSPENDED (Tangguhkan)</option>
                  <option value="EXPIRED">EXPIRED (Kedaluwarsa)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Tanggal Kedaluwarsa Lisensi
                </label>
                <input
                  type="date"
                  value={editForm.expiresAt}
                  onChange={(e) => setEditForm({ ...editForm, expiresAt: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Batas Maksimal User (Seats)
                </label>
                <input
                  type="number"
                  value={editForm.maxUsersLimit}
                  onChange={(e) => setEditForm({ ...editForm, maxUsersLimit: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Batas Maksimal Pit / Sites
                </label>
                <input
                  type="number"
                  value={editForm.maxSitesLimit}
                  onChange={(e) => setEditForm({ ...editForm, maxSitesLimit: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Kuota AI Invocations / Bulan
                </label>
                <input
                  type="number"
                  value={editForm.maxAiQuotaMonth}
                  onChange={(e) => setEditForm({ ...editForm, maxAiQuotaMonth: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setEditingCustomer(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleSaveCustomerEdit}
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-xl shadow-lg shadow-emerald-500/25 flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan Akun</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
