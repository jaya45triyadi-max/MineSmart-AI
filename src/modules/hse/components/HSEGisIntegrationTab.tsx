import React, { useState } from "react";
import { MapPin, ShieldAlert, AlertTriangle, Layers, Flame, Eye, Filter } from "lucide-react";
import { HSEIncident, Hazard } from "../../../types/hseTypes";

interface HSEGisIntegrationTabProps {
  incidents: HSEIncident[];
  hazards: Hazard[];
}

export const HSEGisIntegrationTab: React.FC<HSEGisIntegrationTabProps> = ({ incidents, hazards }) => {
  const [selectedLayer, setSelectedLayer] = useState<"ALL" | "INCIDENTS" | "HAZARDS">("ALL");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-400" />
            Integrasi HSE GIS & Peta Sebaran Risiko Tambang
          </h2>
          <p className="text-xs text-slate-400">Pemetaan spasial insiden, potensi bahaya, dan zona risiko tinggi di seluruh konsesi site</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-lg text-xs">
          <button
            onClick={() => setSelectedLayer("ALL")}
            className={`px-3 py-1.5 rounded-md font-medium ${selectedLayer === "ALL" ? "bg-indigo-600 text-white" : "text-slate-400"}`}
          >
            Semua Layer
          </button>
          <button
            onClick={() => setSelectedLayer("INCIDENTS")}
            className={`px-3 py-1.5 rounded-md font-medium ${selectedLayer === "INCIDENTS" ? "bg-rose-600 text-white" : "text-slate-400"}`}
          >
            Insiden Saja
          </button>
          <button
            onClick={() => setSelectedLayer("HAZARDS")}
            className={`px-3 py-1.5 rounded-md font-medium ${selectedLayer === "HAZARDS" ? "bg-amber-600 text-white" : "text-slate-400"}`}
          >
            Bahaya Saja
          </button>
        </div>
      </div>

      {/* Map Container Mockup with High Contrast Mining Canvas */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 relative overflow-hidden min-h-[420px] flex flex-col justify-between">
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="bg-slate-900/90 border border-slate-800 backdrop-blur px-3 py-2 rounded-lg text-xs text-slate-300 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            GIS Coordinates: Lat: -2.1245°, Lng: 115.3821° (Site Alpha Pit & Haul Road)
          </div>

          <div className="bg-slate-900/90 border border-slate-800 backdrop-blur px-3 py-2 rounded-lg text-xs text-slate-300 font-semibold">
            Status GIS: <span className="text-emerald-400">Live Spatial Sync</span>
          </div>
        </div>

        {/* Spatial Pins */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
          {(selectedLayer === "ALL" || selectedLayer === "INCIDENTS") &&
            incidents.map((inc) => (
              <div
                key={inc.id}
                className="bg-slate-900/90 border border-rose-500/40 rounded-xl p-4 backdrop-blur shadow-lg shadow-rose-950/30 flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-rose-300">{inc.incidentNumber}</div>
                  <div className="text-xs font-semibold text-white">{inc.locationName}</div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{inc.description}</p>
                </div>
              </div>
            ))}

          {(selectedLayer === "ALL" || selectedLayer === "HAZARDS") &&
            hazards.map((haz) => (
              <div
                key={haz.id}
                className="bg-slate-900/90 border border-amber-500/40 rounded-xl p-4 backdrop-blur shadow-lg shadow-amber-950/30 flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-300">Hazard: {haz.category}</div>
                  <div className="text-xs font-semibold text-white">{haz.locationName}</div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{haz.description}</p>
                </div>
              </div>
            ))}
        </div>

        <div className="relative z-10 bg-slate-900/90 border border-slate-800 backdrop-blur p-3 rounded-lg text-xs text-slate-400 flex items-center justify-between">
          <span>Mining GIS Spatial Health: Optimal Resolution</span>
          <span className="text-indigo-400 font-medium">Terhubung dengan Module GIS (Prompt 8)</span>
        </div>
      </div>
    </div>
  );
};
