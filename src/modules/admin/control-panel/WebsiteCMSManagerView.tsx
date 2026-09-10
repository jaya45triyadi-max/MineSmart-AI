// MINE SMART AI - Dynamic Website CMS & Content Versioning Engine
// PROMPT 36: Live Website Editing, Safe Publish, Versioning & Zero-Redeploy Architecture

import React, { useState } from "react";
import {
  FileText,
  Sparkles,
  Save,
  RotateCcw,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Layers,
  History,
  Radio,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  MessageSquare,
  Globe2,
  HelpCircle,
  Megaphone,
} from "lucide-react";
import {
  PlatformConfig,
  WebsiteCMSConfig,
  CMSHeroSection,
  CMSFeatureCard,
  CMSFAQItem,
  CMSAnnouncement,
  CMSVersionRecord,
} from "../../../types/developerControlPanelTypes";
import { platformConfigService } from "../../../services/config/PlatformConfigService";

interface WebsiteCMSManagerViewProps {
  config: PlatformConfig;
  onRefresh: () => void;
}

export const WebsiteCMSManagerView: React.FC<WebsiteCMSManagerViewProps> = ({
  config,
  onRefresh,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    "HERO" | "FEATURES" | "FAQS" | "ANNOUNCEMENTS" | "SEO" | "VERSIONS" | "PREVIEW"
  >("HERO");

  // Draft State initialized with current config
  const [cmsDraft, setCmsDraft] = useState<WebsiteCMSConfig>({ ...config.websiteCMS });
  const [isSaving, setIsSaving] = useState(false);
  const [showImpactModal, setShowImpactModal] = useState(false);
  const [publishComment, setPublishComment] = useState("Pembaruan teks hero & CMS");
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const versionHistory = platformConfigService.getVersionHistory();
  const impact = platformConfigService.getCustomerImpactEstimate();

  const handleHeroChange = (field: keyof CMSHeroSection, val: string) => {
    setCmsDraft((prev) => ({
      ...prev,
      hero: { ...prev.hero, [field]: val },
    }));
  };

  const handleExecutePublish = async () => {
    setIsSaving(true);
    setShowImpactModal(false);

    await platformConfigService.publishConfig(
      { websiteCMS: cmsDraft },
      "Triyadi Jaya",
      "jaya45triyadi@gmail.com",
      publishComment
    );

    setIsSaving(false);
    setActionSuccessMessage(
      `✅ Konfigurasi CMS berhasil dipublikasikan ke Versi v${config.version + 1}! Perubahan langsung aktif di landing page & akun customer.`
    );
    onRefresh();
    setTimeout(() => setActionSuccessMessage(null), 5000);
  };

  const handleRollback = async (versionNumber: number) => {
    setIsSaving(true);
    const restored = await platformConfigService.rollbackToVersion(
      versionNumber,
      "Triyadi Jaya",
      "jaya45triyadi@gmail.com"
    );
    if (restored) {
      setCmsDraft({ ...restored.websiteCMS });
      setActionSuccessMessage(
        `✅ Berhasil melakukan rollback ke snapshot Versi v${versionNumber}!`
      );
      onRefresh();
    }
    setIsSaving(false);
    setTimeout(() => setActionSuccessMessage(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Publish Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-black text-white">
              Dynamic Website CMS & Content Engine
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono">
              Live v{config.version}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Ubah judul, narasi, video, fitur, dan pengumuman secara dinamis tanpa perlu deploy source code ulang.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowImpactModal(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Publish Changes to Live</span>
          </button>
        </div>
      </div>

      {actionSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Sub-tabs switcher */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-800 pb-2 scrollbar-none">
        {[
          { key: "HERO", label: "Hero & Headline", icon: Sparkles },
          { key: "FEATURES", label: "Features Cards", icon: Layers },
          { key: "FAQS", label: "FAQ & Answers", icon: HelpCircle },
          { key: "ANNOUNCEMENTS", label: "Global Announcements", icon: Megaphone },
          { key: "SEO", label: "SEO & Contacts", icon: Globe2 },
          { key: "VERSIONS", label: "Version History & Rollback", icon: History },
          { key: "PREVIEW", label: "Live Visual Preview", icon: Eye },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveSubTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-slate-800 text-emerald-400 shadow-md border border-slate-700"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: HERO & HEADLINE */}
      {activeSubTab === "HERO" && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Website Hero Section Content
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Dynamic Live Bind</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                Top Hero Badge
              </label>
              <input
                type="text"
                value={cmsDraft.hero.badge}
                onChange={(e) => handleHeroChange("badge", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-semibold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Main Headline (Line 1)
                </label>
                <input
                  type="text"
                  value={cmsDraft.hero.title}
                  onChange={(e) => handleHeroChange("title", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Gradient Highlighted Text (Line 2)
                </label>
                <input
                  type="text"
                  value={cmsDraft.hero.highlightedTitle}
                  onChange={(e) => handleHeroChange("highlightedTitle", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                Hero Subtitle / Description Paragraph
              </label>
              <textarea
                rows={3}
                value={cmsDraft.hero.subtitle}
                onChange={(e) => handleHeroChange("subtitle", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white leading-relaxed focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Primary CTA Button Text
                </label>
                <input
                  type="text"
                  value={cmsDraft.hero.ctaPrimaryText}
                  onChange={(e) => handleHeroChange("ctaPrimaryText", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Secondary CTA Button Text
                </label>
                <input
                  type="text"
                  value={cmsDraft.hero.ctaSecondaryText}
                  onChange={(e) => handleHeroChange("ctaSecondaryText", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Demo Video Embed URL (YouTube/MP4)
                </label>
                <input
                  type="text"
                  value={cmsDraft.hero.demoVideoUrl || ""}
                  onChange={(e) => handleHeroChange("demoVideoUrl", e.target.value)}
                  placeholder="https://www.youtube.com/embed/..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Hero Background / Cover Image URL
                </label>
                <input
                  type="text"
                  value={cmsDraft.hero.heroImageUrl || ""}
                  onChange={(e) => handleHeroChange("heroImageUrl", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FEATURES CARDS */}
      {activeSubTab === "FEATURES" && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Feature Showcase Cards ({cmsDraft.features.length})
            </h3>
            <button
              onClick={() => {
                const newFeat: CMSFeatureCard = {
                  id: `feat-${Date.now()}`,
                  title: "Fitur Baru",
                  description: "Deskripsi fitur baru yang dapat diedit langsung.",
                  iconName: "Sparkles",
                  category: "AI",
                  badge: "New",
                  order: cmsDraft.features.length + 1,
                };
                setCmsDraft((prev) => ({
                  ...prev,
                  features: [...prev.features, newFeat],
                }));
              }}
              className="px-3 py-1.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg hover:bg-emerald-400 cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Feature Card</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cmsDraft.features.map((feat, idx) => (
              <div
                key={feat.id}
                className="p-4 rounded-2xl border border-slate-800/80 bg-slate-950/70 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-slate-400">
                    Feature #{idx + 1}
                  </span>
                  <button
                    onClick={() => {
                      setCmsDraft((prev) => ({
                        ...prev,
                        features: prev.features.filter((f) => f.id !== feat.id),
                      }));
                    }}
                    className="text-rose-500 hover:text-rose-400 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <input
                  type="text"
                  value={feat.title}
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    setCmsDraft((prev) => ({
                      ...prev,
                      features: prev.features.map((f) =>
                        f.id === feat.id ? { ...f, title: newTitle } : f
                      ),
                    }));
                  }}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-bold text-white"
                  placeholder="Feature Title"
                />

                <textarea
                  rows={2}
                  value={feat.description}
                  onChange={(e) => {
                    const newDesc = e.target.value;
                    setCmsDraft((prev) => ({
                      ...prev,
                      features: prev.features.map((f) =>
                        f.id === feat.id ? { ...f, description: newDesc } : f
                      ),
                    }));
                  }}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300"
                  placeholder="Feature Description"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: FAQS */}
      {activeSubTab === "FAQS" && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Frequently Asked Questions (FAQ)
            </h3>
            <button
              onClick={() => {
                const newFaq: CMSFAQItem = {
                  id: `faq-${Date.now()}`,
                  question: "Pertanyaan Baru?",
                  answer: "Jawaban penjelasan untuk pertanyaan ini.",
                  category: "GENERAL",
                  order: cmsDraft.faqs.length + 1,
                };
                setCmsDraft((prev) => ({
                  ...prev,
                  faqs: [...prev.faqs, newFaq],
                }));
              }}
              className="px-3 py-1.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg hover:bg-emerald-400 cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah FAQ</span>
            </button>
          </div>

          <div className="space-y-3">
            {cmsDraft.faqs.map((faq, idx) => (
              <div
                key={faq.id}
                className="p-4 rounded-2xl border border-slate-800/80 bg-slate-950/70 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-slate-400">
                    FAQ #{idx + 1}
                  </span>
                  <button
                    onClick={() => {
                      setCmsDraft((prev) => ({
                        ...prev,
                        faqs: prev.faqs.filter((f) => f.id !== faq.id),
                      }));
                    }}
                    className="text-rose-500 hover:text-rose-400 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCmsDraft((prev) => ({
                      ...prev,
                      faqs: prev.faqs.map((f) => (f.id === faq.id ? { ...f, question: val } : f)),
                    }));
                  }}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-bold text-white"
                />

                <textarea
                  rows={2}
                  value={faq.answer}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCmsDraft((prev) => ({
                      ...prev,
                      faqs: prev.faqs.map((f) => (f.id === faq.id ? { ...f, answer: val } : f)),
                    }));
                  }}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: GLOBAL ANNOUNCEMENTS */}
      {activeSubTab === "ANNOUNCEMENTS" && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Global Platform Announcements & Banners
            </h3>
            <button
              onClick={() => {
                const newAnn: CMSAnnouncement = {
                  id: `ann-${Date.now()}`,
                  title: "Pengumuman Baru",
                  message: "Pesan pengumuman penting yang akan tampil di seluruh user.",
                  type: "INFO",
                  targetScope: "ALL_USERS",
                  active: true,
                  startDate: new Date().toISOString(),
                };
                setCmsDraft((prev) => ({
                  ...prev,
                  announcements: [...prev.announcements, newAnn],
                }));
              }}
              className="px-3 py-1.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg hover:bg-emerald-400 cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buat Pengumuman Baru</span>
            </button>
          </div>

          <div className="space-y-3">
            {cmsDraft.announcements.map((ann) => (
              <div
                key={ann.id}
                className="p-4 rounded-2xl border border-slate-800/80 bg-slate-950/70 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ann.type === "CRITICAL"
                          ? "bg-rose-500/20 text-rose-400"
                          : ann.type === "WARNING"
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-emerald-500/20 text-emerald-400"
                      }`}
                    >
                      {ann.type}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Target: {ann.targetScope}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setCmsDraft((prev) => ({
                        ...prev,
                        announcements: prev.announcements.filter((a) => a.id !== ann.id),
                      }));
                    }}
                    className="text-rose-500 hover:text-rose-400 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <input
                  type="text"
                  value={ann.title}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCmsDraft((prev) => ({
                      ...prev,
                      announcements: prev.announcements.map((a) =>
                        a.id === ann.id ? { ...a, title: val } : a
                      ),
                    }));
                  }}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-bold text-white"
                />

                <textarea
                  rows={2}
                  value={ann.message}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCmsDraft((prev) => ({
                      ...prev,
                      announcements: prev.announcements.map((a) =>
                        a.id === ann.id ? { ...a, message: val } : a
                      ),
                    }));
                  }}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SEO & CONTACTS */}
      {activeSubTab === "SEO" && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3">
            SEO Metadata & Corporate Support Contacts
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                Site Title (Browser Tab)
              </label>
              <input
                type="text"
                value={cmsDraft.siteTitle}
                onChange={(e) => setCmsDraft({ ...cmsDraft, siteTitle: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-semibold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                Corporate Support Email
              </label>
              <input
                type="email"
                value={cmsDraft.contactEmail}
                onChange={(e) => setCmsDraft({ ...cmsDraft, contactEmail: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                WhatsApp Hotline
              </label>
              <input
                type="text"
                value={cmsDraft.whatsappSupportNumber}
                onChange={(e) =>
                  setCmsDraft({ ...cmsDraft, whatsappSupportNumber: e.target.value })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                Copyright Text
              </label>
              <input
                type="text"
                value={cmsDraft.copyrightText}
                onChange={(e) => setCmsDraft({ ...cmsDraft, copyrightText: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: VERSIONS HISTORY & ROLLBACK */}
      {activeSubTab === "VERSIONS" && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Published Version Snapshots ({versionHistory.length} Recorded)
            </h3>
            <span className="text-xs text-slate-400">1-Click Instant Rollback</span>
          </div>

          <div className="space-y-3">
            {versionHistory.map((rec) => (
              <div
                key={rec.version}
                className="p-4 rounded-2xl border border-slate-800/80 bg-slate-950/70 flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded font-mono text-xs font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      v{rec.version}
                    </span>
                    <span className="font-bold text-xs text-white">
                      {rec.comment}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Dipublikasikan oleh <strong>{rec.publishedBy}</strong> pada{" "}
                    {new Date(rec.publishedAt).toLocaleString("id-ID")}
                  </p>
                </div>

                <button
                  onClick={() => handleRollback(rec.version)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Restore Snapshot</span>
                </button>
              </div>
            ))}

            {versionHistory.length === 0 && (
              <div className="text-center py-8 text-xs text-slate-400">
                Belum ada snapshot rollback sebelumnya. Setiap kali Anda melakukan Publish, snapshot baru akan otomatis tersimpan di sini.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 7: LIVE VISUAL PREVIEW */}
      {activeSubTab === "PREVIEW" && (
        <div className="rounded-3xl border border-slate-800 bg-[#0B1220] p-6 sm:p-8 text-white shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <span className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              <span>LIVE RENDERED VISUAL PREVIEW (LANDING PAGE)</span>
            </span>
          </div>

          {/* Hero Simulation Box */}
          <div className="text-center space-y-4 max-w-3xl mx-auto py-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-400">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>{cmsDraft.hero.badge}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              {cmsDraft.hero.title} <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                {cmsDraft.hero.highlightedTitle}
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl mx-auto">
              {cmsDraft.hero.subtitle}
            </p>

            <div className="flex items-center justify-center gap-3 pt-4">
              <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs shadow-lg">
                {cmsDraft.hero.ctaPrimaryText}
              </button>
              <button className="px-5 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-bold text-xs">
                {cmsDraft.hero.ctaSecondaryText}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Impact Preview Confirmation Modal */}
      {showImpactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 text-white shadow-2xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">
                  Customer Impact & Safe Publish Review
                </h3>
                <p className="text-xs text-slate-400">
                  Konfirmasi penerbitan konfigurasi dinamis ke production.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <p className="font-bold text-amber-300 flex items-center gap-1.5">
                <span>⚠️ Perubahan ini akan langsung mempengaruhi:</span>
              </p>
              <ul className="space-y-1 text-slate-300 font-mono text-[11px] list-disc list-inside">
                <li>
                  <strong>{impact.totalCompanies} Perusahaan Pelanggan Aktif</strong> (Multi-Tenant)
                </li>
                <li>
                  <strong>{impact.totalUsers} Akun Pengguna Aktif</strong> di seluruh site tambang
                </li>
                <li>Public Landing Page & FAQ Portal</li>
              </ul>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                Catatan Perubahan (Audit Trail)
              </label>
              <input
                type="text"
                value={publishComment}
                onChange={(e) => setPublishComment(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowImpactModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleExecutePublish}
                disabled={isSaving}
                className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-slate-950 text-xs font-black rounded-xl shadow-lg shadow-emerald-500/25 cursor-pointer disabled:opacity-50"
              >
                {isSaving ? "Publishing..." : "Ya, Publish Sekarang (v" + (config.version + 1) + ")"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
