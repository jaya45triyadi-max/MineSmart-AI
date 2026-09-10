// MINE SMART AI - Dynamic Feature Flags & Rollout Control Console
// PROMPT 36: Feature Flag Toggles, Rollout Stages & Tenant Overrides

import React, { useState } from "react";
import {
  Flag,
  Sparkles,
  Save,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Plus,
  Trash2,
  Shield,
  Layers,
} from "lucide-react";
import {
  PlatformConfig,
  FeatureFlagItem,
} from "../../../types/developerControlPanelTypes";
import { platformConfigService } from "../../../services/config/PlatformConfigService";

interface FeatureFlagsManagerViewProps {
  config: PlatformConfig;
  onRefresh: () => void;
}

export const FeatureFlagsManagerView: React.FC<FeatureFlagsManagerViewProps> = ({
  config,
  onRefresh,
}) => {
  const [flagsDraft, setFlagsDraft] = useState<FeatureFlagItem[]>([...config.featureFlags]);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const handleUpdateStatus = (id: string, newStatus: FeatureFlagItem["status"]) => {
    setFlagsDraft((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: newStatus } : f))
    );
  };

  const handleSaveFlags = async () => {
    await platformConfigService.publishConfig(
      { featureFlags: flagsDraft },
      "Triyadi Jaya",
      "jaya45triyadi@gmail.com",
      "Pembaruan Status Feature Flags & Rollout"
    );
    setActionSuccessMessage("✅ Status feature flags berhasil dipublikasikan ke production!");
    onRefresh();
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Flag className="w-5 h-5 text-amber-400" />
            <span>Dynamic Feature Flags & Progressive Rollout</span>
          </h2>
          <p className="text-xs text-slate-400">
            Aktifkan atau nonaktifkan fitur spesifik secara real-time tanpa perlu deployment kode ulang.
          </p>
        </div>

        <button
          onClick={handleSaveFlags}
          className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/25 transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Publish Feature Flags</span>
        </button>
      </div>

      {actionSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Feature Flags List */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
        <div className="space-y-3">
          {flagsDraft.map((flag) => (
            <div
              key={flag.id}
              className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-white">
                    {flag.key}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-800 text-slate-300">
                    {flag.category}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">
                    Min: {flag.minPlanRequired}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-200">
                  {flag.name}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {flag.description}
                </p>
              </div>

              {/* Status Radio / Selector */}
              <div className="flex items-center gap-2 shrink-0">
                {(["ENABLED", "BETA", "MAINTENANCE", "DISABLED"] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(flag.id, st)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all cursor-pointer ${
                      flag.status === st
                        ? st === "ENABLED"
                          ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                          : st === "BETA"
                          ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                          : st === "MAINTENANCE"
                          ? "bg-orange-500 text-white"
                          : "bg-rose-600 text-white shadow-md shadow-rose-600/20"
                        : "bg-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
