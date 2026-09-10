// MINE SMART AI - Comprehensive Mobile Application
// Responsive Native Views: PC | Laptop | Tablet | Android | iOS
// 9 Dedicated Mobile Workflows: Dashboard | Production | Inspection | HSE | Equipment | Attendance | Approval | Notification | AI Assistant

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Pickaxe,
  ClipboardCheck,
  ShieldAlert,
  Truck,
  Clock,
  CheckSquare,
  Bell,
  Bot,
  Smartphone,
  Tablet as TabletIcon,
  Laptop as LaptopIcon,
  Monitor,
  Apple,
  Wifi,
  WifiOff,
  Battery,
  Signal,
  MapPin,
  RefreshCw,
  Plus,
  Check,
  X,
  AlertTriangle,
  Flame,
  Fuel,
  Volume2,
  Send,
  Camera,
  Maximize2,
  Minimize2,
  ChevronRight,
  TrendingUp,
  Sliders,
  Sparkles,
  Calendar,
  User,
  Search,
  Compass,
} from "lucide-react";
import { useAuth } from "../../providers/AuthProvider";
import {
  DeviceViewportMode,
  MobileTab,
  MobileProductionTally,
  MobileP2HInspection,
  MobileHazardReport,
  MobileApprovalItem,
  MobileAttendanceLog,
} from "../../types/mobileAppTypes";
import {
  MobileAppService,
  INITIAL_SHIFT_SUMMARY,
  INITIAL_P2H_TEMPLATE,
} from "../../services/mobile/MobileAppService";
import { OfflineManagerService } from "../../services/offline/OfflineManagerService";
import { SmartAlertEngineService } from "../../services/ai/alerts/SmartAlertEngineService";
import { SmartAlertItem } from "../../types/smartAlertTypes";

