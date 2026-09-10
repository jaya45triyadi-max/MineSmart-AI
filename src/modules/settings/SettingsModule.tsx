import React, { useState } from "react";
import {
  Settings,
  Building2,
  MapPin,
  Users,
  Key,
  History,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Globe2,
  Sparkles,
  Calendar,
  DollarSign,
  Layers,
  Database,
} from "lucide-react";
import { useAuth } from "../../providers/AuthProvider";
import { useLanguage } from "../../providers/LanguageProvider";
import { INITIAL_AUDIT_LOGS } from "../../data/mockData";
import { UserManagementModule } from "../../components/user/UserManagementModule";
import { LanguageSwitcher } from "../../components/common/LanguageSwitcher";
import { SupabaseManagementPanel } from "../../components/supabase/SupabaseManagementPanel";

export const SettingsModule: React.FC = () => {
  const { company, sites, activeSite, license, currentUser } = useAuth();
  const { language, setLanguage, availableLanguages, currentLanguageMeta, t, formatDate, formatNumber, formatCurrency } = useLanguage();
  const [activeTab, setActiveTab] = useState<"supabase" | "company" | "sites" | "users" | "license" | "language" | "audit">("supabase");

  return (
    <div className="space-y-6">
      {/* Settings Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md">
        <div>
          <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
            SYSTEM ADMINISTRATION
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            {t("settings.title", "Pengaturan Sistem & Pengelolaan Lisensi")}
          </h1>
          <p className="text-xs text-slate-400">
            {t("settings.subtitle", "Konfigurasi profil perusahaan, lokasi site, RBAC user, lisensi SaaS, bahasa, dan audit trail.")}
          </p>
        </div>

        <button
          onClick={() => {
            if ((window as any).__NAVIGATE_MODULE__) {
              (window as any).__NAVIGATE_MODULE__("security");
            }
          }}
          className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer shrink-0"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Buka Enterprise Security Suite</span>
        </button>
      </div>

      {/* Tabs Header */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab("supabase")}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all cursor-pointer ${
            activeTab === "supabase"
              ? "border-emerald-400 text-emerald-400 font-bold bg-emerald-500/10"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <Database className="h-4 w-4 text-emerald-400" />
          <span>Supabase Database &amp; Backend</span>
          <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold">
            PostgreSQL
          </span>
        </button>

        <button
          onClick={() => setActiveTab("language")}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all cursor-pointer ${
            activeTab === "language"
              ? "border-emerald-400 text-emerald-400 font-bold bg-emerald-500/10"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <Globe2 className="h-4 w-4 text-emerald-400" />
          <span>{t("settings.tabLanguage", "Bahasa & Lokalisasi (Multi-Language)")}</span>
          <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold">
            {currentLanguageMeta.badge}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("company")}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all cursor-pointer ${
            activeTab === "company"
              ? "border-emerald-400 text-emerald-400 font-bold"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <Building2 className="h-4 w-4" /> {t("settings.tabCompany", "Profil Perusahaan")}
        </button>

        <button
          onClick={() => setActiveTab("sites")}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all cursor-pointer ${
            activeTab === "sites"
              ? "border-emerald-400 text-emerald-400 font-bold"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <MapPin className="h-4 w-4" /> {t("settings.tabSites", "Lokasi Tambang (Sites)")}
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all cursor-pointer ${
            activeTab === "users"
              ? "border-emerald-400 text-emerald-400 font-bold"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <Users className="h-4 w-4" /> {t("settings.tabUsers", "User RBAC & Akses")}
        </button>

        <button
          onClick={() => setActiveTab("license")}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all cursor-pointer ${
            activeTab === "license"
              ? "border-emerald-400 text-emerald-400 font-bold"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <Key className="h-4 w-4" /> {t("settings.tabLicense", "Status Lisensi SaaS")}
        </button>

        <button
          onClick={() => setActiveTab("audit")}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all cursor-pointer ${
            activeTab === "audit"
              ? "border-emerald-400 text-emerald-400 font-bold"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <History className="h-4 w-4" /> {t("settings.tabAudit", "Audit Trail Log")}
        </button>
      </div>

      {/* Tab Content */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl">
        {/* SUPABASE DATABASE & BACKEND TAB */}
        {activeTab === "supabase" && (
          <div className="space-y-6">
            <SupabaseManagementPanel />
          </div>
        )}

        {/* MULTI-LANGUAGE SETTINGS TAB */}
        {activeTab === "language" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Globe2 className="h-5 w-5 text-emerald-400" />
                  <span>{t("settings.languageTitle", "Pengaturan Bahasa Sistem (Multi-Language)")}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {t(
                    "settings.languageDesc",
                    "Pilih bahasa antarmuka standar untuk operasional tambang Anda. Mendukung Bahasa Indonesia, English, dan 中文."
                  )}
                </p>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs font-bold text-emerald-300">
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>Active: {currentLanguageMeta.flag} {currentLanguageMeta.nativeName}</span>
              </div>
            </div>

            {/* Interactive Language Selection Cards */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                {t("settings.selectLanguagePrompt", "Pilih salah satu bahasa di bawah ini:")}
              </label>

              <LanguageSwitcher variant="pills" />
            </div>

            {/* Mining Regional Format & Localization Preview */}
            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/80 p-5 space-y-4">
              <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>{t("settings.regionalFormatTitle", "Format Regional & Standar Pertambangan")}</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-teal-400" />
                    <span>{t("settings.dateFormatLabel", "Format Tanggal")}</span>
                  </div>
                  <p className="font-mono text-emerald-300 font-bold text-sm">
                    {formatDate(new Date())}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Pattern: {currentLanguageMeta.dateFormat}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                    <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t("settings.currencyLabel", "Mata Uang Standar")}</span>
                  </div>
                  <p className="font-mono text-amber-300 font-bold text-sm">
                    {formatCurrency(125000000)}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Base: {currentLanguageMeta.currencyCode}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>{t("settings.numberFormatLabel", "Pemisah Angka / Tonase")}</span>
                  </div>
                  <p className="font-mono text-purple-300 font-bold text-sm">
                    {formatNumber(1320450.75)} MT
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Standard Decimal Separation</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{t("settings.unitsStandardLabel", "Standar Satuan")}</span>
                  </div>
                  <p className="font-mono text-white font-bold text-sm">
                    Ton, BCM, Liter
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">ESDM Kepmen 1827 / ISO</p>
                </div>
              </div>
            </div>

            {/* Extensibility Notice for Chinese & Additional Languages */}
            <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs flex items-start gap-3">
              <Globe2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-indigo-200">
                  Arsitektur Multi-Language Modular & Scalable
                </p>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Sistem mendukung pergantian instan tanpa memuat ulang (zero reload). Semua kamus istilah teknis tambang, regulasi Minerba, dan pesan audit telah dipetakan dalam 3 bahasa utama: 🇮🇩 <strong>Bahasa Indonesia</strong>, 🇬🇧 <strong>English</strong>, dan 🇨🇳 <strong>简体中文 (Chinese Mandarin)</strong>, serta siap diperluas untuk bahasa mitra bisnis lainnya.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "company" && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">Informasi Identitas Perusahaan</h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Nama Perusahaan</label>
                <p className="font-bold text-white text-sm">{company.name}</p>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Kode Singkatan</label>
                <p className="font-bold text-emerald-400 text-sm">{company.code}</p>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">NPWP / Tax ID</label>
                <p className="font-mono text-slate-300">{company.taxId}</p>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Paket Langganan</label>
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-emerald-400 font-bold border border-emerald-500/30">
                  {company.plan}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "sites" && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">Daftar Lokasi Tambang (Multi-Site Architecture)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {sites.map((s) => (
                <div key={s.id} className="rounded-xl border border-slate-800 bg-slate-800/50 p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-white text-sm">{s.name}</p>
                    <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-400 font-bold">
                      {s.code}
                    </span>
                  </div>
                  <p className="text-slate-400">{s.location}, {s.province}</p>
                  <p className="text-slate-400">Mine Manager: <span className="text-slate-200 font-semibold">{s.managerName}</span></p>
                  <div className="border-t border-slate-700/60 pt-2 space-y-1 text-[11px]">
                    <p className="text-slate-400">Target Coal: <span className="text-amber-400 font-bold">{s.targetCoalMonthlyMT.toLocaleString()} MT/Bln</span></p>
                    <p className="text-slate-400">Target OB: <span className="text-emerald-400 font-bold">{s.targetOBMonthlyBCM.toLocaleString()} BCM/Bln</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <UserManagementModule />
        )}

        {activeTab === "license" && (
          <div className="space-y-4 max-w-xl">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">Status Lisensi Platform Commercial</h3>
            {license ? (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-emerald-400 text-sm">Status Lisensi: TERVERIFIKASI AKTIF</span>
                  <span className="rounded bg-emerald-500/20 px-2.5 py-1 text-xs font-black text-emerald-300 border border-emerald-500/30">
                    {license.plan}
                  </span>
                </div>
                <p><span className="text-slate-400">Kode Lisensi:</span> <code className="font-mono text-amber-300 font-bold">{license.licenseKey}</code></p>
                <p><span className="text-slate-400">Perusahaan Entitas:</span> {license.companyName}</p>
                <p><span className="text-slate-400">Masa Berlaku:</span> s/d 31 Desember 2027</p>
                <p><span className="text-slate-400">Batas Pengguna:</span> Up to {license.userLimit} Users | Devices: Up to {license.deviceLimit}</p>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Belum ada lisensi terverifikasi.</p>
            )}
          </div>
        )}

        {activeTab === "audit" && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">Log Audit Aktivitas Sistem</h3>
            <div className="space-y-2 text-xs">
              {INITIAL_AUDIT_LOGS.map((a) => (
                <div key={a.id} className="rounded-xl border border-slate-800 bg-slate-800/40 p-3 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">{a.action} ({a.module})</span>
                    <span className="text-[10px] text-slate-500 font-mono">{a.timestamp}</span>
                  </div>
                  <p className="text-slate-300">{a.details}</p>
                  <p className="text-[10px] text-slate-500">Oleh: <span className="text-emerald-400 font-semibold">{a.userName}</span> ({a.userRole}) | IP: {a.ipAddress}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
