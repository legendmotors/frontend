import "rc-slider/assets/index.css";
import "../../public/assets/scss/app.scss";
import "swiper/css/effect-fade";
import "swiper/css/grid";
import "photoswipe/style.css";

// Styles for PDF Viewer

import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import RootClient from "@/components/layout/RootClient";
import WhatsAppButton from "@/components/social/WhatsAppButton";
import Script from "next/script";

export default async function RootLayout({ children, params: { locale } }) {

  console.log(locale,"loccaaca");
  
  // Fetch messages for the given locale
  const messages = (await import(`../../messages/${locale}.json`)).default;

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
        {/* <NextIntlClientProvider messages={messages}> */}
          <RootClient>{children}</RootClient>
        {/* </NextIntlClientProvider> */}
      </body>
    </html>
  );
}
