"use client";

import React, { ReactNode, useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n/client";
import Cookies from "js-cookie";

export function I18nProvider({ children, initialLocale }: { children: ReactNode, initialLocale?: string }) {
  // Sync the client instance with the server-detected locale BEFORE first render
  // This prevents React Hydration Mismatch errors
  if (initialLocale && i18n.language !== initialLocale) {
    i18n.changeLanguage(initialLocale);
  }

  // Ensure cookie is in sync on initial mount for server components
  useEffect(() => {
    const currentLang = i18n.language || "en";
    const savedCookie = Cookies.get("NEXT_LOCALE");
    
    if (savedCookie !== currentLang) {
      Cookies.set("NEXT_LOCALE", currentLang, { path: "/" });
    }
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
