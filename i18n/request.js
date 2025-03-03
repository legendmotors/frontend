import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en', 'ar', 'fr', 'es', 'pt', 'zh'], // Supported locales
  defaultLocale: 'en', // Default locale
  redirectToDefaultLocale: false, // Prevent automatic redirection of / to /en
  hideDefaultLocaleInURL: true, // Hides en in URLs
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);