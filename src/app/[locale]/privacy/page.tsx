import { Container } from "@/components/layout/Container";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "PrivacyPage" });
  return {
    title: t("meta_title"),
    description: t("meta_desc"),
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "PrivacyPage" });

  return (
    <Container className="py-12">
      <div className="max-w-3xl mx-auto prose prose-gray dark:prose-invert">
        <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {t("last_updated")}
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{t("sections.overview.title")}</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {t("sections.overview.content")}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{t("sections.processing.title")}</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            <strong>{t("sections.processing.content_strong")}</strong>
            {t("sections.processing.content")}
          </p>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
            {(t.raw("sections.processing.list") as string[]).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{t("sections.collection.title")}</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {t("sections.collection.content")}
          </p>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
            {(t.raw("sections.collection.list") as { title: string; content: string }[]).map((item, index) => (
              <li key={index}>
                <strong>{item.title}</strong>
                {item.content}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{t("sections.third_party.title")}</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {t("sections.third_party.content")}
          </p>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
            {(t.raw("sections.third_party.list") as { title: string; content: string }[]).map((item, index) => (
              <li key={index}>
                <strong>{item.title}</strong>
                {item.content}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{t("sections.security.title")}</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {t("sections.security.content")}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{t("sections.minors.title")}</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {t("sections.minors.content")}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{t("sections.updates.title")}</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {t("sections.updates.content")}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{t("sections.contact.title")}</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {t("sections.contact.content")}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            {t("sections.contact.email")}
          </p>
        </section>
      </div>
    </Container>
  );
}

