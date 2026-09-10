// MINE SMART AI - Create Work Order Modal

import React, { useState } from "react";
import {
  X,
  Wrench,
  AlertTriangle,
  Send,
  Sparkles,
  Calendar,
  Layers,
  MapPin,
  Clock,
  Plus
} from "lucide-react";
import {
  WorkOrder,
  MaintenanceType,
  WorkOrderPriority,
  WorkOrderStage
} from "../../types/maintenanceTypes";

interface CreateWorkOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (wo: Partial<WorkOrder>) => void;
}

const EQUIPMENT_OPTIONS = [
  { code: "EX-101", name: "Excavator CAT 6020B #101", type: "Excavator (CAT 6020B)", defaultSMU: 18450, location: "Pit 1 South" },
  { code: "EX-102", name: "Excavator Komatsu PC2000 #102", type: "Excavator (Komatsu PC2000-8)", defaultSMU: 14280, location: "Pit 2 West" },
  { code: "EX-104", name: "Excavator Komatsu PC1250 #104", type: "Excavator (Komatsu PC1250)", defaultSMU: 14280, location: "Pit 2 West Bench 3" },
  { code: "HT-201", name: "Dump Truck Scania P410 #201", type: "Dump Truck (Scania P410)", defaultSMU: 9840, location: "ROM Haul Road" },
  { code: "HT-202", name: "Dump Truck Scania P410 #202", type: "Dump Truck (Scania P410)", defaultSMU: 11420, location: "Ramp Pit 1 South" },
  { code: "HT-203", name: "Dump Truck Scania P410 #203", type: "Dump Truck (Scania P410)", defaultSMU: 12150, location: "Main Haul Road KM 4" },
  { code: "HT-204", name: "Dump Truck CAT 777E #204", type: "Dump Truck (CAT 777E)", defaultSMU: 16890, location: "Pit 1 South RL +45" },
  { code: "DZ-301", name: "Bulldozer CAT D8R #301", type: "Bulldozer (CAT D8R)", defaultSMU: 7510, location: "Disposal Area 1" },
  { code: "DZ-302", name: "Bulldozer CAT D8R #302", type: "Bulldozer (CAT D8R)", defaultSMU: 8920, location: "ROM Stockpile Area" },
  { code: "GR-401", name: "Motor Grader CAT 16M #401", type: "Grader (CAT 16M)", defaultSMU: 6240, location: "Main Haul Road KM 2" },
];

