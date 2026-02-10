import { WebsiteJsonLd, OrganizationJsonLd } from "@/components/seo/JsonLd";
import { Hero } from "@/components/home/Hero";
import { ToolsGrid } from "@/components/home/ToolsGrid";
import { Features } from "@/components/home/Features";

export default function Home() {
  return (
    <>
      <WebsiteJsonLd />
      <OrganizationJsonLd />
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Hero />
        <ToolsGrid />
        <Features />
      </main>
    </>
  );
}
