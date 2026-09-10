import React, { useState } from "react";
import {
  FileText,
  Plus,
  Calendar,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  User,
  Building,
  ChevronRight,
  X,
  ClipboardList,
} from "lucide-react";
import {
  ReclamationProject,
  ReclamationAssessment,
  DisturbedArea,
  ProjectPriority,
  ProjectStatus,
} from "../../../types/reclamationTypes";

interface Props {
  projects: ReclamationProject[];
  assessments: ReclamationAssessment[];
  disturbedAreas: DisturbedArea[];
  onAddProject: (
    proj: Omit<ReclamationProject, "id" | "createdAt" | "updatedAt">
  ) => void;
}

export const ReclamationPlanningTab: React.FC<Props> = ({
  projects,
  assessments,
  disturbedAreas,
  onAddProject,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    projects[0]?.id || ""
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [projectName, setProjectName] = useState("");
  const [disturbedAreaId, setDisturbedAreaId] = useState(disturbedAreas[0]?.disturbedAreaId || "");
  const [objective, setObjective] = useState("Penebaran topsoil, penataan lereng & penanaman cover crop + pohon");
  const [targetAreaHa, setTargetAreaHa] = useState<number>(10.0);
  const [startDate, setStartDate] = useState("2026-09-01");
  const [targetCompletionDate, setTargetCompletionDate] = useState("2026-12-31");
  const [responsiblePerson, setResponsiblePerson] = useState("Bambang Suherman, S.Hut");
  const [contractorName, setContractorName] = useState("PT Rimba Hijaubumi Ops");
  const [budgetIDR, setBudgetIDR] = useState<number>(1500000000);
  const [priority, setPriority] = useState<ProjectPriority>("HIGH");

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0];
  const selectedAssessment = assessments.find((a) => a.projectId === selectedProject?.projectId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName) return;

    const area = disturbedAreas.find((a) => a.disturbedAreaId === disturbedAreaId);

    onAddProject({
      projectId: `REC-PROJ-2026-0${projects.length + 1}`,
      companyId: "COMP-01",
      siteId: "SITE-TAPIN",
      disturbedAreaId,
      disturbedAreaName: area?.name || "Disturbed Area",
      projectName,
      objective,
      targetAreaHa,
      reclaimedAreaHa: 0,
      startDate,
      targetCompletionDate,
      responsiblePerson,
      contractorId: "CONT-001",
      contractorName,
      budgetIDR,
      actualCostIDR: 0,
      priority,
      status: "PLANNED",
      assessmentStatus: "READY",
    });

    setIsModalOpen(false);
    setProjectName("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-400" />
            Reclamation Planning & Area Assessment
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Perencanaan proyek reklamasi, target area, budget biaya, kontraktor pelaksana, dan kajian kelayakan fisik lokasi.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-emerald-500/10"
        >
          <Plus className="h-4 w-4" /> Buat Proyek Reklamasi Baru
        </button>
      </div>

      {/* Grid Projects & Detailed Assessment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project List */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Daftar Proyek Reklamasi</h3>
          {projects.map((proj) => (
            <div
              key={proj.id}
              onClick={() => setSelectedProjectId(proj.id)}
              className={`rounded-2xl p-4 border transition cursor-pointer space-y-2 ${
                selectedProjectId === proj.id
                  ? "border-emerald-500 bg-slate-900 shadow-md shadow-emerald-500/5"
                  : "border-slate-800 bg-slate-950 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-emerald-400">{proj.projectId}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    proj.status === "COMPLETED"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  }`}
                >
                  {proj.status}
                </span>
              </div>

              <h4 className="font-bold text-white text-xs leading-snug">{proj.projectName}</h4>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                <span>Target: <strong className="text-white">{proj.targetAreaHa} ha</strong></span>
                <span>Budget: <strong className="text-emerald-400">Rp {(proj.budgetIDR / 1000000).toFixed(0)}M</strong></span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Project Detail & Assessment */}
        <div className="lg:col-span-2 space-y-6">
          {selectedProject && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-md space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    {selectedProject.projectId} • {selectedProject.disturbedAreaName}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1">{selectedProject.projectName}</h3>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 self-start sm:self-auto">
                  Prioritas: {selectedProject.priority}
                </span>
              </div>

              {/* Objectives & Info */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tujuan & Ruang Lingkup:</h4>
                <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  {selectedProject.objective}
                </p>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Target Luas Area</span>
                  <strong className="text-white text-sm">{selectedProject.targetAreaHa} ha</strong>
                </div>
                <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Realisasi Ter-reklamasi</span>
                  <strong className="text-emerald-400 text-sm">{selectedProject.reclaimedAreaHa} ha</strong>
                </div>
                <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Kontraktor Pelaksana</span>
                  <strong className="text-slate-200 text-xs truncate block">{selectedProject.contractorName}</strong>
                </div>
                <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Budget Anggaran</span>
                  <strong className="text-purple-400 text-xs">Rp {(selectedProject.budgetIDR / 1000000).toFixed(0)}M</strong>
                </div>
              </div>

              {/* Physical Area Assessment Section */}
              <div className="pt-2 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <ClipboardList className="h-4 w-4 text-amber-400" /> Physical Area Assessment (Kajian Kelayakan Lahan)
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Status: {selectedProject.assessmentStatus}
                  </span>
                </div>

                {selectedAssessment ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 space-y-1">
                      <span className="text-slate-500 text-[10px] block">Topografi & Kemiringan Slope</span>
                      <p className="text-slate-200 font-medium">{selectedAssessment.topography}</p>
                      <span className="text-amber-400 text-[11px] font-bold block">Slope: {selectedAssessment.slopePercent}%</span>
                    </div>

                    <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 space-y-1">
                      <span className="text-slate-500 text-[10px] block">Kondisi Tanah & Topsoil Stok</span>
                      <p className="text-slate-200 font-medium">{selectedAssessment.soilCondition}</p>
                      <span className="text-emerald-400 text-[11px] font-bold block">Topsoil Tersedia: {selectedAssessment.topsoilAvailabilityM3.toLocaleString()} m³</span>
                    </div>

                    <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 space-y-1">
                      <span className="text-slate-500 text-[10px] block">Drainase & Risiko Erosi</span>
                      <p className="text-slate-200 font-medium">{selectedAssessment.drainageCondition}</p>
                      <span className="text-rose-400 text-[11px] font-bold block">Risiko Erosi: {selectedAssessment.erosionRisk}</span>
                    </div>

                    <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 space-y-1">
                      <span className="text-slate-500 text-[10px] block">Kesiapan Revegetasi & Aksesibilitas</span>
                      <p className="text-slate-200 font-medium">{selectedAssessment.accessibility}</p>
                      <span className="text-cyan-400 text-[11px] font-bold block">Kesiapan: {selectedAssessment.revegetationReadiness}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic bg-slate-950 p-3 rounded-xl border border-slate-800">
                    Kajian assessment fisik area belum dicatat untuk proyek ini.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Add Reclamation Project */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-400" /> Form Perencanaan Proyek Reklamasi Baru
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Nama Proyek Reklamasi</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Reklamasi & Penanaman Waste Dump Block 4"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Target Area Terganggu</label>
                  <select
                    value={disturbedAreaId}
                    onChange={(e) => setDisturbedAreaId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    {disturbedAreas.map((da) => (
                      <option key={da.id} value={da.disturbedAreaId}>
                        {da.disturbedAreaId} - {da.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Target Luas (Ha)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={targetAreaHa}
                    onChange={(e) => setTargetAreaHa(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Tujuan & Sasaran Pekerjaan</label>
                <textarea
                  rows={2}
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Tgl Mulai Proyek</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Target Selesai</label>
                  <input
                    type="date"
                    value={targetCompletionDate}
                    onChange={(e) => setTargetCompletionDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Penanggung Jawab (PIC)</label>
                  <input
                    type="text"
                    value={responsiblePerson}
                    onChange={(e) => setResponsiblePerson(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Kontraktor Pelaksana</label>
                  <input
                    type="text"
                    value={contractorName}
                    onChange={(e) => setContractorName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Anggaran / Budget (IDR)</label>
                  <input
                    type="number"
                    value={budgetIDR}
                    onChange={(e) => setBudgetIDR(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Tingkat Prioritas</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as ProjectPriority)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                >
                  Simpan Proyek Reklamasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
