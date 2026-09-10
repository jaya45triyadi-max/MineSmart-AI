import React, { useState } from "react";
import {
  DollarSign,
  Search,
  Filter,
  Plus,
  TrendingUp,
  FileText,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Scale,
} from "lucide-react";
import { SalesRevenue } from "../../../types/salesTypes";

interface RevenueTabProps {
  revenues: SalesRevenue[];
}

export const RevenueTab: React.FC<RevenueTabProps> = ({ revenues }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const totalGrossUSD = revenues.reduce((sum, r) => sum + r.grossRevenue, 0);
  const totalNetUSD = revenues.reduce((sum, r) => sum + r.netRevenue, 0);
  const totalAdjustmentsUSD = revenues.reduce((sum, r) => sum + (r.netRevenue - r.grossRevenue), 0);

  const filteredRevenues = revenues.filter((r) =>
    r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.invoiceReference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.revenueCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-emerald-500" />
          Commercial Revenue, Pricing Engine & Quality Adjustments
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Automatic pricing calculations: Base Price + GCV Adjustments - Ash/Moisture Penalties = Final Net Commercial Revenue.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold uppercase text-slate-500">Total Gross Sales</span>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            USD ${(totalGrossUSD / 1000000).toFixed(3)}M
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">Contracted Base Price Revenue</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold uppercase text-slate-500">Quality Bonus / Penalties</span>
          <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            +USD ${(totalAdjustmentsUSD / 1000).toFixed(1)}k
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">Net Quality Bonus Adjustments</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold uppercase text-slate-500">Final Net Invoiced Revenue</span>
          <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            USD ${(totalNetUSD / 1000000).toFixed(3)}M
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">Recognized Commercial Revenue</p>
        </div>
      </div>

      {/* Revenue Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <input
            type="text"
            placeholder="Filter revenue entries by customer, invoice reference..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-80 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 uppercase font-bold border-b border-slate-200 dark:border-slate-800 text-[10px] tracking-wider">
              <tr>
                <th className="p-3.5">Invoice / Revenue Code</th>
                <th className="p-3.5">Customer & Contract</th>
                <th className="p-3.5">Billed Quantity</th>
                <th className="p-3.5">Base Price</th>
                <th className="p-3.5">Quality Adjustments</th>
                <th className="p-3.5">Final Net Revenue</th>
                <th className="p-3.5">Payment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredRevenues.map((rev) => (
                <tr key={rev.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/50">
                  <td className="p-3.5">
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100 block">
                      {rev.revenueCode}
                    </span>
                    <span className="text-[10px] text-slate-500">{rev.invoiceReference}</span>
                  </td>
                  <td className="p-3.5">
                    <span className="font-bold text-slate-900 dark:text-slate-100 block">{rev.customerName}</span>
                    <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">{rev.contractNumber}</span>
                  </td>
                  <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100">
                    {rev.quantity.toLocaleString("id-ID")} MT
                  </td>
                  <td className="p-3.5">
                    ${rev.basePrice.toFixed(2)}/MT
                  </td>
                  <td className="p-3.5">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      +${rev.gcvAdjustment.toFixed(2)}/MT
                    </span>
                    <span className="text-[10px] text-slate-500 block">(GCV Bonus)</span>
                  </td>
                  <td className="p-3.5">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm block">
                      ${rev.netRevenue.toLocaleString("id-ID")} USD
                    </span>
                    <span className="text-[10px] text-slate-500">${rev.finalPrice.toFixed(2)}/MT</span>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        rev.status === "PAID"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                      }`}
                    >
                      {rev.status}
                    </span>
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
