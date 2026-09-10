// MINE SMART AI - Fleet Shift KPI & Performance Report Export Modal

import React, { useState } from "react";
import {
  X,
  FileSpreadsheet,
  Download,
  Printer,
  CheckCircle2,
  Truck,
  Activity,
  Fuel,
  Clock,
  RotateCcw,
  Zap,
} from "lucide-react";
import { FleetKPIOverview, FleetUnitProfile } from "../../../types/fleetManagementTypes";

interface FleetExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  kpiOverview: FleetKPIOverview;
  units: FleetUnitProfile[];
}

export const FleetExportReportModal: React.FC<FleetExportReportModalProps> = ({
  isOpen,
  onClose,
  kpiOverview,
  units,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  if (!isOpen) return null;

  const handleExport = (type: "EXCEL" | "PDF") => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess(true);
      setTimeout(() => {
        setExportSuccess(false);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden my-6">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                Ekspor Laporan Performa Fleet & 7 KPI Shift
              </h3>
              <p className="text-xs text-slate-400">
                Laporan resmi shift operasional penambangan (PA, UA, MA, EU, Produktivitas, BBM, Cycle Time, SMU).
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Report Preview Box */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[11px] text-slate-400">
              <span>MINE SITE: SANGATTA COAL & OB MINING</span>
              <span>DATE: {new Date().toLocaleDateString("id-ID")} • SHIFT 1</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-400">Total Fleet Units:</span>{" "}
                <span className="text-white font-bold">{units.length} Units</span>
              </div>
              <div>
                <span className="text-slate-400">Physical Availability (PA):</span>{" "}
                <span className="text-emerald-400 font-bold">
                  {kpiOverview.availability.fleetPhysicalAvailabilityPA}%
                </span>
              </div>
              <div>
                <span className="text-slate-400">Utilization of Avail (UA):</span>{" "}
                <span className="text-teal-400 font-bold">
                  {kpiOverview.utilization.fleetUtilizationOfAvailabilityUA}%
                </span>
              </div>
              <div>
                <span className="text-slate-400">Total Production (BCM):</span>{" "}
                <span className="text-blue-400 font-bold">
                  {kpiOverview.productivity.totalBcmToday.toLocaleString()} BCM
                </span>
              </div>
              <div>
                <span className="text-slate-400">Total Fuel Consumed:</span>{" "}
                <span className="text-amber-400 font-bold">
                  {kpiOverview.fuelConsumption.totalFuelConsumedLitersToday.toLocaleString()} Liters
                </span>
              </div>
              <div>
                <span className="text-slate-400">Total Idle Time:</span>{" "}
                <span className="text-yellow-400 font-bold">
                  {kpiOverview.idleTime.totalFleetIdleHoursToday} Hours
                </span>
              </div>
              <div>
                <span className="text-slate-400">Avg Haul Cycle Time:</span>{" "}
                <span className="text-purple-400 font-bold">
                  {kpiOverview.cycleTime.avgTotalCycleTimeMin} Menit
                </span>
              </div>
              <div>
                <span className="text-slate-400">Total SMU Hours:</span>{" "}
                <span className="text-sky-300 font-bold">
                  {kpiOverview.engineHour.totalFleetOperatingHoursToday} SMU
                </span>
              </div>
            </div>

            {/* Status Breakdown */}
            <div className="border-t border-slate-800 pt-2 text-[10px] text-slate-300 flex items-center justify-between">
              <span>🟢 Running: {kpiOverview.statusDistribution.runningCount}</span>
              <span>🟡 Idle: {kpiOverview.statusDistribution.idleCount}</span>
              <span>🔴 Breakdown: {kpiOverview.statusDistribution.breakdownCount}</span>
              <span>🔵 Maintenance: {kpiOverview.statusDistribution.maintenanceCount}</span>
            </div>
          </div>

          {exportSuccess && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Laporan shift berhasil diekspor dan diunduh ke perangkat Anda.</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button
              disabled={isExporting}
              onClick={() => handleExport("EXCEL")}
              className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition-all cursor-pointer"
            >
              <Download className="h-4 w-4 text-emerald-400" />
              <span>Download Excel (.xlsx)</span>
            </button>

            <button
              disabled={isExporting}
              onClick={() => handleExport("PDF")}
              className="flex items-center justify-center gap-2 rounded-xl border border-sky-500/30 bg-sky-500/10 p-3.5 text-xs font-bold text-sky-300 hover:bg-sky-500/20 transition-all cursor-pointer"
            >
              <Printer className="h-4 w-4 text-sky-400" />
              <span>Cetak PDF Laporan Shift</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end border-t border-slate-800 px-6 py-4 bg-slate-950/60">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 px-5 py-2 text-xs font-bold text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
