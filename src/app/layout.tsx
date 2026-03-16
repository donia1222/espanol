import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";


const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "El Español — Spanisches Restaurant & Tapas Bar | Buchs SG",
  description:
    "Authentische spanische Küche, Tapas und Weine in Buchs SG. Reservieren Sie jetzt Ihren Tisch bei El Español — Ihr spanisches Restaurant mit Paella, Tapas, Sangría und erlesenen Weinen.",
  themeColor: "#1a1a1a",
  keywords: [
    "Spanisches Restaurant Buchs",
    "Tapas Bar Buchs SG",
    "El Español Buchs",
    "Paella Buchs",
    "Spanische Küche Schweiz",
    "Restaurant Buchs SG",
    "Tapas Buchs",
    "Sangría",
    "Spanische Weine",
    "Tisch reservieren Buchs",
  ],
  openGraph: {
    title: "El Español — Spanisches Restaurant & Tapas Bar | Buchs SG",
    description:
      "Authentische spanische Küche, Tapas und Weine in Buchs SG. Reservieren Sie jetzt Ihren Tisch.",
    type: "website",
    locale: "de_CH",
    siteName: "El Español Buchs",
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "geo.region": "CH-SG",
    "geo.placename": "Buchs",
    "geo.position": "47.1667;9.4833",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={`${cormorant.variable} ${outfit.variable}`}>
        {children}
      </body>
    </html>
  );
}
