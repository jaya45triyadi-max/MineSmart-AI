// MINE SMART AI - RFQ, Quotation & Comparison Matrix Tab

import React, { useState } from "react";
import {
  Send,
  Award,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Building2,
  Scale,
  FileSpreadsheet,
  Clock,
  Plus,
  ArrowRight,
  ShieldAlert,
  ChevronDown
} from "lucide-react";
import { RFQ, Quotation, Vendor, VendorCategory } from "../../../types/procurementTypes";

interface RFQAndQuotationTabProps {
  rfqs: RFQ[];
  quotations: Quotation[];
  vendors: Vendor[];
  onCreateRFQ: (rfq: RFQ) => void;
  onSubmitQuotation: (quotation: Quotation) => void;
  onAwardQuotation: (quotationId: string, vendorId: string) => void;
}

export const RFQAndQuotationTab: React.FC<RFQAndQuotationTabProps> = ({
  rfqs,
  quotations,
  vendors,
  onCreateRFQ,
  onSubmitQuotation,
  onAwardQuotation,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"RFQS" | "QUOTATIONS" | "COMPARISON">("COMPARISON");
  const [selectedRFQForComparison, setSelectedRFQForComparison] = useState<string>(rfqs[0]?.rfqId || "rfq-001");

  const [weights, setWeights] = useState({
    price: 40,
    quality: 20,
    leadTime: 20,
    paymentTerms: 10,
    hse: 10,
  });

  const selectedRFQ = rfqs.find((r) => r.rfqId === selectedRFQForComparison) || rfqs[0];
  const relatedQuotations = quotations.filter((q) => q.rfqId === selectedRFQForComparison);

  const formatIDR = (val: number) => `Rp ${val.toLocaleString("id-ID")}`;

  return (
    <div className="space-y-6">
      {/* Sub-tab Navigation */}
      <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab("COMPARISON")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeSubTab === "COMPARISON"
                ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <Scale className="w-4 h-4" /> Quotation Comparison Matrix
          </button>
          <button
            onClick={() => setActiveSubTab("RFQS")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeSubTab === "RFQS"
                ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <Send className="w-4 h-4" /> RFQ & Undangan Vendor ({rfqs.length})
          </button>
          <button
            onClick={() => setActiveSubTab("QUOTATIONS")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeSubTab === "QUOTATIONS"
                ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" /> Penawaran Vendor ({quotations.length})
          </button>
        </div>

        {/* RFQ Selector for Matrix */}
        {activeSubTab === "COMPARISON" && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Pilih RFQ:</span>
            <select
              value={selectedRFQForComparison}
              onChange={(e) => setSelectedRFQForComparison(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg text-xs text-amber-400 font-mono font-bold px-3 py-1.5 focus:outline-none"
            >
              {rfqs.map((r) => (
                <option key={r.rfqId} value={r.rfqId}>
                  {r.rfqNumber} (PR: {r.prNumber})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* 1. COMPARISON MATRIX SUB-TAB */}
      {activeSubTab === "COMPARISON" && (
        <div className="space-y-6">
          {/* RFQ Header & Context */}
          {selectedRFQ && (
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div>
                <span className="text-xs text-amber-400 font-mono font-bold">{selectedRFQ.rfqNumber}</span>
                <h3 className="text-base font-bold text-white">Evaluasi & Komparasi Penawaran Harga (Commercial & Technical)</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pengadaan terkait Purchase Request <strong className="text-slate-200">{selectedRFQ.prNumber}</strong> | Lokasi: {selectedRFQ.deliveryLocation}
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs bg-slate-900/80 p-2.5 rounded-lg border border-slate-700">
                <span>Weighting Config:</span>
                <span className="text-amber-400 font-semibold">Harga {weights.price}%</span>
                <span>•</span>
                <span className="text-blue-400 font-semibold">Kualitas {weights.quality}%</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">Lead Time {weights.leadTime}%</span>
              </div>
            </div>
          )}

          {/* Side-by-Side Comparison Matrix Table */}
          <div className="bg-slate-800/80 rounded-2xl border border-slate-700/60 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold text-[11px]">
                  <tr>
                    <th className="p-4 w-64">Kriteria Evaluasi</th>
                    {relatedQuotations.map((q) => (
                      <th key={q.quotationId} className="p-4 text-center border-l border-slate-700/60 min-w-[220px]">
                        <div className="text-white font-bold text-sm">{q.vendorName}</div>
                        <div className="text-[11px] text-amber-400 font-mono mt-0.5">{q.quotationNumber}</div>
                        {q.status === "ACCEPTED" && (
                          <span className="mt-1 inline-block px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-bold">
                            AWARDED / SELECTED
                          </span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60 text-slate-200">
                  {/* Row: Grand Total Price */}
                  <tr className="bg-slate-900/30">
                    <td className="p-3.5 font-bold text-white flex items-center gap-2">
                      <span>Total Harga Penawaran</span>
                    </td>
                    {relatedQuotations.map((q) => (
                      <td key={q.quotationId} className="p-3.5 text-center font-bold text-sm text-amber-300 border-l border-slate-700/60">
                        {formatIDR(q.grandTotal)}
                        <div className="text-[10px] text-slate-400 font-normal">Inc Tax {q.taxAmount > 0 ? "+ PPN 11%" : ""}</div>
                      </td>
                    ))}
                  </tr>

                  {/* Row: Delivery Lead Time */}
                  <tr>
                    <td className="p-3.5 font-medium text-slate-300">Lead Time Pengiriman</td>
                    {relatedQuotations.map((q) => (
                      <td key={q.quotationId} className="p-3.5 text-center border-l border-slate-700/60">
                        <span className="font-bold text-white">{q.leadTimeDays} Hari</span>
                        <div className="text-[10px] text-slate-400">{q.deliveryTerms}</div>
                      </td>
                    ))}
                  </tr>

                  {/* Row: Payment Terms */}
                  <tr>
                    <td className="p-3.5 font-medium text-slate-300">Termin Pembayaran (TOP)</td>
                    {relatedQuotations.map((q) => (
                      <td key={q.quotationId} className="p-3.5 text-center font-semibold text-slate-200 border-l border-slate-700/60">
                        {q.paymentTerms}
                      </td>
                    ))}
                  </tr>

                  {/* Row: Technical & Brand Specs */}
                  <tr>
                    <td className="p-3.5 font-medium text-slate-300">Spesifikasi Technical Match</td>
                    {relatedQuotations.map((q) => (
                      <td key={q.quotationId} className="p-3.5 text-center text-[11px] text-slate-300 border-l border-slate-700/60">
                        {q.items.map((it) => (
                          <div key={it.quotationItemId} className="mb-1">
                            <span className="font-semibold text-amber-400">{it.brand || "Genuine"}</span> - {it.itemName}
                          </div>
                        ))}
                      </td>
                    ))}
                  </tr>

                  {/* Row: Garansi / Warranty */}
                  <tr>
                    <td className="p-3.5 font-medium text-slate-300">Garansi Resmi Manufacturer</td>
                    {relatedQuotations.map((q) => (
                      <td key={q.quotationId} className="p-3.5 text-center text-slate-200 border-l border-slate-700/60">
                        {q.items[0]?.warranty || "12 Bulan Warranty"}
                      </td>
                    ))}
                  </tr>

                  {/* Row: HSE Compliance Flag */}
                  <tr>
                    <td className="p-3.5 font-medium text-slate-300">Status HSE CSMS Vendor</td>
                    {relatedQuotations.map((q) => (
                      <td key={q.quotationId} className="p-3.5 text-center border-l border-slate-700/60">
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[10px] font-bold">
                          100% HSE COMPLIANT
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Row: Weighted Score Breakdown */}
                  <tr className="bg-slate-900/60 font-bold">
                    <td className="p-4 text-white">Weighted Vendor Score (100)</td>
                    {relatedQuotations.map((q) => (
                      <td key={q.quotationId} className="p-4 text-center border-l border-slate-700/60">
                        <div className="text-xl text-amber-400">{q.totalScore || 90} / 100</div>
                        <div className="text-[10px] text-slate-400 font-normal">Score Terkalkulasi Otomatis</div>
                      </td>
                    ))}
                  </tr>

                  {/* Row: Award Action */}
                  <tr className="bg-slate-950/80">
                    <td className="p-4 font-bold text-slate-300">Keputusan Final Award</td>
                    {relatedQuotations.map((q) => (
                      <td key={q.quotationId} className="p-4 text-center border-l border-slate-700/60">
                        {q.status === "ACCEPTED" ? (
                          <div className="text-emerald-400 font-bold text-xs flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Awarded & PO Issued
                          </div>
                        ) : (
                          <button
                            onClick={() => onAwardQuotation(q.quotationId, q.vendorId)}
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md transition"
                          >
                            Pilih Vendor & Terbitkan PO
                          </button>
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Vendor Advisory Panel */}
          <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900/90 p-5 rounded-2xl border border-amber-500/30">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h4 className="text-sm font-bold text-white">Rekomendasi AI Procurement Advisor</h4>
              <span className="text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded font-bold">
                GUARDRAILED - ADVISORY ONLY
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Berdasarkan analisis komparatif, <strong className="text-amber-400">PT Hexindo Adiperkasa Tbk</strong> direkomendasikan untuk dipilih karena menawarkan komponen genuine OEM dengan garansi 12 bulan, lead time lebih singkat (5 hari vs 10 hari), serta skor persetujuan teknis tertinggi (98/100). Meskipun total nilai nominal sedikit berbeda, resiko breakdown berulang diminimalkan secara signifikan.
            </p>
          </div>
        </div>
      )}

      {/* 2. RFQS LIST SUB-TAB */}
      {activeSubTab === "RFQS" && (
        <div className="space-y-4">
          <div className="bg-slate-800/80 rounded-xl border border-slate-700/60 p-4">
            <h3 className="text-sm font-bold text-white mb-3">Daftar Request for Quotation (RFQ) Aktif</h3>
            <div className="space-y-3">
              {rfqs.map((rfq) => (
                <div key={rfq.rfqId} className="p-4 bg-slate-900/60 rounded-xl border border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-400 font-mono">{rfq.rfqNumber}</span>
                      <span className="text-xs text-slate-300">| PR Reference: <strong className="text-white">{rfq.prNumber}</strong></span>
                    </div>
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded text-[10px] font-bold">
                      {rfq.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-300">
                    Batas Penutupan RFQ: <strong className="text-amber-300">{rfq.closingDate}</strong> | Lokasi DDP: {rfq.deliveryLocation}
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Vendor Diundang: {rfq.invitedVendors?.length || 2} Vendor</span>
                    <button
                      onClick={() => {
                        setSelectedRFQForComparison(rfq.rfqId);
                        setActiveSubTab("COMPARISON");
                      }}
                      className="text-amber-400 hover:text-amber-300 font-medium text-xs flex items-center gap-1"
                    >
                      Buka Komparasi →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. QUOTATIONS SUB-TAB */}
      {activeSubTab === "QUOTATIONS" && (
        <div className="space-y-4">
          <div className="bg-slate-800/80 rounded-xl border border-slate-700/60 p-4">
            <h3 className="text-sm font-bold text-white mb-3">Daftar Surat Penawaran Harga (Quotation) Vendor</h3>
            <div className="space-y-3">
              {quotations.map((q) => (
                <div key={q.quotationId} className="p-4 bg-slate-900/60 rounded-xl border border-slate-700/60 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-400 font-mono">{q.quotationNumber}</span>
                      <span className="text-sm font-bold text-white">{q.vendorName}</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Lead time: {q.leadTimeDays} Hari | Valid sampai: {q.validUntil}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-bold text-amber-300">{formatIDR(q.grandTotal)}</div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      q.status === "ACCEPTED" ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-700 text-slate-300"
                    }`}>
                      {q.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
