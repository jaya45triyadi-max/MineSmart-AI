// MINE SMART AI - Revenue Management Tab (Sales & Shipment Integration)
import React, { useState } from "react";
import { TrendingUp, Plus, DollarSign, Calculator, Search, ShieldCheck, FileText, CheckCircle } from "lucide-react";
import { RevenueRecord } from "../../../types/financeTypes";

interface RevenueManagementTabProps {
  revenues: RevenueRecord[];
  onSaveRevenue: (rev: RevenueRecord) => Promise<void>;
}

export const RevenueManagementTab: React.FC<RevenueManagementTabProps> = ({ revenues, onSaveRevenue }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState<Partial<RevenueRecord>>({
    customerName: "",
    contractId: "",
    shipmentNumber: "",
    product: "Coal GAR 6100",
    quantityMT: 5000,
    unitPriceUSD: 85.0,
    exchangeRate: 15850,
    deductionIDR: 0,
    recognitionDate: new Date().toISOString().split("T")[0],
    status: "RECOGNIZED",
  });

  const formatIDR = (val: number) => `Rp ${val.toLocaleString("id-ID")}`;

  const filteredRevenues = revenues.filter(
    (r) =>
      r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.revenueNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(formData.quantityMT) || 0;
    const priceUSD = Number(formData.unitPriceUSD) || 0;
    const rate = Number(formData.exchangeRate) || 15850;
    const deduction = Number(formData.deductionIDR) || 0;

    const unitPriceIDR = Math.round(priceUSD * rate);
    const grossRevenueIDR = Math.round(qty * unitPriceIDR);
    const netRevenueIDR = grossRevenueIDR - deduction;

    const revToSave: RevenueRecord = {
      id: `REV-${Date.now()}`,
      revenueId: `REV-${Date.now()}`,
      revenueNumber: `REV-BNU-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: `CUST-${Date.now()}`,
      customerName: formData.customerName || "Pelanggan PLN / Smelter",
      contractId: formData.contractId || "CTR-2026-001",
      shipmentId: `SHP-${Date.now()}`,
      shipmentNumber: formData.shipmentNumber || "SHP-BNU-2026-X",
      product: formData.product || "Coal GAR 6100",
      quantityMT: qty,
      unitPriceUSD: priceUSD,
      exchangeRate: rate,
      unitPriceIDR,
      grossRevenueIDR,
      deductionIDR: deduction,
      netRevenueIDR,
      recognitionDate: formData.recognitionDate || new Date().toISOString().split("T")[0],
      status: formData.status || "RECOGNIZED",
      companyId: "COMP-BNU-01",
      siteId: "SITE-KAL-A",
    };

    await onSaveRevenue(revToSave);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Revenue Calculation Formula Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 p-5 rounded-2xl border border-emerald-500/30 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Transparansi Formula Perhitungan Revenue Penjualan Batubara</h3>
              <p className="text-xs text-slate-400">Terintegrasi otomatis dengan Modul Sales, Shipment & Quality Verification Lab</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition"
          >
            <Plus className="w-4 h-4" />
            Catat Revenue Baru
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs border-t border-slate-800/80">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 font-bold block text-[10px] uppercase">Formula Gross Revenue</span>
            <span className="font-mono font-bold text-emerald-400 mt-0.5 block">
              Gross Revenue = Quantity (MT) × Unit Price (USD) × Kurs (IDR/USD)
            </span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 font-bold block text-[10px] uppercase">Formula Net Revenue</span>
            <span className="font-mono font-bold text-emerald-400 mt-0.5 block">
              Net Revenue = Gross Revenue - Deductions (Quality/Moisture Adjust)
            </span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 font-bold block text-[10px] uppercase">Syarat Pengakuan Revenue</span>
            <span className="font-mono font-bold text-slate-200 mt-0.5 block">
              Shipment Verified (BL / Barging Document) & Contract Linked
            </span>
          </div>
        </div>
      </div>

      {/* Revenue List Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari pelanggan, nomor pengakuan revenue..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Total Recognized Net Revenue:{" "}
            <strong className="text-emerald-400">
              {formatIDR(revenues.reduce((acc, r) => acc + r.netRevenueIDR, 0))}
            </strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
              <tr>
                <th className="p-3">No. Revenue / Invoice</th>
                <th className="p-3">Pelanggan & Kontrak</th>
                <th className="p-3">Spesifikasi Batubara</th>
                <th className="p-3">Qty (MT)</th>
                <th className="p-3">Harga Satuan (USD)</th>
                <th className="p-3">Gross Revenue (IDR)</th>
                <th className="p-3">Deduction (Penalti)</th>
                <th className="p-3 text-right">Net Revenue (IDR)</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredRevenues.map((r) => (
                <tr key={r.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-mono">
                    <div className="font-bold text-amber-400">{r.revenueNumber}</div>
                    <div className="text-[10px] text-slate-500">{r.invoiceNumber || "Invoicing Pending"}</div>
                  </td>
                  <td className="p-3">
                    <div className="font-bold text-white">{r.customerName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{r.contractId}</div>
                  </td>
                  <td className="p-3 font-medium text-slate-300">{r.product}</td>
                  <td className="p-3 font-mono">{r.quantityMT.toLocaleString("id-ID")} MT</td>
                  <td className="p-3 font-mono">
                    ${r.unitPriceUSD} <span className="text-[10px] text-slate-500">(Kurs {r.exchangeRate})</span>
                  </td>
                  <td className="p-3 font-mono text-slate-200">{formatIDR(r.grossRevenueIDR)}</td>
                  <td className="p-3 font-mono text-rose-400">
                    {r.deductionIDR > 0 ? `- ${formatIDR(r.deductionIDR)}` : "Rp 0"}
                  </td>
                  <td className="p-3 text-right font-mono font-black text-emerald-400 text-sm">
                    {formatIDR(r.netRevenueIDR)}
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        r.status === "PAID"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : r.status === "INVOICED"
                          ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Revenue Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <h3 className="text-base font-bold text-white">Catat Revenue Penjualan Batubara Baru</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300">Nama Pelanggan (Customer)</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: PLN Energi Primer Indonesia"
                  value={formData.customerName || ""}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300">No. Kontrak Sales</label>
                  <input
                    type="text"
                    placeholder="CTR-PLN-2026-004"
                    value={formData.contractId || ""}
                    onChange={(e) => setFormData({ ...formData, contractId: e.target.value })}
                    className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300">Spesifikasi Batubara</label>
                  <input
                    type="text"
                    value={formData.product || "Coal GAR 6100"}
                    onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                    className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300">Kuantitas (MT)</label>
                  <input
                    type="number"
                    required
                    value={formData.quantityMT || ""}
                    onChange={(e) => setFormData({ ...formData, quantityMT: Number(e.target.value) })}
                    className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300">Harga Satuan (USD)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.unitPriceUSD || ""}
                    onChange={(e) => setFormData({ ...formData, unitPriceUSD: Number(e.target.value) })}
                    className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300">Kurs Kurs (IDR/USD)</label>
                  <input
                    type="number"
                    value={formData.exchangeRate || 15850}
                    onChange={(e) => setFormData({ ...formData, exchangeRate: Number(e.target.value) })}
                    className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Deduction / Penalti Kualitas (IDR)</label>
                <input
                  type="number"
                  placeholder="0 jika tidak ada penalti"
                  value={formData.deductionIDR || 0}
                  onChange={(e) => setFormData({ ...formData, deductionIDR: Number(e.target.value) })}
                  className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
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
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs transition"
                >
                  Simpan & Pengakuan Revenue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
