// MINE SMART AI - Work Order Details & Stage Management Modal

import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  Clock,
  Wrench,
  AlertTriangle,
  FileText,
  UserCheck,
  Package,
  ShieldCheck,
  Check,
  DollarSign,
  ArrowRight,
  Send,
  Sparkles,
  MapPin,
  Calendar,
  Layers,
  ChevronRight,
  Plus,
  Trash2
} from "lucide-react";
import {
  WorkOrder,
  WorkOrderStage,
  WorkOrderPriority,
  WorkOrderChecklistTask,
  WorkOrderPartUsage,
  SparePart
} from "../../types/maintenanceTypes";

interface WorkOrderDetailsModalProps {
  workOrder: WorkOrder;
  spareParts: SparePart[];
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (wo: WorkOrder) => void;
  onAdvanceStage: (id: string, nextStage: WorkOrderStage) => void;
}

const STAGES: WorkOrderStage[] = ["Request", "Approval", "Assignment", "Repair", "Testing", "Closing"];

export const WorkOrderDetailsModal: React.FC<WorkOrderDetailsModalProps> = ({
  workOrder,
  spareParts,
  isOpen,
  onClose,
  onUpdate,
  onAdvanceStage,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"overview" | "tasks" | "parts" | "testing" | "financials">("overview");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [selectedPartId, setSelectedPartId] = useState("");
  const [partQty, setPartQty] = useState(1);

  if (!isOpen) return null;

  const currentStageIndex = STAGES.indexOf(workOrder.stage);
  const nextStage = currentStageIndex < STAGES.length - 1 ? STAGES[currentStageIndex + 1] : null;

  // Toggle task
  const handleToggleTask = (taskId: string) => {
    const updatedTasks = workOrder.tasksChecklist.map((t) => {
      if (t.id === taskId) {
        const isCompleted = !t.isCompleted;
        return {
          ...t,
          isCompleted,
          completedBy: isCompleted ? "Technician in Charge" : undefined,
          completedAt: isCompleted ? new Date().toISOString().slice(0, 16).replace("T", " ") : undefined,
        };
      }
      return t;
    });

    onUpdate({
      ...workOrder,
      tasksChecklist: updatedTasks,
    });
  };

  // Add task
  const handleAddTask = () => {
    if (!newTaskDesc.trim()) return;
    const newTask: WorkOrderChecklistTask = {
      id: `T-${Date.now()}`,
      taskDescription: newTaskDesc.trim(),
      category: "Inspection",
      isCompleted: false,
    };
    onUpdate({
      ...workOrder,
      tasksChecklist: [...workOrder.tasksChecklist, newTask],
    });
    setNewTaskDesc("");
  };

  // Add Part Usage
  const handleAddPartUsage = () => {
    const part = spareParts.find((p) => p.id === selectedPartId);
    if (!part) return;

    const newUsage: WorkOrderPartUsage = {
      id: `PU-${Date.now()}`,
      partId: part.id,
      partNumber: part.partNumber,
      partName: part.partName,
      quantity: partQty,
      unit: part.unit,
      unitPriceIDR: part.unitPriceIDR,
      totalCostIDR: partQty * part.unitPriceIDR,
      issuedFromWarehouse: part.storageWarehouse,
      issuedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
    };

    const updatedParts = [...(workOrder.sparePartsUsed || []), newUsage];
    const partsCostIDR = updatedParts.reduce((sum, p) => sum + p.totalCostIDR, 0);
    const totalCostIDR = (workOrder.laborCostIDR || 0) + partsCostIDR + (workOrder.otherCostIDR || 0);

    onUpdate({
      ...workOrder,
      sparePartsUsed: updatedParts,
      partsCostIDR,
      totalCostIDR,
    });

    setSelectedPartId("");
    setPartQty(1);
  };

  const priorityColor =
    workOrder.priority === "Emergency"
      ? "bg-rose-500/20 text-rose-400 border-rose-500/40"
      : workOrder.priority === "High"
      ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
      : "bg-blue-500/20 text-blue-400 border-blue-500/40";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-black text-amber-400">{workOrder.woNumber}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${priorityColor}`}>
                  {workOrder.priority}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  {workOrder.maintenanceType} Maintenance
                </span>
              </div>
              <h2 className="text-base font-extrabold text-white mt-0.5 truncate max-w-xl">{workOrder.title}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {nextStage && (
              <button
                onClick={() => onAdvanceStage(workOrder.id, nextStage)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 text-xs font-black hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <span>Advance to {nextStage}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 6-Stage Progress Stepper Bar */}
        <div className="px-6 py-3 bg-slate-950/40 border-b border-slate-800/80 overflow-x-auto scrollbar-none">
          <div className="flex items-center justify-between min-w-[650px] gap-2">
            {STAGES.map((st, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              const isFuture = idx > currentStageIndex;

              return (
                <div key={st} className="flex items-center gap-2 flex-1">
                  <div
                    onClick={() => onAdvanceStage(workOrder.id, st)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex-1 ${
                      isCurrent
                        ? "bg-amber-500 text-slate-950 border-amber-400 font-black shadow-md shadow-amber-500/20"
                        : isPast
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                        : "bg-slate-800/60 text-slate-400 border-slate-700 hover:bg-slate-800"
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                        isCurrent
                          ? "bg-slate-950 text-amber-400"
                          : isPast
                          ? "bg-emerald-500 text-slate-950"
                          : "bg-slate-700 text-slate-300"
                      }`}
                    >
                      {isPast ? "✓" : idx + 1}
                    </span>
                    <span className="truncate">{st}</span>
                  </div>
                  {idx < STAGES.length - 1 && (
                    <ChevronRight
                      className={`w-3.5 h-3.5 shrink-0 ${isPast ? "text-emerald-400" : "text-slate-600"}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-900/60">
          <button
            onClick={() => setActiveSubTab("overview")}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeSubTab === "overview"
                ? "text-amber-400 border-amber-400"
                : "text-slate-400 border-transparent hover:text-slate-200"
            }`}
          >
            Overview & Details
          </button>
          <button
            onClick={() => setActiveSubTab("tasks")}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === "tasks"
                ? "text-amber-400 border-amber-400"
                : "text-slate-400 border-transparent hover:text-slate-200"
            }`}
          >
            <span>Repair Tasks Checklist</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
              {workOrder.tasksChecklist.filter((t) => t.isCompleted).length}/{workOrder.tasksChecklist.length}
            </span>
          </button>
          <button
            onClick={() => setActiveSubTab("parts")}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === "parts"
                ? "text-amber-400 border-amber-400"
                : "text-slate-400 border-transparent hover:text-slate-200"
            }`}
          >
            <span>Spare Parts Issued</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
              {workOrder.sparePartsUsed?.length || 0}
            </span>
          </button>
          <button
            onClick={() => setActiveSubTab("testing")}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeSubTab === "testing"
                ? "text-amber-400 border-amber-400"
                : "text-slate-400 border-transparent hover:text-slate-200"
            }`}
          >
            QA/QC Testing & Commissioning
          </button>
          <button
            onClick={() => setActiveSubTab("financials")}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeSubTab === "financials"
                ? "text-amber-400 border-amber-400"
                : "text-slate-400 border-transparent hover:text-slate-200"
            }`}
          >
            Cost & Valuation Recap
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeSubTab === "overview" && (
            <div className="space-y-6">
              {/* Top Quick Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                  <span className="text-[11px] font-semibold text-slate-400">Target Equipment</span>
                  <div className="text-sm font-black text-amber-400 mt-1">{workOrder.equipmentCode}</div>
                  <div className="text-xs text-slate-300">{workOrder.equipmentType}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                  <span className="text-[11px] font-semibold text-slate-400">Current SMU / Hour</span>
                  <div className="text-sm font-black text-white mt-1">{workOrder.currentSMU.toLocaleString()} SMU</div>
                  <div className="text-xs text-slate-400">Location: {workOrder.location}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                  <span className="text-[11px] font-semibold text-slate-400">Lead Mechanic / Team</span>
                  <div className="text-sm font-black text-emerald-400 mt-1">
                    {workOrder.assignedLeadMechanic || "Unassigned"}
                  </div>
                  <div className="text-xs text-slate-400">{workOrder.assignedWorkshopBay || "No Bay"}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                  <span className="text-[11px] font-semibold text-slate-400">Total Downtime / Duration</span>
                  <div className="text-sm font-black text-rose-400 mt-1">{workOrder.downtimeHours} Hours</div>
                  <div className="text-xs text-slate-400">Est: {workOrder.estimatedDurationHours} Hours</div>
                </div>
              </div>

              {/* Problem & Defect Description */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>Problem & Defect Description</span>
                </h3>
                <p className="text-xs text-slate-200 leading-relaxed">{workOrder.description}</p>
                {workOrder.defectDetails && (
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-amber-300">
                    <span className="font-bold">Defect Details: </span>
                    {workOrder.defectDetails}
                  </div>
                )}
              </div>

              {/* Stage Lifecycle Detailed Records */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Request & Approval */}
                <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-2.5">
                  <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-blue-400" />
                    <span>Stage 1 & 2: Request & Approval</span>
                  </div>
                  <div className="text-xs text-slate-300 space-y-1">
                    <div>
                      <span className="text-slate-400">Requested by:</span> {workOrder.requestedBy} ({workOrder.requestDate})
                    </div>
                    <div>
                      <span className="text-slate-400">Origin Source:</span> {workOrder.originSource}
                    </div>
                    <div>
                      <span className="text-slate-400">Approval Status:</span>{" "}
                      <span className="font-bold text-emerald-400">{workOrder.approvalStatus}</span>
                      {workOrder.approvedBy && ` by ${workOrder.approvedBy}`}
                    </div>
                    {workOrder.approvalNotes && (
                      <div className="text-slate-400 italic">Notes: "{workOrder.approvalNotes}"</div>
                    )}
                  </div>
                </div>

                {/* Assignment & Execution */}
                <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-2.5">
                  <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Wrench className="w-4 h-4 text-amber-400" />
                    <span>Stage 3 & 4: Assignment & Repair</span>
                  </div>
                  <div className="text-xs text-slate-300 space-y-1">
                    <div>
                      <span className="text-slate-400">Workshop Bay:</span> {workOrder.assignedWorkshopBay || "-"}
                    </div>
                    <div>
                      <span className="text-slate-400">Mechanic Crew:</span>{" "}
                      {workOrder.mechanicTeam?.length > 0 ? workOrder.mechanicTeam.join(", ") : "-"}
                    </div>
                    <div>
                      <span className="text-slate-400">Actual Execution:</span>{" "}
                      {workOrder.actualStartDate ? `${workOrder.actualStartDate} s/d ${workOrder.actualEndDate || "Ongoing"}` : "Not started"}
                    </div>
                    {workOrder.repairNotes && (
                      <div className="text-slate-400 italic">Repair notes: "{workOrder.repairNotes}"</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === "tasks" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">Service Task Checklist</h3>
                  <p className="text-[11px] text-slate-400">Centang tugas yang telah diselesaikan oleh tim mekanik</p>
                </div>
                <div className="text-xs font-bold text-emerald-400">
                  {Math.round(
                    (workOrder.tasksChecklist.filter((t) => t.isCompleted).length /
                      (workOrder.tasksChecklist.length || 1)) *
                      100
                  )}
                  % Completed
                </div>
              </div>

              <div className="space-y-2">
                {workOrder.tasksChecklist.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(task.id)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      task.isCompleted
                        ? "bg-emerald-500/10 border-emerald-500/30 text-slate-200"
                        : "bg-slate-800/60 border-slate-700/70 hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                          task.isCompleted
                            ? "bg-emerald-500 border-emerald-400 text-slate-950"
                            : "border-slate-600 bg-slate-900"
                        }`}
                      >
                        {task.isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div>
                        <span className={`text-xs font-bold ${task.isCompleted ? "line-through text-slate-400" : "text-white"}`}>
                          {task.taskDescription}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                          <span className="px-1.5 py-0.2 rounded bg-slate-900 text-slate-300 border border-slate-700">
                            {task.category}
                          </span>
                          {task.completedBy && <span>Done by {task.completedBy}</span>}
                          {task.completedAt && <span>at {task.completedAt}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Task Bar */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Tambahkan tugas baru..."
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={handleAddTask}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Task</span>
                </button>
              </div>
            </div>
          )}

          {activeSubTab === "parts" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">Spare Parts Issued & Consumed</h3>
                  <p className="text-[11px] text-slate-400">Pengeluaran suku cadang dari warehouse untuk WO ini</p>
                </div>
                <div className="text-xs font-bold text-amber-400">
                  Total Parts: Rp {(workOrder.partsCostIDR || 0).toLocaleString("id-ID")}
                </div>
              </div>

              {workOrder.sparePartsUsed?.length === 0 ? (
                <div className="text-center py-8 bg-slate-950/40 rounded-2xl border border-slate-800 text-xs text-slate-400">
                  Belum ada spare part yang dikeluarkan untuk Work Order ini.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-black border-b border-slate-800">
                      <tr>
                        <th className="p-3">Part Number</th>
                        <th className="p-3">Part Name</th>
                        <th className="p-3 text-center">Qty</th>
                        <th className="p-3 text-right">Unit Price</th>
                        <th className="p-3 text-right">Total Price</th>
                        <th className="p-3">Issued From</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                      {workOrder.sparePartsUsed.map((part) => (
                        <tr key={part.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-3 font-mono font-bold text-amber-400">{part.partNumber}</td>
                          <td className="p-3 font-medium text-white">{part.partName}</td>
                          <td className="p-3 text-center font-bold text-slate-200">
                            {part.quantity} {part.unit}
                          </td>
                          <td className="p-3 text-right text-slate-300">
                            Rp {part.unitPriceIDR.toLocaleString("id-ID")}
                          </td>
                          <td className="p-3 text-right font-black text-amber-400">
                            Rp {part.totalCostIDR.toLocaleString("id-ID")}
                          </td>
                          <td className="p-3 text-slate-400">{part.issuedFromWarehouse}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Add Spare Part Picker */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  <Package className="w-4 h-4 text-amber-400" />
                  <span>Issue Additional Spare Part</span>
                </span>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="md:col-span-2">
                    <select
                      value={selectedPartId}
                      onChange={(e) => setSelectedPartId(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="">-- Pilih Spare Part Warehouse --</option>
                      {spareParts.map((sp) => (
                        <option key={sp.id} value={sp.id}>
                          {sp.partNumber} - {sp.partName} (Stock: {sp.stock} {sp.unit})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <input
                      type="number"
                      min={1}
                      value={partQty}
                      onChange={(e) => setPartQty(Math.max(1, parseInt(e.target.value) || 1))}
                      placeholder="Qty"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <button
                      onClick={handleAddPartUsage}
                      disabled={!selectedPartId}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-bold hover:brightness-110 disabled:opacity-50 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Issue Part</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === "testing" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">
                    Stage 5: QA/QC Testing & Commissioning
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Pemeriksaan hasil perbaikan, functional test run, dan sertifikasi green-tag operasional
                  </p>
                </div>
                {workOrder.testingQC?.overallStatus && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                      workOrder.testingQC.overallStatus === "PASSED"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    }`}
                  >
                    Status: {workOrder.testingQC.overallStatus}
                  </span>
                )}
              </div>

              {workOrder.testingQC ? (
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Tested By & Date</span>
                      <div className="text-xs font-bold text-white mt-0.5">{workOrder.testingQC.testedBy}</div>
                      <div className="text-[11px] text-slate-400">{workOrder.testingQC.testDate}</div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Engine & Pressure Test</span>
                      <div className="text-xs font-bold text-amber-400 mt-0.5">{workOrder.testingQC.engineRpmTest}</div>
                      <div className="text-[11px] text-slate-300">
                        Pressure: {workOrder.testingQC.hydraulicPressurePsi} PSI | Temp: {workOrder.testingQC.operatingTempCelsius}°C
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Safety Checks</span>
                      <div className="flex items-center gap-2 mt-1 text-xs">
                        <span className="text-emerald-400 font-bold">✓ Safety OK</span>
                        <span className="text-emerald-400 font-bold">✓ No Leakage</span>
                        <span className="text-emerald-400 font-bold">✓ Brakes Passed</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
                    <span className="font-bold text-slate-300">QC Inspector Notes: </span>
                    <span className="text-slate-200">{workOrder.testingQC.qcNotes}</span>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center bg-slate-950/40 rounded-2xl border border-slate-800 text-xs text-slate-400">
                  Testing QC belum dilaksanakan. Advance Work Order ke stage <strong>Testing</strong> untuk mengisi formulir komisioning.
                </div>
              )}
            </div>
          )}

          {activeSubTab === "financials" && (
            <div className="space-y-4">
              <h3 className="text-xs font-black text-white uppercase tracking-wider">Maintenance Cost Breakdown</h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Labor Cost</span>
                  <div className="text-lg font-black text-blue-400 mt-1">
                    Rp {(workOrder.laborCostIDR || 0).toLocaleString("id-ID")}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Parts Cost</span>
                  <div className="text-lg font-black text-amber-400 mt-1">
                    Rp {(workOrder.partsCostIDR || 0).toLocaleString("id-ID")}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Other / Consumables</span>
                  <div className="text-lg font-black text-slate-300 mt-1">
                    Rp {(workOrder.otherCostIDR || 0).toLocaleString("id-ID")}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-600/20 border border-amber-500/40">
                  <span className="text-[10px] uppercase font-bold text-amber-300">Total Work Order Cost</span>
                  <div className="text-lg font-black text-amber-400 mt-1">
                    Rp {(workOrder.totalCostIDR || 0).toLocaleString("id-ID")}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Current Stage: <span className="font-bold text-amber-400">{workOrder.stage}</span>
            {workOrder.releasedToOperations && (
              <span className="ml-2 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Released to Operations
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700 transition-all cursor-pointer"
            >
              Close
            </button>
            {nextStage && (
              <button
                onClick={() => onAdvanceStage(workOrder.id, nextStage)}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-black hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                <span>Advance to {nextStage}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
