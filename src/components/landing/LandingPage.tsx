// MINE SMART AI - Enterprise Public Landing Page & Dynamic CMS Viewer
// PROMPT 36: Dynamic Content Binding, Live Sync with PlatformConfigService & Zero-Redeploy

import React, { useState, useEffect } from "react";
import {
  Pickaxe,
  Bot,
  Truck,
  Compass,
  ShieldCheck,
  Zap,
  CheckCircle2,
  BarChart3,
  ArrowRight,
  Sparkles,
  Layers,
  Key,
  Globe2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Megaphone,
  ShieldAlert,
} from "lucide-react";
import { platformConfigService } from "../../services/config/PlatformConfigService";
import { PlatformConfig } from "../../types/developerControlPanelTypes";

interface LandingPageProps {
  onEnterDashboard: () => void;
  onOpenLicenseModal: () => void;
  onOpenDeveloperConsole?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterDashboard,
  onOpenLicenseModal,
  onOpenDeveloperConsole,
}) => {
  const [config, setConfig] = useState<PlatformConfig>(platformConfigService.getConfig());
  const [openFaqId, setOpenFaqId] = useState<string | null>("faq-1");

  useEffect(() => {
    const unsubscribe = platformConfigService.subscribe((newCfg) => {
      setConfig(newCfg);
    });
    return () => unsubscribe();
  }, []);

  const { websiteCMS, pricingPlans, branding, maintenance } = config;

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="min-h-screen bg-[#0B1220] text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Maintenance Mode Alert Banner if active */}
      {maintenance.isActive && (
        <div className="bg-amber-600 text-slate-950 font-bold px-4 py-2.5 text-xs text-center flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span>
            <strong>{maintenance.title}:</strong> {maintenance.message}
          </span>
        </div>
      )}

      {/* Global Announcements Banner from Dynamic CMS */}
      {websiteCMS.announcements.filter((a) => a.active).map((ann) => (
        <div
          key={ann.id}
          className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-4 py-2 text-xs font-semibold text-center flex items-center justify-center gap-2"
        >
          <Megaphone className="w-4 h-4 text-amber-300" />
          <span>
            <strong>{ann.title}:</strong> {ann.message}
          </span>
        </div>
      ))}

      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#0B1220]/90 backdrop-blur-md px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-amber-500 shadow-md shadow-emerald-500/20">
              <Pickaxe className="h-5 w-5 text-slate-950 font-bold" />
            </div>
            <div>
              <span className="text-xl font-black text-white tracking-tight">
                {branding.appName}
              </span>
              <span className="ml-1.5 rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/30 font-mono">
                v{config.version}
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-emerald-400 transition-colors">Fitur Platform</a>
            <a href="#pricing" className="hover:text-emerald-400 transition-colors">Paket Lisensi</a>
            <a href="#faq" className="hover:text-emerald-400 transition-colors">Tanya Jawab (FAQ)</a>
            <a href="#contact" className="hover:text-emerald-400 transition-colors">Kontak</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenLicenseModal}
              className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-all cursor-pointer"
            >
              <Key className="h-3.5 w-3.5" />
              <span>Aktivasi Lisensi</span>
            </button>

            <button
              onClick={onEnterDashboard}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2 text-xs font-bold text-slate-950 hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
            >
              <span>Masuk Platform</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section (Live Bound to Dynamic CMS) */}
      <section className="relative overflow-hidden py-20 px-6 lg:py-28">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-500/10 via-amber-500/5 to-transparent blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-5xl text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-400 shadow-inner">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>{websiteCMS.hero.badge}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            {websiteCMS.hero.title} <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
              {websiteCMS.hero.highlightedTitle}
            </span>
          </h1>

          <p className="mx-auto max-w-3xl text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            {websiteCMS.hero.subtitle}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={onEnterDashboard}
              className="flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 px-7 py-3.5 text-sm font-extrabold text-slate-950 shadow-xl shadow-emerald-500/25 hover:brightness-110 transition-all active:scale-95 cursor-pointer"
            >
              <span>{websiteCMS.hero.ctaPrimaryText}</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={onOpenLicenseModal}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-6 py-3.5 text-sm font-bold text-slate-200 hover:bg-slate-800 transition-all cursor-pointer"
            >
              <Key className="h-4 w-4 text-amber-400" />
              <span>{websiteCMS.hero.ctaSecondaryText}</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase">Real-Time Fleet FMS</p>
              <p className="text-xl font-extrabold text-emerald-400">100% Connected</p>
              <p className="text-[10px] text-slate-500 mt-1">Telemetry & GPS tracking</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase">AI Reasoning Core</p>
              <p className="text-xl font-extrabold text-amber-400">Gemini 3.7</p>
              <p className="text-[10px] text-slate-500 mt-1">Multi-Modal Domain Expert</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase">Multi-Tenant RBAC</p>
              <p className="text-xl font-extrabold text-white">Company & Site</p>
              <p className="text-[10px] text-slate-500 mt-1">Strict Data Isolation</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase">Compliance Standard</p>
              <p className="text-xl font-extrabold text-teal-400">ESDM & K3 Mining</p>
              <p className="text-[10px] text-slate-500 mt-1">Automated Reporting</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid from Dynamic CMS */}
      <section id="features" className="py-16 px-6 border-t border-slate-800/80 bg-[#0B1220]/50">
        <div className="mx-auto max-w-7xl space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Pilar Teknologi & Modul Unggulan
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
              Dibangun khusus untuk tantangan operasional tambang batubara terbuka (open-pit) dengan presisi tinggi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {websiteCMS.features.map((feat) => (
              <div
                key={feat.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-3 hover:border-emerald-500/40 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  {feat.badge && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 font-mono">
                      {feat.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-extrabold text-white">{feat.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Pricing from Dynamic CMS */}
      <section id="pricing" className="py-20 px-6 border-t border-slate-800">
        <div className="mx-auto max-w-7xl space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Paket Lisensi Commercial Enterprise
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Mekanisme lisensi resmi 1 Account = 1 RSA Cryptographic License Key.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => {
              const isPopular = plan.isPopular;
              return (
                <div
                  key={plan.planId}
                  className={`rounded-3xl p-6 space-y-6 flex flex-col justify-between relative transition-all ${
                    isPopular
                      ? "border-2 border-emerald-500/80 bg-gradient-to-b from-slate-900 to-[#0F172A] shadow-2xl shadow-emerald-500/10"
                      : "border border-slate-800 bg-slate-900/80"
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-3 py-0.5 text-[10px] font-black text-slate-950 uppercase tracking-widest">
                      {plan.badge || "Paling Populer"}
                    </div>
                  )}

                  <div className="space-y-4">
                    <span className="rounded bg-slate-800 px-3 py-1 text-[10px] font-bold text-slate-300 font-mono">
                      {plan.planId}
                    </span>
                    <h3 className="text-xl font-bold text-white">{plan.displayName}</h3>
                    <p className="text-xs text-slate-400">{plan.tagline}</p>
                    <div className="text-2xl font-black text-white font-mono">
                      {formatIDR(plan.priceMonthlyIDR)}{" "}
                      <span className="text-xs font-normal text-slate-400">/ bulan</span>
                    </div>

                    <ul className="space-y-2 text-xs text-slate-300 pt-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        <span>Maks {plan.maxSites} Site Tambang</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        <span>Maks {plan.maxUsers} Active Users</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        <span>Storage {plan.storageGB} GB Cloud Vault</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        <span>{plan.aiMonthlyQuota.toLocaleString()} AI Queries / Bulan</span>
                      </li>
                      {plan.featuresList.map((f, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={onOpenLicenseModal}
                    className={`w-full rounded-xl py-3 text-xs font-bold cursor-pointer transition-all ${
                      isPopular
                        ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 font-black"
                        : "border border-slate-700 bg-slate-800 text-white hover:bg-slate-700"
                    }`}
                  >
                    Aktivasi {plan.displayName}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section from Dynamic CMS */}
      <section id="faq" className="py-16 px-6 border-t border-slate-800/80 bg-[#0B1220]/70">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Tanya Jawab & Regulasi ESDM
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Informasi lengkap seputar kepatuhan, lisensi kriptografis, dan arsitektur data.
            </p>
          </div>

          <div className="space-y-3">
            {websiteCMS.faqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-slate-200 hover:text-white cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 bg-slate-950/40">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-slate-800 bg-[#080D1A] py-12 px-6 text-xs text-slate-400">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Pickaxe className="h-4 w-4 text-emerald-500" />
              <strong className="text-white text-sm font-black">{branding.appName}</strong>
            </div>
            <p className="text-[11px] text-slate-500">{websiteCMS.footerTagline}</p>
            <p className="text-[10px] text-slate-600">{websiteCMS.copyrightText}</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400">
            <span>Email: <strong className="text-slate-200">{websiteCMS.contactEmail}</strong></span>
            <span>WhatsApp: <strong className="text-emerald-400">{websiteCMS.whatsappSupportNumber}</strong></span>
          </div>

          {/* Master Developer Console Trigger */}
          <div>
            <button
              onClick={() => {
                if (onOpenDeveloperConsole) {
                  onOpenDeveloperConsole();
                } else {
                  onEnterDashboard();
                  setTimeout(() => {
                    if ((window as any).__NAVIGATE_MODULE__) {
                      (window as any).__NAVIGATE_MODULE__("developer-control-panel");
                    }
                  }, 100);
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-cyan-400 text-[10px] font-mono font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
              <span>Master Developer Console</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
