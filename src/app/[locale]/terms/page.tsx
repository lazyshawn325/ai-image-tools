import { Container } from "@/components/layout/Container";
import Link from "next/link";
import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Terms" });

  return {
    title: t("meta_title"),
    description: t("meta_desc"),
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Terms" });

  return (
    <Container className="py-12">
      <div className="max-w-3xl mx-auto prose prose-gray dark:prose-invert">
        <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {t("last_updated")}
        </p>

        {(t.raw("sections") as { title: string; content: string[]; link?: string; content_after?: string }[]).map((section, index) => (
          <section key={index} className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
            {section.content.map((paragraph, pIndex) => (
              <p key={pIndex} className="text-gray-700 dark:text-gray-300 mb-4">
                {paragraph}
                {section.link && pIndex === section.content.length - 1 && (
                  <>
                    <Link href="/privacy" className="text-blue-600 hover:underline mx-1">
                      {section.link}
                    </Link>
                    {section.content_after}
                  </>
                )}
              </p>
            ))}
          </section>
        ))}
      </div>
    </Container>
  );
}
