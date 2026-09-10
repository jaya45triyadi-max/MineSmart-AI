// MINE SMART AI - Enterprise Multi-Language Switcher Component
// Supports 🇮🇩 Bahasa Indonesia, 🇬🇧 English, and 🇨🇳 中文 (Chinese)

import React, { useState, useRef, useEffect } from "react";
import { Globe, Check, ChevronDown, Sparkles } from "lucide-react";
import { useLanguage } from "../../providers/LanguageProvider";
import { SupportedLanguage } from "../../i18n/types";

interface LanguageSwitcherProps {
  variant?: "header" | "compact" | "full" | "pills";
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = "header",
  className = "",
}) => {
  const { language, setLanguage, availableLanguages, currentLanguageMeta, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectLanguage = (code: SupportedLanguage) => {
    setLanguage(code);
    setIsOpen(false);
  };

  // Variant: Pills for settings or onboarding
  if (variant === "pills") {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 ${className}`}>
        {availableLanguages.map((lang) => {
          const isSelected = language === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleSelectLanguage(lang.code)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? "bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-slate-900 border-emerald-500/50 shadow-lg shadow-emerald-500/10"
                  : "bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60"
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
              <div className="flex items-center gap-3">
                <span className="text-2xl">{lang.flag}</span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white text-sm">{lang.nativeName}</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] font-bold">
                      {lang.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {lang.name} &bull; {lang.country}
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Date: {lang.dateFormat}</span>
                <span className="text-emerald-400 font-bold">{lang.currencyCode}</span>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  // Variant: Full block (for sidebar or mobile drawer)
  if (variant === "full") {
    return (
      <div className={`space-y-1.5 ${className}`}>
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-1">
          {t("header.languageSelector", "Language / Bahasa / 语言")}
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {availableLanguages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleSelectLanguage(lang.code)}
              className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                language === lang.code
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800"
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.badge}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Variant: Header Dropdown (Standard)
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/90 px-2.5 py-1.5 text-xs text-slate-200 hover:border-slate-700 hover:bg-slate-800 transition-all cursor-pointer shadow-sm"
        title={t("header.languageSelector", "Switch Language")}
        aria-label="Switch Language"
      >
        <span className="text-sm leading-none">{currentLanguageMeta.flag}</span>
        <span className="font-bold text-[11px] text-slate-200">{currentLanguageMeta.badge}</span>
        <ChevronDown
          className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-emerald-400" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-800 bg-[#0D1938] p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95">
          <div className="px-2.5 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-800 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3 text-emerald-400" />
              {t("header.languageSelector", "Pilih Bahasa")}
            </span>
            <span className="text-emerald-400 font-mono text-[9px]">3 Active</span>
          </div>

          <div className="space-y-1 mt-1.5">
            {availableLanguages.map((lang) => {
              const isSelected = language === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left text-xs transition-all cursor-pointer ${
                    isSelected
                      ? "bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30"
                      : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base leading-none">{lang.flag}</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold">{lang.nativeName}</span>
                        <span className="text-[10px] px-1 py-0.2 rounded bg-slate-900/80 text-slate-400 font-mono">
                          {lang.badge}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400">{lang.country}</p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-2 pt-2 border-t border-slate-800/80 px-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Standard: Minerba ESDM / ISO</span>
            <span className="text-emerald-400 font-bold">i18n Ready</span>
          </div>
        </div>
      )}
    </div>
  );
};
