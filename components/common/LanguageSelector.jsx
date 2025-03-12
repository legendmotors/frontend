'use client';

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie"; // For client-side cookie handling
import i18nConfig from '@/i18nConfig'; // Import your i18n configuration

export default function LanguageSelector() {
  const pathname = usePathname(); // Current route
  const router = useRouter(); // Navigation
  const [language, setLanguage] = useState("English");

  // Updated languages array – note that English now uses "en"
  const languages = [
    { code: "en", label: "English" },
    { code: "ar", label: "Arabic" },
    { code: "fr", label: "French" },
    { code: "es", label: "Spanish" },
    { code: "ru", label: "Russian" },
    { code: "zh-CN", label: "Chinese" },
  ];

  // Update the selected language based on the URL
  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    const firstSegment = segments[0];
    const isLocaleSegment = i18nConfig.locales.includes(firstSegment);
    const currentLocale = isLocaleSegment ? firstSegment : i18nConfig.defaultLocale;
    const currentLanguage = languages.find((lang) => lang.code === currentLocale);
    if (currentLanguage) {
      setLanguage(currentLanguage.label);
    }
  }, [pathname]);

  const handleLanguageChange = (code, label) => {
    setLanguage(label);

    // Save the new locale in cookies with a 30-day expiration
    Cookies.set("NEXT_LOCALE", code, { expires: 30 });

    const segments = pathname.split("/").filter(Boolean);
    const firstSegment = segments[0];
    const isLocaleSegment = i18nConfig.locales.includes(firstSegment);
    const currentLocale = isLocaleSegment ? firstSegment : i18nConfig.defaultLocale;

    let newPathname;
    // If there's no locale in the URL and we're on the default locale (without prefix), prepend the new locale
    if (!isLocaleSegment && currentLocale === i18nConfig.defaultLocale && !i18nConfig.prefixDefault) {
      newPathname = `/${code}${pathname}`;
    } else if (isLocaleSegment) {
      // Otherwise, replace the current locale segment with the new one
      newPathname = pathname.replace(`/${currentLocale}`, `/${code}`);
    } else {
      // Fallback to prepend the new locale
      newPathname = `/${code}${pathname}`;
    }

    router.push(newPathname);
    router.refresh();
  };

  return (
    <div className="dropdown">
      <button
        className="btn btn-light dropdown-toggle"
        type="button"
        id="languageDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {language}
      </button>
      <ul className="dropdown-menu p-0" aria-labelledby="languageDropdown">
        {languages.map((lang) => (
          <li key={lang.code} className="m-0 p-0"  onClick={() => handleLanguageChange(lang.code, lang.label)}>
            <div
             
              className="p-2"
            >
              {lang.label}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
