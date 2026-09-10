// MINE SMART AI - Multi-Language / Internationalization (i18n) Types
// Supports 🇮🇩 Bahasa Indonesia, 🇬🇧 English, and 🇨🇳 中文 (Chinese)

export type SupportedLanguage = "id" | "en" | "zh";

export interface LanguageMeta {
  code: SupportedLanguage;
  name: string;          // e.g. "Indonesian", "English", "Chinese"
  nativeName: string;    // e.g. "Bahasa Indonesia", "English", "简体中文"
  flag: string;          // e.g. "🇮🇩", "🇬🇧", "🇨🇳"
  country: string;       // e.g. "Indonesia", "Global / UK", "China / 华语"
  badge: string;         // e.g. "ID", "EN", "ZH"
  dateFormat: string;    // e.g. "DD/MM/YYYY", "YYYY-MM-DD"
  currencyCode: string;  // e.g. "IDR", "USD", "CNY"
}

export type TranslationKey = string;

export interface TranslationDictionary {
  [key: string]: string | TranslationDictionary;
}
