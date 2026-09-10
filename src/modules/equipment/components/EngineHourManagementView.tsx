// MINE SMART AI - Engine Hour Management & Anomaly Detection View

import React, { useState } from "react";
import { Clock, AlertTriangle, CheckCircle2, TrendingUp, Plus, ShieldAlert } from "lucide-react";
import { Equipment } from "../../../types/equipmentTypes";
import { EquipmentCalculationService } from "../../../services/equipment/EquipmentCalculationService";

interface EngineHourManagementViewProps {
  equipmentList: Equipment[];
  onUpdateEngineHour: (equipmentId: string, newHour: number) => void;
}

export const EngineHourManagementView: React.FC<EngineHourManagementViewProps> = ({
  equipmentList,
  onUpdateEngineHour,
}) => {
  const [selectedUnitId, setSelectedUnitId] = useState(equipmentList[0]?.id || "");
  const [inputHour, setInputHour] = useState<number>(15000);
  const [logSource, setLogSource] = useState<"Telemetry" | "Manual Shift Log">("Manual Shift Log");
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    isAnomaly: boolean;
    errorReason?: string;
  } | null>(null);

  const selectedUnit = equipmentList.find((e) => e.id === selectedUnitId) || equipmentList[0];

  const handleValidateAndSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUnit) return;

    const res = EquipmentCalculationService.validateEngineHour(selectedUnit.engineHour, inputHour);
    setValidationResult(res);

    if (res.isValid && !res.isAnomaly) {
      onUpdateEngineHour(selectedUnit.id, inputHour);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <span>ENGINE HOUR MANAGEMENT & ANOMALY DETECTION</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Validasi Pembacaan Hour Meter (SMU), Pencegahan Manipulasi Data Engine Hour, & Proyeksi Service Interval
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Logging */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
            Catat Pembacaan Jam Kerja (SMU)
          </h3>

          <form onSubmit={handleValidateAndSave} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Pilih Unit Alat Tambang</label>
              <select
                value={selectedUnitId}
                onChange={(e) => {
                  setSelectedUnitId(e.target.value);
                  const unit = equipmentList.find((item) => item.id === e.target.value);
                  if (unit) setInputHour(unit.engineHour + 10);
                  setValidationResult(null);
                }}
                className="w-full p-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
              >
                {equipmentList.map((eq) => (
                  <option key={eq.id} value={eq.id}>
                    {eq.unitCode} ({eq.brand} {eq.model}) - Saat Ini: {eq.engineHour.toLocaleString()} h
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Current SMU Reading (Jam)</label>
              <input
                type="number"
                value={inputHour}
                onChange={(e) => setInputHour(Number(e.target.value))}
                className="w-full p-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Sumber Input Pembacaan</label>
              <select
                value={logSource}
                onChange={(e) => setLogSource(e.target.value as any)}
                className="w-full p-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
              >
                <option value="Manual Shift Log">Manual Shift Log Operator</option>
                <option value="Telemetry">CAN-BUS Telemetry Auto Sync</option>
              </select>
            </div>

            {validationResult && (
              <div
                className={`p-3 rounded-xl border text-xs font-sans ${
                  validationResult.isAnomaly
                    ? "bg-rose-950/50 border-rose-500/50 text-rose-300"
                    : "bg-emerald-950/50 border-emerald-500/50 text-emerald-300"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  {validationResult.isAnomaly ? (
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                  <span>
                    {validationResult.isAnomaly ? "Peringatan Anomali Engine Hour" : "Validasi SMU Sukses"}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {validationResult.errorReason || "Pembacaan SMU baru berada dalam batas toleransi kenaikan wajar."}
                </p>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white rounded-xl cursor-pointer transition-all shadow-lg shadow-amber-900/30"
            >
              Simpan & Validasi Jam Kerja
            </button>
          </form>
        </div>

        {/* Forecast & Interval Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
              Proyeksi Maintenance Interval & Service Forecast
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {equipmentList.slice(0, 4).map((eq) => {
                const nextServiceHour = Math.ceil(eq.engineHour / 250) * 250;
                const hoursToService = nextServiceHour - eq.engineHour;

                return (
                  <div key={eq.id} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-400">{eq.unitCode}</span>
                      <span className="text-[10px] text-slate-400">{eq.equipmentType}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-sans">Current SMU:</span>
                      <span className="font-bold text-white">{eq.engineHour.toLocaleString()} h</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-sans">Next Service Due:</span>
                      <span className="font-bold text-sky-400">{nextServiceHour.toLocaleString()} h</span>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-slate-400 font-sans">Sisa Waktu Operasi:</span>
                      <span className="font-bold text-emerald-400">+{hoursToService} h</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
