// MINE SMART AI - Operating Expenses (OPEX) Management Tab
import React, { useState } from "react";
import { TrendingDown, Plus, Search, Filter, Layers, DollarSign } from "lucide-react";
import { OpexRecord, CostCategory, CostCenter, ChartOfAccount } from "../../../types/financeTypes";

interface OpexManagementTabProps {
  opexList: OpexRecord[];
  costCenters: CostCenter[];
  accounts: ChartOfAccount[];
  onSaveOpex: (opex: OpexRecord) => Promise<void>;
}

export const OpexManagementTab: React.FC<OpexManagementTabProps> = ({
  opexList,
  costCenters,
  accounts,
  onSaveOpex,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState<Partial<OpexRecord>>({
    category: "Fuel",
    costCenterId: costCenters[0]?.costCenterId || "CC-HAUL-01",
    accountId: "COA-5100",
    vendorName: "",
    description: "",
    amountIDR: 10000000,
    date: new Date().toISOString().split("T")[0],
    status: "APPROVED",
  });

  const categories: CostCategory[] = [
    "Fuel",
    "Lubricant",
    "Maintenance",
    "Spare Parts",
    "Labor",
    "Contractor",
    "Hauling",
    "Equipment",
    "Plant",
    "Power",
    "Water",
    "HSE",
    "Environment",
    "Reclamation",
    "Overhead",
    "Logistics",
    "Port",
    "Shipping",
    "Other",
  ];

  const formatIDR = (val: number) => `Rp ${val.toLocaleString("id-ID")}`;

  const filteredOpex = opexList.filter((o) => {
    const matchesSearch =
      o.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.vendorName && o.vendorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      o.costCenterName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "ALL" || o.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalOpexFiltered = filteredOpex.reduce((acc, o) => acc + o.amountIDR, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedCC = costCenters.find((c) => c.costCenterId === formData.costCenterId);
    const selectedAcc = accounts.find((a) => a.accountId === formData.accountId) || {
      accountCode: "5000",
      accountName: "Beban Operasional Tambang",
    };

    const opexToSave: OpexRecord = {
      id: `OPX-${Date.now()}`,
      expenseId: `OPX-${Date.now()}`,
      date: formData.date || new Date().toISOString().split("T")[0],
      accountId: formData.accountId || "COA-5000",
      accountCode: selectedAcc.accountCode,
      accountName: selectedAcc.accountName,
      costCenterId: formData.costCenterId || "CC-HAUL-01",
      costCenterName: selectedCC ? selectedCC.name : "Mining Operation",
      category: (formData.category as CostCategory) || "Fuel",
      siteId: "SITE-KAL-A",
      vendorName: formData.vendorName || "Vendor Tambang",
      description: formData.description || "Pengeluaran Beban Operasional Site",
      amountIDR: Number(formData.amountIDR) || 0,
      status: formData.status || "APPROVED",
      companyId: "COMP-BNU-01",
    };

    await onSaveOpex(opexToSave);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari deskripsi, vendor, cost center..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto">
            <button
              onClick={() => setSelectedCategory("ALL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                selectedCategory === "ALL" ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Semua Kategori ({opexList.length})
            </button>
            {categories.slice(0, 6).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  selectedCategory === cat ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="w-full md:w-auto px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition"
        >
          <Plus className="w-4 h-4" />
          Catat Pengeluaran OPEX Baru
        </button>
      </div>

      {/* OPEX Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Buku Ledger Biaya Operasional (OPEX Ledger)</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Total Filtered OPEX: <strong className="text-amber-400">{formatIDR(totalOpexFiltered)}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
              <tr>
                <th className="p-3">Tanggal</th>
                <th className="p-3">Kategori OPEX</th>
                <th className="p-3">Cost Center & Site</th>
                <th className="p-3">Kode COA</th>
                <th className="p-3">Vendor / Pihak Ke-3</th>
                <th className="p-3">Deskripsi Transaksi</th>
                <th className="p-3 text-right">Jumlah Biaya IDR</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredOpex.map((o) => (
                <tr key={o.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-mono text-slate-400">{o.date}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {o.category}
                    </span>
                  </td>
                  <td className="p-3 font-medium text-white">{o.costCenterName}</td>
                  <td className="p-3 font-mono text-slate-400">{o.accountCode}</td>
                  <td className="p-3 text-slate-300 font-medium">{o.vendorName || "Internal"}</td>
                  <td className="p-3 text-slate-200">{o.description}</td>
                  <td className="p-3 text-right font-mono font-black text-amber-400 text-sm">
                    {formatIDR(o.amountIDR)}
                  </td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[10px] font-black uppercase border border-emerald-500/30">
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add OPEX Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <h3 className="text-base font-bold text-white">Catat Pengeluaran Beban OPEX Baru</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300">Tanggal Transaksi</label>
                  <input
                    type="date"
                    required
                    value={formData.date || ""}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300">Kategori Biaya</label>
                  <select
                    value={formData.category || "Fuel"}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as CostCategory })}
                    className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300">Cost Center</label>
                  <select
                    value={formData.costCenterId || ""}
                    onChange={(e) => setFormData({ ...formData, costCenterId: e.target.value })}
                    className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    {costCenters.map((cc) => (
                      <option key={cc.costCenterId} value={cc.costCenterId}>
                        {cc.name} ({cc.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300">Akun COA</label>
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
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Vendor / Pihak Ke-3 (Opsional)</label>
                <input
                  type="text"
                  placeholder="Contoh: PT Pertamina Patra Niaga"
                  value={formData.vendorName || ""}
                  onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                  className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Deskripsi Pengeluaran</label>
                <input
                  type="text"
                  required
                  placeholder="Detail kegiatan operasional"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Jumlah Biaya (IDR)</label>
                <input
                  type="number"
                  required
                  value={formData.amountIDR || ""}
                  onChange={(e) => setFormData({ ...formData, amountIDR: Number(e.target.value) })}
                  className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono text-sm font-bold"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
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
                  Simpan OPEX
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
