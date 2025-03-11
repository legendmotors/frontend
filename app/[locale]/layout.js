import "rc-slider/assets/index.css";
import "../../public/assets/scss/app.scss";
import "swiper/css/effect-fade";
import "swiper/css/grid";
import "photoswipe/style.css";

// Styles for PDF Viewer

import { notFound } from "next/navigation";
import RootClient from "@/components/layout/RootClient";
import TranslationsProvider from "@/components/layout/TranslationsProvider";
import WhatsAppButton from "@/components/social/WhatsAppButton";
import Script from "next/script";
import initTranslations from '@/app/i18n';

const i18nNamespaces = ['common'];


export default async function RootLayout({ children, params: { locale } }) {

  const { t, resources } = await initTranslations(locale, i18nNamespaces);

  // Fetch messages for the given locale

  // Determine the direction of the text (RTL or LTR)
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir}>
      <head>
        <meta name="robots" content="noindex, nofollow" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Outfit:wght@100..900&display=swap"
          rel="stylesheet"
        />

        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-6WZ84PB88R" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-6WZ84PB88R');
          `}
        </Script>
      </head>
      <body className="body" style={{ transition: "0s" }}>
        <WhatsAppButton />
        <TranslationsProvider namespaces={i18nNamespaces} locale={locale}>
          <RootClient>{children}</RootClient>
        </TranslationsProvider>
      </body>
    </html>
  );
}
