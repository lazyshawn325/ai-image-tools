import { Container } from "@/components/layout/Container";
import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "FAQ" });

  return {
    title: t("meta_title"),
    description: t("meta_desc"),
    keywords: t("meta_keywords").split(","),
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function FAQPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "FAQ" });

  return (
    <Container className="py-12">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">{t("title")}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t("description")}
          </p>
        </header>

        <div className="space-y-4">
          {(t.raw("items") as { question: string; answer: string }[]).map((faq, index) => (
            <details 
              key={index} 
              className="group border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800 transition-shadow hover:shadow-md"
            >
              <summary className="flex justify-between items-center cursor-pointer p-5 font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors list-none [&::-webkit-details-marker]:hidden select-none">
                <span className="text-lg pr-4">{faq.question}</span>
                <span className="text-gray-400 dark:text-gray-500 transition-transform duration-300 group-open:rotate-180 flex-shrink-0">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </span>
              </summary>
              <div className="px-5 pb-5 pt-0 text-gray-600 dark:text-gray-300 leading-relaxed border-t border-transparent group-open:border-gray-100 dark:group-open:border-gray-700/50 group-open:pt-4 transition-all">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </Container>
  );
}
