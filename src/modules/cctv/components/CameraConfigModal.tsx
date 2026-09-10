// MINE SMART AI - AI CCTV Camera Configuration & RTSP / ONVIF Setup Modal

import React, { useState } from "react";
import {
  Camera,
  CheckCircle2,
  Cpu,
  Radio,
  Save,
  Server,
  Settings,
  ShieldCheck,
  Video,
  X,
} from "lucide-react";
import { CameraFeed } from "../../../types/cctvTypes";

interface CameraConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCamera: CameraFeed;
  onSaveConfig: (updatedCamera: CameraFeed) => void;
}

export const CameraConfigModal: React.FC<CameraConfigModalProps> = ({
  isOpen,
  onClose,
  selectedCamera,
  onSaveConfig,
}) => {
  const [streamUrl, setStreamUrl] = useState(selectedCamera.streamUrl);
  const [resolution, setResolution] = useState(selectedCamera.resolution);
  const [fps, setFps] = useState(selectedCamera.fps);
  const [modelName, setModelName] = useState(selectedCamera.edgeAiGateway.modelName);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: CameraFeed = {
      ...selectedCamera,
      streamUrl,
      resolution: resolution as any,
      fps: Number(fps),
      edgeAiGateway: {
        ...selectedCamera.edgeAiGateway,
        modelName,
      },
    };

    onSaveConfig(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Konfigurasi Kamera & AI Edge Stream
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                {selectedCamera.code} • {selectedCamera.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              RTSP / ONVIF Video Stream Endpoint
            </label>
            <input
              type="text"
              value={streamUrl}
              onChange={(e) => setStreamUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-750 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
            />
            <span className="text-[10px] text-slate-500 mt-1 block font-mono">
              H.265 / H.264 High-Throughput Video Pipeline
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Resolusi Video Stream
              </label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-750 text-xs text-slate-200 font-medium focus:outline-none focus:border-indigo-500"
              >
                <option value="4K UHD (3840x2160)">4K UHD (3840x2160)</option>
                <option value="1080p FHD (1920x1080)">1080p FHD (1920x1080)</option>
                <option value="720p HD">720p HD</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Target Frame Rate (FPS)
              </label>
              <select
                value={fps}
                onChange={(e) => setFps(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-750 text-xs text-slate-200 font-medium focus:outline-none focus:border-indigo-500"
              >
                <option value={30}>30 FPS (Standard Mining)</option>
                <option value={60}>60 FPS (High-Speed Haul Road)</option>
                <option value={15}>15 FPS (Bandwidth Saver)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              AI Detection Vision Model
            </label>
            <input
              type="text"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-750 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              Accelerator: NVIDIA Jetson AGX Orin 64GB with DeepStream Pipeline
            </span>
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            {savedSuccess ? (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Pengaturan Tersimpan!
              </span>
            ) : (
              <span className="text-[11px] text-slate-500">
                Auto-syncs with Edge Gateway Node
              </span>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-900/40"
              >
                <Save className="w-3.5 h-3.5" />
                Simpan Perubahan
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
