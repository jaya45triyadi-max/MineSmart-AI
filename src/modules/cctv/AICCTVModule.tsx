// MINE SMART AI - Enterprise AI CCTV & Vision Mining Analytics Module
// Fulfills Enterprise requirement: PPE, Helmet, Vest, Person, Vehicle, Restricted Area, Unsafe Interaction, Smoke/Fire
// Standard: Kepmen ESDM No. 1827 K/30/MEM/2018 (Lampiran III K3 Pertambangan)

import React, { useState, useEffect } from "react";
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  Camera,
  CheckCircle2,
  Cpu,
  Eye,
  Flame,
  HardHat,
  Layers,
  LayoutGrid,
  Radio,
  Scan,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Truck,
  Users,
  Video,
  Zap,
} from "lucide-react";

import {
  CameraFeed,
  VisionIncident,
  PPEZoneSummary,
  AICCTVEnterpriseSummary,
  VisionDetectionCategory,
} from "../../types/cctvTypes";

import {
  INITIAL_CAMERA_FEEDS,
  INITIAL_VISION_INCIDENTS_LIST,
  INITIAL_PPE_ZONE_SUMMARIES,
  INITIAL_AICCTV_ENTERPRISE_SUMMARY,
} from "../../data/cctvData";

import { VisionAiEngine } from "../../services/cctv/visionAiEngine";
import { CCTVHeaderStats } from "./components/CCTVHeaderStats";
import { LiveCameraGrid } from "./components/LiveCameraGrid";
import { VisionIncidentFeed } from "./components/VisionIncidentFeed";
import { PPEComplianceHeatmap } from "./components/PPEComplianceHeatmap";
import { RestrictedZoneManager } from "./components/RestrictedZoneManager";
import { VisionAiSandboxModal } from "./components/VisionAiSandboxModal";
import { CameraConfigModal } from "./components/CameraConfigModal";

type ActiveTabType = "live-matrix" | "incidents" | "ppe-heatmap" | "geofencing";

