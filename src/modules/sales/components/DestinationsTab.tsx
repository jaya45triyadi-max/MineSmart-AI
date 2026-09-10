import React from "react";
import { MapPin, Globe, Anchor, CheckCircle2 } from "lucide-react";
import { DestinationPort } from "../../../types/salesTypes";

interface DestinationsTabProps {
  destinations: DestinationPort[];
}

export const DestinationsTab: React.FC<DestinationsTabProps> = ({ destinations }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Globe className="w-5 h-5 text-emerald-500" />
          Destinations & Discharge Ports Directory
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          International discharge ports, thermal power plant jetty terminals, unloading rate capacities, and draught limits.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {destinations.map((dest) => (
          <div
            key={dest.id}
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  {dest.portCode}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">
                  {dest.destinationName}
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {dest.country}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <MapPin className="w-4 h-4 text-emerald-500" />
                <span>Coordinates: {dest.coordinates.lat}, {dest.coordinates.lng}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Anchor className="w-4 h-4 text-emerald-500" />
                <span>Unloading Capability: <strong>{dest.unloadingCapability}</strong></span>
              </div>
            </div>

            <div className="text-xs text-slate-500">
              Address: {dest.address}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
