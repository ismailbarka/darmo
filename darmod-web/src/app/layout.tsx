import type { Metadata } from "next";
import { Jost } from "next/font/google";
import Providers from "./providers";
import "./globals.css";

const jost = Jost({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jost",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title:
    "Daro.ma - Femme de ménage à Casablanca | Services de nettoyage près de vous",
  description:
    "Découvrez des femmes de ménage, nounous, plombiers et électriciens de confiance près de chez vous à Casablanca. Appelez, envoyez un WhatsApp ou obtenez un itinéraire instantanément.",
  keywords:
    "femme de ménage, nounou, plombier, électricien, Casablanca, services à domicile, Daro.ma",
  openGraph: {
    title:
      "Daro.ma - Femme de ménage à Casablanca | Services de nettoyage près de vous",
    description: "Découvrez des femmes de ménage, nounous, plombiers et électriciens de confiance près de chez vous à Casablanca. Appelez, envoyez un WhatsApp ou obtenez un itinéraire instantanément.",
    type: "website",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jost.variable}>
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
