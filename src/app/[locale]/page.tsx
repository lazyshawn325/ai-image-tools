import { WebsiteJsonLd, OrganizationJsonLd } from "@/components/seo/JsonLd";
import { Hero } from "@/components/home/Hero";
import { ToolsGrid } from "@/components/home/ToolsGrid";
import { Features } from "@/components/home/Features";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Hero" });
  const g = await getTranslations({ locale, namespace: "Global" });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-image-tools-h41u.vercel.app";

  const title = locale === 'zh' 
    ? `AI 图片工具箱 - 免费在线无损放大、智能去背景、格式转换` 
    : `AI Image Tools - Free Online Upscaler, Background Remover & Converter`;

  return {
    title,
    description: t("description"),
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
      title,
      description: t("description"),
      url: `${baseUrl}/${locale}`,
      siteName: "AI Image Tools",
      locale: locale === "zh" ? "zh_CN" : "en_US",
      type: "website",
      images: [
        {
          url: "/icon.svg",
          width: 800,
          height: 600,
          alt: "AI Image Tools",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: t("description"),
      images: ["/icon.svg"],
    },
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <WebsiteJsonLd />
      <OrganizationJsonLd />
      <main className="min-h-screen">
        <Hero />
        <ToolsGrid />
        <Features />
      </main>
    </>
  );
}
