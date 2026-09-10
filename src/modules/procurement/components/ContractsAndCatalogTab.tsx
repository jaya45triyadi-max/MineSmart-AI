// MINE SMART AI - Contracts & Catalog Management Tab

import React, { useState } from "react";
import {
  FileText,
  Boxes,
  AlertTriangle,
  Search,
  CheckCircle2,
  Calendar,
  Building2,
  Package
} from "lucide-react";
import { ProcurementContract, CatalogItem } from "../../../types/procurementTypes";

interface ContractsAndCatalogTabProps {
  contracts: ProcurementContract[];
  catalog: CatalogItem[];
}

export const ContractsAndCatalogTab: React.FC<ContractsAndCatalogTabProps> = ({
  contracts,
  catalog,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"CONTRACTS" | "CATALOG">("CONTRACTS");
  const [searchTerm, setSearchTerm] = useState("");

  const formatIDR = (val: number) => `Rp ${val.toLocaleString("id-ID")}`;

  return (
    <div className="space-y-6">
      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-700/60 pb-3">
        <button
          onClick={() => setActiveSubTab("CONTRACTS")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeSubTab === "CONTRACTS"
              ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          <FileText className="w-4 h-4" /> Kontrak Master Vendor ({contracts.length})
        </button>
        <button
          onClick={() => setActiveSubTab("CATALOG")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeSubTab === "CATALOG"
              ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          <Boxes className="w-4 h-4" /> Katalog Pengadaan Tambang ({catalog.length})
        </button>
      </div>

      {activeSubTab === "CONTRACTS" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contracts.map((c) => (
              <div key={c.contractId} className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60 space-y-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-400">{c.contractNumber}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    c.status === "ACTIVE"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  }`}>
                    {c.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">{c.vendorName}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{c.scope}</p>

                <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Nilai Kontrak: <strong className="text-amber-300">{formatIDR(c.value)}</strong></span>
                  <span className="text-slate-400">Periode: {c.startDate} s/d {c.endDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === "CATALOG" && (
        <div className="bg-slate-800/80 rounded-xl border border-slate-700/60 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold text-[11px]">
                <tr>
                  <th className="p-3.5">Item Code & Name</th>
                  <th className="p-3.5">Kategori</th>
                  <th className="p-3.5">Preferred Vendor</th>
                  <th className="p-3.5 text-right">Harga Terakhir</th>
                  <th className="p-3.5 text-right">Harga Rerata</th>
                  <th className="p-3.5 text-center">Lead Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 text-slate-200">
                {catalog.map((item) => (
                  <tr key={item.itemCode} className="hover:bg-slate-700/30 transition">
                    <td className="p-3.5 font-mono">
                      <div className="font-bold text-amber-400">{item.itemCode}</div>
                      <div className="text-slate-200 font-sans font-medium">{item.itemName}</div>
                    </td>
                    <td className="p-3.5 text-slate-300">{item.category}</td>
                    <td className="p-3.5 font-semibold text-white">{item.preferredVendorName}</td>
                    <td className="p-3.5 text-right font-bold text-amber-300">{formatIDR(item.lastPurchasePrice)}</td>
                    <td className="p-3.5 text-right text-slate-300">{formatIDR(item.avgPurchasePrice)}</td>
                    <td className="p-3.5 text-center font-bold text-slate-200">{item.leadTimeDays} Hari</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
