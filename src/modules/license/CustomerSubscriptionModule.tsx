import React, { useState } from "react";
import { useLicense } from "../../providers/LicenseProvider";
import { useAuth } from "../../providers/AuthProvider";
import { SUBSCRIPTION_PLANS } from "../../services/license/SubscriptionPlansData";
import { paymentService } from "../../services/license/PaymentService";
import { LicensePlanId, InvoiceRecord, SubscriptionCycleType } from "../../types/license";
import {
  CreditCard,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Building2,
  Receipt,
  FileText,
  AlertCircle,
  X,
  Send,
  Calendar,
  Check,
  Shield,
} from "lucide-react";

export const CustomerSubscriptionModule: React.FC = () => {
  const { currentLicense, currentSubscription, currentPlanDef, renewLicense } = useLicense();
  const { company } = useAuth();

  const [activeCycleTab, setActiveCycleTab] = useState<SubscriptionCycleType>("YEARLY");
  const [selectedPlanForUpgrade, setSelectedPlanForUpgrade] = useState<LicensePlanId | null>(null);
  const [createdInvoice, setCreatedInvoice] = useState<InvoiceRecord | null>(null);
  const [loadingInvoice, setLoadingInvoice] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const handleGenerateInvoice = async (planId: LicensePlanId) => {
    setLoadingInvoice(true);
    try {
      const plan = SUBSCRIPTION_PLANS[planId];
      let amount = plan.priceAnnualIDR;
      if (activeCycleTab === "MONTHLY") amount = plan.priceMonthlyIDR;
      else if (activeCycleTab === "QUARTERLY") amount = plan.priceQuarterlyIDR;
      else if (activeCycleTab === "ENTERPRISE") amount = plan.priceEnterpriseIDR;

      const inv = await paymentService.createInvoice({
        companyId: company.id,
        companyName: company.name || "PT Batubara Nusa Utama",
        subscriptionId: currentSubscription?.id || "SUB-01",
        planId,
        amountIDR: amount,
      });
      setCreatedInvoice(inv);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingInvoice(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Subscription Status Header */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-[#0B1220] to-slate-900 p-6 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-400 border border-emerald-500/30 uppercase tracking-widest">
              PAKET SUBSKRIPSI SAAT INI
            </span>
            <span className="rounded bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/30">
              Siklus: {currentLicense.billingCycle || "YEARLY"}
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1">
            {currentPlanDef.displayName}
          </h1>
          <p className="text-xs text-slate-400">
            Biaya Subskripsi: <span className="text-emerald-400 font-bold">Rp {currentPlanDef.priceAnnualIDR.toLocaleString("id-ID")} / Tahun</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => renewLicense(12)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Perpanjang Paket Ini</span>
          </button>
        </div>
      </div>

      {/* Cycle Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-black text-white tracking-tight">Pilih Siklus & Paket Subskripsi</h2>
          <p className="text-xs text-slate-400">Pilih durasi penagihan yang paling sesuai dengan roadmap tambang Anda.</p>
        </div>

        <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveCycleTab("MONTHLY")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeCycleTab === "MONTHLY"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setActiveCycleTab("QUARTERLY")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeCycleTab === "QUARTERLY"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Quarterly (-7%)
          </button>
          <button
            onClick={() => setActiveCycleTab("YEARLY")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeCycleTab === "YEARLY"
                ? "bg-emerald-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Yearly (Hemat 2 Bln)
          </button>
          <button
            onClick={() => setActiveCycleTab("ENTERPRISE")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeCycleTab === "ENTERPRISE"
                ? "bg-teal-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Enterprise Dedicated
          </button>
        </div>
      </div>

      {/* Plan Pricing & Feature Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.values(SUBSCRIPTION_PLANS).map((plan) => {
          const isCurrent = currentLicense.planId === plan.planId;

          let displayPrice = plan.priceAnnualIDR;
          let suffix = "Juta / Tahun";
          if (activeCycleTab === "MONTHLY") {
            displayPrice = plan.priceMonthlyIDR;
            suffix = "Juta / Bulan";
          } else if (activeCycleTab === "QUARTERLY") {
            displayPrice = plan.priceQuarterlyIDR;
            suffix = "Juta / Kuartal (3 Bln)";
          } else if (activeCycleTab === "ENTERPRISE") {
            displayPrice = plan.priceEnterpriseIDR;
            suffix = "Juta / Tahun SLA";
          }

          return (
            <div
              key={plan.planId}
              className={`rounded-2xl border p-5 flex flex-col justify-between space-y-5 transition-all ${
                isCurrent
                  ? "border-emerald-500/50 bg-slate-900/90 ring-1 ring-emerald-500/30 shadow-xl shadow-emerald-500/10"
                  : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-white uppercase tracking-wider">{plan.displayName}</span>
                  {isCurrent && (
                    <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-400 border border-emerald-500/30">
                      PAKET AKTIF
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed min-h-[36px]">
                  {plan.tagline}
                </p>

                <div className="pt-2 border-t border-slate-800">
                  <span className="text-2xl font-black text-white">
                    Rp {(displayPrice / 1000000).toLocaleString("id-ID")}
                  </span>
                  <span className="text-xs text-slate-400"> {suffix}</span>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Siklus terpilih: <span className="text-amber-400 font-bold">{activeCycleTab}</span>
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-800 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>{plan.maxUsers} Users Terdaftar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>{plan.maxSites} Active Mining Site</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>{plan.maxDevices} Bound Devices</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>{plan.aiMonthlyQuota.toLocaleString("id-ID")} AI Requests/Bulan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>{plan.storageGB} GB Cloud Storage</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedPlanForUpgrade(plan.planId);
                  handleGenerateInvoice(plan.planId);
                }}
                className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all cursor-pointer ${
                  isCurrent
                    ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    : "bg-gradient-to-r from-emerald-500 to-amber-500 text-slate-950 hover:brightness-110 shadow-lg shadow-emerald-500/20"
                }`}
              >
                <Receipt className="h-4 w-4" />
                <span>{isCurrent ? "Perpanjang / Invoice" : "Pilih / Upgrade"}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Invoice Modal */}
      {createdInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="max-w-xl w-full rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => {
                setCreatedInvoice(null);
                setPaymentConfirmed(false);
              }}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                <Receipt className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">Invoice Subskripsi Diterbitkan</h3>
                <p className="text-xs text-slate-400">{createdInvoice.invoiceNumber}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Perusahaan:</span>
                  <span className="font-bold text-white">{createdInvoice.companyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Paket Subskripsi:</span>
                  <span className="font-bold text-amber-400">{createdInvoice.planId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Siklus:</span>
                  <span className="font-bold text-teal-400">{activeCycleTab}</span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-2 text-sm font-bold">
                  <span className="text-slate-300">Total Tagihan (IDR):</span>
                  <span className="text-emerald-400">Rp {createdInvoice.amountIDR.toLocaleString("id-ID")}</span>
                </div>
              </div>

              {/* Bank Transfer Details */}
              <div className="rounded-xl bg-amber-500/10 p-4 border border-amber-500/30 text-amber-300 space-y-2">
                <p className="font-bold text-amber-200">Instruksi Pembayaran Transfer Bank (IDR):</p>
                <div className="text-[11px] space-y-1">
                  <div>Bank: <span className="font-bold text-white">{createdInvoice.bankTransferDetails?.bankName}</span></div>
                  <div>No. Rekening: <span className="font-bold text-emerald-300 font-mono text-xs">{createdInvoice.bankTransferDetails?.accountNumber}</span></div>
                  <div>Atas Nama: <span className="font-bold text-white">{createdInvoice.bankTransferDetails?.accountName}</span></div>
                </div>
              </div>

              {paymentConfirmed && (
                <div className="rounded-xl bg-emerald-500/20 p-3 border border-emerald-500/30 text-emerald-400 font-bold flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  <span>Konfirmasi Pembayaran Diterima! Tim Billing memproses aktivasi.</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setPaymentConfirmed(true);
                  setTimeout(() => {
                    setCreatedInvoice(null);
                    setPaymentConfirmed(false);
                  }, 2000);
                }}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:brightness-110 cursor-pointer"
              >
                <Send className="h-4 w-4" />
                <span>Kirim Bukti Pembayaran</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
