// MINE SMART AI - Survey Instruments & Telemetry Integrations (Drone, RTK GPS, Total Station, GNSS, Level, Scanner)

import React, { useState } from "react";
import {
  Radio,
  Compass,
  Navigation,
  Crosshair,
  Layers,
  Battery,
  Wifi,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Cpu,
  MapPin,
  Camera,
  Satellite,
  Gauge,
  Sliders,
  Sparkles,
} from "lucide-react";
import { SurveyDeviceTelemetry } from "../../../types/surveyTypes";

interface SurveyIntegrationViewProps {
  devices: SurveyDeviceTelemetry[];
  onRefreshTelemetry?: () => void;
  onOpenAIAnalyzeDevice?: (device: SurveyDeviceTelemetry) => void;
}

export const SurveyIntegrationView: React.FC<SurveyIntegrationViewProps> = ({
  devices,
  onRefreshTelemetry,
  onOpenAIAnalyzeDevice,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");
  const [activeDevice, setActiveDevice] = useState<SurveyDeviceTelemetry | null>(devices[0] || null);

  const filteredDevices =
    selectedFilter === "ALL" ? devices : devices.filter((d) => d.type === selectedFilter);

  const getStatusBadge = (status: SurveyDeviceTelemetry["status"]) => {
    switch (status) {
      case "ONLINE_ACTIVE":
        return (
          <span className="px-2.5 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            ONLINE ACTIVE
          </span>
        );
      case "STANDBY":
        return (
          <span className="px-2.5 py-0.5 text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-full flex items-center gap-1">
            STANDBY
          </span>
        );
      case "PROCESSING":
        return (
          <span className="px-2.5 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full flex items-center gap-1">
            PROCESSING
          </span>
        );
      case "CALIBRATION_DUE":
        return (
          <span className="px-2.5 py-0.5 text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            CALIBRATION DUE
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 text-[10px] font-bold bg-slate-500/20 text-slate-300 border border-slate-500/30 rounded-full">
            OFFLINE
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-sky-500/10 border border-sky-500/30 rounded-xl text-sky-400">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Survey Hardware & Telemetry Integrations
              <span className="px-2 py-0.5 text-[10px] bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-full font-mono">
                Drone UAV • RTK GPS • Total Station • GNSS CORS • 3D Scanner
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Sinkronisasi real-time instrumen geospasial lapangan, status fix RTK, baseline vector, dan kalibrasi optis.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onRefreshTelemetry && onRefreshTelemetry()}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
            <span>Sync Telemetri</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {["ALL", "Drone", "RTK GPS", "Total Station", "GNSS", "Digital Level", "Laser Scanner"].map(
          (filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all whitespace-nowrap cursor-pointer ${
                selectedFilter === filter
                  ? "bg-sky-600 border-sky-500 text-white shadow-md shadow-sky-950/40"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
              }`}
            >
              {filter}
            </button>
          )
        )}
      </div>

      {/* Main Grid: Device Cards & Detail Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Device Cards List */}
        <div className="space-y-3">
          {filteredDevices.map((device) => {
            const isSelected = activeDevice?.id === device.id;
            return (
              <div
                key={device.id}
                onClick={() => setActiveDevice(device)}
                className={`p-4 bg-slate-900/90 border rounded-2xl space-y-3 transition-all cursor-pointer ${
                  isSelected
                    ? "border-sky-500 bg-sky-950/20 shadow-lg shadow-sky-950/30 ring-1 ring-sky-500/30"
                    : "border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-sky-400 block">{device.type}</span>
                    <h4 className="text-sm font-bold text-white">{device.name}</h4>
                    <span className="text-xs text-slate-400 font-mono">{device.model}</span>
                  </div>
                  {getStatusBadge(device.status)}
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs font-mono pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Battery className={`w-3.5 h-3.5 ${device.batteryLevelPct > 30 ? "text-emerald-400" : "text-rose-400"}`} />
                    <span>{device.batteryLevelPct}%</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Wifi className="w-3.5 h-3.5 text-sky-400" />
                    <span>{device.signalQualityPct}%</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span className="truncate">{device.location.area.split("-")[0]}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Detailed Live Telemetry Inspector */}
        <div className="lg:col-span-2 space-y-6">
          {activeDevice ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-lg font-mono">
                      {activeDevice.deviceId}
                    </span>
                    <h3 className="text-base font-bold text-white">{activeDevice.name}</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 font-mono">
                    S/N: {activeDevice.serialNumber} • Operator: {activeDevice.currentSurveyor}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(activeDevice.status)}
                  {onOpenAIAnalyzeDevice && (
                    <button
                      onClick={() => onOpenAIAnalyzeDevice(activeDevice)}
                      className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Analisis AI</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Geographic Coordinates Telemetry */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-sans">Easting (X)</span>
                  <span className="font-mono text-sm font-bold text-sky-400">
                    {activeDevice.location.easting.toFixed(3)} m
                  </span>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-sans">Northing (Y)</span>
                  <span className="font-mono text-sm font-bold text-sky-400">
                    {activeDevice.location.northing.toFixed(3)} m
                  </span>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-sans">Elevation (RL)</span>
                  <span className="font-mono text-sm font-bold text-emerald-400">
                    {activeDevice.location.elevation.toFixed(3)} m
                  </span>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-sans">Sektor Tambang</span>
                  <span className="font-sans text-xs font-bold text-amber-400 truncate block">
                    {activeDevice.location.area}
                  </span>
                </div>
              </div>

              {/* Type-Specific Deep Telemetry */}
              {/* 1. Drone UAV Details */}
              {activeDevice.droneDetails && (
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <Camera className="w-4 h-4 text-sky-400" />
                    Telemetri Misi Penerbangan Fotogrametri UAV
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 font-sans block">Misi Penerbangan</span>
                      <span className="font-bold text-white truncate block">{activeDevice.droneDetails.flightMission}</span>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 font-sans block">GSD Ketelitian</span>
                      <span className="font-bold text-emerald-400">{activeDevice.droneDetails.gsdCmPx} cm/pixel</span>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 font-sans block">Ketinggian Terbang AGL</span>
                      <span className="font-bold text-sky-400">{activeDevice.droneDetails.altitudeAglMeters} m</span>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 font-sans block">Foto Terkumpul</span>
                      <span className="font-bold text-amber-400">{activeDevice.droneDetails.capturedPhotos} Foto</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. RTK GPS Details */}
              {activeDevice.rtkDetails && (
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <Satellite className="w-4 h-4 text-sky-400" />
                    Telemetri Solusi RTK & Konstelasi Satelit
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 font-sans block">Status Solusi</span>
                      <span className="font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {activeDevice.rtkDetails.fixStatus} (100%)
                      </span>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 font-sans block">Satelit Terlacak</span>
                      <span className="font-bold text-white">{activeDevice.rtkDetails.satellitesCount} SVs (4 Konstelasi)</span>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 font-sans block">PDOP / HDOP</span>
                      <span className="font-bold text-sky-400">
                        {activeDevice.rtkDetails.pdop} / {activeDevice.rtkDetails.hdop}
                      </span>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 font-sans block">Presisi RMS H / V</span>
                      <span className="font-bold text-amber-400">
                        {activeDevice.rtkDetails.horizontalRmsMm}mm / {activeDevice.rtkDetails.verticalRmsMm}mm
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Total Station Details */}
              {activeDevice.totalStationDetails && (
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <Crosshair className="w-4 h-4 text-sky-400" />
                    Konfigurasi Stasiun Ukur & Backsight Total Station
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 font-sans block">Metode Setup</span>
                      <span className="font-bold text-white truncate block">
                        {activeDevice.totalStationDetails.setupMethod}
                      </span>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 font-sans block">Backsight Check</span>
                      <span className="font-bold text-emerald-400">
                        {activeDevice.totalStationDetails.backsightDeltaHzSec}" detik busur
                      </span>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 font-sans block">Tipe Prisma</span>
                      <span className="font-bold text-sky-400 truncate block">
                        {activeDevice.totalStationDetails.prismType}
                      </span>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 font-sans block">Mode EDM</span>
                      <span className="font-bold text-amber-400">
                        {activeDevice.totalStationDetails.edmMode}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. Scanner Details */}
              {activeDevice.scannerDetails && (
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-sky-400" />
                    Telemetri Terrestrial 3D Laser Scanner (FARO Focus)
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 font-sans block">Resolusi Pindai</span>
                      <span className="font-bold text-white truncate block">
                        {activeDevice.scannerDetails.scanResolution}
                      </span>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 font-sans block">Laju Perekaman</span>
                      <span className="font-bold text-sky-400">{activeDevice.scannerDetails.pointsPerSec}</span>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 font-sans block">Scan Terdaftar</span>
                      <span className="font-bold text-emerald-400">
                        {activeDevice.scannerDetails.registeredScansCount} Stasiun
                      </span>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 font-sans block">Registrasi Error</span>
                      <span className="font-bold text-amber-400">
                        {activeDevice.scannerDetails.targetRegistrationErrorMm} mm
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 bg-slate-900 border border-slate-800 rounded-2xl text-center text-slate-400 text-xs">
              Pilih instrumen survei untuk melihat data telemetri langsung.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
