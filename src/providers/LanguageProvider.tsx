// MINE SMART AI - Multi-Language / Internationalization (i18n) Provider
// Context for language switching, translation lookup, and localized formatting

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { SupportedLanguage, LanguageMeta } from "../i18n/types";
import { SUPPORTED_LANGUAGES, translations } from "../i18n/translations";

const STORAGE_KEY = "minesmart_preferred_language";

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  availableLanguages: typeof SUPPORTED_LANGUAGES;
  currentLanguageMeta: LanguageMeta;
  t: (path: string, fallback?: string, params?: Record<string, string | number>) => string;
  formatDate: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => string;
  formatNumber: (num: number, options?: Intl.NumberFormatOptions) => string;
  formatCurrency: (amount: number, currencyOverride?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as SupportedLanguage | null;
      if (stored && (stored === "id" || stored === "en" || stored === "zh")) {
        return stored;
      }
      // Check browser navigator language
      const navLang = navigator.language.toLowerCase();
      if (navLang.startsWith("zh")) return "zh";
      if (navLang.startsWith("en")) return "en";
      return "id";
    } catch {
      return "id";
    }
  });

  const setLanguage = (newLang: SupportedLanguage) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
      document.documentElement.lang = newLang;
    } catch (e) {
      console.warn("Could not save language preference to localStorage:", e);
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const currentLanguageMeta = useMemo(() => {
    return (
      SUPPORTED_LANGUAGES.find((l) => l.code === language) ||
      SUPPORTED_LANGUAGES[0]
    );
  }, [language]);

  /**
   * Translates a dot-notated string key (e.g. 'common.save', 'nav.production')
   */
  const t = (path: string, fallback?: string, params?: Record<string, string | number>): string => {
    if (!path) return fallback || "";

    const parts = path.split(".");
    let current: any = translations[language];

    for (const part of parts) {
      if (current && typeof current === "object" && part in current) {
        current = current[part];
      } else {
        // Fallback to Bahasa Indonesia dictionary if missing in target
        let fbCurrent: any = translations.id;
        for (const fbPart of parts) {
          if (fbCurrent && typeof fbCurrent === "object" && fbPart in fbCurrent) {
            fbCurrent = fbCurrent[fbPart];
          } else {
            fbCurrent = undefined;
            break;
          }
        }
        current = typeof fbCurrent === "string" ? fbCurrent : undefined;
        break;
      }
    }

    let result = typeof current === "string" ? current : fallback || path;

    // Parameter interpolation like {count} or {name}
    if (params && typeof result === "string") {
      Object.keys(params).forEach((paramKey) => {
        result = result.replace(new RegExp(`{${paramKey}}`, "g"), String(params[paramKey]));
      });
    }

    return result;
  };

  /**
   * Localized Date Formatter
   */
  const formatDate = (date: Date | string | number, options?: Intl.DateTimeFormatOptions): string => {
    try {
      const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
      const localeMap: Record<SupportedLanguage, string> = {
        id: "id-ID",
        en: "en-US",
        zh: "zh-CN",
      };
      const locale = localeMap[language] || "id-ID";
      const defaultOptions: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "short",
        year: "numeric",
      };
      return new Intl.DateTimeFormat(locale, options || defaultOptions).format(d);
    } catch {
      return String(date);
    }
  };

  /**
   * Localized Number Formatter
   */
  const formatNumber = (num: number, options?: Intl.NumberFormatOptions): string => {
    try {
      const localeMap: Record<SupportedLanguage, string> = {
        id: "id-ID",
        en: "en-US",
        zh: "zh-CN",
      };
      const locale = localeMap[language] || "id-ID";
      return new Intl.NumberFormat(locale, options).format(num);
    } catch {
      return String(num);
    }
  };

  /**
   * Localized Currency Formatter
   */
  const formatCurrency = (amount: number, currencyOverride?: string): string => {
    try {
      const localeMap: Record<SupportedLanguage, { locale: string; defaultCurrency: string }> = {
        id: { locale: "id-ID", defaultCurrency: "IDR" },
        en: { locale: "en-US", defaultCurrency: "USD" },
        zh: { locale: "zh-CN", defaultCurrency: "CNY" },
      };
      const cfg = localeMap[language] || localeMap.id;
      const currency = currencyOverride || cfg.defaultCurrency;

      return new Intl.NumberFormat(cfg.locale, {
        style: "currency",
        currency,
        maximumFractionDigits: currency === "IDR" ? 0 : 2,
      }).format(amount);
    } catch {
      return `${currencyOverride || "IDR"} ${amount.toLocaleString()}`;
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        availableLanguages: SUPPORTED_LANGUAGES,
        currentLanguageMeta,
        t,
        formatDate,
        formatNumber,
        formatCurrency,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
