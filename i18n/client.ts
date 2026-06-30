"use client";

import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Cookies from "js-cookie";

import enCommon from "../locales/en/common.json";
import idCommon from "../locales/id/common.json";

export const defaultNS = "common";
export const resources = {
  en: { common: enCommon },
  id: { common: idCommon },
} as const;

// Create custom language detector to sync with cookie
const customLanguageDetector = new LanguageDetector();
customLanguageDetector.addDetector({
  name: "cookieAndLocalStorage",
  lookup(options) {
    let found = Cookies.get("NEXT_LOCALE");
    if (!found && typeof window !== "undefined") {
      found = localStorage.getItem("i18nextLng") || undefined;
    }
    return found;
  },
  cacheUserLanguage(lng, options) {
    if (typeof window !== "undefined") {
      localStorage.setItem("i18nextLng", lng);
      Cookies.set("NEXT_LOCALE", lng, { path: "/" });
    }
  },
});

i18next
  .use(customLanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    defaultNS,
    fallbackLng: "en",
    supportedLngs: ["en", "id"],
    detection: {
      order: ["cookieAndLocalStorage", "navigator"],
      caches: ["cookieAndLocalStorage"],
    },
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18next;
