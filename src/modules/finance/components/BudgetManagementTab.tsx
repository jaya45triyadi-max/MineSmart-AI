// MINE SMART AI - Budget Management, Control & Variance Analysis Tab
import React, { useState } from "react";
import { PieChart, Plus, Search, AlertCircle, CheckCircle2, TrendingDown, TrendingUp, ShieldAlert } from "lucide-react";
import { BudgetRecord, CostCenter, ChartOfAccount } from "../../../types/financeTypes";

interface BudgetManagementTabProps {
  budgets: BudgetRecord[];
  costCenters: CostCenter[];
  accounts: ChartOfAccount[];
  onSaveBudget: (budget: BudgetRecord) => Promise<void>;
}

export const BudgetManagementTab: React.FC<BudgetManagementTabProps> = ({
  budgets,
  costCenters,
  accounts,
  onSaveBudget,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState<Partial<BudgetRecord>>({
    fiscalYear: 2026,
    period: "MONTHLY",
    periodName: "2026-08",
    costCenterId: costCenters[0]?.costCenterId || "CC-HAUL-01",
    accountId: "COA-5100",
    budgetAmountIDR: 1000000000,
    status: "APPROVED",
  });

  const formatIDR = (val: number) => `Rp ${val.toLocaleString("id-ID")}`;

  const filteredBudgets = budgets.filter((b) => {
    const ccName = b.costCenterName || "";
    const accName = b.accountName || "";
    return (
      ccName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      accName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.accountCode.includes(searchTerm)
    );
  });

  const totalBudget = budgets.reduce((acc, b) => acc + b.budgetAmountIDR, 0);
  const totalActual = budgets.reduce((acc, b) => acc + b.actualAmountIDR, 0);
  const totalVariance = totalActual - totalBudget;
  const totalVariancePct = totalBudget > 0 ? (totalVariance / totalBudget) * 100 : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedCC = costCenters.find((c) => c.costCenterId === formData.costCenterId);
    const selectedAcc = accounts.find((a) => a.accountId === formData.accountId) || {
      accountCode: "5100",
      accountName: "Biaya Bahan Bakar Fuel",
    };

    const budgetAmt = Number(formData.budgetAmountIDR) || 0;
    const actualAmt = 0;
    const variance = actualAmt - budgetAmt;
    const variancePct = budgetAmt > 0 ? (variance / budgetAmt) * 100 : 0;

    const newBudget: BudgetRecord = {
      id: `BDG-${Date.now()}`,
      budgetId: `BDG-${Date.now()}`,
      fiscalYear: Number(formData.fiscalYear) || 2026,
      period: (formData.period as any) || "MONTHLY",
      periodName: formData.periodName || "2026-08",
      companyId: "COMP-BNU-01",
      siteId: "SITE-KAL-A",
      departmentId: selectedCC ? selectedCC.departmentId : "DEP-MINING",
      departmentName: selectedCC ? selectedCC.departmentName : "Mining Production",
      costCenterId: formData.costCenterId || "CC-HAUL-01",
      costCenterName: selectedCC ? selectedCC.name : "Coal Hauling",
      accountId: formData.accountId || "COA-5100",
      accountCode: selectedAcc.accountCode,
      accountName: selectedAcc.accountName,
      budgetAmountIDR: budgetAmt,
      actualAmountIDR: actualAmt,
      varianceIDR: variance,
      variancePct: Number(variancePct.toFixed(2)),
      controlStatus: "WITHIN_BUDGET",
      status: "APPROVED",
    };

    await onSaveBudget(newBudget);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Total Anggaran (Budget)</div>
          <div className="text-base font-black text-slate-100 mt-1">{formatIDR(totalBudget)}</div>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Realisasi Biaya (Actual)</div>
          <div className="text-base font-black text-amber-400 mt-1">{formatIDR(totalActual)}</div>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Budget Variance IDR</div>
          <div className={`text-base font-black mt-1 ${totalVariance <= 0 ? "text-emerald-400" : "text-rose-400"}`}>
            {formatIDR(totalVariance)}
          </div>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Variance %</div>
          <div className={`text-base font-black mt-1 ${totalVariance <= 0 ? "text-emerald-400" : "text-rose-400"}`}>
            {totalVariancePct.toFixed(2)}% ({totalVariance <= 0 ? "Savings" : "Over Budget"})
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4 shadow-xl">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari Cost Center atau Akun Anggaran..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition"
        >
          <Plus className="w-4 h-4" />
          Set/Update Budget Baru
        </button>
      </div>

      {/* Budget Matrix Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Matriks Pengendalian Budget vs Actual (Budget Control Matrix)</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Periode Operasional: 2026-08</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
              <tr>
                <th className="p-3">Cost Center & Departemen</th>
                <th className="p-3">Akun Anggaran (COA)</th>
                <th className="p-3">Budget (Pagu) IDR</th>
                <th className="p-3">Actual IDR</th>
                <th className="p-3">Variance IDR</th>
                <th className="p-3">Variance %</th>
                <th className="p-3 text-center">Status Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredBudgets.map((b) => {
                const isOver = b.actualAmountIDR > b.budgetAmountIDR;
                return (
                  <tr key={b.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3">
                      <div className="font-bold text-white">{b.costCenterName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{b.departmentName}</div>
                    </td>
                    <td className="p-3 font-mono">
                      <div className="font-bold text-amber-400">{b.accountCode}</div>
                      <div className="text-[10px] text-slate-300">{b.accountName}</div>
                    </td>
                    <td className="p-3 font-mono text-slate-200">{formatIDR(b.budgetAmountIDR)}</td>
                    <td className="p-3 font-mono font-bold text-amber-400">{formatIDR(b.actualAmountIDR)}</td>
                    <td className={`p-3 font-mono font-bold ${isOver ? "text-rose-400" : "text-emerald-400"}`}>
                      {formatIDR(b.varianceIDR)}
                    </td>
                    <td className={`p-3 font-mono font-bold ${isOver ? "text-rose-400" : "text-emerald-400"}`}>
                      {b.variancePct}%
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          b.controlStatus === "OVER_BUDGET"
                            ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                            : b.controlStatus === "NEAR_LIMIT"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        }`}
                      >
                        {b.controlStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Budget Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Alokasi Budget Anggaran Baru</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300">Cost Center</label>
                <select
                  value={formData.costCenterId || ""}
                  onChange={(e) => setFormData({ ...formData, costCenterId: e.target.value })}
                  className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {costCenters.map((cc) => (
                    <option key={cc.costCenterId} value={cc.costCenterId}>
                      {cc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Akun Anggaran (COA)</label>
                <select
                  value={formData.accountId || "COA-5100"}
                  onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                  className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {accounts
                    .filter((a) => a.accountType === "EXPENSE")
                    .map((a) => (
                      <option key={a.accountId} value={a.accountId}>
                        {a.accountCode} - {a.accountName}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Besar Pagu Budget (IDR)</label>
                <input
                  type="number"
                  required
                  value={formData.budgetAmountIDR || ""}
                  onChange={(e) => setFormData({ ...formData, budgetAmountIDR: Number(e.target.value) })}
                  className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono text-sm font-bold"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 text-slate-950 font-black rounded-xl text-xs hover:bg-amber-600 transition"
                >
                  Simpan Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