export const AICCTVModule: React.FC = () => {
  const [cameras, setCameras] = useState<CameraFeed[]>(INITIAL_CAMERA_FEEDS);
  const [incidents, setIncidents] = useState<VisionIncident[]>(INITIAL_VISION_INCIDENTS_LIST);
  const [ppeSummaries, setPpeSummaries] = useState<PPEZoneSummary[]>(INITIAL_PPE_ZONE_SUMMARIES);
  const [enterpriseSummary, setEnterpriseSummary] = useState<AICCTVEnterpriseSummary>(
    INITIAL_AICCTV_ENTERPRISE_SUMMARY
  );

  const [selectedCamera, setSelectedCamera] = useState<CameraFeed>(INITIAL_CAMERA_FEEDS[0]);
  const [activeTab, setActiveTab] = useState<ActiveTabType>("live-matrix");
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [liveFrameCount, setLiveFrameCount] = useState<number>(4892400);

  const [isSandboxOpen, setIsSandboxOpen] = useState<boolean>(false);
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Live video stream simulation loop (runs every 2.5 seconds when streaming is active)
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      setLiveFrameCount((prev) => prev + 30);
      setCameras((prevCams) =>
        prevCams.map((cam) => VisionAiEngine.simulateCameraTick(cam))
      );
    }, 2500);

    return () => clearInterval(interval);
  }, [isStreaming]);

  // Handler for acknowledging incidents
  const handleAcknowledgeIncident = (id: string) => {
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === id ? { ...inc, status: "ACKNOWLEDGED", acknowledgedBy: "Pengawas K3 KTT" } : inc
      )
    );
    showToast("Insiden K3 telah diakui (Acknowledged) oleh Pengawas K3");
  };

  // Handler for dispatching audio/radio alert
  const handleDispatchAlert = (incident: VisionIncident) => {
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === incident.id
          ? {
              ...inc,
              dispatchedAlerts: {
                ...inc.dispatchedAlerts,
                radioBroadcastSent: true,
                sirenActivated: true,
              },
            }
          : inc
      )
    );
    showToast(`🚨 Peringatan K3 Darurat disiarkan via Radio Channel Pit 01: "${incident.title}"`);
  };

  // Handler for injecting custom test scenario from Sandbox
  const handleInjectViolation = (
    cameraId: string,
    category: VisionDetectionCategory,
    customDetection: any
  ) => {
    setCameras((prevCams) =>
      prevCams.map((cam) => {
        if (cam.id === cameraId) {
          const updatedDetections = [customDetection, ...cam.activeDetections];
          const newViolationsCount = updatedDetections.filter((d) => d.isViolation).length;
          return {
            ...cam,
            activeDetections: updatedDetections,
            activeViolationsCount: newViolationsCount,
          };
        }
        return cam;
      })
    );

    // Also scan and append to incidents list
    const targetCam = cameras.find((c) => c.id === cameraId) || cameras[0];
    const newIncidents = VisionAiEngine.scanCameraFeed({
      ...targetCam,
      activeDetections: [customDetection, ...targetCam.activeDetections],
    });

    if (newIncidents.length > 0) {
      setIncidents((prev) => [newIncidents[0], ...prev]);
      setEnterpriseSummary((prev) => ({
        ...prev,
        criticalSafetyBreachesToday: prev.criticalSafetyBreachesToday + 1,
        totalViolationsToday: prev.totalViolationsToday + 1,
        detectionsByCategory: {
          ...prev.detectionsByCategory,
          [category]: prev.detectionsByCategory[category] + 1,
        },
      }));
    }

    showToast(`✓ Injeksi pengujian AI Vision berhasil pada ${targetCam.name}!`);
  };

  // Handler for adding geofence hazard zone
  const handleAddZone = (cameraId: string, newZone: any) => {
    setCameras((prevCams) =>
      prevCams.map((cam) =>
        cam.id === cameraId
          ? { ...cam, virtualRestrictedZones: [...cam.virtualRestrictedZones, newZone] }
          : cam
      )
    );
    showToast(`✓ Geofence "${newZone.name}" berhasil diaktifkan!`);
  };

  // Handler for saving RTSP camera config
  const handleSaveCameraConfig = (updatedCamera: CameraFeed) => {
    setCameras((prevCams) =>
      prevCams.map((cam) => (cam.id === updatedCamera.id ? updatedCamera : cam))
    );
    setSelectedCamera(updatedCamera);
    showToast(`✓ Konfigurasi streaming ${updatedCamera.code} tersimpan.`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-5 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-indigo-500/60 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Stats Bar */}
      <CCTVHeaderStats
        summary={enterpriseSummary}
        liveFrameCount={liveFrameCount}
        isStreaming={isStreaming}
        onToggleStreaming={() => setIsStreaming(!isStreaming)}
        onOpenSandbox={() => setIsSandboxOpen(true)}
        onOpenConfig={() => setIsConfigOpen(true)}
      />

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {[
          {
            id: "live-matrix" as ActiveTabType,
            label: "Live Camera Grid & AI Bounding Boxes",
            icon: LayoutGrid,
            badge: `${cameras.length} Feeds`,
          },
          {
            id: "incidents" as ActiveTabType,
            label: "Vision Forensic Incident Feed",
            icon: ShieldAlert,
            badge: `${incidents.filter((i) => i.status === "ACTIVE").length} Active`,
            badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
          },
          {
            id: "ppe-heatmap" as ActiveTabType,
            label: "PPE Compliance Heatmap (Helmet/Vest/Boots)",
            icon: HardHat,
            badge: `${enterpriseSummary.overallPPECompliancePct.toFixed(0)}% Index`,
          },
          {
            id: "geofencing" as ActiveTabType,
            label: "Virtual Restricted Hazard Zones",
            icon: Layers,
            badge: "ESDM K3",
          },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-900/30"
                  : "bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full border font-mono ${
                    tab.badgeColor || (isActive ? "bg-white/20 text-white border-white/30" : "bg-slate-800 text-slate-400 border-slate-700")
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Tab Content Display */}
      {activeTab === "live-matrix" && (
        <LiveCameraGrid
          cameras={cameras}
          selectedCamera={selectedCamera}
          onSelectCamera={(cam) => setSelectedCamera(cam)}
          onTriggerInspection={(cam) => {
            setSelectedCamera(cam);
            setActiveTab("incidents");
          }}
          onOpenSandboxForCamera={(cam) => {
            setSelectedCamera(cam);
            setIsSandboxOpen(true);
          }}
        />
      )}

      {activeTab === "incidents" && (
        <VisionIncidentFeed
          incidents={incidents}
          cameras={cameras}
          onAcknowledge={handleAcknowledgeIncident}
          onSelectCamera={(camId) => {
            const found = cameras.find((c) => c.id === camId);
            if (found) {
              setSelectedCamera(found);
              setActiveTab("live-matrix");
            }
          }}
          onDispatchAlert={handleDispatchAlert}
        />
      )}

      {activeTab === "ppe-heatmap" && (
        <PPEComplianceHeatmap zoneSummaries={ppeSummaries} />
      )}

      {activeTab === "geofencing" && (
        <RestrictedZoneManager
          cameras={cameras}
          selectedCamera={selectedCamera}
          onSelectCamera={(cam) => setSelectedCamera(cam)}
          onAddZone={handleAddZone}
        />
      )}

      {/* Modals */}
      <VisionAiSandboxModal
        isOpen={isSandboxOpen}
        onClose={() => setIsSandboxOpen(false)}
        cameras={cameras}
        onInjectViolation={handleInjectViolation}
      />

      <CameraConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        selectedCamera={selectedCamera}
        onSaveConfig={handleSaveCameraConfig}
      />
    </div>
  );
};
