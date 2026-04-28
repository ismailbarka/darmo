import type { Metadata } from "next";
import { Jost } from "next/font/google";
import Script from "next/script";
import Providers from "./providers";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import "leaflet/dist/leaflet.css";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import { Suspense } from "react";
import { Noto_Sans_Arabic } from "next/font/google";

const jost = Jost({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jost",
  weight: ["400", "500", "700"],
});

const arabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Daro.ma - Femme de ménage à Casablanca | عاملة منزل في الدار البيضاء",
  description:
    "Découvrez des femmes de ménage, nounous, plombiers et électriciens de confiance à Casablanca. اكتشف عاملات نظافة، مربيات، سباكين وكهربائيين موثوقين في الدار البيضاء.",
  openGraph: {
    title:
      "Daro.ma - Services de nettoyage à Casablanca | خدمات تنظيف في الدار البيضاء",
    description:
      "Trouvez des professionnels de confiance près de chez vous. اعثر على مهنيين موثوقين بالقرب منك.",
    type: "website",
    url: "https://daro.ma",
    locale: "fr_MA",
    alternateLocale: ["ar_MA"],
    siteName: "Daro.ma",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Daro.ma Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Daro.ma - Femme de ménage à Casablanca | عاملة منزل في الدار البيضاء",
    description:
      "Trouvez des professionnels de confiance près de chez vous. اعثر على مهنيين موثوقين بالقرب منك.",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale?: string };
}) {
  const isArabic = params?.locale === "ar";
  return (
    <html
      lang={params?.locale || "fr"}
      dir={isArabic ? "rtl" : "ltr"}
      className={`${jost.variable} ${arabic.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* <link rel="stylesheet" crossOrigin="" /> */}
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1282964636728385&ev=PageView&noscript=1"
          />
        </noscript>
      </head>
      <body>
        <Providers>{children}</Providers>
        <Analytics />
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
      </body>
    </html>
  );
}
