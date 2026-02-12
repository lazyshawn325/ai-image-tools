import { Container } from "@/components/layout/Container";
import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });

  return {
    title: t("meta_title"),
    description: t("meta_desc"),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "About" });
  const tNav = await getTranslations({ locale, namespace: "Navigation" });

  return (
    <Container className="py-12">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            {t("title")}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t("description")}
          </p>
        </div>

        <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t("mission_title")}
          </h2>
          <p 
            className="text-gray-600 dark:text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: t.raw("mission_content") }}
          />
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {t("features_title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
              <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-2">
                {t("feature_local_title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t("feature_local_desc")}
              </p>
            </div>

            <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800">
              <h3 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-2">
                {t("feature_free_title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t("feature_free_desc")}
              </p>
            </div>

            <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800">
              <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-300 mb-2">
                {t("feature_no_login_title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t("feature_no_login_desc")}
              </p>
            </div>

            <div className="p-6 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-100 dark:border-orange-800">
              <h3 className="text-lg font-semibold text-orange-700 dark:text-orange-300 mb-2">
                {t("feature_fast_title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t("feature_fast_desc")}
              </p>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t("tech_title")}
          </h2>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>
              {t("tech_desc")}
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none pl-0 mt-4">
              {(t.raw("tech_list") as string[]).map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2 font-bold text-blue-600 dark:text-blue-400">{String(index + 1).padStart(2, '0')}.</span>
                  <span dangerouslySetInnerHTML={{ __html: item }} />
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {t("functions_title")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { title: "compress", icon: "🖼️" },
              { title: "convert", icon: "🔄" },
              { title: "resize", icon: "📏" },
              { title: "qrcode", icon: "📱" },
              { title: "removeBg", icon: "✨" },
              { title: "watermark", icon: "💧" },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {tNav(feature.title as any)}
                </h3>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Container>
  );
}
