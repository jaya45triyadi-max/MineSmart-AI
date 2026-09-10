// MINE SMART AI - Equipment & Fleet Management Module Container

import React, { useState } from "react";
import {
  Truck,
  Gauge,
  Clock,
  Wrench,
  Users,
  Radio,
  MapPin,
  TrendingUp,
  Activity,
  Layers,
  Sparkles,
  FileSpreadsheet,
  AlertTriangle,
  Compass,
  CheckCircle2,
  List,
} from "lucide-react";

import { Equipment, EquipmentAlert } from "../../types/equipmentTypes";
import { equipmentRepository } from "../../services/repositories/EquipmentRepository";
import { INITIAL_OPERATORS, INITIAL_DOWNTIME_RECORDS, INITIAL_FLEET_DISPATCH, INITIAL_EQUIPMENT_ALERTS } from "../../data/equipmentData";

import { EquipmentHeader } from "./components/EquipmentHeader";
import { FleetCommandCenterDashboard } from "./components/FleetCommandCenterDashboard";
import { EquipmentUnitsView } from "./components/EquipmentUnitsView";
import { ExcavatorView } from "./components/ExcavatorView";
import { DumpTruckView } from "./components/DumpTruckView";
import { DozerView } from "./components/DozerView";
import { GraderView } from "./components/GraderView";
import { WaterTruckView } from "./components/WaterTruckView";
import { LightVehicleView } from "./components/LightVehicleView";
import { EngineHourManagementView } from "./components/EngineHourManagementView";
import { DowntimeManagementView } from "./components/DowntimeManagementView";
import { OperatorManagementView } from "./components/OperatorManagementView";
import { FleetDispatchView } from "./components/FleetDispatchView";
import { FleetShiftView } from "./components/FleetShiftView";
import { UtilizationView } from "./components/UtilizationView";
import { AvailabilityView } from "./components/AvailabilityView";
import { EquipmentLocationsView } from "./components/EquipmentLocationsView";

interface EquipmentModuleProps {
  onOpenAICopilot?: () => void;
  initialSubRoute?: string;
}

