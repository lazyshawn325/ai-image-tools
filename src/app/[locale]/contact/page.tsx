import { Container } from "@/components/layout/Container";
import type { Metadata } from "next";
import { Mail, Github, MessageCircle, HelpCircle } from "lucide-react";
import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact" });

  return {
    title: t("meta_title"),
    description: t("meta_desc"),
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Contact" });

  return (
    <Container className="py-12">
      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            {t("title")}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t("description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
              {t("email_title")}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              {t("email_desc")}
            </p>
            <a
              href="mailto:contact@ai-image-tools.com"
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium break-all"
            >
              contact@ai-image-tools.com
            </a>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 mb-4">
              <Github className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
              {t("github_title")}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              {t("github_desc")}
            </p>
            <a
              href="https://github.com/lazyshawn325/ai-image-tools"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
            >
              {t("visit_github")}
            </a>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-4">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
              {t("feedback_title")}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              {t("feedback_desc")}
            </p>
            <a
              href="https://github.com/lazyshawn325/ai-image-tools/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
            >
              {t("submit_issue")}
            </a>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-sm">
              <HelpCircle className="w-6 h-6 text-purple-500" />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {t("faq_title")}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("faq_desc")}
              </p>
            </div>
          </div>
          <Link
            href="/faq"
            className="px-6 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm font-medium rounded-md shadow-sm border border-gray-200 dark:border-gray-600 transition-colors"
          >
            {t("view_faq")}
          </Link>
        </div>
      </div>
    </Container>
  );
}