export const CreateWorkOrderModal: React.FC<CreateWorkOrderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [selectedEqCode, setSelectedEqCode] = useState(EQUIPMENT_OPTIONS[0].code);
  const [title, setTitle] = useState("");
  const [maintenanceType, setMaintenanceType] = useState<MaintenanceType>("Preventive");
  const [priority, setPriority] = useState<WorkOrderPriority>("Medium");
  const [description, setDescription] = useState("");
  const [defectDetails, setDefectDetails] = useState("");
  const [failureCategory, setFailureCategory] = useState("Engine");
  const [location, setLocation] = useState(EQUIPMENT_OPTIONS[0].location);
  const [currentSMU, setCurrentSMU] = useState(EQUIPMENT_OPTIONS[0].defaultSMU);
  const [estimatedDurationHours, setEstimatedDurationHours] = useState(4);
  const [estimatedBudgetIDR, setEstimatedBudgetIDR] = useState(15000000);
  const [assignedWorkshopBay, setAssignedWorkshopBay] = useState("Main Workshop Bay 1");
  const [requestedBy, setRequestedBy] = useState("Maintenance Planner (Shift A)");

  if (!isOpen) return null;

  const handleEquipmentChange = (code: string) => {
    setSelectedEqCode(code);
    const eq = EQUIPMENT_OPTIONS.find((e) => e.code === code);
    if (eq) {
      setLocation(eq.location);
      setCurrentSMU(eq.defaultSMU);
      if (!title) {
        setTitle(`${maintenanceType} Service - ${eq.code} (${eq.type})`);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const eq = EQUIPMENT_OPTIONS.find((e) => e.code === selectedEqCode) || EQUIPMENT_OPTIONS[0];

    const newWO: Partial<WorkOrder> = {
      title: title || `${maintenanceType} Service - ${eq.code}`,
      equipmentId: `EQ-${eq.code}`,
      equipmentCode: eq.code,
      equipmentType: eq.type,
      maintenanceType,
      priority,
      stage: "Request",
      description: description || `Permintaan perbaikan / servis ${maintenanceType} untuk unit ${eq.code}`,
      defectDetails,
      failureCategory,
      location,
      currentSMU,
      requestedBy,
      requestDate: new Date().toISOString().slice(0, 16).replace("T", " "),
      originSource: maintenanceType === "Breakdown" ? "BREAKDOWN_CALL" : "OPERATOR_LOG",
      estimatedDurationHours,
      estimatedBudgetIDR,
      assignedWorkshopBay,
      tasksChecklist: [
        { id: "T1", taskDescription: "Pemeriksaan visual awal dan isolasi LOTO unit", category: "Inspection", isCompleted: false },
        { id: "T2", taskDescription: "Pelaksanaan servis / penggantian komponen", category: "Replacement", isCompleted: false },
        { id: "T3", taskDescription: "Pengujian fungsional & commissioning test run", category: "Testing", isCompleted: false },
      ],
      sparePartsUsed: [],
      laborCostIDR: 0,
      partsCostIDR: 0,
      otherCostIDR: 0,
      totalCostIDR: 0,
      downtimeHours: 0,
      releasedToOperations: false,
    };

    onSubmit(newWO);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <Plus className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Create New Work Order</h2>
              <p className="text-xs text-slate-400">Initiate Stage 1: Maintenance Request</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Equipment Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Target Equipment *</label>
              <select
                value={selectedEqCode}
                onChange={(e) => handleEquipmentChange(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                {EQUIPMENT_OPTIONS.map((eq) => (
                  <option key={eq.code} value={eq.code}>
                    {eq.code} - {eq.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Current SMU (Engine Hours) *</label>
              <input
                type="number"
                value={currentSMU}
                onChange={(e) => setCurrentSMU(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Maintenance Type & Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Maintenance Type *</label>
              <select
                value={maintenanceType}
                onChange={(e) => setMaintenanceType(e.target.value as MaintenanceType)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Preventive">Preventive Maintenance (PM)</option>
                <option value="Predictive">Predictive Maintenance (PdM)</option>
                <option value="Corrective">Corrective Maintenance (CM)</option>
                <option value="Breakdown">Breakdown Emergency (BM)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Priority Level *</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as WorkOrderPriority)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>
          </div>

          {/* Work Order Title */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Work Order Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Servis Berkala PM 500 SMU - Excavator EX-101"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Problem & Defect Description */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Problem / Scope Description *</label>
            <textarea
              rows={3}
              required
              placeholder="Jelaskan detail keluhan, indikasi anomali, atau lingkup servis pemeliharaan..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Defect Details & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Failure Subsystem / Category</label>
              <select
                value={failureCategory}
                onChange={(e) => setFailureCategory(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Engine">Engine & Combustion</option>
                <option value="Hydraulics">Hydraulic System & Pumps</option>
                <option value="Transmission">Transmission & Final Drive</option>
                <option value="Cooling System">Cooling System & Radiator</option>
                <option value="Electrical">Electrical & CANBus Sensors</option>
                <option value="Braking & Safety">Braking & Retarder</option>
                <option value="Undercarriage">Undercarriage & Tracks</option>
                <option value="General Periodic PM">General Periodic PM</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Assigned Workshop Bay</label>
              <select
                value={assignedWorkshopBay}
                onChange={(e) => setAssignedWorkshopBay(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Main Workshop Bay 1 (Heavy Digger)">Main Workshop Bay 1 (Heavy Digger)</option>
                <option value="Main Workshop Bay 2 (Hauler)">Main Workshop Bay 2 (Hauler)</option>
                <option value="Bay 3 - Hauler Rapid Bay">Bay 3 - Hauler Rapid Bay</option>
                <option value="In-Pit Service Bay 2">In-Pit Service Bay 2</option>
                <option value="Mobile In-Pit Field Service">Mobile In-Pit Field Service</option>
              </select>
            </div>
          </div>

          {/* Location & Estimated Duration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Equipment Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Est. Duration (Hours)</label>
              <input
                type="number"
                step="0.5"
                value={estimatedDurationHours}
                onChange={(e) => setEstimatedDurationHours(parseFloat(e.target.value) || 1)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Est. Budget (IDR)</label>
              <input
                type="number"
                step="500000"
                value={estimatedBudgetIDR}
                onChange={(e) => setEstimatedBudgetIDR(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-black hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Submit Work Order Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
