import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import ar from "./ar.json";

export const LANGUAGES = ["ar", "en"];
const STORAGE_KEY = "lang";
const DEFAULT_LANGUAGE = "ar";

function getSavedLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return LANGUAGES.includes(saved) ? saved : DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

// العربية من اليمين لليسار، الإنجليزية من اليسار لليمين
function applyLanguageToPage(lng) {
  document.documentElement.lang = lng;
  document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: getSavedLanguage(),
  fallbackLng: "ar",
  interpolation: { escapeValue: false }, // React يحمي من XSS
});

applyLanguageToPage(i18n.language);

i18n.on("languageChanged", (lng) => {
  applyLanguageToPage(lng);
  try {
    localStorage.setItem(STORAGE_KEY, lng);
  } catch {
    // التخزين غير متاح (وضع خاص مثلاً) — اللغة تعمل لهذه الجلسة فقط
  }
});

// للتواريخ: أرقام إنجليزية في العربية أيضاً (مثل الأسعار)
export function getDateLocale() {
  return i18n.language === "ar" ? "ar-u-nu-latn" : "en-US";
}

export default i18n;
