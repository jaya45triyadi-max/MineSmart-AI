// MINE SMART AI - Chart of Accounts (COA) Management Tab
import React, { useState } from "react";
import { Plus, Search, Filter, Layers, CheckCircle2, AlertCircle, Edit, FolderTree } from "lucide-react";
import { ChartOfAccount, AccountCategoryType } from "../../../types/financeTypes";

interface ChartOfAccountsTabProps {
  accounts: ChartOfAccount[];
  onSaveAccount: (account: ChartOfAccount) => Promise<void>;
}

export const ChartOfAccountsTab: React.FC<ChartOfAccountsTabProps> = ({ accounts, onSaveAccount }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<ChartOfAccount | null>(null);

  const [formData, setFormData] = useState<Partial<ChartOfAccount>>({
    accountCode: "",
    accountName: "",
    accountType: "EXPENSE",
    parentAccountId: "",
    level: 2,
    normalBalance: "DEBIT",
    isActive: true,
  });

  const categories: AccountCategoryType[] = ["ASSET", "LIABILITY", "EQUITY", "REVENUE", "EXPENSE"];

  const filteredAccounts = accounts.filter((a) => {
    const matchesSearch =
      a.accountCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.accountName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "ALL" || a.accountType === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEditClick = (acc: ChartOfAccount) => {
    setEditingAccount(acc);
    setFormData(acc);
    setShowAddModal(true);
  };

  const handleCreateClick = () => {
    setEditingAccount(null);
    setFormData({
      accountCode: "",
      accountName: "",
      accountType: "EXPENSE",
      parentAccountId: "",
      level: 2,
      normalBalance: "DEBIT",
      isActive: true,
    });
    setShowAddModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.accountCode || !formData.accountName) return;

    const accountToSave: ChartOfAccount = {
      id: editingAccount ? editingAccount.id : `COA-${formData.accountCode}`,
      accountId: editingAccount ? editingAccount.accountId : `COA-${formData.accountCode}`,
      accountCode: formData.accountCode!,
      accountName: formData.accountName!,
      accountType: (formData.accountType as AccountCategoryType) || "EXPENSE",
      parentAccountId: formData.parentAccountId || undefined,
      level: formData.level || 2,
      normalBalance: formData.normalBalance || "DEBIT",
      isActive: formData.isActive ?? true,
    };

    await onSaveAccount(accountToSave);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari kode atau nama akun COA..."
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
              Semua Akun ({accounts.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  selectedCategory === cat ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {cat} ({accounts.filter((a) => a.accountType === cat).length})
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleCreateClick}
          className="w-full md:w-auto px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition"
        >
          <Plus className="w-4 h-4" />
          Tambah Akun COA Baru
        </button>
      </div>

      {/* COA Hierarchical Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Bagan Akun Standar (Chart of Accounts Master)</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Struktur Hirarki Akun Double-Entry ERP Tambang
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
              <tr>
                <th className="p-3">Kode Akun</th>
                <th className="p-3">Nama Akun (COA)</th>
                <th className="p-3">Kategori</th>
                <th className="p-3">Level</th>
                <th className="p-3">Saldo Normal</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-sans">
              {filteredAccounts.map((acc) => {
                const isHeader = acc.level === 1;
                return (
                  <tr
                    key={acc.id}
                    className={`hover:bg-slate-800/40 transition ${isHeader ? "bg-slate-950/40 font-bold" : ""}`}
                  >
                    <td className="p-3 font-mono font-bold text-amber-400">{acc.accountCode}</td>
                    <td className="p-3">
                      <span className={acc.level === 2 ? "pl-4 text-slate-200" : "text-white font-extrabold"}>
                        {acc.accountName}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          acc.accountType === "ASSET"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : acc.accountType === "REVENUE"
                            ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                            : acc.accountType === "EXPENSE"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            : acc.accountType === "LIABILITY"
                            ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                            : "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                        }`}
                      >
                        {acc.accountType}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400 font-mono">Level {acc.level}</td>
                    <td className="p-3">
                      <span
                        className={`font-mono text-[11px] font-bold ${
                          acc.normalBalance === "DEBIT" ? "text-emerald-400" : "text-indigo-400"
                        }`}
                      >
                        {acc.normalBalance}
                      </span>
                    </td>
                    <td className="p-3">
                      {acc.isActive ? (
                        <span className="text-emerald-400 flex items-center gap-1 text-[11px] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Aktif
                        </span>
                      ) : (
                        <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                          <AlertCircle className="w-3.5 h-3.5" /> Non-Aktif
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleEditClick(acc)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold border border-slate-700 transition"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <h3 className="text-base font-bold text-white">
              {editingAccount ? "Edit Akun COA" : "Tambah Akun COA Baru"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300">Kode Akun</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 5150"
                    value={formData.accountCode || ""}
                    onChange={(e) => setFormData({ ...formData, accountCode: e.target.value })}
                    className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300">Kategori Akun</label>
                  <select
                    value={formData.accountType || "EXPENSE"}
                    onChange={(e) => setFormData({ ...formData, accountType: e.target.value as AccountCategoryType })}
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

              <div>
                <label className="text-xs font-bold text-slate-300">Nama Akun (COA)</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Biaya Pelumas & Oli Fleet"
                  value={formData.accountName || ""}
                  onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                  className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300">Saldo Normal</label>
                  <select
                    value={formData.normalBalance || "DEBIT"}
                    onChange={(e) => setFormData({ ...formData, normalBalance: e.target.value as "DEBIT" | "CREDIT" })}
                    className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="DEBIT">DEBIT</option>
                    <option value="CREDIT">CREDIT</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300">Level Hirarki</label>
                  <select
                    value={formData.level || 2}
                    onChange={(e) => setFormData({ ...formData, level: Number(e.target.value) })}
                    className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value={1}>Level 1 (Header Group)</option>
                    <option value={2}>Level 2 (Detail Sub-Account)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive ?? true}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-slate-800 bg-slate-950 text-amber-500 focus:ring-amber-500"
                />
                <label htmlFor="isActive" className="text-xs font-bold text-slate-300">
                  Status Akun Aktif
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs transition"
                >
                  Simpan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
