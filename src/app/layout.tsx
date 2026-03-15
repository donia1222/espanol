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
    "Authentische spanische Küche, Tapas und Weine in Buchs SG. Reservieren Sie jetzt Ihren Tisch.",
  themeColor: "#1a1a1a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={`${cormorant.variable} ${outfit.variable}`} style={{ opacity: 0 }}>
        {children}
      </body>
    </html>
  );
}
