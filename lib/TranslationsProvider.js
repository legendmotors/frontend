"use client";

import { I18nextProvider } from "react-i18next";
import { createInstance } from "i18next";
import initTranslations from "@/app/i18n";

export default function TranslationsProvider({ children, locale, namespaces, resources }) {
  const i18n = createInstance();

  // Initialize i18n for the client-side
  initTranslations(locale, namespaces, i18n, resources).catch((err) => {
    console.error("❌ i18n Initialization Error:", err);
  });

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
