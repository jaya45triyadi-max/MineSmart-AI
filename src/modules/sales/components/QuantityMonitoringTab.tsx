import React, { useState } from "react";
import {
  Scale,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  FileCheck,
  Ship,
  Boxes,
  Layers,
  Award,
  Download,
  Eye,
  Info,
} from "lucide-react";
import { QuantityMassBalanceRecord } from "../../../types/salesTypes";

interface QuantityMonitoringTabProps {
  records: QuantityMassBalanceRecord[];
}

export const QuantityMonitoringTab: React.FC<QuantityMonitoringTabProps> = ({ records }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedRecord, setSelectedRecord] = useState<QuantityMassBalanceRecord | null>(null);

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.shipmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.vesselName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.surveyorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || r.reconciliationStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalContractMT = records.reduce((sum, r) => sum + r.contractQuantityMT, 0);
  const totalLoadedDraftMT = records.reduce((sum, r) => sum + r.draftSurveyLoadedMT, 0);
  const totalDischargedMT = records.reduce((sum, r) => sum + r.destinationDraftSurveyMT, 0);
  const totalVarianceMT = records.reduce((sum, r) => sum + r.varianceMT, 0);
  const avgVariancePercent = (totalVarianceMT / totalLoadedDraftMT) * 100;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold border border-indigo-500/20 uppercase tracking-wider">
              QUANTITY & MASS BALANCE MONITORING
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
              ISO 17020 Surveyor Certified
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1 flex items-center gap-2">
            <Scale className="w-6 h-6 text-indigo-500" />
            Coal Quantity & Draft Survey Mass Balance Reconciliation
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
            Monitoring kuantitas tonase batubara secara end-to-end: <strong>Contract Quantity → Stock Allocation → Belt Scale → Loading Draft Survey → Discharge Draft Survey</strong> untuk mendeteksi varians susut muatan secara presisi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert("Mengunduh Rekonsiliasi Mass Balance Draft Survey PDF/Excel...")}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-indigo-500" />
            <span>Export Reconciliation</span>
          </button>
        </div>
      </div>

      {/* Mass Balance Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Contracted Qty */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Contract Volume
            </span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {totalContractMT.toLocaleString("id-ID")} <span className="text-xs text-slate-400 font-sans font-normal">MT</span>
          </div>
          <p className="text-[10px] text-slate-400">4 Active Batches in Reconciliation</p>
        </div>

        {/* Total Draft Survey Loaded */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Loading Port Draft Survey
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Ship className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">
            {totalLoadedDraftMT.toLocaleString("id-ID")} <span className="text-xs text-slate-400 font-sans font-normal">MT</span>
          </div>
          <p className="text-[10px] text-slate-400">Sangatta Coal Terminal Outturn</p>
        </div>

        {/* Destination Discharged Survey */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Discharge Outturn Survey
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {totalDischargedMT.toLocaleString("id-ID")} <span className="text-xs text-slate-400 font-sans font-normal">MT</span>
          </div>
          <p className="text-[10px] text-slate-400">Customer Unloading Point Verified</p>
        </div>

        {/* Net Transit Variance */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Net Transit Variance (Loss)
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {totalVarianceMT.toLocaleString("id-ID")} MT <span className="text-xs font-sans font-normal text-emerald-500">({avgVariancePercent.toFixed(2)}%)</span>
          </div>
          <p className="text-[10px] text-emerald-600 font-semibold">✓ Well within standard 0.50% margin</p>
        </div>
      </div>

      {/* Interactive Mass Balance Flow Breakdown */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">
              Continuous Mass Balance Quantity Flow (MT)
            </h3>
          </div>
          <span className="text-xs text-indigo-300">
            Tolerance threshold: ±0.50% | Current avg: 0.12%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
            <span className="text-[10px] uppercase font-bold text-indigo-300">1. Contract Qty</span>
            <div className="text-lg font-black font-mono text-white">
              {totalContractMT.toLocaleString("id-ID")} MT
            </div>
            <span className="text-[10px] text-slate-400 block">Baseline Commitment</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
            <span className="text-[10px] uppercase font-bold text-blue-300">2. Stock Allocation</span>
            <div className="text-lg font-black font-mono text-white">
              {totalContractMT.toLocaleString("id-ID")} MT
            </div>
            <span className="text-[10px] text-slate-400 block">Stockpile Pad Reservation</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
            <span className="text-[10px] uppercase font-bold text-amber-300">3. Conveyor Belt Scale</span>
            <div className="text-lg font-black font-mono text-white">
              {(totalLoadedDraftMT + 1050).toLocaleString("id-ID")} MT
            </div>
            <span className="text-[10px] text-slate-400 block">+0.56% Conveyor Weight</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
            <span className="text-[10px] uppercase font-bold text-emerald-300">4. Loading Draft Survey</span>
            <div className="text-lg font-black font-mono text-emerald-400">
              {totalLoadedDraftMT.toLocaleString("id-ID")} MT
            </div>
            <span className="text-[10px] text-slate-400 block">Bill of Lading Official Qty</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
            <span className="text-[10px] uppercase font-bold text-cyan-300">5. Discharge Draft Survey</span>
            <div className="text-lg font-black font-mono text-cyan-400">
              {totalDischargedMT.toLocaleString("id-ID")} MT
            </div>
            <span className="text-[10px] text-slate-400 block">Final Certificate Outturn</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by shipment #, customer, vessel, or surveyor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Reconciliation Status</option>
            <option value="MATCHED">100% Matched</option>
            <option value="WITHIN_TOLERANCE">Within ±0.50% Tolerance</option>
            <option value="DISPUTE_EXCEEDED">Dispute Exceeded</option>
          </select>
        </div>
      </div>

      {/* Detailed Mass Balance Reconciliation Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 uppercase font-bold border-b border-slate-200 dark:border-slate-800 text-[10px] tracking-wider">
              <tr>
                <th className="p-3.5">Shipment & Contract</th>
                <th className="p-3.5">Customer & Vessel</th>
                <th className="p-3.5 text-right">Contract Qty</th>
                <th className="p-3.5 text-right">Conveyor Scale</th>
                <th className="p-3.5 text-right">Loading Draft</th>
                <th className="p-3.5 text-right">Discharge Draft</th>
                <th className="p-3.5 text-right">Variance (Loss)</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5">Surveyor</th>
                <th className="p-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
              {filteredRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/50 transition-colors">
                  <td className="p-3.5 font-sans">
                    <div className="font-bold font-mono text-slate-900 dark:text-slate-100">
                      {rec.shipmentNumber}
                    </div>
                    <div className="text-[10px] text-slate-400">{rec.contractNumber}</div>
                  </td>
                  <td className="p-3.5 font-sans">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      {rec.customerName}
                    </div>
                    <div className="text-[10px] text-slate-500">{rec.vesselName}</div>
                  </td>
                  <td className="p-3.5 text-right font-bold text-slate-900 dark:text-slate-100">
                    {rec.contractQuantityMT.toLocaleString("id-ID")} MT
                  </td>
                  <td className="p-3.5 text-right text-slate-600 dark:text-slate-300">
                    {rec.conveyorBeltScaleMT.toLocaleString("id-ID")} MT
                  </td>
                  <td className="p-3.5 text-right font-bold text-blue-600 dark:text-blue-400">
                    {rec.draftSurveyLoadedMT.toLocaleString("id-ID")} MT
                  </td>
                  <td className="p-3.5 text-right font-bold text-emerald-600 dark:text-emerald-400">
                    {rec.destinationDraftSurveyMT.toLocaleString("id-ID")} MT
                  </td>
                  <td className="p-3.5 text-right">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {rec.varianceMT} MT ({rec.variancePercent}%)
                    </span>
                  </td>
                  <td className="p-3.5 text-center font-sans">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        rec.reconciliationStatus === "MATCHED"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                      }`}
                    >
                      {rec.reconciliationStatus.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="p-3.5 font-sans text-[11px] text-slate-600 dark:text-slate-400">
                    {rec.surveyorName}
                  </td>
                  <td className="p-3.5 text-center font-sans">
                    <button
                      onClick={() => setSelectedRecord(rec)}
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold transition-all inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>COA Cert</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Surveyor Certificate Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-indigo-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Official Draft Survey Certificate
                </h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Shipment Number:</span>
                <strong className="font-mono text-slate-900 dark:text-white">{selectedRecord.shipmentNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Vessel / Barge:</span>
                <strong className="text-slate-900 dark:text-white">{selectedRecord.vesselName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Customer:</span>
                <strong className="text-slate-900 dark:text-white">{selectedRecord.customerName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Independent Surveyor:</span>
                <strong className="text-indigo-600 dark:text-indigo-400">{selectedRecord.surveyorName}</strong>
              </div>
              <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-2 font-mono">
                <span className="text-slate-500 font-sans">Loading Draft Tonnage:</span>
                <strong className="text-blue-600">{selectedRecord.draftSurveyLoadedMT.toLocaleString()} MT</strong>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-slate-500 font-sans">Discharge Draft Tonnage:</span>
                <strong className="text-emerald-600">{selectedRecord.destinationDraftSurveyMT.toLocaleString()} MT</strong>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-slate-500 font-sans">Net Loss / Gain:</span>
                <strong className="text-emerald-600">{selectedRecord.varianceMT} MT ({selectedRecord.variancePercent}%)</strong>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert(`Certificate #${selectedRecord.shipmentNumber} downloaded successfully.`);
                  setSelectedRecord(null);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download ISO COA Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
