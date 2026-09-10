import React, { useState } from "react";
import {
  Ship,
  Search,
  Filter,
  Plus,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Anchor,
  X,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { Shipment, ShipmentStatus, QualityComplianceStatus } from "../../../types/salesTypes";

interface ShipmentsTabProps {
  shipments: Shipment[];
  onAddShipment: (shipment: Partial<Shipment>) => void;
  onUpdateShipmentStatus: (shipmentId: string, status: ShipmentStatus) => void;
}

export const ShipmentsTab: React.FC<ShipmentsTabProps> = ({
  shipments,
  onAddShipment,
  onUpdateShipmentStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  const filteredShipments = shipments.filter((s) => {
    const matchesSearch =
      s.shipmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.vesselName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const timelineSteps: ShipmentStatus[] = [
    "PLANNED",
    "SCHEDULED",
    "READY_TO_LOAD",
    "LOADING",
    "LOADED",
    "DEPARTED",
    "IN_TRANSIT",
    "ARRIVED",
    "DELIVERED",
    "COMPLETED",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Ship className="w-5 h-5 text-emerald-500" />
            Barge & Vessel Shipment Dispatch Center
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor river barge logistics, anchorage transshipment, vessel loading speeds, and international voyage tracking.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by shipment number, vessel, customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-slate-100 placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Shipment Statuses</option>
            <option value="IN_TRANSIT">In Transit</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="DELIVERED">Delivered</option>
          </select>
        </div>
      </div>

      {/* Shipment Cards */}
      <div className="space-y-4">
        {filteredShipments.map((shp) => {
          const currentStepIndex = timelineSteps.indexOf(shp.status);

          return (
            <div
              key={shp.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/50 transition-all space-y-5"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md">
                      {shp.shipmentNumber}
                    </span>
                    <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      {shp.vesselType}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded text-xs font-extrabold uppercase ${
                        shp.status === "DELIVERED"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {shp.status.replace("_", " ")}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Anchor className="w-4 h-4 text-emerald-500" />
                    {shp.vesselName} • <span className="text-slate-600 dark:text-slate-400">{shp.customerName}</span>
                  </h3>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Cargo Tonnage</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {shp.quantity.toLocaleString("id-ID")} MT
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Quality Gate</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {shp.qualityStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Interactive Timeline Stepper */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Shipment Voyage Progress
                </span>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-1 text-center text-[10px]">
                  {timelineSteps.map((step, idx) => {
                    const isPassed = idx <= currentStepIndex;
                    const isCurrent = idx === currentStepIndex;

                    return (
                      <div key={step} className="space-y-1">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            isCurrent
                              ? "bg-emerald-500 ring-2 ring-emerald-500/30"
                              : isPassed
                              ? "bg-emerald-400"
                              : "bg-slate-200 dark:bg-slate-800"
                          }`}
                        ></div>
                        <span
                          className={`block truncate font-semibold text-[9px] ${
                            isCurrent
                              ? "text-emerald-600 dark:text-emerald-400 font-bold"
                              : isPassed
                              ? "text-slate-700 dark:text-slate-300"
                              : "text-slate-400"
                          }`}
                        >
                          {step.replace("_", " ")}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ports & Dates */}
              <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>Loading: <strong className="text-slate-800 dark:text-slate-200">{shp.loadingPort}</strong></span>
                  <span>→</span>
                  <span>Destination: <strong className="text-slate-800 dark:text-slate-200">{shp.destinationName}</strong></span>
                </div>

                {shp.status === "IN_TRANSIT" && (
                  <button
                    onClick={() => onUpdateShipmentStatus(shp.id, "DELIVERED")}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs shadow"
                  >
                    Mark as Delivered
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
