// MINE SMART AI - Dynamic Pricing Plans & Feature Entitlements Matrix Console
// PROMPT 36: Dynamic Pricing Editor, Quota Limits & Feature Entitlements Matrix

import React, { useState } from "react";
import {
  DollarSign,
  Check,
  X,
  Sparkles,
  Save,
  CheckCircle2,
  Sliders,
  Shield,
  Layers,
} from "lucide-react";
import {
  PlatformConfig,
  PricingPlanConfig,
} from "../../../types/developerControlPanelTypes";
import { platformConfigService } from "../../../services/config/PlatformConfigService";

interface PricingMatrixManagerViewProps {
  config: PlatformConfig;
  onRefresh: () => void;
}

export const PricingMatrixManagerView: React.FC<PricingMatrixManagerViewProps> = ({
  config,
  onRefresh,
}) => {
  const [plansDraft, setPlansDraft] = useState<PricingPlanConfig[]>([...config.pricingPlans]);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleUpdatePrice = (planId: string, field: keyof PricingPlanConfig, val: any) => {
    setPlansDraft((prev) =>
      prev.map((p) => (p.planId === planId ? { ...p, [field]: val } : p))
    );
  };

  const handleSavePricing = async () => {
    await platformConfigService.publishConfig(
      { pricingPlans: plansDraft },
      "Triyadi Jaya",
      "jaya45triyadi@gmail.com",
      "Pembaruan Harga Paket & Matriks Fitur Lisensi"
    );
    setActionSuccessMessage(
      "✅ Konfigurasi harga paket dan kuota lisensi berhasil dipublikasikan!"
    );
    onRefresh();
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-purple-400" />
            <span>Dynamic Pricing & Feature Entitlements Matrix</span>
          </h2>
          <p className="text-xs text-slate-400">
            Atur skema harga berlangganan bulanan/tahunan, kuota pemakaian AI, kapasitas storage, dan matriks hak fitur per tier secara dinamis.
          </p>
        </div>

        <button
          onClick={handleSavePricing}
          className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-lg shadow-purple-600/25 transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Publish Dynamic Pricing</span>
        </button>
      </div>

      {actionSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Pricing Cards Editor */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plansDraft.map((plan) => {
          const isEnterprise = plan.planId === "ENTERPRISE";
          const isPro = plan.planId === "PROFESSIONAL";

          return (
            <div
              key={plan.planId}
              className={`rounded-3xl p-6 border transition-all flex flex-col justify-between space-y-5 ${
                isEnterprise
                  ? "bg-slate-900/95 border-purple-500/50 shadow-xl shadow-purple-500/10 text-white"
                  : isPro
                  ? "bg-slate-900/90 border-cyan-500/40 shadow-lg text-white"
                  : "bg-slate-900/90 border-slate-800 text-white shadow-lg"
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {plan.badge || plan.planId}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">ID: {plan.planId}</span>
                </div>

                <div>
                  <h3 className="text-lg font-black">{plan.displayName}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{plan.tagline}</p>
                </div>

                {/* Price Inputs */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">
                      Harga Bulanan (IDR)
                    </label>
                    <input
                      type="number"
                      value={plan.priceMonthlyIDR}
                      onChange={(e) =>
                        handleUpdatePrice(plan.planId, "priceMonthlyIDR", Number(e.target.value))
                      }
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono font-bold text-emerald-400 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">
                      Harga Tahunan (IDR)
                    </label>
                    <input
                      type="number"
                      value={plan.priceAnnualIDR}
                      onChange={(e) =>
                        handleUpdatePrice(plan.planId, "priceAnnualIDR", Number(e.target.value))
                      }
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono font-bold text-purple-400 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* Limits */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Maks Users:</span>
                    <input
                      type="number"
                      value={plan.maxUsers}
                      onChange={(e) =>
                        handleUpdatePrice(plan.planId, "maxUsers", Number(e.target.value))
                      }
                      className="w-full px-2 py-1 bg-slate-950 border border-slate-800 rounded text-xs font-mono font-bold text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Maks Sites:</span>
                    <input
                      type="number"
                      value={plan.maxSites}
                      onChange={(e) =>
                        handleUpdatePrice(plan.planId, "maxSites", Number(e.target.value))
                      }
                      className="w-full px-2 py-1 bg-slate-950 border border-slate-800 rounded text-xs font-mono font-bold text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Storage GB:</span>
                    <input
                      type="number"
                      value={plan.storageGB}
                      onChange={(e) =>
                        handleUpdatePrice(plan.planId, "storageGB", Number(e.target.value))
                      }
                      className="w-full px-2 py-1 bg-slate-950 border border-slate-800 rounded text-xs font-mono font-bold text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">AI Calls/Bln:</span>
                    <input
                      type="number"
                      value={plan.aiMonthlyQuota}
                      onChange={(e) =>
                        handleUpdatePrice(plan.planId, "aiMonthlyQuota", Number(e.target.value))
                      }
                      className="w-full px-2 py-1 bg-slate-950 border border-slate-800 rounded text-xs font-mono font-bold text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-3">
                SLA Support: <strong className="text-white">{plan.supportSLA}</strong>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature Entitlements Matrix Table */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3">
          Feature Entitlement Matrix Across Subscription Tiers
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase">
                <th className="py-3 px-4">Modul / Kapabilitas Utama</th>
                <th className="py-3 px-4 text-center">Starter</th>
                <th className="py-3 px-4 text-center">Professional</th>
                <th className="py-3 px-4 text-center">Enterprise Dedicated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {[
                { name: "Live Operations & Production Dashboard", starter: true, pro: true, ent: true },
                { name: "AI Mining Copilot Natural Language Assistant", starter: true, pro: true, ent: true },
                { name: "GIS Fleet GPS Tracking & Spatial Map", starter: false, pro: true, ent: true },
                { name: "AI Root Cause Analysis (RCA 5-Why Engine)", starter: false, pro: true, ent: true },
                { name: "AI Mine Planning & Pit Sequencing Assistant", starter: false, pro: true, ent: true },
                { name: "AI Coal Quality Blending & Lab Analysis", starter: false, pro: true, ent: true },
                { name: "3D Pit Digital Twin & Topographic Slicing", starter: false, pro: false, ent: true },
                { name: "AI Predictive Maintenance & Vibration Radar", starter: false, pro: false, ent: true },
                { name: "AI Fuel Loss & Siphon Theft Detector", starter: true, pro: true, ent: true },
                { name: "1-Click Executive PDF/Excel Boardroom Generator", starter: false, pro: true, ent: true },
                { name: "Multi-Company Holding Console & ERP/SCADA Sync", starter: false, pro: false, ent: true },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-semibold text-slate-200">
                    {row.name}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.starter ? (
                      <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-500 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.pro ? (
                      <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-500 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.ent ? (
                      <Check className="w-4 h-4 text-purple-400 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-500 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
