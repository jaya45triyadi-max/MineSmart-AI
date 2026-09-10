import React, { useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import { CustomerLicenseModule } from "./CustomerLicenseModule";
import { CustomerSubscriptionModule } from "./CustomerSubscriptionModule";
import { CustomerDevicesModule } from "./CustomerDevicesModule";
import { CustomerInvoicesModule } from "./CustomerInvoicesModule";
import { ActivateLicenseModule } from "./ActivateLicenseModule";
import { AdminLicensesModule } from "../admin/AdminLicensesModule";
import { AdminSubscriptionsModule } from "../admin/AdminSubscriptionsModule";
import { AdminLicenseEventsModule } from "../admin/AdminLicenseEventsModule";
import {
  ShieldCheck,
  Key,
  CreditCard,
  Laptop,
  Receipt,
  Crown,
  History,
  Building2,
} from "lucide-react";

export const LicenseHubModule: React.FC = () => {
  const { currentUser } = useAuth();
  const isSuperAdmin = currentUser.role === "SUPER_ADMIN" || currentUser.role === "EXECUTIVE";

  const [activeTab, setActiveTab] = useState<
    "overview" | "subscription" | "devices" | "invoices" | "activate" | "admin-licenses" | "admin-billing" | "admin-events"
  >("overview");

  return (
    <div className="space-y-6">
      {/* Top Commercial License Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 overflow-x-auto">
        <div className="flex items-center gap-2">
          {/* Customer Tabs */}
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === "overview"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "text-slate-400 hover:bg-slate-800"
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Status & Kuota</span>
          </button>

          <button
            onClick={() => setActiveTab("subscription")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === "subscription"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "text-slate-400 hover:bg-slate-800"
            }`}
          >
            <CreditCard className="h-4 w-4" />
            <span>Paket & Upgrade</span>
          </button>

          <button
            onClick={() => setActiveTab("devices")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === "devices"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "text-slate-400 hover:bg-slate-800"
            }`}
          >
            <Laptop className="h-4 w-4" />
            <span>Bound Devices</span>
          </button>

          <button
            onClick={() => setActiveTab("invoices")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === "invoices"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "text-slate-400 hover:bg-slate-800"
            }`}
          >
            <Receipt className="h-4 w-4" />
            <span>Tagihan Invoice</span>
          </button>

          <button
            onClick={() => setActiveTab("activate")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === "activate"
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                : "text-slate-400 hover:bg-slate-800"
            }`}
          >
            <Key className="h-4 w-4 text-amber-400" />
            <span>Aktivasi Kode</span>
          </button>
        </div>

        {/* Super Admin Control Section */}
        {isSuperAdmin && (
          <div className="flex items-center gap-2 pl-4 border-l border-slate-800">
            <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest flex items-center gap-1 shrink-0">
              <Crown className="h-3.5 w-3.5" /> Admin Portal:
            </span>

            <button
              onClick={() => setActiveTab("admin-licenses")}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                activeTab === "admin-licenses"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "text-slate-400 hover:bg-slate-800"
              }`}
            >
              <span>Master Licenses</span>
            </button>

            <button
              onClick={() => setActiveTab("admin-billing")}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                activeTab === "admin-billing"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "text-slate-400 hover:bg-slate-800"
              }`}
            >
              <span>Approval Invoice</span>
            </button>

            <button
              onClick={() => setActiveTab("admin-events")}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                activeTab === "admin-events"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "text-slate-400 hover:bg-slate-800"
              }`}
            >
              <History className="h-3.5 w-3.5" />
              <span>Audit Trail</span>
            </button>
          </div>
        )}
      </div>

      {/* Tab Render Area */}
      {activeTab === "overview" && <CustomerLicenseModule />}
      {activeTab === "subscription" && <CustomerSubscriptionModule />}
      {activeTab === "devices" && <CustomerDevicesModule />}
      {activeTab === "invoices" && <CustomerInvoicesModule />}
      {activeTab === "activate" && <ActivateLicenseModule />}

      {/* Super Admin Tab Views */}
      {activeTab === "admin-licenses" && <AdminLicensesModule />}
      {activeTab === "admin-billing" && <AdminSubscriptionsModule />}
      {activeTab === "admin-events" && <AdminLicenseEventsModule />}
    </div>
  );
};
