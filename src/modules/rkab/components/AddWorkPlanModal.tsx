// MINE SMART AI - Add Work Plan Matrix Modal
import React, { useState } from "react";
import { X, Plus, Layers, CheckCircle2 } from "lucide-react";
import { WorkPlanMatrixItem, QuarterPeriod } from "../../../types/rkabTypes";

interface AddWorkPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: Omit<WorkPlanMatrixItem, "id">) => void;
}

export const AddWorkPlanModal: React.FC<AddWorkPlanModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [matrixCode, setMatrixCode] = useState<string>("Matriks 2B");
  const [activityName, setActivityName] = useState<string>("");
  const [category, setCategory] = useState<WorkPlanMatrixItem["category"]>("PENAMBANGAN");
  const [targetVolume, setTargetVolume] = useState<number>(1000);
  const [unit, setUnit] = useState<string>("BCM");
  const [realizedVolume, setRealizedVolume] = useState<number>(0);
  const [timelineQuarter, setTimelineQuarter] = useState<QuarterPeriod[]>(["Q3", "Q4"]);
  const [responsiblePerson, setResponsiblePerson] = useState<string>("");
  const [budgetAllocatedIDR, setBudgetAllocatedIDR] = useState<number>(1500000000);
  const [budgetSpentIDR, setBudgetSpentIDR] = useState<number>(0);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityName.trim() || !responsiblePerson.trim()) return;

    const progressPercent = targetVolume > 0 ? parseFloat(((realizedVolume / targetVolume) * 100).toFixed(1)) : 0;
    const status: WorkPlanMatrixItem["status"] =
      progressPercent >= 100 ? "COMPLETED" : progressPercent > 0 ? "ON_TRACK" : "NOT_STARTED";

    onAdd({
      matrixCode,
      activityName,
      category,
      targetVolume,
      unit,
      realizedVolume,
      progressPercent,
      timelineQuarter,
      responsiblePerson,
      status,
      budgetAllocatedIDR,
      budgetSpentIDR,
    });

    onClose();
  };

  const toggleQuarter = (q: QuarterPeriod) => {
    if (timelineQuarter.includes(q)) {
      setTimelineQuarter(timelineQuarter.filter((item) => item !== q));
    } else {
      setTimelineQuarter([...timelineQuarter, q]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl space-y-6 p-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500 text-slate-950 rounded-xl font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Tambah Rencana Kerja Matriks RKAB</h3>
              <p className="text-xs text-slate-400">Pendaftaran kegiatan operasional terstandar Minerba ESDM</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Kode Matriks</label>
              <input
                type="text"
                value={matrixCode}
                onChange={(e) => setMatrixCode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Kategori Kegiatan</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="EKSPLORASI">EKSPLORASI</option>
                <option value="PENAMBANGAN">PENAMBANGAN</option>
                <option value="PENGOLAHAN">PENGOLAHAN</option>
                <option value="INFRASTRUKTUR">INFRASTRUKTUR</option>
                <option value="LINGKUNGAN">LINGKUNGAN</option>
                <option value="K3">K3 & SMKP</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Nama Program Kerja / Kegiatan</label>
            <input
              type="text"
              placeholder="Contoh: Pembuatan Kolam Sedimen Pengendap Tambahan Pit 2"
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Target Volume</label>
              <input
                type="number"
                value={targetVolume}
                onChange={(e) => setTargetVolume(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Satuan</label>
              <input
                type="text"
                placeholder="BCM / Ha / KM / Unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Realisasi Fisik</label>
              <input
                type="number"
                value={realizedVolume}
                onChange={(e) => setRealizedVolume(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-emerald-400 font-mono focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Alokasi Anggaran (IDR)</label>
              <input
                type="number"
                value={budgetAllocatedIDR}
                onChange={(e) => setBudgetAllocatedIDR(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">PIC Penanggung Jawab</label>
              <input
                type="text"
                placeholder="Nama & Jabatan"
                value={responsiblePerson}
                onChange={(e) => setResponsiblePerson(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">Jadwal Pelaksanaan (Kuartal)</label>
            <div className="flex items-center gap-2">
              {(["Q1", "Q2", "Q3", "Q4"] as QuarterPeriod[]).map((q) => {
                const active = timelineQuarter.includes(q);
                return (
                  <button
                    key={q}
                    type="button"
                    onClick={() => toggleQuarter(q)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      active
                        ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20"
                        : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white"
                    }`}
                  >
                    {q}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Simpan Program RKAB</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
