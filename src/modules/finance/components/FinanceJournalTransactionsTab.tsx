// MINE SMART AI - Double-Entry Journal Ledger & Transactions Tab
import React, { useState } from "react";
import { Layers, Plus, CheckCircle2, AlertCircle, FileText, Search, ShieldAlert, Lock } from "lucide-react";
import { JournalEntry, JournalLine, ChartOfAccount, CostCenter, FinancialPeriod } from "../../../types/financeTypes";

interface FinanceJournalTransactionsTabProps {
  journals: JournalEntry[];
  accounts: ChartOfAccount[];
  costCenters: CostCenter[];
  periods: FinancialPeriod[];
  onCreateJournal: (journal: Omit<JournalEntry, "id" | "isBalanced" | "createdAt" | "updatedAt">) => Promise<void>;
}

export const FinanceJournalTransactionsTab: React.FC<FinanceJournalTransactionsTabProps> = ({
  journals,
  accounts,
  costCenters,
  periods,
  onCreateJournal,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const [description, setDescription] = useState("");
  const [fiscalPeriod, setFiscalPeriod] = useState("2026-08");
  const [referenceType, setReferenceType] = useState<any>("MANUAL");
  const [referenceId, setReferenceId] = useState("");

  const [lines, setLines] = useState<Partial<JournalLine>[]>([
    { lineId: "L1", accountId: accounts[0]?.accountId || "COA-1110", debitIDR: 100000000, creditIDR: 0, description: "Penerimaan Kas" },
    { lineId: "L2", accountId: accounts[1]?.accountId || "COA-4110", debitIDR: 0, creditIDR: 100000000, description: "Pengakuan Pendapatan" },
  ]);

  const formatIDR = (val: number) => `Rp ${val.toLocaleString("id-ID")}`;

  const totalDebit = lines.reduce((acc, l) => acc + (Number(l.debitIDR) || 0), 0);
  const totalCredit = lines.reduce((acc, l) => acc + (Number(l.creditIDR) || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

  const currentPeriodObj = periods.find((p) => p.periodName === fiscalPeriod);
  const isPeriodLocked = currentPeriodObj?.status === "LOCKED" || currentPeriodObj?.status === "CLOSED";

  const handleAddLine = () => {
    setLines([
      ...lines,
      { lineId: `L${lines.length + 1}`, accountId: accounts[0]?.accountId || "COA-5100", debitIDR: 0, creditIDR: 0, description: "" },
    ]);
  };

  const handleLineChange = (index: number, field: keyof JournalLine, value: any) => {
    const newLines = [...lines];
    newLines[index] = { ...newLines[index], [field]: value };
    setLines(newLines);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBalanced) {
      alert("Error Validation: Total Debit harus persis sama dengan Total Credit!");
      return;
    }
    if (isPeriodLocked) {
      alert(`Error Period Lock: Periode fiskal ${fiscalPeriod} sudah dikunci/tertutup! Posting jurnal tidak diizinkan.`);
      return;
    }

    const journalLines: JournalLine[] = lines.map((l, idx) => {
      const accObj = accounts.find((a) => a.accountId === l.accountId);
      return {
        lineId: l.lineId || `L${idx + 1}`,
        accountId: l.accountId || "COA-1110",
        accountCode: accObj ? accObj.accountCode : "1000",
        accountName: accObj ? accObj.accountName : "Akun",
        debitIDR: Number(l.debitIDR) || 0,
        creditIDR: Number(l.creditIDR) || 0,
        description: l.description || description,
      };
    });

    await onCreateJournal({
      journalId: `JRN-${Date.now()}`,
      journalNumber: `JRN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      transactionDate: new Date().toISOString().split("T")[0],
      postingDate: new Date().toISOString().split("T")[0],
      referenceType,
      referenceId: referenceId || undefined,
      description: description || "Jurnal Umum Manual",
      fiscalPeriod,
      status: "POSTED",
      lines: journalLines,
      totalDebitIDR: totalDebit,
      totalCreditIDR: totalCredit,
      createdBy: "Finance Accountant",
      approvedBy: "Finance Manager",
      companyId: "COMP-BNU-01",
      siteId: "SITE-KAL-A",
    });

    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari nomor jurnal, deskripsi, atau kode akun..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="w-full md:w-auto px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition"
        >
          <Plus className="w-4 h-4" />
          Buat Jurnal Posting Baru
        </button>
      </div>

      {/* Journal Entry List */}
      <div className="space-y-4">
        {journals
          .filter(
            (j) =>
              j.journalNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
              j.description.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((j) => (
            <div key={j.id} className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20 font-mono font-bold text-xs">
                    {j.journalNumber}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{j.description}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Ref: {j.referenceType} ({j.referenceId || "No Ref"}) • Periode: {j.fiscalPeriod} • Tanggal: {j.transactionDate}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    Total: {formatIDR(j.totalDebitIDR)}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {j.status}
                  </span>
                </div>
              </div>

              {/* Journal Lines Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="p-2">Kode Akun</th>
                      <th className="p-2">Nama Akun (COA)</th>
                      <th className="p-2">Keterangan Baris</th>
                      <th className="p-2 text-right">Debit (IDR)</th>
                      <th className="p-2 text-right">Credit (IDR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40 text-slate-300 font-mono">
                    {j.lines.map((line, idx) => (
                      <tr key={idx}>
                        <td className="p-2 font-bold text-amber-400">{line.accountCode}</td>
                        <td className="p-2 text-slate-200 font-sans">{line.accountName}</td>
                        <td className="p-2 text-slate-400 font-sans">{line.description}</td>
                        <td className="p-2 text-right text-emerald-400">
                          {line.debitIDR > 0 ? formatIDR(line.debitIDR) : "-"}
                        </td>
                        <td className="p-2 text-right text-indigo-400">
                          {line.creditIDR > 0 ? formatIDR(line.creditIDR) : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
      </div>

      {/* Add Journal Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-white">Buat Transaksi Jurnal Posting Baru</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300">Deskripsi Jurnal Header</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Pengakuan Pendapatan & Kas"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300">Periode Fiskal</label>
                  <select
                    value={fiscalPeriod}
                    onChange={(e) => setFiscalPeriod(e.target.value)}
                    className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  >
                    {periods.map((p) => (
                      <option key={p.periodId} value={p.periodName}>
                        {p.periodName} ({p.status})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Journal Line Entries */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">Baris Jurnal Double Entry</span>
                  <button
                    type="button"
                    onClick={handleAddLine}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold rounded-lg border border-slate-700"
                  >
                    + Tambah Baris
                  </button>
                </div>

                {lines.map((line, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 items-center text-xs">
                    <div className="col-span-5">
                      <select
                        value={line.accountId || ""}
                        onChange={(e) => handleLineChange(idx, "accountId", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-white text-[11px]"
                      >
                        {accounts.map((a) => (
                          <option key={a.accountId} value={a.accountId}>
                            {a.accountCode} - {a.accountName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-3">
                      <input
                        type="number"
                        placeholder="Debit IDR"
                        value={line.debitIDR || 0}
                        onChange={(e) => handleLineChange(idx, "debitIDR", Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 font-mono text-emerald-400 font-bold"
                      />
                    </div>

                    <div className="col-span-3">
                      <input
                        type="number"
                        placeholder="Credit IDR"
                        value={line.creditIDR || 0}
                        onChange={(e) => handleLineChange(idx, "creditIDR", Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 font-mono text-indigo-400 font-bold"
                      />
                    </div>
                  </div>
                ))}

                {/* Balance Meter Bar */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between font-mono text-xs">
                  <div>
                    Total Debit: <span className="font-bold text-emerald-400">{formatIDR(totalDebit)}</span> | Total Credit:{" "}
                    <span className="font-bold text-indigo-400">{formatIDR(totalCredit)}</span>
                  </div>
                  {isBalanced ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> BALANCED OK
                    </span>
                  ) : (
                    <span className="text-rose-400 font-bold flex items-center gap-1">
                      <ShieldAlert className="w-4 h-4" /> UNBALANCED ({formatIDR(Math.abs(totalDebit - totalCredit))})
                    </span>
                  )}
                </div>
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
                  disabled={!isBalanced || isPeriodLocked}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition ${
                    isBalanced && !isPeriodLocked
                      ? "bg-amber-500 text-slate-950 hover:bg-amber-600"
                      : "bg-slate-800 text-slate-600 cursor-not-allowed"
                  }`}
                >
                  Posting Jurnal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
