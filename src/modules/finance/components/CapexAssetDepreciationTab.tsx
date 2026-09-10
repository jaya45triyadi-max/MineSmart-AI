// MINE SMART AI - CAPEX Workflow, Asset Register & Straight-Line Depreciation Tab
import React, { useState } from "react";
import { Building2, Plus, Calculator, CheckCircle2, AlertTriangle, Search, Layers, FileText, ArrowUpRight } from "lucide-react";
import { CapexRequest, FixedAsset, CapexCategory } from "../../../types/financeTypes";

interface CapexAssetDepreciationTabProps {
  capexRequests: CapexRequest[];
  fixedAssets: FixedAsset[];
  onSaveCapex: (capex: CapexRequest) => Promise<void>;
  onSaveAsset: (asset: FixedAsset) => Promise<void>;
}

export const CapexAssetDepreciationTab: React.FC<CapexAssetDepreciationTabProps> = ({
  capexRequests,
  fixedAssets,
  onSaveCapex,
  onSaveAsset,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"CAPEX" | "ASSETS" | "DEPRECIATION">("CAPEX");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCapexModal, setShowCapexModal] = useState(false);

  const [capexFormData, setCapexFormData] = useState<Partial<CapexRequest>>({
    title: "",
    category: "Heavy Equipment",
    proposedAmountIDR: 5000000000,
    usefulLifeYears: 8,
    justification: "",
    requestorName: "Ir. Hendra Wijaya",
  });

  const formatIDR = (val: number) => `Rp ${val.toLocaleString("id-ID")}`;

  const categories: CapexCategory[] = [
    "Mining Equipment",
    "Heavy Equipment",
    "Processing Plant",
    "Infrastructure",
    "Road",
    "Workshop",
    "Warehouse",
    "IT",
    "Land",
    "Other",
  ];

  const totalCapexValue = capexRequests.reduce((acc, c) => acc + (c.approvedAmountIDR || c.proposedAmountIDR), 0);
  const totalAssetCost = fixedAssets.reduce((acc, a) => acc + a.purchaseCostIDR, 0);
  const totalBookValue = fixedAssets.reduce((acc, a) => acc + a.currentBookValueIDR, 0);
  const totalAnnualDepr = fixedAssets.reduce((acc, a) => acc + a.annualDepreciationIDR, 0);

  const handleCapexSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newCapex: CapexRequest = {
      id: `CPX-${Date.now()}`,
      capexId: `CPX-${Date.now()}`,
      capexNumber: `CPX-BNU-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: capexFormData.title || "Usulan CAPEX Aset Baru",
      category: (capexFormData.category as CapexCategory) || "Heavy Equipment",
      siteId: "SITE-KAL-A",
      costCenterId: "CC-MIN-01",
      proposedAmountIDR: Number(capexFormData.proposedAmountIDR) || 0,
      approvedAmountIDR: Number(capexFormData.proposedAmountIDR) || 0,
      usefulLifeYears: Number(capexFormData.usefulLifeYears) || 8,
      justification: capexFormData.justification || "Pengembangan kapasitas operasional tambang.",
      approvalStatus: "SUBMITTED",
      requestorName: capexFormData.requestorName || "Ir. Hendra Wijaya",
      companyId: "COMP-BNU-01",
      createdAt: new Date().toISOString(),
    };

    await onSaveCapex(newCapex);
    setShowCapexModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Sub-Tab Navigation Bar */}
      <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-2">
          {[
            { key: "CAPEX", label: "Workflow CAPEX Requests", count: capexRequests.length },
            { key: "ASSETS", label: "Fixed Asset Register", count: fixedAssets.length },
            { key: "DEPRECIATION", label: "Kalkulator Penyusutan Aset (Straight-Line)", count: null },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveSubTab(tab.key as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeSubTab === tab.key
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-950/30 text-amber-950 font-black">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {activeSubTab === "CAPEX" && (
          <button
            onClick={() => setShowCapexModal(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition"
          >
            <Plus className="w-4 h-4" />
            Ajukan CAPEX Proposal
          </button>
        )}
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Total CAPEX Approved</div>
          <div className="text-base font-black text-amber-400 mt-1">{formatIDR(totalCapexValue)}</div>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Total Acquisition Cost Aset</div>
          <div className="text-base font-black text-slate-200 mt-1">{formatIDR(totalAssetCost)}</div>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Nilai Buku Aset Saat Ini (Book Value)</div>
          <div className="text-base font-black text-emerald-400 mt-1">{formatIDR(totalBookValue)}</div>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Penyusutan Tahunan (Straight-Line)</div>
          <div className="text-base font-black text-cyan-400 mt-1">{formatIDR(totalAnnualDepr)}</div>
        </div>
      </div>

      {/* VIEW 1: CAPEX REQUESTS WORKFLOW */}
      {activeSubTab === "CAPEX" && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Daftar Pengajuan Investasi Aset Tetap (CAPEX Proposal)</h3>
            <span className="text-xs text-slate-400 font-mono">Workflow: Proposal → Budget Check → Approval → Capitalization</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                <tr>
                  <th className="p-3">No. CAPEX</th>
                  <th className="p-3">Judul Investasi Aset</th>
                  <th className="p-3">Kategori</th>
                  <th className="p-3">Pengusul</th>
                  <th className="p-3">Nilai Usulan IDR</th>
                  <th className="p-3">Masa Pakai (Thn)</th>
                  <th className="p-3 text-center">Status Approval</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {capexRequests.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-mono font-bold text-amber-400">{c.capexNumber}</td>
                    <td className="p-3">
                      <div className="font-bold text-white">{c.title}</div>
                      <div className="text-[10px] text-slate-400">{c.justification}</div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        {c.category}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300">{c.requestorName}</td>
                    <td className="p-3 font-mono font-bold text-slate-100">{formatIDR(c.proposedAmountIDR)}</td>
                    <td className="p-3 font-mono">{c.usefulLifeYears} Tahun</td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase ${
                          c.approvalStatus === "CAPITALIZED"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : c.approvalStatus === "APPROVED"
                            ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                            : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {c.approvalStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: FIXED ASSETS REGISTER */}
      {activeSubTab === "ASSETS" && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Register Aset Tetap Tambang (Fixed Asset Register)</h3>
            <span className="text-xs text-slate-400 font-mono">Terhubung dengan Master Equipment & Fleet Unit</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                <tr>
                  <th className="p-3">Kode Aset / Serial</th>
                  <th className="p-3">Nama Aset & Equipment Unit</th>
                  <th className="p-3">Lokasi Site</th>
                  <th className="p-3">Tanggal Beli</th>
                  <th className="p-3">Harga Perolehan (Cost)</th>
                  <th className="p-3">Akumulasi Penyusutan</th>
                  <th className="p-3 text-right">Nilai Buku (Book Value)</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {fixedAssets.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-mono">
                      <div className="font-bold text-amber-400">{a.assetCode}</div>
                      <div className="text-[10px] text-slate-500">{a.serialNumber || "-"}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-white">{a.assetName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Equipment Code: {a.equipmentId || "N/A"}</div>
                    </td>
                    <td className="p-3 text-slate-300">{a.location}</td>
                    <td className="p-3 font-mono text-slate-400">{a.purchaseDate}</td>
                    <td className="p-3 font-mono text-slate-200">{formatIDR(a.purchaseCostIDR)}</td>
                    <td className="p-3 font-mono text-rose-400">{formatIDR(a.accumulatedDepreciationIDR)}</td>
                    <td className="p-3 text-right font-mono font-black text-emerald-400 text-sm">
                      {formatIDR(a.currentBookValueIDR)}
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: STRAIGHT-LINE DEPRECIATION CALCULATOR */}
      {activeSubTab === "DEPRECIATION" && (
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <Calculator className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Metode Penyusutan Garis Lurus (Straight-Line Depreciation)</h3>
              <p className="text-xs text-slate-400">Formula: Penyusutan Tahunan = (Harga Perolehan - Nilai Residu) / Masa Pakai (Tahun)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {fixedAssets.map((a) => (
              <div key={a.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="font-bold text-white text-sm">{a.assetName}</div>
                <div className="text-[11px] text-amber-400 font-mono">{a.assetCode}</div>

                <div className="pt-2 border-t border-slate-800 space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Harga Perolehan:</span>
                    <span className="text-slate-200">{formatIDR(a.purchaseCostIDR)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Nilai Residu (Salvage):</span>
                    <span className="text-slate-200">{formatIDR(a.salvageValueIDR)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Masa Pakai:</span>
                    <span className="text-slate-200">{a.usefulLifeYears} Tahun</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-800/60 text-cyan-400 font-bold">
                    <span>Depresiasi / Tahun:</span>
                    <span>{formatIDR(a.annualDepreciationIDR)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Sisa Book Value:</span>
                    <span>{formatIDR(a.currentBookValueIDR)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Capex Modal */}
      {showCapexModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Pengajuan Proposal CAPEX Baru</h3>

            <form onSubmit={handleCapexSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300">Judul Investasi CAPEX</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pengadaan 2 Unit Dump Truck CAT 777G"
                  value={capexFormData.title || ""}
                  onChange={(e) => setCapexFormData({ ...capexFormData, title: e.target.value })}
                  className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300">Kategori CAPEX</label>
                  <select
                    value={capexFormData.category || "Heavy Equipment"}
                    onChange={(e) => setCapexFormData({ ...capexFormData, category: e.target.value as CapexCategory })}
                    className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300">Estimasi Masa Pakai (Tahun)</label>
                  <input
                    type="number"
                    value={capexFormData.usefulLifeYears || 8}
                    onChange={(e) => setCapexFormData({ ...capexFormData, usefulLifeYears: Number(e.target.value) })}
                    className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Usulan Nilai Investasi (IDR)</label>
                <input
                  type="number"
                  required
                  value={capexFormData.proposedAmountIDR || ""}
                  onChange={(e) => setCapexFormData({ ...capexFormData, proposedAmountIDR: Number(e.target.value) })}
                  className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono font-bold text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Justifikasi Bisnis & Operasional</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Justifikasi peningkatan target produksi..."
                  value={capexFormData.justification || ""}
                  onChange={(e) => setCapexFormData({ ...capexFormData, justification: e.target.value })}
                  className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCapexModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 text-slate-950 font-black rounded-xl text-xs hover:bg-amber-600 transition"
                >
                  Kirim Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
