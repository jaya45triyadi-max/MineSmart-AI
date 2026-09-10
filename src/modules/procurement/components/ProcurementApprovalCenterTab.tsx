// MINE SMART AI - Procurement Approval Center Tab

import React, { useState } from "react";
import {
  CheckSquare,
  CheckCircle2,
  XCircle,
  FileText,
  ShoppingCart,
  Clock,
  UserCheck,
  ShieldCheck
} from "lucide-react";
import { PurchaseRequest, PurchaseOrder, Invoice } from "../../../types/procurementTypes";

interface ProcurementApprovalCenterTabProps {
  prs: PurchaseRequest[];
  pos: PurchaseOrder[];
  invoices: Invoice[];
  onApprovePR: (prId: string, comment?: string) => void;
}

export const ProcurementApprovalCenterTab: React.FC<ProcurementApprovalCenterTabProps> = ({
  prs,
  pos,
  invoices,
  onApprovePR,
}) => {
  const pendingPRs = prs.filter((p) => p.status === "SUBMITTED" || p.status === "UNDER_REVIEW");
  const pendingPOs = pos.filter((p) => p.status === "PENDING_APPROVAL");

  const formatIDR = (val: number) => `Rp ${val.toLocaleString("id-ID")}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-amber-400" /> Unified Procurement Approval Center
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Pusat persetujuan bertingkat Purchase Request (PR), Purchase Order (PO), & Verifikasi Invoice
          </p>
        </div>
      </div>

      {/* Pending PR Section */}
      <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-amber-400" /> Pending Purchase Requests ({pendingPRs.length})
        </h3>

        {pendingPRs.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400 bg-slate-900/40 rounded-xl border border-slate-800">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            Tidak ada pengajuan PR yang menunggu persetujuan Anda saat ini.
          </div>
        ) : (
          <div className="space-y-3">
            {pendingPRs.map((pr) => (
              <div key={pr.prId} className="p-4 bg-slate-900/60 rounded-xl border border-slate-700/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-400 font-mono">{pr.prNumber}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300">
                      {pr.priority}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1">{pr.purpose}</h4>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Pemohon: {pr.requesterName} • Departemen: {pr.departmentName}
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                  <span className="text-sm font-bold text-amber-300">{formatIDR(pr.estimatedValue)}</span>
                  <button
                    onClick={() => onApprovePR(pr.prId, "Approved via Approval Center")}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve PR
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
