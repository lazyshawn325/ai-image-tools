import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "../globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { routing } from '@/i18n/routing';
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { HistoryPanel } from "@/components/shared/HistoryPanel";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#4f46e5",
};

import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Global" });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-image-tools-h41u.vercel.app";

  return {
    title: {
      template: `%s | ${t("meta_title")}`,
      default: t("meta_title"),
    },
    description: t("meta_desc"),
    keywords: [
      t.raw("meta_title"),
      (await getTranslations({ locale, namespace: "Navigation" }))("compress"),
      (await getTranslations({ locale, namespace: "Navigation" }))("convert"),
      (await getTranslations({ locale, namespace: "Navigation" }))("resize"),
      (await getTranslations({ locale, namespace: "Navigation" }))("qrcode"),
      (await getTranslations({ locale, namespace: "Navigation" }))("removeBg"),
    ],
    authors: [{ name: "AI Image Tools" }],
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'en': '/en',
        'zh': '/zh',
        'x-default': '/en',
      },
    },
    openGraph: {
      title: t("meta_title"),
      description: t("meta_desc"),
      url: `${baseUrl}/${locale}`,
      siteName: "AI Image Tools",
      locale: locale === "zh" ? "zh_CN" : "en_US",
      type: "website",
      images: [
        {
          url: "/icon.svg",
          width: 800,
          height: 600,
          alt: "AI Image Tools Logo",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("meta_title"),
      description: t("meta_desc"),
      images: ["/icon.svg"],
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: t("apple_title"),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Ensure locale exists (fallback for 404/root if needed)
  const safeLocale = locale || routing.defaultLocale;
  
  // Enable static rendering
  setRequestLocale(safeLocale);

  // We must pass the locale to getMessages, otherwise it might infer the wrong one
  // or default to something else in static generation context
  const messages = await getMessages({locale: safeLocale});
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  return (
    <html lang={locale}>
      <head>
        {adsenseClientId && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <div className="scroll-progress" />
        <NextIntlClientProvider messages={messages} locale={safeLocale}>
          <ThemeProvider>
            <ToastProvider>
              <Header />
              <main className="flex-1">
                <Breadcrumbs />
                {children}
              </main>
              <Footer />
              <HistoryPanel />
              <GoogleAnalytics />
            </ToastProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
