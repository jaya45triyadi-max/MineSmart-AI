// MINE SMART AI - Finance Settings, Tax, Currency & Fiscal Period Tab
import React from "react";
import { Settings, DollarSign, Shield, Lock, Layers, CheckCircle2, ShieldCheck } from "lucide-react";
import { FinanceTaxCode, CurrencyRate, FinancialPeriod, CostCenter } from "../../../types/financeTypes";

interface FinanceSettingsTabProps {
  taxCodes: FinanceTaxCode[];
  currencyRates: CurrencyRate[];
  periods: FinancialPeriod[];
  costCenters: CostCenter[];
}

export const FinanceSettingsTab: React.FC<FinanceSettingsTabProps> = ({
  taxCodes,
  currencyRates,
  periods,
  costCenters,
}) => {
  return (
    <div className="space-y-6">
      {/* Fiscal Period Management Card */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Lock className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-white">Manajemen Periode Fiskal (Fiscal Period Control & Period Lock)</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
              <tr>
                <th className="p-3">ID Periode</th>
                <th className="p-3">Nama Periode</th>
                <th className="p-3">Tanggal Mulai</th>
                <th className="p-3">Tanggal Selesai</th>
                <th className="p-3 text-center">Status Lock Periode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
              {periods.map((p) => (
                <tr key={p.id}>
                  <td className="p-3 text-amber-400 font-bold">{p.periodId}</td>
                  <td className="p-3 text-white font-sans">{p.periodName}</td>
                  <td className="p-3 text-slate-400">{p.startDate}</td>
                  <td className="p-3 text-slate-400">{p.endDate}</td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2.5 py-1 rounded text-[10px] font-black uppercase ${
                        p.status === "OPEN"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tax Architecture & Currency Exchange Rates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Currency Rates */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Multi-Currency Exchange Rates</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                <tr>
                  <th className="p-2.5">Mata Uang</th>
                  <th className="p-2.5">Kurs Terhadap IDR</th>
                  <th className="p-2.5">Tanggal Efektif</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {currencyRates.map((c) => (
                  <tr key={c.currencyCode}>
                    <td className="p-2.5 font-bold text-amber-400">{c.currencyCode} - {c.currencyName}</td>
                    <td className="p-2.5 text-white font-bold">Rp {c.exchangeRateToIDR.toLocaleString("id-ID")}</td>
                    <td className="p-2.5 text-slate-400">{c.effectiveDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tax Architecture */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Master Tarif Pajak & Royalti ESDM</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                <tr>
                  <th className="p-2.5">Kode Pajak</th>
                  <th className="p-2.5">Nama & Tipe</th>
                  <th className="p-2.5 font-mono text-right">Tarif (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {taxCodes.map((t) => (
                  <tr key={t.code}>
                    <td className="p-2.5 font-mono font-bold text-amber-400">{t.code}</td>
                    <td className="p-2.5 font-medium text-white">{t.name}</td>
                    <td className="p-2.5 font-mono font-bold text-right text-emerald-400">{t.ratePct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* RBAC & Entitlement Status Panel */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl p-5 space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Shield className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-white">Hak Akses Modul Finance (RBAC & Entitlement Entitlements)</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {[
            "finance.view",
            "finance.dashboard",
            "finance.revenue",
            "finance.opex",
            "finance.capex",
            "finance.budget",
            "finance.cashflow",
            "finance.ar",
            "finance.ap",
            "finance.asset",
            "finance.depreciation",
            "finance.journal",
            "finance.post",
            "finance.approve",
            "finance.close_period",
            "finance.reports",
          ].map((perm) => (
            <div key={perm} className="p-2 bg-slate-950 rounded-lg border border-slate-800 text-slate-300 font-mono text-[11px] flex items-center justify-between">
              <span>{perm}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
