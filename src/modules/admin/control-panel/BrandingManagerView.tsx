// MINE SMART AI - Global Branding & White-Label Console
// PROMPT 36: Brand Identity, Colors, Typography, Logos & White-Label Policy

import React, { useState } from "react";
import {
  Palette,
  Sparkles,
  Save,
  CheckCircle2,
  Image as ImageIcon,
  Shield,
  Layers,
} from "lucide-react";
import {
  PlatformConfig,
  BrandingConfig,
} from "../../../types/developerControlPanelTypes";
import { platformConfigService } from "../../../services/config/PlatformConfigService";

interface BrandingManagerViewProps {
  config: PlatformConfig;
  onRefresh: () => void;
}

export const BrandingManagerView: React.FC<BrandingManagerViewProps> = ({
  config,
  onRefresh,
}) => {
  const [brandingDraft, setBrandingDraft] = useState<BrandingConfig>({
    ...config.branding,
  });
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const handleSaveBranding = async () => {
    await platformConfigService.publishConfig(
      { branding: brandingDraft },
      "Triyadi Jaya",
      "jaya45triyadi@gmail.com",
      "Pembaruan Global Branding & Palet Warna"
    );
    setActionSuccessMessage("✅ Konfigurasi branding global berhasil diperbarui!");
    onRefresh();
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-emerald-400" />
            <span>Global Branding & Enterprise White-Labeling</span>
          </h2>
          <p className="text-xs text-slate-400">
            Atur identitas merek, palet warna, tipografi, logo vektor, dan hak custom white-labeling bagi pelanggan korporat.
          </p>
        </div>

        <button
          onClick={handleSaveBranding}
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Konfigurasi Branding</span>
        </button>
      </div>

      {actionSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Core Brand Identity */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3">
            Core Brand Identity
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                App Product Name
              </label>
              <input
                type="text"
                value={brandingDraft.appName}
                onChange={(e) => setBrandingDraft({ ...brandingDraft, appName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                Company Legal Name
              </label>
              <input
                type="text"
                value={brandingDraft.companyName}
                onChange={(e) => setBrandingDraft({ ...brandingDraft, companyName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-semibold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                Official Brand Tagline
              </label>
              <input
                type="text"
                value={brandingDraft.tagline}
                onChange={(e) => setBrandingDraft({ ...brandingDraft, tagline: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Colors */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Primary Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={brandingDraft.primaryColor}
                    onChange={(e) =>
                      setBrandingDraft({ ...brandingDraft, primaryColor: e.target.value })
                    }
                    className="h-8 w-8 rounded-lg cursor-pointer border-0 bg-transparent"
                  />
                  <span className="font-mono text-xs font-bold text-slate-300">
                    {brandingDraft.primaryColor}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Secondary Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={brandingDraft.secondaryColor}
                    onChange={(e) =>
                      setBrandingDraft({ ...brandingDraft, secondaryColor: e.target.value })
                    }
                    className="h-8 w-8 rounded-lg cursor-pointer border-0 bg-transparent"
                  />
                  <span className="font-mono text-xs font-bold text-slate-300">
                    {brandingDraft.secondaryColor}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Accent Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={brandingDraft.accentColor}
                    onChange={(e) =>
                      setBrandingDraft({ ...brandingDraft, accentColor: e.target.value })
                    }
                    className="h-8 w-8 rounded-lg cursor-pointer border-0 bg-transparent"
                  />
                  <span className="font-mono text-xs font-bold text-slate-300">
                    {brandingDraft.accentColor}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logos & White-Label Policy */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3">
            Logo Assets & White-Labeling
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                Main Vector Logo Path
              </label>
              <input
                type="text"
                value={brandingDraft.mainLogoUrl}
                onChange={(e) => setBrandingDraft({ ...brandingDraft, mainLogoUrl: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                Favicon URL (.ico / .svg)
              </label>
              <input
                type="text"
                value={brandingDraft.faviconUrl}
                onChange={(e) => setBrandingDraft({ ...brandingDraft, faviconUrl: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                PDF Report Official Header Logo
              </label>
              <input
                type="text"
                value={brandingDraft.pdfReportLogoUrl}
                onChange={(e) =>
                  setBrandingDraft({ ...brandingDraft, pdfReportLogoUrl: e.target.value })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* White-Label Toggle Box */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3 mt-4">
              <div>
                <h4 className="text-xs font-black text-emerald-300">
                  Allow Enterprise White-Labeling
                </h4>
                <p className="text-[11px] text-emerald-400">
                  Izinkan entitas tenant Enterprise mengunggah logo kustom dan palet warna perusahaannya sendiri.
                </p>
              </div>

              <input
                type="checkbox"
                checked={brandingDraft.allowTenantWhiteLabeling}
                onChange={(e) =>
                  setBrandingDraft({
                    ...brandingDraft,
                    allowTenantWhiteLabeling: e.target.checked,
                  })
                }
                className="h-5 w-5 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
