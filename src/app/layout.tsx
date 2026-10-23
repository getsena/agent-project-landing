import { getCountriesServer } from "@/lib/services/countryService.server";
import { getIpInfoServer } from "@/lib/services/ipConfigService.server";
import { ModalRenderer } from "@/ui/shared/ModalRender";
import { Toast } from "@/ui/shared/Toast";
import Whatsapp from "@/ui/shared/WhatsApp";
import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";
import { adobeCleanFont, canaroFont, caslonFont } from "./fonts";
import "./globals.css";
import Providers from "./providers";

const TITLE = "Sena Ópera · Tu equipo de cobranza B2B externo";
const DESCRIPTION =
  "Ópera es el equipo de cobranza B2B que tu empresa no tiene: nosotros cobramos, tú ves los resultados. Desde US$50 al mes, con análisis de cartera sin costo. Chile y Perú.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords:
    "Sena Ópera, Sena, cobranza B2B, cobranza externalizada, equipo de cobranza externo, cobranza de facturas, Chile, Perú",
  authors: [{ name: "Sena" }],
  robots: { index: true, follow: true },
  metadataBase: new URL("https://agente.somossena.com"),
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/sena-crm-lite.jpg"],
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: "/",
    images: ["/sena-crm-lite.jpg"],
    siteName: "Sena",
    locale: "es_CL",
  },
  other: {
    "facebook-domain-verification": "tyjmxihsgkrx666ql4rwmnhsftl6hv",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [ipInfo, countries] = await Promise.all([
    getIpInfoServer(),
    getCountriesServer(),
  ]);
  const country = ipInfo?.country || null;

  return (
    <Providers country={country} countries={countries}>
      <html lang="es" dir="ltr">
        <head>
          {/* Google Tag Manager — Opera (GTM-52ZMKFRM) */}
          <Script id="gtm-script" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-52ZMKFRM');`}
          </Script>
          {/* Google Ads */}
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=AW-17962976949"
            strategy="afterInteractive"
          />
          <Script id="google-ads-config" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-17962976949');
            `}
          </Script>
          {/* Meta Pixel */}
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window,document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1585154825921176');
              fbq('track', 'PageView');
            `}
          </Script>
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src="https://www.facebook.com/tr?id=1585154825921176&ev=PageView&noscript=1"
              alt=""
            />
          </noscript>
        </head>
        <body
          className={`${canaroFont.variable} ${adobeCleanFont.variable} ${caslonFont.variable} antialiased font-adobe bg-surface-default`}
        >
          {/* Deshabilitar debugger statements */}
          <Script id="disable-debugger" strategy="beforeInteractive">
            {`
              (function() {
                  const originalDebugger = window.debugger;
                  window.debugger = function() {
                      // No hacer nada, deshabilitar pausas del debugger
                      return;
                  };
              })();
            `}
          </Script>
          {/* Fallback para Google Tag Manager */}
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-52ZMKFRM"
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            ></iframe>
          </noscript>
          <Suspense>{children}</Suspense>
          <ModalRenderer />
          <Toast />
          <Whatsapp
            message="Hola, vi su web y quiero saber más sobre Sena Ópera y cómo funciona."
            animated
          />
        </body>
      </html>
    </Providers>
  );
}
