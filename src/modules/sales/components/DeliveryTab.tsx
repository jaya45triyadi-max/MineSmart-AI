import React from "react";
import {
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Scale,
  FileText,
  Building2,
  DollarSign,
  Download,
} from "lucide-react";
import { DeliveryRecord } from "../../../types/salesTypes";

interface DeliveryTabProps {
  deliveries: DeliveryRecord[];
}

export const DeliveryTab: React.FC<DeliveryTabProps> = ({ deliveries }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-emerald-500" />
          Delivery Management & Proof of Delivery (POD)
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Coal quantity reconciliation (Loaded vs Shipped vs Delivered vs Customer Received), draft survey variances, and signed receipt verification.
        </p>
      </div>

      <div className="space-y-4">
        {deliveries.map((del) => (
          <div
            key={del.id}
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded">
                  {del.deliveryCode}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                  {del.customerName}
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {del.status}
              </span>
            </div>

            {/* Quantity Reconciliation Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Loaded Quantity</span>
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{del.loadedQuantity.toLocaleString("id-ID")} MT</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Shipped Quantity</span>
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{del.shippedQuantity.toLocaleString("id-ID")} MT</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Customer Received</span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{del.receivedQuantity.toLocaleString("id-ID")} MT</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Transit Variance</span>
                <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{del.deliveryVariance} MT (-0.18%)</span>
              </div>
            </div>

            {/* Proof of Delivery Document Card */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-500" />
                  <span className="font-bold text-slate-900 dark:text-slate-100">{del.proofOfDelivery.documentName}</span>
                </div>
                <p className="text-slate-500">
                  Signed by {del.proofOfDelivery.receiptNo} • {del.proofOfDelivery.timestamp}
                </p>
                <p className="text-slate-600 dark:text-slate-300 italic">"{del.proofOfDelivery.notes}"</p>
              </div>

              <button className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-all flex items-center gap-1.5 self-start sm:self-center">
                <Download className="w-3.5 h-3.5" /> Download POD
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
