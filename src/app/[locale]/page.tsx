import { WebsiteJsonLd, OrganizationJsonLd } from "@/components/seo/JsonLd";
import { Hero } from "@/components/home/Hero";
import { ToolsGrid } from "@/components/home/ToolsGrid";
import { Features } from "@/components/home/Features";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
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
