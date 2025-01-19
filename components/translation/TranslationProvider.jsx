// app/TranslationProvider.js
'use client';

import { NextIntlProvider } from 'next-intl';

export default function TranslationProvider({ children, locale, messages }) {
  return (
    <NextIntlProvider locale={locale} messages={messages}>
      {children}
    </NextIntlProvider>
  );
}
