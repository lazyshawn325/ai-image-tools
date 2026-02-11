import {setRequestLocale, getTranslations} from 'next-intl/server';
import PageClient from './PageClient';
import {routing} from '@/i18n/routing';
import { Metadata } from 'next';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Exif" });

  return {
    title: t("meta_title"),
    description: t("meta_desc"),
    keywords: t("meta_keywords").split(","),
  };
}

export default async function Page({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  return <PageClient />;
}
