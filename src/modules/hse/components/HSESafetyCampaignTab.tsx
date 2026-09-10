import React, { useState } from "react";
import {
  Megaphone,
  Award,
  Calendar,
  Users,
  CheckCircle2,
  Sparkles,
  Flame,
  ShieldAlert,
  HelpCircle,
  Plus,
  ArrowRight,
  TrendingUp,
  Bookmark,
  Share2,
  Gift,
  Heart,
  Lightbulb,
} from "lucide-react";
import { SafetyCampaign, CampaignActivity } from "../../../types/hseTypes";
import { MOCK_SAFETY_CAMPAIGNS, MOCK_CAMPAIGN_ACTIVITIES } from "../../../data/hseData";

export const HSESafetyCampaignTab: React.FC = () => {
  const [campaigns, setCampaigns] = useState<SafetyCampaign[]>(MOCK_SAFETY_CAMPAIGNS);
  const [activities, setActivities] = useState<CampaignActivity[]>(MOCK_CAMPAIGN_ACTIVITIES);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(MOCK_SAFETY_CAMPAIGNS[0]?.id || "CMP-01");
  const [activeQuizIndex, setActiveQuizIndex] = useState<number | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [pledgeCount, setPledgeCount] = useState<number>(1420);
  const [hasPledged, setHasPledged] = useState<boolean>(false);

  const activeCampaign = campaigns.find((c) => c.id === selectedCampaignId) || campaigns[0];

  const quizQuestions = [
    {
      q: "Berapa jarak aman minimal yang harus dijaga personel pejalan kaki dari radius swing alat berat excavator tanpa konfirmasi radio 2 arah?",
      options: ["5 Meter", "10 Meter", "30 Meter", "50 Meter"],
      correct: 2,
      explanation: "Standar Golden Safety Rules mewajibkan batas eksklusi minimal 30 meter dari perimeter jangkauan kerja unit.",
    },
    {
      q: "Kapan prosedur Lockout-Tagout (LOTO) wajib dipasang?",
      options: [
        "Hanya saat mesin rusak total",
        "Sebelum melakukan perbaikan, inspeksi, atau pembersihan mesin yang berpotensi menyimpan energi sisa",
        "Hanya pada saat shift malam",
        "Jika diinstruksikan oleh satpam",
      ],
      correct: 1,
      explanation: "LOTO mutlak dipasang untuk mengisolasi semua sumber energi (mekanikal, elektrikal, hidrolik, pneumatik) sebelum servis dimulai.",
    },
  ];

  const handleTakePledge = () => {
    if (!hasPledged) {
      setPledgeCount((prev) => prev + 1);
      setHasPledged(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 text-white border border-rose-500/20 shadow-xl flex flex-col lg:flex-row justify-between lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5 uppercase tracking-wider">
              <Megaphone className="w-3.5 h-3.5" /> PROGRAM BULAN K3 & SAFETY CAMPAIGN
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Gamification & Reward Active
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Mining Safety Campaign & Worker Awareness
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
            Pusat sosialisasi budaya keselamatan tambang: <strong>Golden Rules, Interaksi Pejalan Kaki & Alat Berat, Program Manajemen Fatigue</strong>, dan penghargaan Safety Champion.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleTakePledge}
            disabled={hasPledged}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 shadow-lg cursor-pointer ${
              hasPledged
                ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 cursor-default"
                : "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/25"
            }`}
          >
            <Heart className={`w-4 h-4 ${hasPledged ? "text-emerald-400 fill-emerald-400" : "fill-white"}`} />
            <span>{hasPledged ? "Ikrar K3 Terkonfirmasi ✓" : "Ikrar Komitmen K3 (Pledge)"}</span>
          </button>
        </div>
      </div>

      {/* Safety Pledge Counter Ribbon */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
              Total Komitmen Ikrar Keselamatan (Worker Safety Pledge)
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {pledgeCount.toLocaleString("id-ID")} Pekerja Telah Menandatangani Komitmen Zero Harm
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl font-bold border border-emerald-500/20">
            97.8% Partisipasi Site
          </span>
        </div>
      </div>

      {/* Campaign Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {campaigns.map((camp) => {
          const isSelected = selectedCampaignId === camp.id;
          return (
            <div
              key={camp.id}
              onClick={() => setSelectedCampaignId(camp.id)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer space-y-3 ${
                isSelected
                  ? "bg-slate-50 dark:bg-slate-800/90 border-rose-500 ring-2 ring-rose-500/20 shadow-md"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                  {camp.category}
                </span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {camp.status}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                  {camp.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {camp.theme}
                </p>
              </div>

              {/* Progress bar */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  <span>Partisipasi Kampanye</span>
                  <span className="font-mono text-rose-600 dark:text-rose-400 font-bold">{camp.completionRatePercent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    style={{ width: `${camp.completionRatePercent}%` }}
                    className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full transition-all duration-500"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> {camp.participantsCount} Peserta
                </span>
                <span>{camp.startDate} s/d {camp.endDate}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Campaign Detailed Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Campaign Directives & Key Rules */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold font-mono text-rose-600 dark:text-rose-400 uppercase">
                  CAMPAIGN HIGHLIGHT & SAFETY DIRECTIVES
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                  {activeCampaign.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Penyelenggara: <strong>{activeCampaign.organizer}</strong> • Target: {activeCampaign.targetAudience}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {activeCampaign.description}
            </p>

            {/* Key Golden Rules / Messages */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                Pesan Kunci & Protokol Mandatori (Key Golden Messages)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {activeCampaign.keyMessages.map((msg, mIdx) => (
                  <div
                    key={mIdx}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                      {msg}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Campaign Activities & Competitions */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-500" />
                Jadwal Kegiatan, Kompetisi & Workshop Kampanye
              </h4>
            </div>

            <div className="space-y-3">
              {activities.map((act) => (
                <div
                  key={act.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">{act.title}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                        {act.activityType}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {act.date} • Lokasi: {act.location} • {act.participants} Peserta Terdaftar
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                      <Gift className="w-3.5 h-3.5" /> +{act.rewardPoints} Poin
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-xl font-bold uppercase text-[10px] ${
                        act.status === "COMPLETED"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-blue-500/10 text-blue-600"
                      }`}
                    >
                      {act.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Interactive Safety Quiz & Rewards */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white border border-indigo-500/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-400" />
                <h4 className="text-sm font-bold text-white">Daily Digital Safety Quiz</h4>
              </div>
              <span className="text-xs text-amber-400 font-bold font-mono">Skor: {quizScore} Poin</span>
            </div>

            <div className="space-y-3 text-xs">
              <p className="font-semibold text-slate-200 leading-relaxed">
                {quizQuestions[activeQuizIndex ?? 0].q}
              </p>

              <div className="space-y-2">
                {quizQuestions[activeQuizIndex ?? 0].options.map((opt, oIdx) => {
                  const isChosen = quizAnswer === oIdx;
                  const isCorrect = oIdx === quizQuestions[activeQuizIndex ?? 0].correct;
                  const isSubmitted = quizAnswer !== null;

                  let btnColor = "bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700";
                  if (isSubmitted) {
                    if (isCorrect) btnColor = "bg-emerald-600 text-white border-emerald-500 font-bold";
                    else if (isChosen) btnColor = "bg-rose-600 text-white border-rose-500";
                  }

                  return (
                    <button
                      key={oIdx}
                      disabled={isSubmitted}
                      onClick={() => {
                        setQuizAnswer(oIdx);
                        if (oIdx === quizQuestions[activeQuizIndex ?? 0].correct) {
                          setQuizScore((prev) => prev + 100);
                        }
                      }}
                      className={`w-full p-3 rounded-2xl border text-left text-xs transition cursor-pointer flex items-center justify-between ${btnColor}`}
                    >
                      <span>{opt}</span>
                      {isSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </button>
                  );
                })}
              </div>

              {quizAnswer !== null && (
                <div className="p-3 rounded-2xl bg-slate-800/90 border border-indigo-500/30 text-slate-300 text-[11px] leading-relaxed">
                  <span className="text-indigo-400 font-bold block mb-1">Penjelasan K3:</span>
                  {quizQuestions[activeQuizIndex ?? 0].explanation}
                </div>
              )}
            </div>
          </div>

          {/* Safety Champions Recognition Leaderboard */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Safety Champion Leaderboard (Zero Unsafe Acts)
            </h4>

            <div className="space-y-2.5 text-xs">
              {[
                { name: "Agus Prasetyo", role: "Operator Excavator EX-201", points: "1,450 Poin", badge: "🥇 Gold Champion" },
                { name: "Wahyudi", role: "Driver Dump Truck DT-208", points: "1,320 Poin", badge: "🥈 Silver Hero" },
                { name: "Siti Rahmawati", role: "HSE Field Inspector", points: "1,280 Poin", badge: "🥉 Bronze Safety" },
              ].map((ldr, lIdx) => (
                <div
                  key={lIdx}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900 dark:text-white">{ldr.name}</div>
                    <div className="text-[10px] text-slate-500">{ldr.role}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{ldr.points}</div>
                    <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">{ldr.badge}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
