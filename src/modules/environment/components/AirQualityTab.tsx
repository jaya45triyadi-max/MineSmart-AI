import React from "react";
import {
  Wind,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Gauge,
  MapPin,
  Clock,
  Sparkles,
} from "lucide-react";
import {
  AirMonitoringStation,
  AirQualityReading,
} from "../../../types/environmentTypes";

interface Props {
  stations: AirMonitoringStation[];
  readings: AirQualityReading[];
}

export const AirQualityTab: React.FC<Props> = ({ stations, readings }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-slate-900 p-6 border border-slate-800 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <Wind className="h-6 w-6 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">
              Air Quality & Ambient Monitoring (PM10, PM2.5, SO2, NO2, TSP)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Pemantauan kualitas udara ambien stasiun kontinu (PP No. 22/2021) di area ROM, Crusher, Pit, Camp, & batas site
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20 self-start sm:self-auto">
          <Activity className="h-4 w-4" /> 3 Stasiun Sensor Online
        </span>
      </div>

      {/* Monitoring Stations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stations.map((st) => (
          <div
            key={st.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-md space-y-4 hover:border-emerald-500/40 transition"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  {st.stationId}
                </span>
                <h3 className="font-bold text-white text-sm mt-0.5">{st.name}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3 text-slate-500" /> {st.locationName}
                </p>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  st.status === "ONLINE"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}
              >
                {st.status}
              </span>
            </div>

            {/* Monitored Parameters Pills */}
            <div className="flex flex-wrap gap-1.5">
              {st.parametersMonitored.map((param) => (
                <span
                  key={param}
                  className="rounded-md bg-slate-950 px-2 py-0.5 text-[10px] font-semibold text-slate-300 border border-slate-800"
                >
                  {param}
                </span>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Kalibrasi Alat: <strong className="text-slate-200">{st.calibrationStatus}</strong></span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> Real-time
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Real-time Parameter Readings & Standards Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-emerald-400" />
            <h3 className="font-bold text-white text-sm">
              Hasil Pembacaan Sensor vs Baku Mutu PP No. 22/2021
            </h3>
          </div>
          <span className="text-xs text-slate-400">Pembaruan Terakhir: 10:00 WITA</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {readings.map((rdg) => {
            const percentageOfLimit = Math.round((rdg.value / rdg.standardLimit) * 100);
            return (
              <div
                key={rdg.id}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white">{rdg.parameter}</span>
                    <p className="text-[10px] text-slate-400 line-clamp-1">
                      {rdg.stationName}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      rdg.complianceStatus === "COMPLIANT"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {rdg.complianceStatus}
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-emerald-400">
                    {rdg.value}
                  </span>
                  <span className="text-xs text-slate-400">{rdg.unit}</span>
                </div>

                {/* Progress Bar vs Standard Limit */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Baku Mutu: {rdg.standardLimit} {rdg.unit}</span>
                    <span>{percentageOfLimit}% Limit</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        percentageOfLimit > 90
                          ? "bg-red-500"
                          : percentageOfLimit > 75
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${Math.min(percentageOfLimit, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
