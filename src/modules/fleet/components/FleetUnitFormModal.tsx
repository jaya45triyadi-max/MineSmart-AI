// MINE SMART AI - Fleet Unit Create & Edit Form Modal

import React, { useState } from "react";
import { X, Truck, Save, Plus, ShieldCheck, Fuel, Clock, MapPin, Wrench } from "lucide-react";
import { FleetUnitProfile, FleetUnitStatus, FleetCategory } from "../../../types/fleetManagementTypes";

interface FleetUnitFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (unit: FleetUnitProfile) => void;
  initialUnit?: FleetUnitProfile | null;
}

export const FleetUnitFormModal: React.FC<FleetUnitFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialUnit,
}) => {
  const [formData, setFormData] = useState({
    unitId: initialUnit?.unitId || "DT-785-07",
    brand: initialUnit?.brand || "Komatsu",
    model: initialUnit?.model || "HD785-7",
    category: initialUnit?.category || ("DUMP_TRUCK" as FleetCategory),
    capacity: initialUnit?.capacity || "91.0 Ton / 60 m³",
    capacityValue: initialUnit?.capacityValue || 91.0,
    engineHour: initialUnit?.engineHour || 12500,
    fuelTankCapacityLiters: initialUnit?.fuelTankCapacityLiters || 1308,
    fuelLevelPercent: initialUnit?.fuelLevelPercent || 80,
    location: initialUnit?.location || "Pit 1 South (RL +45m)",
    pitArea: initialUnit?.pitArea || ("Pit 1 South" as const),
    status: initialUnit?.status || ("RUNNING" as FleetUnitStatus),
    statusReason: initialUnit?.statusReason || "Siap beroperasi produksi aktif",
    operatorName: initialUnit?.operator?.name || "Budi Pratama",
    operatorId: initialUnit?.operator?.operatorId || "OP-DT-107",
    simperNumber: initialUnit?.operator?.simperNumber || "SIMPER-SGT-785-025",
    nextServiceSMU: initialUnit?.maintenance?.nextServiceSMU || 12750,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = initialUnit?.id || `fleet-${formData.unitId.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
    const now = new Date().toISOString();

    const newProfile: FleetUnitProfile = {
      id,
      createdAt: initialUnit?.createdAt || now,
      unitId: formData.unitId,
      brand: formData.brand,
      model: formData.model,
      category: formData.category,
      capacity: formData.capacity,
      capacityValue: Number(formData.capacityValue),
      capacityUnit: "Ton",
      engineHour: Number(formData.engineHour),
      shiftStartEngineHour: Number(formData.engineHour),
      shiftDeltaEngineHour: 4.5,
      engineRpm: formData.status === "RUNNING" ? 1800 : formData.status === "IDLE" ? 750 : 0,
      engineTemperatureC: formData.status === "BREAKDOWN" ? 96 : 82,
      oilPressureKpa: formData.status === "BREAKDOWN" ? 120 : 420,
      fuelLevelPercent: Number(formData.fuelLevelPercent),
      fuelTankCapacityLiters: Number(formData.fuelTankCapacityLiters),
      fuelCurrentLiters: Math.round(
        (Number(formData.fuelTankCapacityLiters) * Number(formData.fuelLevelPercent)) / 100
      ),
      fuelBurnRateLitersPerHour: formData.category === "EXCAVATOR" ? 180 : 60,
      fuelSpecificConsumption: 0.22,
      shiftTotalFuelConsumedLiters: 270,
      fuelCostTodayUsd: 297,
      location: formData.location,
      pitArea: formData.pitArea,
      latitude: -0.5025,
      longitude: 117.4895,
      elevationRl: 45,
      lastGpsUpdate: now,
      status: formData.status,
      statusChangeTimestamp: now,
      statusReason: formData.statusReason,
      operator: {
        operatorId: formData.operatorId,
        name: formData.operatorName,
        nik: "EMP-2023-109",
        badgeNumber: "BADGE-5599",
        simperNumber: formData.simperNumber,
        simperExpiry: "2028-12-31",
        shift: "SHIFT_1_DAY",
        fatigueScore: 20,
        fatigueStatus: "FIT_TO_WORK",
        assignedSince: now,
        operatorRating: 4.8,
        phone: "+62 812-9900-8811",
      },
      maintenance: {
        lastServiceDate: "2026-08-01",
        lastServiceSMU: Number(formData.engineHour) - 200,
        lastServiceType: "PM_250",
        nextServiceSMU: Number(formData.nextServiceSMU),
        remainingHoursToService: Number(formData.nextServiceSMU) - Number(formData.engineHour),
        serviceStatus: "GOOD",
        assignedMechanic: "Hendro Wibowo, S.T.",
        componentHealth: {
          engine: 95,
          transmission: 92,
          hydraulic: 94,
          finalDrive: 91,
          tiresOrTracks: 88,
          brakeSystem: 95,
        },
      },
      availability: {
        physicalAvailabilityPA: 92.5,
        mechanicalAvailabilityMA: 95.0,
      },
      utilization: {
        utilizationOfAvailabilityUA: 85.0,
        effectiveUtilizationEU: 78.6,
      },
      productivity: {
        bcmPerHour: formData.category === "EXCAVATOR" ? 850 : 0,
        tonPerHour: formData.category === "DUMP_TRUCK" ? 270 : 0,
        tripsCountToday: 15,
        totalTonsHauledToday: 1350,
        totalBcmExcavatedToday: 0,
        payloadCompliancePercent: 98.5,
        actualAvgPayloadTons: Number(formData.capacityValue),
        targetPayloadTons: Number(formData.capacityValue),
      },
      idleTime: {
        totalIdleHoursToday: 0.8,
        idlePercentageOfShift: 10,
        idleFuelBurnLiters: 15,
        idleCostImpactUsd: 16.5,
        primaryIdleReason: "Shovel Queue",
      },
      cycleTime: {
        queueAtLoaderMin: 2.5,
        spotAtLoaderMin: 0.8,
        loadingTimeMin: 3.2,
        haulLoadedMin: 9.5,
        queueAtDumpMin: 1.0,
        dumpingTimeMin: 1.2,
        returnEmptyMin: 7.2,
        totalCycleTimeMin: 25.4,
        haulDistanceKm: 3.4,
        avgSpeedLoadedKmh: 24.0,
        avgSpeedEmptyKmh: 31.0,
      },
      speedKmh: formData.status === "RUNNING" ? 25.0 : 0,
      payloadTonActual: Number(formData.capacityValue),
      isGpsOnline: true,
      notes: "Unit profil berhasil diverifikasi dan tersinkronisasi dengan FMS telemetri.",
      updatedAt: now,
    };

    onSubmit(newProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden my-6">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                {initialUnit ? "Edit Profil Unit Fleet" : "Tambah Profil Unit Baru"}
              </h3>
              <p className="text-xs text-slate-400">
                Lengkapi spesifikasi unit, status, operator, fuel tank, dan jadwal maintenance.
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Section 1: Identity & Specifications */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              1. Identitas & Spesifikasi Unit
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Unit ID *</label>
                <input
                  type="text"
                  required
                  value={formData.unitId}
                  onChange={(e) => setFormData({ ...formData, unitId: e.target.value })}
                  placeholder="e.g. DT-785-07"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Brand *</label>
                <input
                  type="text"
                  required
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="e.g. Komatsu / CAT"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Model *</label>
                <input
                  type="text"
                  required
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="e.g. HD785-7 / 777E"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Kategori Fleet</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="DUMP_TRUCK">Dump Truck</option>
                  <option value="EXCAVATOR">Excavator / Shovel</option>
                  <option value="DOZER">Dozer</option>
                  <option value="MOTOR_GRADER">Motor Grader</option>
                  <option value="WATER_TRUCK">Water Truck</option>
                  <option value="WHEEL_LOADER">Wheel Loader</option>
                  <option value="DRILL_RIG">Drill Rig</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Kapasitas (Label)</label>
                <input
                  type="text"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  placeholder="e.g. 91.0 Ton / 60 m³"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">
                  Engine Hour Total (SMU) *
                </label>
                <input
                  type="number"
                  required
                  value={formData.engineHour}
                  onChange={(e) => setFormData({ ...formData, engineHour: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Status & Location */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              2. Status Operasional & Lokasi
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Status Operasi</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="RUNNING">🟢 Running (Beroperasi Aktif)</option>
                  <option value="IDLE">🟡 Idle (Standby / Antrian)</option>
                  <option value="BREAKDOWN">🔴 Breakdown (Rusak Lapangan)</option>
                  <option value="MAINTENANCE">🔵 Maintenance (Workshop)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Keterangan / Alasan Status</label>
                <input
                  type="text"
                  value={formData.statusReason}
                  onChange={(e) => setFormData({ ...formData, statusReason: e.target.value })}
                  placeholder="e.g. Hauling overburden ke Disposal North"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Lokasi Tambang (Pit / Area)</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Pit 1 South - Bench 10 (RL +45m)"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Area Pit Dropdown</label>
                <select
                  value={formData.pitArea}
                  onChange={(e) => setFormData({ ...formData, pitArea: e.target.value as any })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Pit 1 South">Pit 1 South</option>
                  <option value="Pit 2 North">Pit 2 North</option>
                  <option value="Disposal North">Disposal North</option>
                  <option value="Stockpile ROM A">Stockpile ROM A</option>
                  <option value="Workshop Bay">Workshop Bay</option>
                  <option value="Haul Road">Haul Road</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Fuel & Maintenance */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              3. Bahan Bakar & Jadwal Servis
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Kapasitas Tangki (L)</label>
                <input
                  type="number"
                  value={formData.fuelTankCapacityLiters}
                  onChange={(e) =>
                    setFormData({ ...formData, fuelTankCapacityLiters: Number(e.target.value) })
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Level BBM Saat Ini (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.fuelLevelPercent}
                  onChange={(e) =>
                    setFormData({ ...formData, fuelLevelPercent: Number(e.target.value) })
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Target Next PM (SMU)</label>
                <input
                  type="number"
                  value={formData.nextServiceSMU}
                  onChange={(e) =>
                    setFormData({ ...formData, nextServiceSMU: Number(e.target.value) })
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Operator */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              4. Penugasan Operator
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Nama Operator</label>
                <input
                  type="text"
                  value={formData.operatorName}
                  onChange={(e) => setFormData({ ...formData, operatorName: e.target.value })}
                  placeholder="e.g. Budi Pratama"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Operator ID</label>
                <input
                  type="text"
                  value={formData.operatorId}
                  onChange={(e) => setFormData({ ...formData, operatorId: e.target.value })}
                  placeholder="e.g. OP-DT-107"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Nomor SIMPER</label>
                <input
                  type="text"
                  value={formData.simperNumber}
                  onChange={(e) => setFormData({ ...formData, simperNumber: e.target.value })}
                  placeholder="e.g. SIMPER-SGT-785-025"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Batal
            </button>

            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2 text-xs font-bold text-slate-950 hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>Simpan Profil Unit</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
