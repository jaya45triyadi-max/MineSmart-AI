import React, { useState } from "react";
import {
  Sparkles,
  Bot,
  Send,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Cpu,
  BrainCircuit,
  Eye,
  Sliders,
  ArrowRight,
  Radio,
  Zap,
  Layers,
  Activity,
  Compass,
  AlertCircle,
  Truck,
  UserCheck,
  Building,
} from "lucide-react";
import {
  HSEAIInsight,
  AIIncidentPatternAnalysis,
  AIPrioritizedAction,
  HumanVehicleInteractionEvent,
  HeavyVehicleSafetyMetrics,
} from "../../../types/hseTypes";
import {
  MOCK_HSE_AI_INSIGHTS,
  MOCK_AI_INCIDENT_PATTERNS,
  MOCK_AI_PRIORITIZED_ACTIONS,
  MOCK_HUMAN_VEHICLE_INTERACTIONS,
  MOCK_HEAVY_VEHICLE_METRICS,
} from "../../../data/hseData";

interface HSEAISafetyTabProps {
  insights?: HSEAIInsight[];
  onQueryAI?: (query: string) => Promise<string>;
}

export const HSEAISafetyTab: React.FC<HSEAISafetyTabProps> = ({
  insights = MOCK_HSE_AI_INSIGHTS,
  onQueryAI,
}) => {
  const [activeSubSection, setActiveSubSection] = useState<
    "patterns" | "priorities" | "human-vehicle-ai" | "copilot"
  >("patterns");

  // State for AI patterns & Prioritized actions
  const [patterns] = useState<AIIncidentPatternAnalysis[]>(MOCK_AI_INCIDENT_PATTERNS);
  const [prioritizedActions, setPrioritizedActions] = useState<AIPrioritizedAction[]>(MOCK_AI_PRIORITIZED_ACTIONS);
  const [interactions] = useState<HumanVehicleInteractionEvent[]>(MOCK_HUMAN_VEHICLE_INTERACTIONS);
  const [metrics] = useState<HeavyVehicleSafetyMetrics>(MOCK_HEAVY_VEHICLE_METRICS);

  // Chat Log State
  const [userQuery, setUserQuery] = useState("");
  const [chatLog, setChatLog] = useState<{ sender: "user" | "ai"; text: string }[]>([
    {
      sender: "ai",
      text: "Halo! Saya AI HSE Intelligence Specialist Gemini. Saya telah menganalisis data 12 insiden, 28 near miss, dan 384 telemetri interaksi manusia-alat berat (PWS). Tanyakan pola bahaya, prioritas mitigasi, atau rekomendasi pencegahan.",
    },
  ]);
  const [isQuerying, setIsQuerying] = useState(false);

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim() || isQuerying) return;

    const q = userQuery;
    setUserQuery("");
    setChatLog((prev) => [...prev, { sender: "user", text: q }]);
    setIsQuerying(true);

    try {
      if (onQueryAI) {
        const response = await onQueryAI(q);
        setChatLog((prev) => [...prev, { sender: "ai", text: response }]);
      } else {
        // Fallback intelligent response simulation
        setTimeout(() => {
          setChatLog((prev) => [
            ...prev,
            {
              sender: "ai",
              text: `Berdasarkan analisis korelasi AI terkini terhadap "${q}":\n\n1. Pola Insiden Terbesar: Interaksi Haul Road & Blind Spot saat manuver reversing alat berat (48% kejadian).\n2. Rekomendasi Prioritas #1: Wajibkan aktivasi AI Proximity Warning System (PWS) dan UWB beacon tags bagi seluruh grade checker & surveyor di Pit Alpha.\n3. Proyeksi Penurunan Risiko: Potensi reduksi LTIFR sebesar 85% dalam 30 hari ke depan.`,
            },
          ]);
          setIsQuerying(false);
        }, 800);
        return;
      }
    } catch (err) {
      setChatLog((prev) => [
        ...prev,
        { sender: "ai", text: "Maaf, terjadi kendala saat memproses analisis AI K3." },
      ]);
    } finally {
      setIsQuerying(false);
    }
  };

  const handleExecuteAction = (actionId: string) => {
    alert(`Tindakan pencegahan K3 (${actionId}) telah dieksekusi dan diterbitkan sebagai Corrective Action (CAPA) Mandatori.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white border border-indigo-500/30 shadow-xl flex flex-col lg:flex-row justify-between lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5 uppercase tracking-wider">
              <BrainCircuit className="w-3.5 h-3.5" /> AI SAFETY INTELLIGENCE & PATTERN RECOGNITION
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Gemini Vision & Telemetry ML
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            AI Safety: Incident Patterns & Human-Heavy Vehicle Interaction
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
            AI menganalisis pola insiden berulang, merekomendasikan prioritas tindakan pencegahan K3, dan memonitor interaksi manusia-alat berat (<strong>Proximity Warning System & AI Fatigue Detection</strong>) sesuai standar inovasi tambang Indonesia.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold font-mono">
            PWS Real-time: 68 Unit Aktif
          </span>
        </div>
      </div>

      {/* Sub-Navigation Switcher */}
      <div className="p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap gap-1.5">
        {[
          { key: "patterns", label: "Pola Insiden AI (Pattern Analysis)", icon: TrendingUp },
          { key: "priorities", label: "Prioritas Tindakan Pencegahan", icon: ShieldAlert },
          { key: "human-vehicle-ai", label: "Interaksi Manusia & Alat Berat (PWS / AI Vision)", icon: Eye, badge: "Live" },
          { key: "copilot", label: "HSE AI Assistant Chat", icon: Bot },
        ].map((sub) => {
          const Icon = sub.icon;
          const isActive = activeSubSection === sub.key;
          return (
            <button
              key={sub.key}
              onClick={() => setActiveSubSection(sub.key as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{sub.label}</span>
              {sub.badge && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-emerald-400 text-slate-950">
                  {sub.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 1. INCIDENT PATTERN ANALYSIS SECTION */}
      {activeSubSection === "patterns" && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-500" />
                  Analisis Klaster Pola Insiden & Faktor Korelasi Utama
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  AI mengelompokkan data insiden historis dan near-miss untuk mengungkap pola risiko tersembunyi.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                3 Klaster Kritis Teridentifikasi
              </span>
            </div>

            <div className="space-y-4">
              {patterns.map((pat) => (
                <div
                  key={pat.patternId}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded font-mono font-bold text-xs bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                        {pat.patternId}
                      </span>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                        {pat.clusterName}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-slate-600 dark:text-slate-400">
                        {pat.incidentCount} Insiden • {pat.nearMissCount} Near Miss
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        AI Confidence {pat.aiConfidenceScore}%
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-slate-400">Faktor Pemicu Primer (Risk Factor)</span>
                      <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                        {pat.primaryRiskFactor}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-slate-400">Korelasi Waktu & Cuaca (Temporal Pattern)</span>
                      <p className="text-indigo-600 dark:text-indigo-400 leading-relaxed font-medium">
                        {pat.temporalCorrelation}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300">
                    <span className="font-bold block mb-0.5">[Pola Akar Penyebab / Root Cause Pattern]</span>
                    {pat.rootCausePattern}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. PRIORITIZED PREVENTIVE ACTIONS SECTION */}
      {activeSubSection === "priorities" && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-500" />
                  Prioritas Tindakan Pencegahan Berbasis AI (Impact-Ranked Preventive Actions)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  AI menghitung skor prioritas intervensi K3 berdasarkan estimasi penurunan risiko LTIFR/TRIFR dan rasio biaya implementasi.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {prioritizedActions.map((act) => (
                <div
                  key={act.actionId}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row justify-between gap-4 text-xs"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-black text-sm text-indigo-600 dark:text-indigo-400">
                        #{act.actionId}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          act.urgencyLevel === "CRITICAL"
                            ? "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                            : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                        }`}
                      >
                        Urgency: {act.urgencyLevel}
                      </span>
                      <span className="text-slate-500 font-bold">• {act.targetCategory}</span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {act.title}
                    </h4>

                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {act.recommendedIntervention}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1">
                      <span>Departemen: <strong className="text-slate-800 dark:text-slate-200">{act.responsibleDepartment}</strong></span>
                      <span>Batas Waktu: <strong className="text-rose-600 dark:text-rose-400">{act.deadlineDays} Hari</strong></span>
                      <span>Biaya: <strong className="text-emerald-600 dark:text-emerald-400">{act.estimatedImplementationCost}</strong></span>
                    </div>
                  </div>

                  {/* Impact score card & dispatch CTA */}
                  <div className="flex flex-row lg:flex-col justify-between items-end lg:items-center gap-3 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 pt-3 lg:pt-0 lg:pl-6 shrink-0">
                    <div className="text-right lg:text-center">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Est. Reduksi Risiko</div>
                      <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                        -{act.estimatedRiskReductionPercent}%
                      </div>
                      <span className="text-[10px] text-slate-500">Skor AI: {act.priorityScore}/100</span>
                    </div>

                    <button
                      onClick={() => handleExecuteAction(act.actionId)}
                      className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-sm whitespace-nowrap"
                    >
                      <span>Terbitkan Mandat CAPA</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. HUMAN & HEAVY VEHICLE AI MONITORING SECTION */}
      {activeSubSection === "human-vehicle-ai" && (
        <div className="space-y-6">
          {/* Key PWS & Interaction Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-[10px] text-slate-400 font-sans font-bold uppercase">Total Interaksi Terpantau (24h)</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {metrics.totalInteractions24h}
              </div>
              <span className="text-[10px] text-indigo-500 font-sans font-semibold">Radar PWS & AI Vision Tags</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-[10px] text-slate-400 font-sans font-bold uppercase">Near-Miss Dicegah AI Alarm</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {metrics.nearMissesPrevented} Insiden
              </div>
              <span className="text-[10px] text-emerald-500 font-sans font-semibold">100% Intervensi Sukses</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-[10px] text-slate-400 font-sans font-bold uppercase">Fatigue / DSM Alert (24h)</span>
              <div className="text-2xl font-black text-amber-500">
                {metrics.fatigueAlerts24h} Peringatan
              </div>
              <span className="text-[10px] text-slate-400 font-sans">Kamera Driver Micro-Sleep</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-[10px] text-slate-400 font-sans font-bold uppercase">Tingkat Kepatuhan Zona Aman</span>
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                {metrics.complianceRate}%
              </div>
              <span className="text-[10px] text-slate-400 font-sans">Radius Eksklusi 30 Meter</span>
            </div>
          </div>

          {/* Real-time Interaction Event Log */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Eye className="w-5 h-5 text-indigo-500" />
                  Live Event Log: Interaksi Pejalan Kaki & Unit Alat Berat (PWS & AI Camera)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Telemetri sensor Proximity Warning System, deteksi blind-spot kamera AI 360°, dan pemantauan fatigue operator.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse" /> Telemetri Terhubung
              </span>
            </div>

            <div className="space-y-3">
              {interactions.map((ev) => (
                <div
                  key={ev.eventId}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{ev.eventId}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ev.severity === "CRITICAL"
                            ? "bg-rose-500/10 text-rose-600"
                            : ev.severity === "HIGH"
                            ? "bg-amber-500/10 text-amber-600"
                            : "bg-blue-500/10 text-blue-600"
                        }`}
                      >
                        {ev.eventType.replace(/_/g, " ")}
                      </span>
                      <span className="text-slate-400">• {ev.timestamp}</span>
                    </div>

                    <div className="font-bold text-slate-900 dark:text-white">
                      Unit: {ev.heavyEquipmentId} ({ev.heavyEquipmentType}) • Terkait: {ev.workerName || "Driver Telemetry"}
                    </div>

                    <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                      Lokasi: {ev.location} | Jarak Terdeteksi: <strong className="font-mono text-rose-600 dark:text-rose-400">{ev.distanceMeters} m</strong> (Batas Aman: {ev.safeDistanceThresholdMeters} m)
                    </p>

                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-[11px]">
                      <strong>AI Intervensi:</strong> {ev.actionTaken}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold uppercase text-[10px]">
                      {ev.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Indonesian Mining Innovation Case Studies Benchmark */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white border border-indigo-500/30 shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-400" />
              Inovasi AI Interaksi Manusia & Alat Berat Pertambangan Indonesia
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Penerapan teknologi keselamatan mutakhir yang diadaptasi dari best practice operasi tambang nasional terkemuka:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1.5">
                <span className="font-bold text-emerald-400 block">AI Proximity Warning (PWS)</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Pemasangan kamera pintar 360° dan tag UWB aktif untuk mendeteksi personel pejalan kaki pada blind-spot excavator & dump truck.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1.5">
                <span className="font-bold text-cyan-400 block">Driver State Monitoring (DSM / FDS)</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Deteksi micro-sleep dan distraksi di kabin secara real-time dengan getaran kursi dan alarm radio dispatch otomatis.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1.5">
                <span className="font-bold text-amber-400 block">Geofenced Exclusion Zones</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Pemetaan zona larangan melintas otomatis pada pit loading area dan persimpangan haul road dengan peringatan batas kecepatan.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. HSE AI COPILOT CHAT SECTION */}
      {activeSubSection === "copilot" && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-indigo-500" />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    HSE & K3 AI Specialist Assistant
                  </h3>
                  <p className="text-xs text-slate-500">
                    Didukung Gemini AI untuk konsultasi regulasi Kemen ESDM, investigasi akar masalah 5-Why, dan SOP K3.
                  </p>
                </div>
              </div>
            </div>

            {/* Chat message stream */}
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {chatLog.map((chat, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3 text-xs ${chat.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {chat.sender === "ai" && (
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div
                    className={`p-3.5 rounded-2xl max-w-xl leading-relaxed whitespace-pre-line ${
                      chat.sender === "user"
                        ? "bg-indigo-600 text-white font-medium shadow-sm"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {chat.text}
                  </div>
                </div>
              ))}
              {isQuerying && (
                <div className="flex items-center gap-2 text-xs text-indigo-500">
                  <Bot className="w-4 h-4 animate-spin" /> Menganalisis basis data K3 pertambangan...
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendChat} className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <input
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="Tanyakan analisis insiden: 'Apa penyebab utama near miss haul road?', 'Buat draf JSA pengelasan tangki'..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isQuerying}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0 transition"
              >
                <Send className="w-3.5 h-3.5" /> Kirim
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
