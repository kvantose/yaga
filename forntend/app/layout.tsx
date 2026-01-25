import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import { AntdProvider } from "./AntdProvider";
import { YandexMetrica } from "@/src/components/YandexMetrica/YandexMetrica";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YAGAART - Магазин авторской одежды",
  description:
    "Yagaart — дизайн-студия, создающая одежду ЕЛОМА для женщин, которые живут в своём ритме и ценят ощущение внутренней свободы.",
  keywords:
    "авторская одежда, одежда ручной работы, уникальная одежда, handmade, дизайнерская одежда, худи оверсайз, футболки с принтом, эксклюзивные аксессуары, купить одежду онлайн, yaga, yagaart, eloma, елома, Елена Ломаева",
  openGraph: {
    title: "YAGAART",
    description: "Магазин авторской одежды",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_API_URL}/images/og.png`,
        width: 1200,
        height: 630,
        alt: "YAGAart - авторская одежда",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YAGAART",
    description: "Магазин авторской одежды",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_API_URL}/images/og.png` || "/public/favicon.ico",
        width: 1200,
        height: 630,
        alt: "YAGAart - авторская одежда",
      },
    ],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} antialiased`}
      >
        <AntdProvider>{children}</AntdProvider>
        <YandexMetrica />
      </body>
    </html>
  );
}
