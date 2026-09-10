// MINE SMART AI - Maintenance Types View (Preventive, Predictive, Corrective, Breakdown)

import React, { useState } from "react";
import {
  CalendarClock,
  Cpu,
  Wrench,
  AlertOctagon,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Search,
  Filter,
  Plus,
  ArrowRight,
  TrendingUp,
  Activity,
  Zap,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import {
  MaintenanceTypeDefinition,
  MaintenanceType,
  WorkOrder
} from "../../types/maintenanceTypes";

interface MaintenanceTypesViewProps {
  maintenanceTypes: MaintenanceTypeDefinition[];
  workOrders: WorkOrder[];
  onSelectType: (type: MaintenanceType) => void;
  onCreateWOForType: (type: MaintenanceType) => void;
  onOpenWorkOrder: (wo: WorkOrder) => void;
}

interface EquipmentPMStatus {
  code: string;
  name: string;
  type: string;
  currentSMU: number;
  lastPMType: string;
  lastPMSMU: number;
  nextPMType: string;
  nextPMSMU: number;
  hoursUntilNextPM: number;
  pmProgressPercent: number;
  status: "OK" | "DUE_SOON" | "OVERDUE";
}

const FLEET_PM_TRACKER: EquipmentPMStatus[] = [
  { code: "EX-101", name: "Excavator CAT 6020B #101", type: "Excavator (CAT 6020B)", currentSMU: 18450, lastPMType: "PM 250", lastPMSMU: 18250, nextPMType: "PM 500", nextPMSMU: 18500, hoursUntilNextPM: 50, pmProgressPercent: 80.0, status: "DUE_SOON" },
  { code: "EX-102", name: "Excavator Komatsu PC2000 #102", type: "Excavator (Komatsu PC2000-8)", currentSMU: 14280, lastPMType: "PM 1000", lastPMSMU: 14000, nextPMType: "PM 250", nextPMSMU: 14250, hoursUntilNextPM: -30, pmProgressPercent: 112.0, status: "OVERDUE" },
  { code: "EX-104", name: "Excavator Komatsu PC1250 #104", type: "Excavator (Komatsu PC1250)", currentSMU: 14280, lastPMType: "PM 500", lastPMSMU: 14000, nextPMType: "PM 250", nextPMSMU: 14250, hoursUntilNextPM: 20, pmProgressPercent: 92.0, status: "DUE_SOON" },
  { code: "HT-201", name: "Dump Truck Scania P410 #201", type: "Dump Truck (Scania P410)", currentSMU: 9840, lastPMType: "PM 250", lastPMSMU: 9750, nextPMType: "PM 250", nextPMSMU: 10000, hoursUntilNextPM: 160, pmProgressPercent: 36.0, status: "OK" },
  { code: "HT-202", name: "Dump Truck Scania P410 #202", type: "Dump Truck (Scania P410)", currentSMU: 11420, lastPMType: "PM 500", lastPMSMU: 11000, nextPMType: "PM 250", nextPMSMU: 11500, hoursUntilNextPM: 80, pmProgressPercent: 84.0, status: "DUE_SOON" },
  { code: "HT-204", name: "Dump Truck CAT 777E #204", type: "Dump Truck (CAT 777E)", currentSMU: 16890, lastPMType: "PM 2000", lastPMSMU: 16000, nextPMType: "PM 250", nextPMSMU: 17000, hoursUntilNextPM: 110, pmProgressPercent: 89.0, status: "OK" },
  { code: "DZ-301", name: "Bulldozer CAT D8R #301", type: "Bulldozer (CAT D8R)", currentSMU: 7510, lastPMType: "PM 250", lastPMSMU: 7250, nextPMType: "PM 500", nextPMSMU: 7500, hoursUntilNextPM: -10, pmProgressPercent: 104.0, status: "OVERDUE" },
  { code: "DZ-302", name: "Bulldozer CAT D8R #302", type: "Bulldozer (CAT D8R)", currentSMU: 8920, lastPMType: "PM 250", lastPMSMU: 8750, nextPMType: "PM 250", nextPMSMU: 9000, hoursUntilNextPM: 80, pmProgressPercent: 68.0, status: "OK" },
];

export const MaintenanceTypesView: React.FC<MaintenanceTypesViewProps> = ({
  maintenanceTypes,
  workOrders,
  onSelectType,
  onCreateWOForType,
  onOpenWorkOrder,
}) => {
  const [selectedType, setSelectedType] = useState<MaintenanceType>("Preventive");
  const [searchFleet, setSearchFleet] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filteredFleet = FLEET_PM_TRACKER.filter((eq) => {
    const matchesSearch =
      eq.code.toLowerCase().includes(searchFleet.toLowerCase()) ||
      eq.name.toLowerCase().includes(searchFleet.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || eq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeWOsForType = workOrders.filter((w) => w.maintenanceType === selectedType);
  const currentTypeDef = maintenanceTypes.find((t) => t.type === selectedType) || maintenanceTypes[0];

  return (
    <div className="space-y-6">
      {/* 4 Maintenance Types Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {maintenanceTypes.map((mt) => {
          const isSelected = selectedType === mt.type;
          const count = workOrders.filter((w) => w.maintenanceType === mt.type).length;
          const openCount = workOrders.filter((w) => w.maintenanceType === mt.type && w.stage !== "Closing").length;

          let Icon = CalendarClock;
          if (mt.type === "Predictive") Icon = Cpu;
          if (mt.type === "Corrective") Icon = Wrench;
          if (mt.type === "Breakdown") Icon = AlertOctagon;

          let colorStyles = "border-emerald-500/30 text-emerald-400";
          if (mt.type === "Predictive") colorStyles = "border-amber-500/30 text-amber-400";
          if (mt.type === "Corrective") colorStyles = "border-blue-500/30 text-blue-400";
          if (mt.type === "Breakdown") colorStyles = "border-rose-500/30 text-rose-400";

          return (
            <div
              key={mt.id}
              onClick={() => setSelectedType(mt.type)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer shadow-xl ${
                isSelected
                  ? "bg-slate-900 border-amber-400 ring-2 ring-amber-400/40"
                  : "bg-slate-900/70 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${mt.bgLight} ${colorStyles}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-xs font-black uppercase text-slate-400">{mt.code}</span>
                    <h3 className="text-sm font-extrabold text-white leading-none mt-0.5">{mt.type}</h3>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-800 text-slate-200 border border-slate-700">
                  {openCount} Open
                </span>
              </div>

              <p className="text-xs text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                {mt.description}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Target SLA: <strong className="text-white">{mt.targetSLAHours} Jam</strong></span>
                <span className="font-bold text-amber-400">Total WOs: {count}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Maintenance Type Detail & Action Bar */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {currentTypeDef.code}
              </span>
              <h2 className="text-base font-extrabold text-white">{currentTypeDef.name}</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              {currentTypeDef.description}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onCreateWOForType(selectedType)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-black hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create {selectedType} WO</span>
            </button>
          </div>
        </div>

        {/* Feature Specific View depending on selectedType */}
        {selectedType === "Preventive" && (
          <div className="space-y-4 pt-2">
            {/* PM Intervals explanation */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] font-black text-emerald-400 uppercase">PM 250 SMU (Monthly)</span>
                <p className="text-xs text-slate-300 mt-1">Ganti oli mesin, filter solar primer, filter oli & inspeksi greasing.</p>
                <div className="text-[10px] text-slate-400 mt-2">SLA Duration: 4-6 Jam</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] font-black text-teal-400 uppercase">PM 500 SMU (Bimonthly)</span>
                <p className="text-xs text-slate-300 mt-1">PM 250 + ganti filter hidrolik, oli transmisi & lab oli SOS wear metals.</p>
                <div className="text-[10px] text-slate-400 mt-2">SLA Duration: 8 Jam</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] font-black text-blue-400 uppercase">PM 1000 SMU (Mid-Year)</span>
                <p className="text-xs text-slate-300 mt-1">PM 500 + ganti oli final drive, diferensial, coolant flush & kalibrasi valve.</p>
                <div className="text-[10px] text-slate-400 mt-2">SLA Duration: 12 Jam</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] font-black text-purple-400 uppercase">PM 2000 SMU (Annual Overhaul)</span>
                <p className="text-xs text-slate-300 mt-1">Mayor servis total semua pelumas, pengujian tekanan pompa & tune-up mesin.</p>
                <div className="text-[10px] text-slate-400 mt-2">SLA Duration: 16-24 Jam</div>
              </div>
            </div>

            {/* Fleet PM Progress Tracking Table */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">Fleet PM Interval Tracker</h3>
                  <p className="text-[11px] text-slate-400">Monitoring sisa jam kerja SMU armada menuju servis berkala berikutnya</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari kode unit..."
                      value={searchFleet}
                      onChange={(e) => setSearchFleet(e.target.value)}
                      className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="ALL">Semua Status</option>
                    <option value="OK">OK (Safe)</option>
                    <option value="DUE_SOON">Due Soon (&lt;100h)</option>
                    <option value="OVERDUE">Overdue (Terlewat)</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-black border-b border-slate-800">
                    <tr>
                      <th className="p-3">Equipment</th>
                      <th className="p-3">Current SMU</th>
                      <th className="p-3">Last PM</th>
                      <th className="p-3">Next Target PM</th>
                      <th className="p-3">Remaining Hours</th>
                      <th className="p-3">PM Interval Progress</th>
                      <th className="p-3 text-center">Status</th>
                      <th className="p-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                    {filteredFleet.map((eq) => (
                      <tr key={eq.code} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3">
                          <div className="font-mono font-bold text-amber-400">{eq.code}</div>
                          <div className="text-[10px] text-slate-400">{eq.type}</div>
                        </td>
                        <td className="p-3 font-mono font-semibold text-white">{eq.currentSMU.toLocaleString()} SMU</td>
                        <td className="p-3 text-slate-300">
                          {eq.lastPMType} <span className="text-[10px] text-slate-500">({eq.lastPMSMU} SMU)</span>
                        </td>
                        <td className="p-3 font-semibold text-teal-400">
                          {eq.nextPMType} <span className="text-[10px] text-slate-400">({eq.nextPMSMU} SMU)</span>
                        </td>
                        <td className="p-3 font-mono font-bold">
                          <span
                            className={
                              eq.hoursUntilNextPM < 0
                                ? "text-rose-400"
                                : eq.hoursUntilNextPM < 60
                                ? "text-amber-400"
                                : "text-emerald-400"
                            }
                          >
                            {eq.hoursUntilNextPM < 0 ? `${Math.abs(eq.hoursUntilNextPM)}h Overdue` : `${eq.hoursUntilNextPM} Hours`}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="w-32 bg-slate-800 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                eq.pmProgressPercent > 100
                                  ? "bg-rose-500"
                                  : eq.pmProgressPercent > 80
                                  ? "bg-amber-500"
                                  : "bg-emerald-500"
                              }`}
                              style={{ width: `${Math.min(100, eq.pmProgressPercent)}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 mt-0.5 block">{eq.pmProgressPercent}% consumed</span>
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              eq.status === "OVERDUE"
                                ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                                : eq.status === "DUE_SOON"
                                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            }`}
                          >
                            {eq.status}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => onCreateWOForType("Preventive")}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 text-[10px] font-bold transition-all cursor-pointer"
                          >
                            Generate PM WO
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {selectedType === "Predictive" && (
          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-slate-200 leading-relaxed">
              <strong className="text-amber-400 font-bold">Predictive Maintenance (PdM) Paradigm: </strong>
              Memanfaatkan 5 pilar telematics cerdas (Engine Hours, Histori Breakdown, Catatan PM & Lab Oli SOS, Konsumsi BBM, dan Operating Pattern) untuk mendeteksi anomali mikroskopis sebelum timbul kerusakan mekanis fatal.
            </div>
          </div>
        )}

        {selectedType === "Corrective" && (
          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-xs text-slate-200 leading-relaxed">
              <strong className="text-blue-400 font-bold">Corrective Maintenance (CM) Management: </strong>
              Perbaikan terencana terhadap backlog temuan defect non-kritis dari daily checklist P2H operator pit, penyetelan celah valve, kalibrasi sistem hidrolik, dan penggantian minor wear parts saat unit sedang idle shift.
            </div>
          </div>
        )}

        {selectedType === "Breakdown" && (
          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-slate-200 leading-relaxed">
              <strong className="text-rose-400 font-bold">Breakdown Maintenance (BM) Fast-Response: </strong>
              Protokol tanggap darurat perbaikan di lokasi (in-pit field breakdown call) dengan mobile service truck untuk memulihkan unit mogok secara instan dan meminimalisir unscheduled downtime tambang.
            </div>
          </div>
        )}
      </div>

      {/* Work Orders List for Selected Maintenance Type */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <Layers className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">{selectedType} Work Orders List</h3>
              <p className="text-[11px] text-slate-400">Total {activeWOsForType.length} Work Orders tercatat</p>
            </div>
          </div>
        </div>

        {activeWOsForType.length === 0 ? (
          <div className="text-center py-10 bg-slate-950/40 rounded-2xl border border-slate-800 text-xs text-slate-400">
            Tidak ada Work Order dengan kategori {selectedType}.
          </div>
        ) : (
          <div className="space-y-3">
            {activeWOsForType.map((wo) => (
              <div
                key={wo.id}
                onClick={() => onOpenWorkOrder(wo)}
                className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-800/40 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-black text-amber-400 group-hover:underline">
                      {wo.woNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-800 text-slate-300 border border-slate-700">
                      {wo.equipmentCode}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        wo.priority === "Emergency"
                          ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                          : wo.priority === "High"
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      }`}
                    >
                      {wo.priority}
                    </span>
                  </div>

                  <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    {wo.stage}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white line-clamp-1">{wo.title}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-1">{wo.description}</p>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>Lead: {wo.assignedLeadMechanic || "Unassigned"}</span>
                  <span>Bay: {wo.assignedWorkshopBay || "In-Pit"}</span>
                  <span className="font-mono text-amber-400">
                    Rp {(wo.totalCostIDR || wo.estimatedBudgetIDR || 0).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