export const MineSmartMobileApp: React.FC<{ onOpenAICopilot?: () => void }> = ({
  onOpenAICopilot,
}) => {
  const { user } = useAuth();

  // Device Frame State
  const [deviceMode, setDeviceMode] = useState<DeviceViewportMode>("ANDROID");
  const [activeTab, setActiveTab] = useState<MobileTab>("DASHBOARD");
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // Submodule Data States
  const [shiftSummary, setShiftSummary] = useState(INITIAL_SHIFT_SUMMARY);
  const [tallies, setTallies] = useState<MobileProductionTally[]>([]);
  const [p2h, setP2h] = useState<MobileP2HInspection>(INITIAL_P2H_TEMPLATE("HD785-05", "DUMP_TRUCK"));
  const [hazards, setHazards] = useState<MobileHazardReport[]>([]);
  const [approvals, setApprovals] = useState<MobileApprovalItem[]>([]);
  const [attendanceLogs, setAttendanceLogs] = useState<MobileAttendanceLog[]>([]);
  const [smartAlerts, setSmartAlerts] = useState<SmartAlertItem[]>([]);

  // Modals & Sub-forms
  const [isNewTallyOpen, setIsNewTallyOpen] = useState<boolean>(false);
  const [isNewHazardOpen, setIsNewHazardOpen] = useState<boolean>(false);
  const [p2hSuccessModal, setP2hSuccessModal] = useState<boolean>(false);

  // New Tally Form State
  const [tallyForm, setTallyForm] = useState({
    pitId: "Pit North Alpha",
    loaderUnitId: "EX-01 (PC2000)",
    haulerUnitId: "DT-102 (HD785)",
    materialType: "COAL" as "COAL" | "OVERBURDEN",
    destination: "ROM_STOCKPILE" as any,
    grossWeightTon: 98.5,
    countToAdd: 1,
  });

  // New Hazard Form State
  const [hazardForm, setHazardForm] = useState({
    title: "",
    category: "UNSAFE_CONDITION" as any,
    severityRating: "MEDIUM" as any,
    location: "Pit North Ramp KM 1.8",
    description: "",
  });

  // AI Mobile Chat State
  const [aiChatMessages, setAiChatMessages] = useState<
    { sender: "user" | "ai"; text: string; time: string }[]
  >([
    {
      sender: "ai",
      text: "Halo! Saya Asisten AI Lapangan MineSmart. Apa yang ingin Anda pantau? (Contoh: 'Cek produksi Pit North', 'Apakah ada unit breakdown?', 'Status solar')",
      time: "08:30",
    },
  ]);
  const [aiInputText, setAiInputText] = useState("");

  // Load Data
  const reloadData = () => {
    setTallies(MobileAppService.getTallies());
    setHazards(MobileAppService.getHazards());
    setApprovals(MobileAppService.getApprovals());
    setAttendanceLogs(MobileAppService.getAttendanceLogs());
    setSmartAlerts(SmartAlertEngineService.getAlerts());
  };

  useEffect(() => {
    reloadData();
  }, []);

  // Handlers
  const handleAddTally = () => {
    const newTally: MobileProductionTally = {
      id: `TLY-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      shift: "Shift 1",
      pitId: tallyForm.pitId,
      loaderUnitId: tallyForm.loaderUnitId,
      haulerUnitId: tallyForm.haulerUnitId,
      materialType: tallyForm.materialType,
      destination: tallyForm.destination,
      grossWeightTon: tallyForm.grossWeightTon,
      operatorName: user?.name || "Rudianto (Driver)",
      gpsCoordinates: { lat: -0.8425, lng: 117.153 },
      synced: isOnline,
    };
    const updated = MobileAppService.addTally(newTally);
    setTallies(updated);
    setIsNewTallyOpen(false);

    // Enqueue to Master Offline Sync Engine
    OfflineManagerService.enqueue(
      "PRODUCTION_RITASE",
      newTally.id,
      `Ritase ${newTally.haulerUnitId} (${newTally.materialType})`,
      newTally.pitId,
      {
        pit: newTally.pitId,
        hauler: newTally.haulerUnitId,
        loader: newTally.loaderUnitId,
        material: newTally.materialType,
        grossTonnage: newTally.grossWeightTon,
        destination: newTally.destination,
        operator: newTally.operatorName,
        shift: newTally.shift,
      },
      newTally.operatorName
    );
  };

  const handleP2hItemToggle = (itemId: string, status: "PASS" | "ATTENTION" | "FAIL") => {
    setP2h({
      ...p2h,
      items: p2h.items.map((item) => (item.id === itemId ? { ...item, status } : item)),
    });
  };

  const handleP2hSubmit = () => {
    const hasFail = p2h.items.some((i) => i.status === "FAIL");
    const hasAttn = p2h.items.some((i) => i.status === "ATTENTION");
    const overall = hasFail ? "DO_NOT_OPERATE" : hasAttn ? "FIT_WITH_NOTE" : "FIT_TO_WORK";

    setP2h({
      ...p2h,
      overallStatus: overall,
      digitalSignature: `SIG-VERIFIED-${user?.name || "OPERATOR"}-${Date.now()}`,
    });
    setP2hSuccessModal(true);
  };

  const handleHazardSubmit = () => {
    if (!hazardForm.title) return;
    const newHzd: MobileHazardReport = {
      id: `HZD-${Date.now().toString().slice(-4)}`,
      title: hazardForm.title,
      category: hazardForm.category,
      severityRating: hazardForm.severityRating,
      location: hazardForm.location,
      reportedBy: user?.name || "Safety Inspector",
      timestamp: "Baru saja",
      description: hazardForm.description || "Temuan bahaya teridentifikasi saat inspeksi lapangan rutin.",
      status: "OPEN",
    };
    const updated = MobileAppService.addHazard(newHzd);
    setHazards(updated);
    setIsNewHazardOpen(false);
    setHazardForm({
      title: "",
      category: "UNSAFE_CONDITION",
      severityRating: "MEDIUM",
      location: "Pit North Ramp KM 1.8",
      description: "",
    });
  };

  const handleApprovalAction = (id: string, action: "APPROVED" | "REJECTED") => {
    const updated = MobileAppService.updateApprovalStatus(id, action);
    setApprovals(updated);
  };

  const handleClockInOut = (action: "CLOCK_IN" | "CLOCK_OUT") => {
    const updated = MobileAppService.recordAttendance(action, "Main Pit North Office");
    setAttendanceLogs(updated);
  };

  const handleSendAiMessage = () => {
    if (!aiInputText.trim()) return;
    const userMsg = {
      sender: "user" as const,
      text: aiInputText,
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };

    let aiReplyText = "";
    const lower = aiInputText.toLowerCase();

    if (lower.includes("produksi") || lower.includes("ton") || lower.includes("bcm")) {
      aiReplyText = `📊 **Status Produksi Shift 1**:\n• Coal: 14.250 MT (89.1% dari target 16.000 MT)\n• Overburden: 48.500 BCM (93.2% dari target 52.000 BCM)\n• Ritase tercatat: ${tallies.length + 42} ritasi aktif.`;
    } else if (lower.includes("breakdown") || lower.includes("unit") || lower.includes("alat")) {
      aiReplyText = `🚜 **Status Unit & Breakdown**:\n• 🔴 EX-03 mengalami downtime 4 jam (tekanan hidrolik 0 bar di Pit South)\n• 🟠 HD785-05 deviasi fuel +18%\n• 🟢 Total unit aktif: 24 DT, 4 Excavator PC2000.`;
    } else if (lower.includes("solar") || lower.includes("fuel")) {
      aiReplyText = `⛽ **Kondisi BBM & Fuel Farm**:\n• Burn rate rata-rata: 72.8 L/Jam\n• Level Tangki Utama: 88% (396.000 Liter)\n• Ketahanan stok diprediksi: 4.8 hari ke depan.`;
    } else {
      aiReplyText = `🤖 AI Lapangan merekomendasikan: Jaga jarak aman antar haul truck 30 meter di turunan KM 3.8 dan monitor suhu stockpile ROM-3B.`;
    }

    const aiMsg = {
      sender: "ai" as const,
      text: aiReplyText,
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };

    setAiChatMessages([...aiChatMessages, userMsg, aiMsg]);
    setAiInputText("");
  };

  // Device Frame Container Classes
  const getDeviceFrameStyles = () => {
    switch (deviceMode) {
      case "IOS":
        return {
          container: "max-w-[395px] h-[830px] rounded-[52px] border-[12px] border-slate-900 shadow-2xl ring-1 ring-slate-800",
          notch: true,
          type: "iPhone 16 Pro",
        };
      case "ANDROID":
        return {
          container: "max-w-[412px] h-[840px] rounded-[44px] border-[10px] border-slate-900 shadow-2xl ring-1 ring-slate-800",
          notch: false,
          pinhole: true,
          type: "Samsung Galaxy Ultra",
        };
      case "TABLET":
        return {
          container: "max-w-[768px] h-[820px] rounded-[32px] border-[14px] border-slate-900 shadow-2xl ring-1 ring-slate-800",
          notch: false,
          type: "iPad Pro / Tablet",
        };
      case "LAPTOP":
        return {
          container: "max-w-[1024px] h-[780px] rounded-[24px] border-[10px] border-slate-900 shadow-2xl ring-1 ring-slate-800",
          notch: false,
          type: "Laptop 13-inch",
        };
      case "PC":
      default:
        return {
          container: "w-full max-w-full h-auto min-h-[760px] rounded-2xl border border-slate-800 shadow-xl",
          notch: false,
          type: "PC Desktop / Full Fluid",
        };
    }
  };

  const frameInfo = getDeviceFrameStyles();

  return (
    <div className="space-y-6 pb-12">
      {/* Top Device Viewport Switcher Bar */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
              <span>MineSmart Mobile Native Viewport Simulator</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                PWA / Native Ready
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Uji responsivitas & tampilan aplikasi lapangan pada perangkat PC, Laptop, Tablet, Android, dan iOS.
            </p>
          </div>
        </div>

        {/* Viewport Selectors */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          {[
            { id: "PC", label: "PC", icon: Monitor },
            { id: "LAPTOP", label: "Laptop", icon: LaptopIcon },
            { id: "TABLET", label: "Tablet", icon: TabletIcon },
            { id: "ANDROID", label: "Android", icon: Smartphone },
            { id: "IOS", label: "iOS (iPhone)", icon: Apple },
          ].map((dev) => {
            const DevIcon = dev.icon;
            return (
              <button
                key={dev.id}
                onClick={() => setDeviceMode(dev.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  deviceMode === dev.id
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <DevIcon className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{dev.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Device Frame Simulator Wrapper */}
      <div className="flex justify-center items-center py-2 bg-slate-950/40 rounded-3xl p-2 sm:p-6 overflow-hidden">
        <div
          className={`${frameInfo.container} bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden transition-all duration-300 mx-auto w-full`}
        >
          {/* iOS Dynamic Island or Android Pinhole Camera */}
          {frameInfo.notch && (
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 flex items-center justify-between px-2 text-[10px] text-white">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-mono text-purple-300">MineSmart</span>
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
            </div>
          )}

          {frameInfo.pinhole && (
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-black rounded-full z-50 border border-slate-800" />
          )}

          {/* Native Mobile Status Bar */}
          <div className="h-9 px-6 bg-slate-950 flex items-center justify-between text-[11px] font-bold text-slate-400 shrink-0 select-none border-b border-slate-900">
            <span>08:42</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-purple-400">4G LTE</span>
              <Signal className="w-3 h-3 text-slate-400" />
              <button
                onClick={() => setIsOnline(!isOnline)}
                className="cursor-pointer"
                title={isOnline ? "Online: Klik untuk simulasi offline" : "Offline: Klik untuk online"}
              >
                {isOnline ? (
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <WifiOff className="w-3.5 h-3.5 text-rose-400" />
                )}
              </button>
              <Battery className="w-3.5 h-3.5 text-slate-300" />
            </div>
          </div>

          {/* Offline Sync Banner */}
          {!isOnline && (
            <div className="bg-amber-500/20 text-amber-300 border-b border-amber-500/30 px-3 py-1 text-[10px] font-bold flex items-center justify-between">
              <span className="flex items-center gap-1">
                <WifiOff className="w-3 h-3 text-amber-400" />
                Mode Lapangan Offline (Data disimpan di perangkat)
              </span>
              <button
                onClick={() => setIsOnline(true)}
                className="underline hover:text-white cursor-pointer"
              >
                Sync Sekarang
              </button>
            </div>
          )}

          {/* Native Mobile App Header */}
          <div className="p-3.5 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-amber-500 flex items-center justify-center font-black text-white text-xs shadow-md">
                MS
              </div>
              <div>
                <h1 className="text-xs font-black text-white leading-tight">
                  MineSmart Mobile Pro
                </h1>
                <p className="text-[10px] text-slate-400 flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5 text-emerald-400" />
                  <span>Pit North Alpha • Shift 1</span>
                </p>
              </div>
            </div>

            {/* Quick Badges: Pending Approvals & Smart Alerts */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveTab("NOTIFICATION")}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 relative hover:text-white cursor-pointer"
                title="Smart Alerts"
              >
                <Bell className="w-4 h-4 text-amber-400" />
                {smartAlerts.filter((a) => a.status === "ACTIVE").length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                    {smartAlerts.filter((a) => a.status === "ACTIVE").length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("APPROVAL")}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 relative hover:text-white cursor-pointer"
                title="Pusat Approval"
              >
                <CheckSquare className="w-4 h-4 text-purple-400" />
                {approvals.filter((a) => a.status === "PENDING").length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-purple-600 text-white text-[9px] font-black flex items-center justify-center">
                    {approvals.filter((a) => a.status === "PENDING").length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Quick Submodule Navigation Pill Bar (Scrollable for Mobile) */}
          <div className="flex items-center gap-1 p-2 bg-slate-950 border-b border-slate-900 overflow-x-auto no-scrollbar shrink-0">
            {[
              { id: "DASHBOARD", label: "Dashboard", icon: LayoutDashboard },
              { id: "PRODUCTION_INPUT", label: "Production Input", icon: Pickaxe },
              { id: "INSPECTION", label: "P2H Inspection", icon: ClipboardCheck },
              { id: "HSE", label: "HSE Hazard", icon: ShieldAlert },
              { id: "EQUIPMENT", label: "Equipment", icon: Truck },
              { id: "ATTENDANCE", label: "Attendance", icon: Clock },
              { id: "APPROVAL", label: "Approval", icon: CheckSquare },
              { id: "NOTIFICATION", label: "Alerts", icon: Bell },
              { id: "AI_ASSISTANT", label: "AI Copilot", icon: Bot },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold shrink-0 flex items-center gap-1.5 transition cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                      : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800/80"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Screen Content Area (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 text-xs bg-slate-950/80">
            {/* =========================================================================
                1. MOBILE DASHBOARD
                ========================================================================= */}
            {activeTab === "DASHBOARD" && (
              <div className="space-y-3">
                {/* Shift Target Progress Card */}
                <div className="p-4 bg-gradient-to-br from-slate-900 via-purple-950/40 to-slate-900 border border-slate-800 rounded-2xl space-y-3 shadow-lg">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-purple-300">Ringkasan Shift 1 (Siang)</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      ON-TARGET 91.2%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Coal */}
                    <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 block font-bold">Batubara (Coal)</span>
                      <div className="text-base font-black text-amber-400 font-mono">
                        {shiftSummary.coalTonnageMT.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">MT</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div
                          className="bg-amber-400 h-full rounded-full"
                          style={{ width: `${(shiftSummary.coalTonnageMT / shiftSummary.coalTargetMT) * 100}%` }}
                        />
                      </div>
                      <span className="text-[9px] text-slate-500 mt-1 block">Target: {shiftSummary.coalTargetMT.toLocaleString()} MT</span>
                    </div>

                    {/* OB */}
                    <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 block font-bold">Kupasan (OB)</span>
                      <div className="text-base font-black text-cyan-400 font-mono">
                        {shiftSummary.obVolumeBCM.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">BCM</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div
                          className="bg-cyan-400 h-full rounded-full"
                          style={{ width: `${(shiftSummary.obVolumeBCM / shiftSummary.obTargetBCM) * 100}%` }}
                        />
                      </div>
                      <span className="text-[9px] text-slate-500 mt-1 block">Target: {shiftSummary.obTargetBCM.toLocaleString()} BCM</span>
                    </div>
                  </div>

                  {/* Secondary Metrics */}
                  <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono text-[10px]">
                    <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block">Fleet DT</span>
                      <span className="text-white font-bold">{shiftSummary.activeTrucks} Unit</span>
                    </div>
                    <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block">Fuel Burn</span>
                      <span className="text-amber-400 font-bold">{shiftSummary.fuelBurnRateLph} L/h</span>
                    </div>
                    <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block">Zero LTI</span>
                      <span className="text-emerald-400 font-bold">{shiftSummary.safetyDaysWithoutLTI} Hari</span>
                    </div>
                  </div>
                </div>

                {/* 4-Tier Smart Alert Live Ticker */}
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-rose-500" />
                      Smart Alerts Lapangan
                    </span>
                    <button
                      onClick={() => setActiveTab("NOTIFICATION")}
                      className="text-[10px] text-purple-400 hover:underline"
                    >
                      Lihat Semua &rarr;
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {smartAlerts.slice(0, 2).map((alt) => (
                      <div
                        key={alt.id}
                        onClick={() => setActiveTab("NOTIFICATION")}
                        className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-2 cursor-pointer hover:border-purple-500/40"
                      >
                        <span className="text-xs">
                          {alt.severity === "CRITICAL" ? "🔴" : alt.severity === "WARNING" ? "🟠" : "🟡"}
                        </span>
                        <div className="space-y-0.5 flex-1">
                          <p className="text-[11px] font-bold text-slate-200 line-clamp-1">{alt.message}</p>
                          <span className="text-[9px] text-slate-500 font-mono">{alt.timestamp} • {alt.entityId}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mobile Quick Action Buttons Grid */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      setActiveTab("PRODUCTION_INPUT");
                      setIsNewTallyOpen(true);
                    }}
                    className="p-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Input Ritase</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab("HSE");
                      setIsNewHazardOpen(true);
                    }}
                    className="p-3 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    <span>Laporkan Bahaya</span>
                  </button>
                </div>
              </div>
            )}

            {/* =========================================================================
                2. MOBILE PRODUCTION INPUT (TALLY COUNTER & LOGGER)
                ========================================================================= */}
            {activeTab === "PRODUCTION_INPUT" && (
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-3 rounded-2xl">
                  <div>
                    <h3 className="text-xs font-black text-white">Logger Ritase Tambang (Tally)</h3>
                    <p className="text-[10px] text-slate-400">Pencatatan cepat per rit hauler dengan GPS auto-tag.</p>
                  </div>
                  <button
                    onClick={() => setIsNewTallyOpen(true)}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah</span>
                  </button>
                </div>

                {/* Quick Add Form Card if Open */}
                {isNewTallyOpen && (
                  <div className="p-4 bg-slate-900 border border-purple-500/40 rounded-2xl space-y-3 shadow-xl">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                      <span className="font-bold text-purple-300 text-xs">Form Input Ritase Baru</span>
                      <button onClick={() => setIsNewTallyOpen(false)} className="text-slate-400 text-xs">✕</button>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <label className="text-slate-400 block text-[10px] font-bold mb-0.5">Pit / Loading Point:</label>
                        <select
                          value={tallyForm.pitId}
                          onChange={(e) => setTallyForm({ ...tallyForm, pitId: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-bold"
                        >
                          <option value="Pit North Alpha">Pit North Alpha (Seam 11)</option>
                          <option value="Pit South Bravo">Pit South Bravo (Seam 12)</option>
                          <option value="Pit West Charlie">Pit West Charlie</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-slate-400 block text-[10px] font-bold mb-0.5">Excavator Loader:</label>
                          <select
                            value={tallyForm.loaderUnitId}
                            onChange={(e) => setTallyForm({ ...tallyForm, loaderUnitId: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-bold text-[11px]"
                          >
                            <option value="EX-01 (PC2000)">EX-01 (PC2000)</option>
                            <option value="EX-02 (CAT 6020B)">EX-02 (CAT 6020B)</option>
                            <option value="EX-04 (EX1200)">EX-04 (EX1200)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-slate-400 block text-[10px] font-bold mb-0.5">Dump Truck (Hauler):</label>
                          <select
                            value={tallyForm.haulerUnitId}
                            onChange={(e) => setTallyForm({ ...tallyForm, haulerUnitId: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-bold text-[11px]"
                          >
                            <option value="DT-102 (HD785)">DT-102 (HD785)</option>
                            <option value="DT-105 (HD785)">DT-105 (HD785)</option>
                            <option value="DT-208 (CAT 777G)">DT-208 (CAT 777G)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-slate-400 block text-[10px] font-bold mb-0.5">Material:</label>
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => setTallyForm({ ...tallyForm, materialType: "COAL" })}
                              className={`flex-1 py-1.5 rounded-lg font-bold text-[11px] cursor-pointer ${
                                tallyForm.materialType === "COAL"
                                  ? "bg-amber-500 text-slate-950"
                                  : "bg-slate-950 text-slate-400"
                              }`}
                            >
                              Coal
                            </button>
                            <button
                              type="button"
                              onClick={() => setTallyForm({ ...tallyForm, materialType: "OVERBURDEN" })}
                              className={`flex-1 py-1.5 rounded-lg font-bold text-[11px] cursor-pointer ${
                                tallyForm.materialType === "OVERBURDEN"
                                  ? "bg-cyan-500 text-slate-950"
                                  : "bg-slate-950 text-slate-400"
                              }`}
                            >
                              OB
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="text-slate-400 block text-[10px] font-bold mb-0.5">Estimasi Ton/Rit:</label>
                          <input
                            type="number"
                            value={tallyForm.grossWeightTon}
                            onChange={(e) => setTallyForm({ ...tallyForm, grossWeightTon: Number(e.target.value) })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-1.5 text-white font-mono font-bold"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleAddTally}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg cursor-pointer"
                    >
                      ✓ Simpan & Catat Ritase (GPS Logged)
                    </button>
                  </div>
                )}

                {/* Tally History List */}
                <div className="space-y-2">
                  {tallies.map((tly) => (
                    <div
                      key={tly.id}
                      className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[9px] font-black px-1.5 py-0.2 rounded font-mono ${
                              tly.materialType === "COAL"
                                ? "bg-amber-500/20 text-amber-300"
                                : "bg-cyan-500/20 text-cyan-300"
                            }`}
                          >
                            {tly.materialType}
                          </span>
                          <span className="font-mono font-bold text-white text-[11px]">{tly.haulerUnitId}</span>
                          <span className="text-[9px] text-slate-500">via {tly.loaderUnitId}</span>
                        </div>
                        <p className="text-[10px] text-slate-400">
                          {tly.pitId} &bull; {tly.grossWeightTon} Ton &bull; {tly.operatorName}
                        </p>
                      </div>

                      <div className="text-right font-mono">
                        <span className="text-[10px] text-slate-400 block">{tly.timestamp}</span>
                        <span className="text-[9px] text-emerald-400 font-bold">✓ Synced</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* =========================================================================
                3. MOBILE INSPECTION (P2H PRE-START CHECKLIST)
                ========================================================================= */}
            {activeTab === "INSPECTION" && (
              <div className="space-y-3">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-black text-white">Inspeksi Harian P2H Unit</h3>
                    <p className="text-[10px] text-slate-400">Pre-start checklist alat berat sebelum shift.</p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-600/20 text-purple-300 font-bold">
                    {p2h.unitCode}
                  </span>
                </div>

                {/* Unit Details Header */}
                <div className="grid grid-cols-2 gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[10px] font-mono">
                  <div>
                    <span className="text-slate-500">Operator/Inspektor:</span>
                    <p className="text-slate-200 font-bold">{p2h.inspectorName} ({p2h.inspectorBadgeNumber})</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Hour Meter (HM):</span>
                    <p className="text-amber-400 font-bold">{p2h.currentHourMeter} Jam</p>
                  </div>
                </div>

                {/* Checklist Items */}
                <div className="space-y-2">
                  {p2h.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-[11px] font-bold text-slate-200 leading-snug">{item.label}</span>
                        <span className="text-[9px] font-mono text-slate-500">{item.category}</span>
                      </div>

                      {/* Status Toggle Buttons (PASS / ATTENTION / FAIL) */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleP2hItemToggle(item.id, "PASS")}
                          className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                            item.status === "PASS"
                              ? "bg-emerald-600 text-white shadow"
                              : "bg-slate-950 text-slate-400 hover:text-white"
                          }`}
                        >
                          ✓ Baik (Pass)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleP2hItemToggle(item.id, "ATTENTION")}
                          className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                            item.status === "ATTENTION"
                              ? "bg-amber-600 text-white shadow"
                              : "bg-slate-950 text-slate-400 hover:text-white"
                          }`}
                        >
                          ⚠️ Catatan
                        </button>
                        <button
                          type="button"
                          onClick={() => handleP2hItemToggle(item.id, "FAIL")}
                          className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                            item.status === "FAIL"
                              ? "bg-rose-600 text-white shadow"
                              : "bg-slate-950 text-slate-400 hover:text-white"
                          }`}
                        >
                          ✕ Rusak
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Submit P2H Button */}
                <button
                  onClick={handleP2hSubmit}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-emerald-600 text-white font-bold rounded-xl shadow-lg cursor-pointer"
                >
                  ✓ Tanda Tangani & Kirim Lembar P2H
                </button>

                {/* Success Notification Modal */}
                {p2hSuccessModal && (
                  <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl space-y-2 text-center">
                    <Check className="w-8 h-8 text-emerald-400 mx-auto" />
                    <h4 className="font-bold text-white">Inspeksi P2H Berhasil Diverifikasi!</h4>
                    <p className="text-[10px] text-slate-300">
                      Status Unit: <strong className="text-emerald-400">{p2h.overallStatus}</strong> &bull; Tanda Tangan Digital Tersimpan.
                    </p>
                    <button
                      onClick={() => setP2hSuccessModal(false)}
                      className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg font-bold text-[11px] cursor-pointer"
                    >
                      Tutup
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* =========================================================================
                4. MOBILE HSE (HAZARD HUNTING & TAKE 5)
                ========================================================================= */}
            {activeTab === "HSE" && (
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-3 rounded-2xl">
                  <div>
                    <h3 className="text-xs font-black text-white">Pelaporan Bahaya HSE & K3</h3>
                    <p className="text-[10px] text-slate-400">Take 5, Unsafe Condition & Near Miss.</p>
                  </div>
                  <button
                    onClick={() => setIsNewHazardOpen(true)}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Lapor Bahaya</span>
                  </button>
                </div>

                {isNewHazardOpen && (
                  <div className="p-4 bg-slate-900 border border-amber-500/40 rounded-2xl space-y-3 shadow-xl">
                    <span className="font-bold text-amber-300 text-xs block">Form Laporan Bahaya Baru</span>

                    <div className="space-y-2 text-xs">
                      <div>
                        <label className="text-slate-400 block text-[10px] font-bold mb-0.5">Judul Bahaya:</label>
                        <input
                          type="text"
                          placeholder="e.g. Ceceran Oli Licin di Ramp Pit"
                          value={hazardForm.title}
                          onChange={(e) => setHazardForm({ ...hazardForm, title: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-slate-400 block text-[10px] font-bold mb-0.5">Kategori:</label>
                          <select
                            value={hazardForm.category}
                            onChange={(e) => setHazardForm({ ...hazardForm, category: e.target.value as any })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white text-[11px]"
                          >
                            <option value="UNSAFE_CONDITION">Kondisi Tidak Aman</option>
                            <option value="UNSAFE_ACTION">Tindakan Tidak Aman</option>
                            <option value="NEAR_MISS">Hampir Celaka (Near Miss)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-slate-400 block text-[10px] font-bold mb-0.5">Tingkat Risiko:</label>
                          <select
                            value={hazardForm.severityRating}
                            onChange={(e) => setHazardForm({ ...hazardForm, severityRating: e.target.value as any })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white text-[11px]"
                          >
                            <option value="LOW">Rendah (Low)</option>
                            <option value="MEDIUM">Sedang (Medium)</option>
                            <option value="HIGH">Tinggi (High)</option>
                            <option value="CRITICAL">Kritis (Critical)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-slate-400 block text-[10px] font-bold mb-0.5">Lokasi Lapangan:</label>
                        <input
                          type="text"
                          value={hazardForm.location}
                          onChange={(e) => setHazardForm({ ...hazardForm, location: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsNewHazardOpen(false)}
                        className="flex-1 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        onClick={handleHazardSubmit}
                        className="flex-1 py-2 bg-amber-600 text-white font-bold rounded-xl cursor-pointer"
                      >
                        Kirim Laporan
                      </button>
                    </div>
                  </div>
                )}

                {/* Hazard Reports List */}
                <div className="space-y-2">
                  {hazards.map((hzd) => (
                    <div
                      key={hzd.id}
                      className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-white leading-snug">{hzd.title}</h4>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            hzd.severityRating === "CRITICAL"
                              ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                              : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          }`}
                        >
                          {hzd.severityRating}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400">{hzd.description}</p>
                      <div className="flex justify-between items-center text-[9px] text-slate-500 pt-1 border-t border-slate-800">
                        <span>{hzd.location}</span>
                        <span className="font-mono text-amber-400">{hzd.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* =========================================================================
                5. MOBILE EQUIPMENT TELEMETRY & WORK ORDERS
                ========================================================================= */}
            {activeTab === "EQUIPMENT" && (
              <div className="space-y-3">
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl">
                  <h3 className="text-xs font-black text-white">Monitoring Alat Berat Lapangan</h3>
                  <p className="text-[10px] text-slate-400">Telemetri live & sisa masa pakai komponen (RUL).</p>
                </div>

                <div className="space-y-2">
                  {[
                    { code: "EX-01", model: "Komatsu PC2000", status: "OPERATING", pit: "Pit North", pa: "94.2%", fuelRate: "112 L/h" },
                    { code: "EX-03", model: "Hitachi EX1200", status: "BREAKDOWN", pit: "Pit South", pa: "64.0%", fuelRate: "0 L/h", issue: "Tekanan hidrolik 0 bar" },
                    { code: "HD-102", model: "Komatsu HD785-7", status: "HAULING", pit: "Haul Road KM 2", pa: "91.8%", fuelRate: "72 L/h" },
                    { code: "HD-105", model: "Komatsu HD785-7", status: "HAULING", pit: "Haul Road KM 3.8", pa: "88.4%", fuelRate: "81.4 L/h (High)" },
                  ].map((unit) => (
                    <div
                      key={unit.code}
                      className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-purple-400" />
                          <div>
                            <h4 className="text-xs font-black text-white font-mono">{unit.code}</h4>
                            <span className="text-[10px] text-slate-400">{unit.model}</span>
                          </div>
                        </div>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded font-mono ${
                            unit.status === "OPERATING" || unit.status === "HAULING"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-rose-500/20 text-rose-300 animate-pulse"
                          }`}
                        >
                          {unit.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-1 bg-slate-950 p-2 rounded-lg text-[10px] font-mono text-center">
                        <div>
                          <span className="text-slate-500 block">Lokasi</span>
                          <span className="text-slate-200">{unit.pit}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">PA Index</span>
                          <span className="text-emerald-400 font-bold">{unit.pa}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Fuel Rate</span>
                          <span className="text-amber-400 font-bold">{unit.fuelRate}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* =========================================================================
                6. MOBILE ATTENDANCE & SHIFT ROSTER
                ========================================================================= */}
            {activeTab === "ATTENDANCE" && (
              <div className="space-y-3">
                <div className="p-4 bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl text-center space-y-2">
                  <Clock className="w-8 h-8 text-indigo-400 mx-auto" />
                  <h3 className="text-xs font-black text-white">Presensi Tambang Berbasis Geofence</h3>
                  <p className="text-[10px] text-slate-400">
                    Radius Site Geofence: <strong className="text-emerald-400">Dalam Area Tambang (Muster Point 1)</strong>
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      onClick={() => handleClockInOut("CLOCK_IN")}
                      className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow cursor-pointer text-xs"
                    >
                      ✓ Clock In (Masuk)
                    </button>
                    <button
                      onClick={() => handleClockInOut("CLOCK_OUT")}
                      className="py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow cursor-pointer text-xs"
                    >
                      ✕ Clock Out (Pulang)
                    </button>
                  </div>
                </div>

                {/* Attendance Logs */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Riwayat Presensi Hari Ini
                  </span>
                  {attendanceLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between font-mono text-[11px]"
                    >
                      <div>
                        <span className="text-white font-bold block">{log.shift}</span>
                        <span className="text-[10px] text-slate-400">{log.locationName}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-emerald-400 font-bold block">{log.clockInTime}</span>
                        <span className="text-[9px] text-slate-500">Biometric Verified</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* =========================================================================
                7. MOBILE FAST APPROVAL CENTER
                ========================================================================= */}
            {activeTab === "APPROVAL" && (
              <div className="space-y-3">
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-black text-white">Approval Lapangan Cepat</h3>
                    <p className="text-[10px] text-slate-400">1-Tap persetujuan Purchase, Solar & Izin Kerja.</p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-600/20 text-purple-300 font-bold">
                    {approvals.filter((a) => a.status === "PENDING").length} Menunggu
                  </span>
                </div>

                <div className="space-y-2.5">
                  {approvals.map((apr) => (
                    <div
                      key={apr.id}
                      className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400">
                          {apr.requestType}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                            apr.status === "APPROVED"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : apr.status === "REJECTED"
                              ? "bg-rose-500/20 text-rose-300"
                              : "bg-amber-500/20 text-amber-300"
                          }`}
                        >
                          {apr.status}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-white leading-snug">{apr.title}</h4>
                      <p className="text-[10px] text-slate-400">{apr.details}</p>

                      <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 bg-slate-950 p-2 rounded-lg">
                        <span>Pemohon: <strong className="text-white">{apr.requesterName}</strong></span>
                        <span className="text-purple-300 font-bold">{apr.amountOrVolume}</span>
                      </div>

                      {apr.status === "PENDING" && (
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => handleApprovalAction(apr.id, "REJECTED")}
                            className="flex-1 py-1.5 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white rounded-lg text-[11px] font-bold border border-rose-500/30 transition cursor-pointer"
                          >
                            Tolak
                          </button>
                          <button
                            onClick={() => handleApprovalAction(apr.id, "APPROVED")}
                            className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold shadow transition cursor-pointer"
                          >
                            ✓ Setujui
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* =========================================================================
                8. MOBILE SMART NOTIFICATION (4-TIER ALERT FEED)
                ========================================================================= */}
            {activeTab === "NOTIFICATION" && (
              <div className="space-y-3">
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl">
                  <h3 className="text-xs font-black text-white">Smart Alert Feed (4-Tier)</h3>
                  <p className="text-[10px] text-slate-400">🔴 Critical &bull; 🟠 Warning &bull; 🟡 Attention &bull; 🟢 Normal</p>
                </div>

                <div className="space-y-2">
                  {smartAlerts.map((alt) => (
                    <div
                      key={alt.id}
                      className={`p-3 bg-slate-900 border rounded-xl space-y-1.5 ${
                        alt.severity === "CRITICAL"
                          ? "border-rose-500/40 bg-rose-950/20"
                          : alt.severity === "WARNING"
                          ? "border-amber-500/40 bg-amber-950/20"
                          : "border-slate-800"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold">
                          {alt.severity === "CRITICAL" ? "🔴 Critical" : alt.severity === "WARNING" ? "🟠 Warning" : alt.severity === "ATTENTION" ? "🟡 Attention" : "🟢 Normal"}
                        </span>
                        <span className="text-[9px] font-mono text-slate-500">{alt.timestamp}</span>
                      </div>
                      <p className="text-[11px] font-bold text-white">{alt.message}</p>
                      <p className="text-[10px] text-slate-400">Tindakan: {alt.suggestedAction}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* =========================================================================
                9. MOBILE AI ASSISTANT (MINE COPILOT CHAT & VOICE)
                ========================================================================= */}
            {activeTab === "AI_ASSISTANT" && (
              <div className="flex flex-col h-[520px] bg-slate-900/90 border border-purple-500/30 rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-purple-400" />
                    <div>
                      <h4 className="text-xs font-black text-white">MineSmart Copilot Lapangan</h4>
                      <span className="text-[9px] text-emerald-400 font-mono">Gemini 3.7 Online</span>
                    </div>
                  </div>
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                  {aiChatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] p-2.5 rounded-xl text-[11px] leading-relaxed ${
                          msg.sender === "user"
                            ? "bg-purple-600 text-white rounded-br-none"
                            : "bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none"
                        }`}
                      >
                        <p className="whitespace-pre-line">{msg.text}</p>
                        <span className="text-[8px] text-slate-400 block text-right mt-1 font-mono">
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Prompts Bar */}
                <div className="p-2 bg-slate-950 border-t border-slate-800/80 flex gap-1.5 overflow-x-auto no-scrollbar">
                  {[
                    "Cek produksi Pit North",
                    "Apakah ada unit breakdown?",
                    "Status stok solar",
                  ].map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setAiInputText(prompt);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 text-purple-300 border border-purple-500/30 text-[10px] font-bold shrink-0 hover:bg-slate-800 cursor-pointer"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>

                {/* Chat Input Bar */}
                <div className="p-2.5 bg-slate-950 border-t border-slate-800 flex items-center gap-1.5">
                  <input
                    type="text"
                    placeholder="Tanyakan status tambang..."
                    value={aiInputText}
                    onChange={(e) => setAiInputText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendAiMessage()}
                    className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                  <button
                    onClick={handleSendAiMessage}
                    className="p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Native Bottom App Bar (5 Main Navigation Anchors) */}
          <div className="h-16 px-3 bg-slate-950 border-t border-slate-800 flex items-center justify-around shrink-0 select-none">
            <button
              onClick={() => setActiveTab("DASHBOARD")}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-bold cursor-pointer ${
                activeTab === "DASHBOARD" ? "text-purple-400" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              onClick={() => setActiveTab("PRODUCTION_INPUT")}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-bold cursor-pointer ${
                activeTab === "PRODUCTION_INPUT" ? "text-purple-400" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <Pickaxe className="w-4 h-4" />
              <span>Input</span>
            </button>

            {/* Raised Center AI Button */}
            <button
              onClick={() => setActiveTab("AI_ASSISTANT")}
              className="flex h-11 w-11 -mt-4 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-amber-500 text-white shadow-lg shadow-purple-600/30 border-2 border-slate-950 cursor-pointer active:scale-95 transition"
              title="Copilot"
            >
              <Bot className="w-5 h-5" />
            </button>

            <button
              onClick={() => setActiveTab("INSPECTION")}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-bold cursor-pointer ${
                activeTab === "INSPECTION" ? "text-purple-400" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>P2H</span>
            </button>

            <button
              onClick={() => setActiveTab("APPROVAL")}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-bold cursor-pointer relative ${
                activeTab === "APPROVAL" ? "text-purple-400" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>Approve</span>
              {approvals.filter((a) => a.status === "PENDING").length > 0 && (
                <span className="absolute top-0 right-2 w-2 h-2 rounded-full bg-purple-500" />
              )}
            </button>
          </div>

          {/* iOS Bottom Gesture Bar */}
          {frameInfo.notch && (
            <div className="h-4 bg-slate-950 flex justify-center items-center shrink-0">
              <div className="w-32 h-1 bg-slate-700 rounded-full" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