export const EquipmentModule: React.FC<EquipmentModuleProps> = ({
  onOpenAICopilot,
  initialSubRoute = "overview",
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialSubRoute);

  // State
  const [equipmentList, setEquipmentList] = useState<Equipment[]>(equipmentRepository.getAllUnits());
  const [operators, setOperators] = useState(INITIAL_OPERATORS);
  const [downtimeRecords, setDowntimeRecords] = useState(INITIAL_DOWNTIME_RECORDS);
  const [dispatchAssignments, setDispatchAssignments] = useState(INITIAL_FLEET_DISPATCH);
  const [alerts, setAlerts] = useState<EquipmentAlert[]>(INITIAL_EQUIPMENT_ALERTS);

  // Unit detail modal/drawer selection
  const [selectedUnit, setSelectedUnit] = useState<Equipment | null>(null);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);
  const [isNewUnitModalOpen, setIsNewUnitModalOpen] = useState(false);

  // Form state for new unit
  const [newUnitData, setNewUnitData] = useState<Partial<Equipment>>({
    unitCode: "EX-205",
    equipmentType: "Excavator",
    brand: "Komatsu",
    model: "PC1250SP-8",
    capacity: "7.0 m³ Bucket",
    location: "Pit 1 South",
    status: "Operating",
    engineHour: 1200,
    physicalAvailabilityPA: 95,
    useOfAvailabilityUA: 85,
    healthScore: "Healthy",
    healthScoreValue: 95,
  });

  const handleRefreshData = () => {
    setEquipmentList([...equipmentRepository.getAllUnits()]);
  };

  const handleCreateNewUnit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `EQ-${newUnitData.unitCode?.replace("-", "") || "NEW"}`;
    const newEq: Equipment = {
      id,
      equipmentId: id,
      unitCode: newUnitData.unitCode || "EQ-999",
      companyId: "COMP-BNU-01",
      siteId: "SITE-KAL-A",
      equipmentType: newUnitData.equipmentType || "Excavator",
      brand: newUnitData.brand || "Komatsu",
      model: newUnitData.model || "PC1250",
      serialNumber: `SN-${Math.floor(Math.random() * 900000 + 100000)}`,
      assetNumber: `AST-${newUnitData.unitCode}`,
      year: 2024,
      ownershipType: "OWNED",
      capacity: newUnitData.capacity || "N/A",
      fuelType: "B35 Biodiesel",
      status: (newUnitData.status as any) || "Operating",
      location: newUnitData.location || "Pit 1",
      operatorId: "OP-001",
      operatorName: "Supriadi",
      engineHour: Number(newUnitData.engineHour) || 0,
      odometerKm: 0,
      purchaseDate: new Date().toISOString().split("T")[0],
      commissionDate: new Date().toISOString().split("T")[0],
      department: "Mining Operations",
      costCenter: "CC-PIT1",
      description: "Unit Tambang Baru",
      physicalAvailabilityPA: Number(newUnitData.physicalAvailabilityPA) || 90,
      mechanicalAvailabilityMA: 92,
      useOfAvailabilityUA: Number(newUnitData.useOfAvailabilityUA) || 80,
      fuelLevelPercent: 85,
      healthScore: "Healthy",
      healthScoreValue: 90,
      latitude: -0.502,
      longitude: 117.489,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "ADMIN",
      updatedBy: "ADMIN",
    };

    equipmentRepository.addUnit(newEq);
    handleRefreshData();
    setIsNewUnitModalOpen(false);
  };

  const handleUpdateUnitStatus = (id: string, newStatus: Equipment["status"]) => {
    equipmentRepository.updateUnit(id, { status: newStatus });
    handleRefreshData();
  };

  // Metrics summary
  const totalUnits = equipmentList.length;
  const operatingUnits = equipmentList.filter((e) => e.status === "Operating").length;
  const breakdownUnits = equipmentList.filter((e) => e.status === "Breakdown" || e.status === "Down" || e.status === "Maintenance").length;
  const avgPA = totalUnits > 0
    ? Number((equipmentList.reduce((acc, curr) => acc + curr.physicalAvailabilityPA, 0) / totalUnits).toFixed(1))
    : 90;
  const avgUA = totalUnits > 0
    ? Number((equipmentList.reduce((acc, curr) => acc + curr.useOfAvailabilityUA, 0) / totalUnits).toFixed(1))
    : 81;

  // Sub-navigation tabs
  const navigationTabs = [
    { id: "overview", label: "Command Center", icon: Activity, badge: "Live" },
    { id: "units", label: "Fleet Master Units", icon: Truck, count: totalUnits },
    { id: "excavators", label: "Excavators", icon: Layers },
    { id: "dump-trucks", label: "Dump Trucks", icon: Truck },
    { id: "dozers", label: "Dozers", icon: Compass },
    { id: "graders", label: "Graders", icon: Compass },
    { id: "water-trucks", label: "Water Trucks", icon: Truck },
    { id: "light-vehicles", label: "Light Vehicles", icon: Truck },
    { id: "engine-hours", label: "Engine Hours & SMU", icon: Gauge },
    { id: "downtime", label: "Downtime & Repair", icon: Wrench, alert: breakdownUnits > 0 ? breakdownUnits : undefined },
    { id: "operators", label: "Operator Fleet", icon: Users },
    { id: "dispatch", label: "FMS Dispatch", icon: Radio },
    { id: "shifts", label: "Shift Roster", icon: Clock },
    { id: "utilization", label: "Utilization (UA%)", icon: TrendingUp },
    { id: "availability", label: "Availability (PA%)", icon: CheckCircle2 },
    { id: "locations", label: "GPS Map", icon: MapPin },
  ];

  const handleExportFleet = () => {
    const csvContent = [
      ["Unit Code", "Equipment Type", "Brand/Model", "Status", "Location", "Engine Hours (SMU)", "PA %", "UA %", "Health"].join(","),
      ...equipmentList.map((e) =>
        [
          e.unitCode,
          e.equipmentType,
          `"${e.brand} ${e.model}"`,
          e.status,
          `"${e.location}"`,
          e.engineHour,
          e.physicalAvailabilityPA,
          e.useOfAvailabilityUA,
          e.healthScore,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `MINE_SMART_AI_FLEET_EXPORT_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <EquipmentHeader
        totalUnits={totalUnits}
        operatingUnits={operatingUnits}
        breakdownUnits={breakdownUnits}
        avgPA={avgPA}
        avgUA={avgUA}
        onNewUnit={() => setIsNewUnitModalOpen(true)}
        onDispatch={() => setActiveTab("dispatch")}
        onOpenAlerts={() => setIsAlertsModalOpen(true)}
        onOpenAI={onOpenAICopilot || (() => {})}
        onExport={handleExportFleet}
      />

      {/* Navigation Sub-Tabs Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-lg overflow-x-auto scrollbar-thin">
        <div className="flex items-center gap-1 min-w-max">
          {navigationTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 text-xs font-medium rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-slate-950" : "text-amber-400"}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`px-1.5 py-0.2 text-[9px] font-bold rounded-full uppercase ${
                      isActive ? "bg-slate-950 text-amber-300" : "bg-amber-500/20 text-amber-300"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
                {tab.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 text-[10px] font-bold rounded-full ${
                      isActive ? "bg-slate-950/30 text-slate-950" : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
                {tab.alert !== undefined && (
                  <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-rose-500 text-white animate-pulse">
                    {tab.alert}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content View Switcher */}
      <div>
        {activeTab === "overview" && (
          <FleetCommandCenterDashboard
            equipmentList={equipmentList}
            alerts={alerts}
            onSelectUnit={(unit) => {
              setSelectedUnit(unit);
              setActiveTab("units");
            }}
            onOpenAI={onOpenAICopilot || (() => {})}
            onNavigateTab={(tabKey) => setActiveTab(tabKey)}
          />
        )}

        {activeTab === "units" && (
          <EquipmentUnitsView
            equipmentList={equipmentList}
            onSelectUnit={(unit) => setSelectedUnit(unit)}
            onUpdateStatus={handleUpdateUnitStatus}
          />
        )}

        {activeTab === "excavators" && (
          <ExcavatorView
            equipmentList={equipmentList}
            onSelectUnit={(unit) => setSelectedUnit(unit)}
          />
        )}

        {activeTab === "dump-trucks" && (
          <DumpTruckView
            equipmentList={equipmentList}
            onSelectUnit={(unit) => setSelectedUnit(unit)}
          />
        )}

        {activeTab === "dozers" && (
          <DozerView
            equipmentList={equipmentList}
            onSelectUnit={(unit) => setSelectedUnit(unit)}
          />
        )}

        {activeTab === "graders" && (
          <GraderView
            equipmentList={equipmentList}
            onSelectUnit={(unit) => setSelectedUnit(unit)}
          />
        )}

        {activeTab === "water-trucks" && (
          <WaterTruckView
            equipmentList={equipmentList}
            onSelectUnit={(unit) => setSelectedUnit(unit)}
          />
        )}

        {activeTab === "light-vehicles" && (
          <LightVehicleView
            equipmentList={equipmentList}
            onSelectUnit={(unit) => setSelectedUnit(unit)}
          />
        )}

        {activeTab === "engine-hours" && (
          <EngineHourManagementView
            equipmentList={equipmentList}
            onUpdateHour={(id, newHour) => {
              equipmentRepository.updateUnit(id, { engineHour: newHour });
              handleRefreshData();
            }}
          />
        )}

        {activeTab === "downtime" && (
          <DowntimeManagementView
            downtimeRecords={downtimeRecords}
            equipmentList={equipmentList}
            onResolveDowntime={(id) => {
              setDowntimeRecords((prev) =>
                prev.map((r) => (r.id === id ? { ...r, status: "RESOLVED", isResolved: true } : r))
              );
            }}
          />
        )}

        {activeTab === "operators" && (
          <OperatorManagementView
            operators={operators}
            equipmentList={equipmentList}
            onAssignOperator={(opId, eqId) => {
              const eq = equipmentList.find((e) => e.id === eqId);
              if (eq) {
                equipmentRepository.updateUnit(eqId, { operatorId: opId });
                handleRefreshData();
              }
            }}
          />
        )}

        {activeTab === "dispatch" && (
          <FleetDispatchView
            dispatchAssignments={dispatchAssignments}
            equipmentList={equipmentList}
            onUpdateDispatch={(id, status) => {
              setDispatchAssignments((prev) =>
                prev.map((a) => (a.id === id ? { ...a, status: status as any } : a))
              );
            }}
          />
        )}

        {activeTab === "shifts" && (
          <FleetShiftView
            equipmentList={equipmentList}
          />
        )}

        {activeTab === "utilization" && (
          <UtilizationView
            equipmentList={equipmentList}
          />
        )}

        {activeTab === "availability" && (
          <AvailabilityView
            equipmentList={equipmentList}
          />
        )}

        {activeTab === "locations" && (
          <EquipmentLocationsView
            equipmentList={equipmentList}
            onSelectUnit={(unit) => setSelectedUnit(unit)}
          />
        )}
      </div>

      {/* New Unit Creation Modal */}
      {isNewUnitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-xl space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Truck className="w-5 h-5" />
                <h3>TAMBAH UNIT ALAT BERAT BARU</h3>
              </div>
              <button
                onClick={() => setIsNewUnitModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewUnit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Kode Unit (Unit Code)</label>
                  <input
                    type="text"
                    value={newUnitData.unitCode || ""}
                    onChange={(e) => setNewUnitData({ ...newUnitData, unitCode: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    placeholder="Contoh: EX-205 / HT-110"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Kategori Alat</label>
                  <select
                    value={newUnitData.equipmentType || "Excavator"}
                    onChange={(e) => setNewUnitData({ ...newUnitData, equipmentType: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Excavator">Excavator</option>
                    <option value="Dump Truck">Dump Truck</option>
                    <option value="Dozer">Dozer</option>
                    <option value="Grader">Grader</option>
                    <option value="Water Truck">Water Truck</option>
                    <option value="Light Vehicle">Light Vehicle</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Merek / Brand</label>
                  <input
                    type="text"
                    value={newUnitData.brand || ""}
                    onChange={(e) => setNewUnitData({ ...newUnitData, brand: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    placeholder="Komatsu / Caterpillar"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Model / Tipe Model</label>
                  <input
                    type="text"
                    value={newUnitData.model || ""}
                    onChange={(e) => setNewUnitData({ ...newUnitData, model: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    placeholder="PC1250 / HD785"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Kapasitas / Bucket/Vessel</label>
                  <input
                    type="text"
                    value={newUnitData.capacity || ""}
                    onChange={(e) => setNewUnitData({ ...newUnitData, capacity: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    placeholder="7.0 m³ / 60 Ton"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Lokasi Awal Tambang</label>
                  <input
                    type="text"
                    value={newUnitData.location || ""}
                    onChange={(e) => setNewUnitData({ ...newUnitData, location: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    placeholder="Pit 1 South"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Initial Engine Hour (SMU)</label>
                  <input
                    type="number"
                    value={newUnitData.engineHour || 0}
                    onChange={(e) => setNewUnitData({ ...newUnitData, engineHour: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Status Operasional</label>
                  <select
                    value={newUnitData.status || "Operating"}
                    onChange={(e) => setNewUnitData({ ...newUnitData, status: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Operating">Operating</option>
                    <option value="Standby">Standby</option>
                    <option value="Idle">Idle</option>
                    <option value="Breakdown">Breakdown</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewUnitModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-amber-500 text-slate-950 rounded-xl hover:bg-amber-400"
                >
                  Simpan Unit Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Alerts Modal */}
      {isAlertsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-2xl space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-rose-400 font-bold">
                <AlertTriangle className="w-5 h-5" />
                <h3>DAFTAR PERINGATAN FLEET (ALERTS)</h3>
              </div>
              <button
                onClick={() => setIsAlertsModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {alerts.map((alt) => (
                <div
                  key={alt.id}
                  className={`p-4 rounded-xl border ${
                    alt.severity === "CRITICAL"
                      ? "bg-rose-950/30 border-rose-500/40 text-rose-200"
                      : "bg-amber-950/30 border-amber-500/40 text-amber-200"
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-xs mb-1">
                    <span className="font-mono text-white">[{alt.unitCode}] {alt.title}</span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-950">
                      {alt.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{alt.message}</p>
                  <p className="text-[10px] text-slate-400 mt-2 font-mono">
                    Waktu: {new Date(alt.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsAlertsModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold bg-slate-800 text-slate-200 rounded-xl hover:bg-slate-700"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
