"use client";

import React, { useState, useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import initTranslations from "@/app/i18n";
import { createInstance } from "i18next";

export default function TranslationsProvider({ children, locale, namespaces }) {
  const [i18n, setI18n] = useState(null);

  useEffect(() => {
    const instance = createInstance();
    initTranslations(locale, namespaces, instance)
      .then(() => {
        setI18n(instance);
      })
      .catch((error) => {
        console.error("Failed to initialize translations:", error);
      });
  }, [locale, namespaces]);

  if (!i18n) {
    return <div></div>;
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
