"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie"; // Import js-cookie for client-side cookie handling

export default function LanguageSelector() {
  const pathname = usePathname(); // Current route
  const router = useRouter(); // Navigation
  const [language, setLanguage] = useState("English");

  const languages = [
    { code: "", label: "English" },
    { code: "ar", label: "Arabic" },
    { code: "fr", label: "French" },
    { code: "es", label: "Spanish" },
    { code: "pt", label: "Portuguese" },
    { code: "zh", label: "Chinese" },
  ];

  // Update the selected language from cookies or fallback
  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    const currentLocale = segments[0] || "en"; // Default to "en" if no locale in pathname
    const currentLanguage = languages.find((lang) => lang.code === currentLocale);

    if (currentLanguage) {
      setLanguage(currentLanguage.label);
    }
  }, [pathname]);

  const handleLanguageChange = (code, label) => {
    setLanguage(label);

    // Save the new locale in cookies
    Cookies.set("NEXT_LOCALE", code);

    // Extract current path without the locale
    const segments = pathname.split("/").filter(Boolean);
    segments[0] = code; // Replace the first segment with the new locale

    // Reconstruct the new pathname
    const newPathname = `/${segments.join("/")}`;
    router.push(newPathname);
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
          <li key={lang.code} className="me-0 ms-0">
            <div
              onClick={() => handleLanguageChange(lang.code, lang.label)}
            >
              {lang.label}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
