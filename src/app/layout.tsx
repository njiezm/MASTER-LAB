import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import PWAInstaller from "@/components/PWAInstaller";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gestion de Cours - Application PWA",
  description: "Application de gestion des cours et ressources pédagogiques avec support hors ligne",
  keywords: ["cours", "éducation", "gestion", "ressources", "PWA", "Next.js", "TypeScript"],
  authors: [{ name: "Équipe PWA" }],
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Gestion de Cours",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "Gestion de Cours",
    description: "Application de gestion des cours et ressources pédagogiques",
    url: "/",
    siteName: "Gestion de Cours",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gestion de Cours",
    description: "Application de gestion des cours et ressources pédagogiques",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Gestion de Cours",
    "application-name": "Gestion de Cours",
    "msapplication-TileColor": "#3b82f6",
    "msapplication-config": "/browserconfig.xml",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <PWAInstaller />
      </body>
    </html>
  );
}
