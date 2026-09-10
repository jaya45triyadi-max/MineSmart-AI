// MINE SMART AI - Cash Flow Management Tab
import React from "react";
import { Wallet, ArrowDownRight, ArrowUpRight, Calendar, DollarSign, Activity } from "lucide-react";
import { CashFlowRecord } from "../../../types/financeTypes";

interface CashFlowTabProps {
  cashFlows: CashFlowRecord[];
}

export const CashFlowTab: React.FC<CashFlowTabProps> = ({ cashFlows }) => {
  const formatIDR = (val: number) => `Rp ${val.toLocaleString("id-ID")}`;

  const inflows = cashFlows.filter((c) => c.direction === "INFLOW");
  const outflows = cashFlows.filter((c) => c.direction === "OUTFLOW");

  const totalInflow = inflows.reduce((acc, c) => acc + c.amountIDR, 0);
  const totalOutflow = outflows.reduce((acc, c) => acc + c.amountIDR, 0);
  const netCashFlow = totalInflow - totalOutflow;

  const operatingCash = cashFlows.filter((c) => c.type === "OPERATING");
  const investingCash = cashFlows.filter((c) => c.type === "INVESTING");
  const financingCash = cashFlows.filter((c) => c.type === "FINANCING");

  const getSubtotal = (items: CashFlowRecord[]) =>
    items.reduce((acc, c) => acc + (c.direction === "INFLOW" ? c.amountIDR : -c.amountIDR), 0);

  return (
    <div className="space-y-6">
      {/* Top Cash Balance Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Saldo Kas Awal (Opening Cash)</div>
          <div className="text-base font-black text-slate-100 mt-1">Rp 48.500.000.000</div>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Total Arus Kas Masuk (Inflow)</div>
          <div className="text-base font-black text-emerald-400 mt-1">{formatIDR(totalInflow)}</div>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Total Arus Kas Keluar (Outflow)</div>
          <div className="text-base font-black text-rose-400 mt-1">{formatIDR(totalOutflow)}</div>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Net Cash Flow Periode Berjalan</div>
          <div className={`text-base font-black mt-1 ${netCashFlow >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
            {formatIDR(netCashFlow)}
          </div>
        </div>
      </div>

      {/* Cash Flow Statement Breakdown by Activity */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden p-5 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <Wallet className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-white">Laporan Arus Kas Operasional (Statement of Cash Flows)</h3>
        </div>

        <div className="space-y-6 text-xs">
          {/* Section 1: Operating Activities */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <span className="font-extrabold text-amber-400 uppercase text-[11px]">
                1. Arus Kas dari Aktivitas Operasional (Operating Cash Flow)
              </span>
              <span className="font-mono font-bold text-white text-sm">{formatIDR(getSubtotal(operatingCash))}</span>
            </div>
            <div className="space-y-2 pl-4">
              {operatingCash.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-slate-300">
                  <div className="flex items-center gap-2">
                    {item.direction === "INFLOW" ? (
                      <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
                    )}
                    <span>{item.description}</span>
                  </div>
                  <span
                    className={`font-mono font-bold ${
                      item.direction === "INFLOW" ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {item.direction === "INFLOW" ? `+ ${formatIDR(item.amountIDR)}` : `- ${formatIDR(item.amountIDR)}`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Investing Activities */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <span className="font-extrabold text-amber-400 uppercase text-[11px]">
                2. Arus Kas dari Aktivitas Investasi (Investing Cash Flow / CAPEX)
              </span>
              <span className="font-mono font-bold text-white text-sm">{formatIDR(getSubtotal(investingCash))}</span>
            </div>
            <div className="space-y-2 pl-4">
              {investingCash.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-slate-300">
                  <div className="flex items-center gap-2">
                    <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
                    <span>{item.description}</span>
                  </div>
                  <span className="font-mono font-bold text-rose-400">- {formatIDR(item.amountIDR)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Closing Cash Summary */}
          <div className="pt-4 border-t-2 border-slate-700 flex items-center justify-between text-sm">
            <span className="font-extrabold text-white uppercase">Saldo Kas Akhir (Closing Cash Position)</span>
            <span className="font-mono font-black text-indigo-400 text-base">
              {formatIDR(48500000000 + netCashFlow)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
