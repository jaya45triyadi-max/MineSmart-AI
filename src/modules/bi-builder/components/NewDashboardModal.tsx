// MINE SMART AI - BI Dashboard Builder New Dashboard Modal
import React, { useState } from "react";
import { X, Plus, Sparkles, LayoutDashboard, Pickaxe, Fuel, Truck } from "lucide-react";
import { CustomBIDashboard } from "../../../types/biBuilderTypes";

interface NewDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateDashboard: (title: string, description: string, templateType: string) => void;
}

export const NewDashboardModal: React.FC<NewDashboardModalProps> = ({
  isOpen,
  onClose,
  onCreateDashboard,
}) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("BLANK");

  if (!isOpen) return null;

  const templates = [
    {
      id: "BLANK",
      title: "Kanvas Kosong (Blank Builder)",
      desc: "Mulai dari nol dan susun widget secara bebas sesuai kebutuhan spesifik Anda.",
      icon: Plus,
    },
    {
      id: "EXECUTIVE",
      title: "Executive Mine Overview",
      desc: "Paket KPI Produksi Batubara, OB, PA Fleet, Biaya/Ton, Peta Pit & Gemini AI Insight.",
      icon: LayoutDashboard,
    },
    {
      id: "OPERATIONS",
      title: "Pit Operations & Hauling Dispatch",
      desc: "Fokus pada antrean loading shovel, cycle times, armada aktif, dan rute spatial.",
      icon: Truck,
    },
    {
      id: "FUEL_COST",
      title: "Fuel & Cost Optimization Center",
      desc: "Analisis konsumsi solar L/BCM, burn rate unit, tank level, dan struktur OPEX.",
      icon: Fuel,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateDashboard(title || "Custom Mining Dashboard", description || "Dashboard analitik kustom", selectedTemplate);
    setTitle("");
    setDescription("");
    setSelectedTemplate("BLANK");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl space-y-5 p-6 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500 text-slate-950 rounded-xl font-bold">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Buat Dashboard BI Baru</h3>
              <p className="text-xs text-slate-400">Pilih template pemula atau mulai dari kanvas kosong</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-300 block mb-1">Judul Dashboard</label>
            <input
              type="text"
              placeholder="Contoh: Pit South Daily Monitoring & Hauling Speed"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400"
              required
            />
          </div>

          <div>
            <label className="font-bold text-slate-300 block mb-1">Deskripsi Singkat</label>
            <input
              type="text"
              placeholder="Contoh: Dashboard pemantauan harian fleet dan konsumsi solar pit 2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Template Selector */}
          <div className="space-y-2">
            <label className="font-bold text-slate-300 block">Pilih Template Permulaan</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {templates.map((tpl) => {
                const Icon = tpl.icon;
                const isSelected = selectedTemplate === tpl.id;

                return (
                  <div
                    key={tpl.id}
                    onClick={() => setSelectedTemplate(tpl.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all space-y-1.5 ${
                      isSelected
                        ? "bg-amber-500/10 border-amber-500 ring-1 ring-amber-500/50"
                        : "bg-slate-950 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-1.5 rounded-lg ${
                          isSelected
                            ? "bg-amber-500 text-slate-950"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <h4 className={`text-xs font-bold ${isSelected ? "text-amber-400" : "text-white"}`}>
                        {tpl.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {tpl.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Buat & Buka Dashboard</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
