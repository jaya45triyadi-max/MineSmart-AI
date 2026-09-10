// MINE SMART AI - Dispatch Live Board View

import React, { useState } from "react";
import {
  Truck,
  Filter,
  Search,
  Clock,
  Layers,
  MapPin,
  TrendingUp,
  RefreshCw,
  Activity,
  AlertCircle,
  Radio,
} from "lucide-react";

import { DispatchRecord } from "../../../types/dispatchTypes";

interface DispatchLiveBoardViewProps {
  dispatches: DispatchRecord[];
  onSelectDispatch?: (dispatch: DispatchRecord) => void;
  onUpdateStatus?: (dispatchId: string, newStatus: DispatchRecord["dispatchStatus"]) => void;
}

export const DispatchLiveBoardView: React.FC<DispatchLiveBoardViewProps> = ({
  dispatches,
  onSelectDispatch,
  onUpdateStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [materialFilter, setMaterialFilter] = useState("ALL");

  const filteredDispatches = dispatches.filter((d) => {
    const matchesSearch =
      d.truckUnitCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.excavatorUnitCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.operatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.originName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || d.dispatchStatus === statusFilter;
    const matchesMaterial = materialFilter === "ALL" || d.materialType === materialFilter;

    return matchesSearch && matchesStatus && matchesMaterial;
  });

  const getStatusBadgeColor = (status: DispatchRecord["dispatchStatus"]) => {
    switch (status) {
      case "Assigned":
        return "bg-slate-800 text-slate-300 border-slate-700";
      case "Queued":
        return "bg-rose-950/80 text-rose-300 border-rose-500/40 animate-pulse";
      case "Loading":
        return "bg-amber-950/80 text-amber-300 border-amber-500/40";
      case "Hauling Loaded":
        return "bg-emerald-950/80 text-emerald-300 border-emerald-500/40";
      case "Dumping":
        return "bg-cyan-950/80 text-cyan-300 border-cyan-500/40";
      case "Returning":
        return "bg-teal-950/80 text-teal-300 border-teal-500/40";
      case "Completed":
        return "bg-blue-950/80 text-blue-300 border-blue-500/40";
      case "Exception":
        return "bg-purple-950/80 text-purple-300 border-purple-500/40 animate-bounce";
      case "Cancelled":
        return "bg-slate-900 text-slate-500 border-slate-800";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-amber-400 animate-pulse" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              LIVE DISPATCH FLEET BOARD
            </h3>
            <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
              {filteredDispatches.length} Units Displayed
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>FMS Telemetry Sync: <strong>Semi-Realtime (15s Poll)</strong></span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari Truck (DT-101), Digger, Operator, Origin..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">Semua Status Dispatch</option>
              <option value="Assigned">Assigned</option>
              <option value="Queued">Queued (Antrean)</option>
              <option value="Loading">Loading (Muat)</option>
              <option value="Hauling Loaded">Hauling Loaded (Angkut)</option>
              <option value="Dumping">Dumping (Bongkar)</option>
              <option value="Returning">Returning (Kosong)</option>
              <option value="Exception">Exception (Kendala)</option>
            </select>
          </div>

          <div>
            <select
              value={materialFilter}
              onChange={(e) => setMaterialFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">Semua Material</option>
              <option value="Coal">Coal (Batu Bara)</option>
              <option value="Overburden">Overburden (OB)</option>
              <option value="Interburden">Interburden</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Truck Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredDispatches.map((disp) => {
          const lastUpdateFormatted = disp.lastUpdateTimestamp
            ? disp.lastUpdateTimestamp.slice(11, 16)
            : "10:30";

          return (
            <div
              key={disp.id}
              onClick={() => onSelectDispatch && onSelectDispatch(disp)}
              className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 shadow-xl space-y-3 transition-all cursor-pointer group relative"
            >
              {/* Card Header: Unit Code & Status */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl font-bold">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white font-mono">{disp.truckUnitCode}</h4>
                    <p className="text-[10px] text-slate-400">{disp.operatorName}</p>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 text-[10px] font-extrabold uppercase border rounded-full font-mono ${getStatusBadgeColor(
                    disp.dispatchStatus
                  )}`}
                >
                  {disp.dispatchStatus}
                </span>
              </div>

              {/* Card Body Details */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500 text-[11px]">Excavator:</span>
                  <span className="font-mono font-bold text-amber-300">{disp.excavatorUnitCode}</span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500 text-[11px]">Material:</span>
                  <span className="font-semibold text-slate-200">{disp.materialType}</span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500 text-[11px]">Origin:</span>
                  <span className="font-medium text-slate-300 truncate max-w-[120px]">{disp.originName}</span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500 text-[11px]">Destination:</span>
                  <span className="font-medium text-slate-300 truncate max-w-[120px]">{disp.destinationName}</span>
                </div>
              </div>

              {/* Metrics & Last Update Bar */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                <div className="text-slate-400">
                  Cycle: <strong className="text-white">{disp.totalCycleTimeMin}m</strong>
                </div>
                <div className="text-slate-400">
                  Trip: <strong className="text-emerald-400">{disp.tripCount}</strong>
                </div>
                <div className="text-[10px] text-slate-500" title="Source timestamp">
                  Last Update: {lastUpdateFormatted}
                </div>
              </div>

              {/* Status Mutator Quick Menu (Optional) */}
              {onUpdateStatus && (
                <div className="pt-2 border-t border-slate-800/50 flex items-center justify-end gap-1">
                  <select
                    value={disp.dispatchStatus}
                    onChange={(e) => {
                      e.stopPropagation();
                      onUpdateStatus(disp.dispatchId, e.target.value as any);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-slate-950 text-[10px] text-slate-300 border border-slate-800 rounded px-1.5 py-0.5 focus:outline-none"
                  >
                    <option value="Assigned">Set Assigned</option>
                    <option value="Queued">Set Queued</option>
                    <option value="Loading">Set Loading</option>
                    <option value="Hauling Loaded">Set Hauling</option>
                    <option value="Dumping">Set Dumping</option>
                    <option value="Returning">Set Returning</option>
                    <option value="Exception">Set Exception</option>
                  </select>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
